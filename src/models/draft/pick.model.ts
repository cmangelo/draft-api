import mongoose from 'mongoose';

const PickSchema = new mongoose.Schema({
    overall: {
        type: Number,
        required: true,
    },
    player: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Player'
    },
    draft: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Draft'
    }
});

export const Pick = mongoose.model('Pick', PickSchema);