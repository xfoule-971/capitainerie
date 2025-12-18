const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const Catway = require('../models/catway');
const Reservation = require('../models/reservation');
const User = require('../models/user');

/**
 * ===============================
 * Middleware d’authentification (JWT)
 * ===============================
 */
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.redirect('/');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.redirect('/');
    }
};

/**
 * ===============================
 * Swagger tags (en commentaire)
 * ===============================
 */
/*
@swagger
tags:
  - name: Auth
    description: Authentification
  - name: Users
    description: Gestion des utilisateurs
  - name: Catways
    description: Gestion des catways
  - name: Reservations
    description: Gestion des réservations
*/

/**
 * ===============================
 * PAGE D’ACCUEIL
 * ===============================
 */
/* @swagger
/:
  get:
    summary: Page d’accueil
    tags: [Auth]
*/
router.get('/', (req, res) => {
    res.render('index', { title: 'Accueil' });
});

/**
 * ===============================
 * LOGIN (JWT)
 * ===============================
 */
/* @swagger
/login:
  post:
    summary: Authentification utilisateur
    tags: [Auth]
*/
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.render('index', { error: 'Utilisateur introuvable' });
        if (user.password !== password) return res.render('index', { error: 'Mot de passe incorrect' });

        const token = jwt.sign(
            { id: user._id, email: user.email, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.render('index', { error: 'Erreur serveur' });
    }
});

/**
 * ===============================
 * LOGOUT
 * ===============================
 */
/* @swagger
/logout:
  get:
    summary: Déconnexion
    tags: [Auth]
*/
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

/**
 * ===============================
 * TABLEAU DE BORD
 * ===============================
 */
/* @swagger
/dashboard:
  get:
    summary: Tableau de bord
    tags: [Auth]
*/
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.render('dashboard', {
            title: 'Tableau de bord',
            user: { email: req.user.email },
            reservations
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
});

/**
 * ===============================
 * CATWAYS CRUD
 * ===============================
 */
/* @swagger
/catways:
  get:
    summary: Liste des catways
    tags: [Catways]
*/
router.get('/catways', authMiddleware, async (req, res) => {
    try {
        const catways = await Catway.find();
        res.render('catways', { title: 'Catways', catways });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
});

/* @swagger
/catways/new:
  get:
    summary: Formulaire ajout catway
    tags: [Catways]
*/
router.get('/catways/new', authMiddleware, (req, res) =>
    res.render('catwayForm', { title: 'Ajouter Catway' })
);

/* @swagger
/catways:
  post:
    summary: Créer un catway
    tags: [Catways]
*/
router.post('/catways', authMiddleware, async (req, res) => {
    const { catwayNumber, catwayType, catwayState } = req.body;
    try {
        await Catway.create({ catwayNumber, catwayType, catwayState });
        res.redirect('/catways');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur lors de l’ajout');
    }
});

/* @swagger
/catways/{id}/edit:
  get:
    summary: Formulaire modification catway
    tags: [Catways]
*/
router.get('/catways/:id/edit', authMiddleware, async (req, res) => {
    try {
        const catway = await Catway.findById(req.params.id);
        res.render('catwayForm', { title: 'Modifier Catway', catway });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
});

router.post('/catways/:id', authMiddleware, async (req, res) => {
    const { catwayNumber, catwayType, catwayState } = req.body;
    try {
        await Catway.findByIdAndUpdate(req.params.id, { catwayNumber, catwayType, catwayState });
        res.redirect('/catways');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
});

/* @swagger
/catways/{id}:
  get:
    summary: Détail catway
    tags: [Catways]
*/
router.get('/catways/:id', authMiddleware, async (req, res) => {
    try {
        const catway = await Catway.findById(req.params.id);
        res.render('catwayDetail', { title: 'Détail Catway', catway });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
});

/* @swagger
/catways/{id}:
  delete:
    summary: Supprimer catway
    tags: [Catways]
*/
router.delete('/catways/:id', authMiddleware, async (req, res) => {
    try {
        await Catway.findByIdAndDelete(req.params.id);
        res.redirect('/catways');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
});

/**
 * ===============================
 * RESERVATIONS CRUD
 * ===============================
 */
/* @swagger
/reservations:
  get:
    summary: Liste des réservations
    tags: [Reservations]
*/
router.get('/reservations', authMiddleware, async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.render('reservations', { title: 'Réservations', reservations });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
});

router.get('/reservations/new', authMiddleware, (req, res) =>
    res.render('reservationForm', { title: 'Ajouter Réservation' })
);

router.post('/reservations', authMiddleware, async (req, res) => {
    const { catwayNumber, clientName, boatName, startDate, endDate } = req.body;
    try {
        await Reservation.create({ catwayNumber, clientName, boatName, startDate, endDate });
        res.redirect('/reservations');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur lors de l’ajout');
    }
});

router.get('/reservations/:id/edit', authMiddleware, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        res.render('reservationForm', { title: 'Modifier Réservation', reservation });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
});

router.post('/reservations/:id', authMiddleware, async (req, res) => {
    const { catwayNumber, clientName, boatName, startDate, endDate } = req.body;
    try {
        await Reservation.findByIdAndUpdate(req.params.id, { catwayNumber, clientName, boatName, startDate, endDate });
        res.redirect('/reservations');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
});

router.get('/reservations/:id', authMiddleware, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        res.render('reservationDetail', { title: 'Détail Réservation', reservation });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
});

router.delete('/reservations/:id', authMiddleware, async (req, res) => {
    try {
        await Reservation.findByIdAndDelete(req.params.id);
        res.redirect('/reservations');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
});

/**
 * ===============================
 * USERS CRUD
 * ===============================
 */
/* @swagger
/users:
  get:
    summary: Liste des utilisateurs
    tags: [Users]
*/
router.get('/users', authMiddleware, async (req, res) => {
    try {
        const users = await User.find();
        res.render('users', { title: 'Utilisateurs', users });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
});

router.get('/users/new', authMiddleware, (req, res) =>
    res.render('userForm', { title: 'Ajouter Utilisateur' })
);

router.post('/users', authMiddleware, async (req, res) => {
    const { username, email, password } = req.body;
    try {
        await User.create({ username, email, password });
        res.redirect('/users');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur lors de l’ajout');
    }
});

router.get('/users/:id/edit', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.render('userForm', { title: 'Modifier Utilisateur', user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
});

router.post('/users/:id', authMiddleware, async (req, res) => {
    const { username, email, password } = req.body;
    try {
        await User.findByIdAndUpdate(req.params.id, { username, email, password });
        res.redirect('/users');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
});

router.get('/users/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.render('userDetail', { title: 'Détail Utilisateur', user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
});

router.delete('/users/:id', authMiddleware, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/users');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
});

module.exports = router;







