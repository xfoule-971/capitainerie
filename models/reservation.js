const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema({
    catwayNumber: { 
        type: Number, 
        required: true 
    },
    clientName: { 
        type: String, 
        required: [true, 'Le nom est requis'] 
    },
    boatName: { 
        type: String, 
        required: [true, 'Le nom du bateau est requis'] 
    },
    startDate: { 
        type: Date, 
        required: [true, 'Date début de réservation requise'] 
    },
    endDate: { 
        type: Date, 
        required: [true, 'Date fin de réservation requise'],
        validate: {
            validator: function (value) {
                return value >= this.startDate;
            },
            message: 'La date de fin doit être postérieure ou égale à la date de début'
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);