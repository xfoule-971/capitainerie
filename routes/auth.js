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
 *     description: Authentifie un utilisateur et retourne un token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
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
 *       200:
 *         description: Connexion réussie – token JWT retourné
 *       401:
 *         description: Email ou mot de passe incorrect
 *       500:
 *         description: Erreur serveur
 */

// Gestion de la connexion
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérification utilisateur
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Vérification mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Création token JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Déconnexion utilisateur
 *     description: Déconnexion côté client (JWT stateless)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */

// Gestion de la déconnexion
router.get('/logout', (req, res) => {
    // En JWT stateless, logout = suppression côté client
    res.status(200).json({ message: 'Déconnexion réussie' });
});

module.exports = router;

