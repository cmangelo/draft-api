import mongoose from 'mongoose';

const rankingSchema = new mongoose.Schema({
    rank: {
        type: Number,
        required: true
    },
    player: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Player'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

rankingSchema.methods.toJSON = function () {
    const ranking = this;
    const rankingObj = ranking.toObject();

    delete rankingObj.createdAt;
    delete rankingObj.updatedAt;
    delete rankingObj.__v;
    delete rankingObj.owner;

    return rankingObj;
}

export const Ranking = mongoose.model('Ranking', rankingSchema);