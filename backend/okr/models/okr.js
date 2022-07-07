var mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator")

var CheetaOKR = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId },
    objective: { type: String },
    actions: [],
    results: [],
    status: { type: Number }, // 0 - deactivated, 1 - active, 2 - deleted, 
    others: {}
}, { timestamps: true });

module.exports = mongoose.model('CheetaOKR', CheetaOKR);
