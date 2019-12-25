import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
    position: {
        type: Number,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    tiers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tier'
    }]
}, {
    timestamps: true,
});

export const Group = mongoose.model('Group', groupSchema);
