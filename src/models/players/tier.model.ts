import mongoose from 'mongoose';

const tierSchema = new mongoose.Schema({
    tierNumber: {
        type: Number,
        required: true
    },
    startingAtRank: {
        type: Number,
        required: true
    },
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Player'
    }]
}, {
    timestamps: true,
});

tierSchema.set('toJSON', {
    virtuals: true
});

tierSchema.methods.toJSON = function () {
    const tier = this;
    const tierObj = tier.toObject();

    delete tierObj.createdAt;
    delete tierObj.updatedAt;
    delete tierObj.__v;
    return tierObj;
}

export const Tier = mongoose.model('Tier', tierSchema);
