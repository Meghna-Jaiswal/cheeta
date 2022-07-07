

var mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator")

var CheetaTaskSchema = new mongoose.Schema({
    date: { type : Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId },
    bigTasks: [
        {
            summary: { type: String , required: true},
            state: { type: String , required: true}, // not-done, done
        }
    ],
    smallTasks: [
        {
            summary: { type: String , required: true},
            state: { type: String , required: true}, // not-done, done
        }
    ] 
}, { timestamps: true });


module.exports = mongoose.model('CheetaTask', CheetaTaskSchema);
