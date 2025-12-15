const express = require('express');
const router = express.Router();

const Catway = require('../models/catway');
const Reservation = require('../models/reservation');
const User = require('../models/user');

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

// PAGE D’ACCUEIL
router.get('/', (req, res) => {
    res.render('index', {
        title: 'Accueil'
    });
});

// TABLEAU DE BORD
router.get('/dashboard', async (req, res) => {
    try {
        const reservations = await Reservation.find();

        res.render('dashboard', {
            title: 'Tableau de bord',
            user: {
                email: 'admin@test.com' // temporaire (sera remplacé par JWT)
            },
            reservations
        });
    } catch (error) {
        res.status(500).send('Erreur serveur');
    }
});

// PAGE CATWAYS (CRUD)
router.get('/catways', async (req, res) => {
    try {
        const catways = await Catway.find();

        res.render('catways', {
            title: 'Catways',
            catways
        });
    } catch (error) {
        res.status(500).send('Erreur serveur');
    }
});

// PAGE RÉSERVATIONS (CRUD)
router.get('/reservations', async (req, res) => {
    try {
        const reservations = await Reservation.find();

        res.render('reservations', {
            title: 'Réservations',
            reservations
        });
    } catch (error) {
        res.status(500).send('Erreur serveur');
    }
});

// PAGE UTILISATEURS (CRUD)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();

        res.render('users', {
            title: 'Utilisateurs',
            users
        });
    } catch (error) {
        res.status(500).send('Erreur serveur');
    }
});

module.exports = router;

