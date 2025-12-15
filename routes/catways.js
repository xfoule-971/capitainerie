const express = require('express');
const router = express.Router();
const Catway = require('../models/catway');

/**
 * @swagger
 * tags:
 *   - name: Catways
 *     description: Gestion des catways
 */

/**
 * @swagger
 * /catways:
 *   get:
 *     summary: Récupérer tous les catways
 *     tags: [Catways]
 *     responses:
 *       200:
 *         description: Liste des catways
 *       500:
 *         description: Erreur serveur
 */

// Récupérer tous les catways
router.get('/catways', async (req, res) => {
    try {
        const catways = await Catway.find();
        res.status(200).json(catways);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /catways/{id}:
 *   get:
 *     summary: Récupérer un catway par ID
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Catway trouvé
 *       404:
 *         description: Catway non trouvé
 *       400:
 *         description: ID invalide
 */

// Récupérer un catway par ID
router.get('/catways/:id', async (req, res) => {
    try {
        const catway = await Catway.findById(req.params.id);

        if (!catway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }

        res.status(200).json(catway);
    } catch (error) {
        res.status(400).json({ message: 'ID invalide' });
    }
});

/**
 * @swagger
 * /catways:
 *   post:
 *     summary: Créer un catway
 *     tags: [Catways]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               catwayNumber:
 *                 type: integer
 *                 example: 12
 *               type:
 *                 type: string
 *                 example: long
 *               catwayState:
 *                 type: string
 *                 example: available
 *     responses:
 *       201:
 *         description: Catway créé
 *       400:
 *         description: Données invalides
 */

// Créer un catway
router.post('/catways', async (req, res) => {
    try {
        const catway = new Catway(req.body);
        const savedCatway = await catway.save();

        res.status(201).json(savedCatway);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /catways/{id}:
 *   put:
 *     summary: Modifier un catway
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Catway modifié
 *       404:
 *         description: Catway non trouvé
 *       400:
 *         description: Données invalides
 */

// Modifier un catway
router.put('/catways/:id', async (req, res) => {
    try {
        const updatedCatway = await Catway.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedCatway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }

        res.status(200).json(updatedCatway);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /catways/{id}:
 *   delete:
 *     summary: Supprimer un catway
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Catway supprimé avec succès
 *       404:
 *         description: Catway non trouvé
 *       400:
 *         description: ID invalide
 */

// Supprimer un catway
router.delete('/catways/:id', async (req, res) => {
    try {
        const deletedCatway = await Catway.findByIdAndDelete(req.params.id);

        if (!deletedCatway) {
            return res.status(404).json({ message: 'Catway non trouvé' });
        }

        res.status(200).json({ message: 'Catway supprimé avec succès' });
    } catch (error) {
        res.status(400).json({ message: 'ID invalide' });
    }
});

module.exports = router;
