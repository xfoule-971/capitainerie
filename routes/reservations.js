const express = require('express');
const router = express.Router();
const Reservation = require('../models/reservation');

/**
 * @swagger
 * tags:
 *   - name: Reservations
 *     description: Gestion des réservations
 */

/**
 * @swagger
 * /catways/{id}/reservations:
 *   get:
 *     summary: Récupérer toutes les réservations d’un catway
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du catway
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des réservations
 *       500:
 *         description: Erreur serveur
 */

// Récupérer toutes les réservations d’un catway
router.get('/catways/:id/reservations', async (req, res) => {
    try {
        const reservations = await Reservation.find({
            catwayId: req.params.id
        });

        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /catways/{id}/reservations/{idReservation}:
 *   get:
 *     summary: Récupérer une réservation précise
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du catway
 *         schema:
 *           type: string
 *       - in: path
 *         name: idReservation
 *         required: true
 *         description: ID de la réservation
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Réservation trouvée
 *       404:
 *         description: Réservation non trouvée
 *       400:
 *         description: ID invalide
 */

// Récupérer une réservation précise
router.get('/catways/:id/reservations/:idReservation', async (req, res) => {
    try {
        const reservation = await Reservation.findOne({
            _id: req.params.idReservation,
            catwayId: req.params.id
        });

        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }

        res.status(200).json(reservation);
    } catch (error) {
        res.status(400).json({ message: 'ID invalide' });
    }
});

/**
 * @swagger
 * /catways/{id}/reservations:
 *   post:
 *     summary: Créer une réservation pour un catway
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du catway
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientName
 *               - boatName
 *               - startDate
 *               - endDate
 *             properties:
 *               clientName:
 *                 type: string
 *                 example: Jean Dupont
 *               boatName:
 *                 type: string
 *                 example: Le Neptune
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-06-01
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-06-10
 *     responses:
 *       201:
 *         description: Réservation créée
 *       400:
 *         description: Données invalides
 */

// Créer une réservation pour un catway
router.post('/catways/:id/reservations', async (req, res) => {
    try {
        const reservation = new Reservation({
            ...req.body,
            catwayId: req.params.id
        });

        const savedReservation = await reservation.save();
        res.status(201).json(savedReservation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /catways/{id}/reservations/{idReservation}:
 *   put:
 *     summary: Modifier une réservation
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du catway
 *         schema:
 *           type: string
 *       - in: path
 *         name: idReservation
 *         required: true
 *         description: ID de la réservation
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Réservation modifiée
 *       404:
 *         description: Réservation non trouvée
 *       400:
 *         description: Données invalides
 */

// Modifier une réservation
router.put('/catways/:id/reservations/:idReservation', async (req, res) => {
    try {
        const updatedReservation = await Reservation.findOneAndUpdate(
            {
                _id: req.params.idReservation,
                catwayId: req.params.id
            },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedReservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }

        res.status(200).json(updatedReservation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /catways/{id}/reservations/{idReservation}:
 *   delete:
 *     summary: Supprimer une réservation
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du catway
 *         schema:
 *           type: string
 *       - in: path
 *         name: idReservation
 *         required: true
 *         description: ID de la réservation
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Réservation supprimée avec succès
 *       404:
 *         description: Réservation non trouvée
 *       400:
 *         description: ID invalide
 */

// Supprimer une réservation
router.delete('/catways/:id/reservations/:idReservation', async (req, res) => {
    try {
        const deletedReservation = await Reservation.findOneAndDelete({
            _id: req.params.idReservation,
            catwayId: req.params.id
        });

        if (!deletedReservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }

        res.status(200).json({ message: 'Réservation supprimée avec succès' });
    } catch (error) {
        res.status(400).json({ message: 'ID invalide' });
    }
});

module.exports = router;

