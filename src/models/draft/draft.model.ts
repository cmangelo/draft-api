import mongoose from 'mongoose';

const DraftSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

export const Draft = mongoose.model('Draft', DraftSchema);