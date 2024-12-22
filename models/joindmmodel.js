// models/joindmmodel.js
const mongoose = require('mongoose');

const joinDMModelSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
});

const JoinDMModel = mongoose.model('JoinDM', joinDMModelSchema);

module.exports = JoinDMModel;
