const Reservation = require('../models/reservation');

const getReservationsByCatway = async (catwayId) => {
    return Reservation.find({ catwayId });
};

const getReservationById = async (catwayId, reservationId) => {
    const reservation = await Reservation.findOne({
        _id: reservationId,
        catwayId
    });

    if (!reservation) throw new Error('Réservation non trouvée');
    return reservation;
};

const createReservation = async (catwayId, data) => {
    const reservation = new Reservation({
        ...data,
        catwayId
    });
    return reservation.save();
};

const updateReservation = async (catwayId, reservationId, data) => {
    const reservation = await Reservation.findOneAndUpdate(
        { _id: reservationId, catwayId },
        data,
        { new: true, runValidators: true }
    );

    if (!reservation) throw new Error('Réservation non trouvée');
    return reservation;
};

const deleteReservation = async (catwayId, reservationId) => {
    const reservation = await Reservation.findOneAndDelete({
        _id: reservationId,
        catwayId
    });

    if (!reservation) throw new Error('Réservation non trouvée');
    return true;
};

module.exports = {
    getReservationsByCatway,
    getReservationById,
    createReservation,
    updateReservation,
    deleteReservation
};
