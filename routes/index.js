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

    if (!token) {
        return res.redirect('/');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.redirect('/');
    }
};

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentification
 *   - name: Users
 *     description: Gestion des utilisateurs
 *   - name: Catways
 *     description: Gestion des catways
 *   - name: Reservations
 *     description: Gestion des réservations
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Page d’accueil
 *     description: Affiche la page d’accueil de l’application
 *     responses:
 *       200:
 *         description: Page HTML d’accueil
 */

// ===============================
// PAGE D’ACCUEIL
// ===============================
router.get('/', (req, res) => {
    res.render('index', {
        title: 'Accueil'
    });
});

// ===============================
// LOGIN (JWT)
// ===============================
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.render('index', {
                error: 'Utilisateur introuvable'
            });
        }

        // ⚠️ Mot de passe en clair (OK pour rendu pédagogique)
        if (user.password !== password) {
            return res.render('index', {
                error: 'Mot de passe incorrect'
            });
        }

        // Création du token JWT
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                username: user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        // Stockage du token dans un cookie sécurisé
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict'
        });

        // Redirection vers le dashboard
        res.redirect('/dashboard');

    } catch (error) {
        console.error(error);
        res.render('index', {
            error: 'Erreur serveur'
        });
    }
});

// ===============================
// LOGOUT
// ===============================
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

// ===============================
// TABLEAU DE BORD (protégé)
// ===============================
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const reservations = await Reservation.find();

        res.render('dashboard', {
            title: 'Tableau de bord',
            user: {
                email: req.user.email
            },
            reservations
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
});

// ===============================
// PAGE CATWAYS (CRUD)
// ===============================
router.get('/catways', authMiddleware, async (req, res) => {
    try {
        const catways = await Catway.find();

        res.render('catways', {
            title: 'Catways',
            catways
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
});

// ===============================
// PAGE RÉSERVATIONS (CRUD)
// ===============================
router.get('/reservations', authMiddleware, async (req, res) => {
    try {
        const reservations = await Reservation.find();

        res.render('reservations', {
            title: 'Réservations',
            reservations
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
});

// ===============================
// PAGE UTILISATEURS (CRUD)
// ===============================
router.get('/users', authMiddleware, async (req, res) => {
    try {
        const users = await User.find();

        res.render('users', {
            title: 'Utilisateurs',
            users
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
});

module.exports = router;



