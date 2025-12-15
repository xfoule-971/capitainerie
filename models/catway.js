const mongoose = require('mongoose');

const catwaySchema = mongoose.Schema({
    catwayNumber: { 
        type: Number, 
        required: true 
    },
    catwayType: { 
        type: String, 
        required: [true, 'long','short'] 
    },
    catwayState: { 
        type: String, 
        required: [true, "Indiquez l'état du catway"]
    }
}, { timestamps: true }
);

module.exports = mongoose.model('Catway', catwaySchema);