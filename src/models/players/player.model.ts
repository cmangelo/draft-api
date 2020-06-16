import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
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
        type: String
    },
    position: {
        type: Number
    },
    value: {
        type: Number
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

playerSchema.virtual('userRank')
    .get(function (this: any) { return this._userRank })
    .set(function (this: any, v: number) { this._userRank = v });

playerSchema.methods.toJSON = function () {
    const player = this;
    const playerObj = player.toObject();

    delete playerObj.createdAt;
    delete playerObj.updatedAt;
    delete playerObj.__v;
    return playerObj;
}

export const Player = mongoose.model('Player', playerSchema);