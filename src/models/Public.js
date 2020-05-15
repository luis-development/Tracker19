const { Schema, model } = require('mongoose');

const publicSchema = new Schema({
    country: {
        type: String,
        required: true
    },
    infect: {
        type: Number,
        required: true
    },
    recover: {
        type: Number,
        required: true
    },
    death: {
        type: Number,
        required: true
    },
    rest: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});


module.exports = model('Public', publicSchema);