var mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator")

var CheetaTicketSchema = new mongoose.Schema({
    hrId: { type: String },
    user: {
        userId: { type: mongoose.Schema.Types.ObjectId },
        type: { type: String },
        email: { type: String },
        name: { type: String },
        profilePic: { type: String },
    },
    title: { type: String , required: true},
    description: { type: String , required: true},
    // projectName: { type: String },
    priority: { type: String , required: true}, // P0, P1, P2, P3
    state: { type: String , required: true}, // backlog, development, devdone, testing, done, deployed
    type: { type: String }, // Big or small
    files: [{ type: String }],
    members: [{
                userId: { type: String },
                type: { type: String },
                email: { type: String },
                name: { type: String },
                profilePic: { type: String },
            }],
    expectedTime: { type: String },
    realTimeTaken: { type: String },
    UT: { type: Boolean },
    documentation: { type: Boolean },
    tags: [{ type: String }], // It will have the tagIds
    comments: [
            {
                user: { type: String },
                msg: { type: String },
                dateTime: { type: Date },
                name: { type: String },
                profilePic: { type: String },
            }
        ], 
    status: { type: Number }, // 0 = Open, 2 = Close, 3 = Deleted

    logs: [
        {
            user: {},
            states: {
                prev: { type: String },
                new: { type: String }
            },
            dateTime: { type: Date, default: Date.now }
        }
    ],
    lastUpdate: { type:Date, default: Date.now },
}, { timestamps: true });


module.exports = mongoose.model('CheetaTicket', CheetaTicketSchema);
