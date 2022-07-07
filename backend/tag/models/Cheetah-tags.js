var mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator")

var CheetaTagsSchema = new mongoose.Schema({
    tag: { type: String }
}, { timestamps: true });

CheetaTagsSchema.plugin(uniqueValidator);
module.exports = mongoose.model('CheetaTags', CheetaTagsSchema);
