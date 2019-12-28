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

PlayerSchema.methods.toJSON = function () {
    const player = this;
    const playerObj = player.toObject();

    delete playerObj.createdAt;
    delete playerObj.updatedAt;
    delete playerObj.__v;
    return playerObj;
}

export const Player = mongoose.model('Player', PlayerSchema);