var mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator")

var CheetaUsers = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true},
    mobile: { type: String },
    password: { type: String, required: true },
    profilePic: { type: String },
    type: { type: String }, //Team-Lead, Project-Manager, Developer, Q/A
    score: { type: Number, default: 0 },     //should take string
    status: { type: String, default: "deactivated"}, // active, deleted, deactivated, banned
    telegram: { id: Number, username: String },
    others: {}
}, { timestamps: true });

module.exports = mongoose.model('CheetaUsers', CheetaUsers);
