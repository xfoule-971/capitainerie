const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentification
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Connexion utilisateur
 *     description: Authentifie un utilisateur et le redirige vers le tableau de bord
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@mail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       302:
 *         description: Redirection vers /dashboard
 *       401:
 *         description: Email ou mot de passe incorrect
 *       500:
 *         description: Erreur serveur
 */

// ===============================
// CONNEXION
// ===============================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérification utilisateur
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).render('index', {
                title: 'Accueil',
                error: 'Email ou mot de passe incorrect'
            });
        }

        // Vérification mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).render('index', {
                title: 'Accueil',
                error: 'Email ou mot de passe incorrect'
            });
        }

        // Création token JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Stockage du token en cookie (simple et efficace)
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600000
        });

        // ✅ Redirection vers le dashboard
        res.redirect('/dashboard');

    } catch (error) {
        console.error(error);
        res.status(500).render('index', {
            title: 'Accueil',
            error: 'Erreur serveur'
        });
    }
});

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Déconnexion utilisateur
 *     description: Supprime le cookie JWT et redirige vers l’accueil
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirection vers /
 */

// ===============================
// DÉCONNEXION
// ===============================
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = router;


