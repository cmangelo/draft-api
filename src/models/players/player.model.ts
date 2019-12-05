import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    team: {
        type: String,
        required: true
    },
    bye: {
        type: Number,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    risk: {
        type: Number,
        required: true
    },
    adp: {
        type: Number,
        required: true
    },
    notes: {
        type: String,
        required: true
    },
    position: {
        type: Number
    },
    value: {
        type: Number
    }
}, {
    timestamps: true
});

export const Player = mongoose.model('Player', PlayerSchema);