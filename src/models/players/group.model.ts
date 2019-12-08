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

    }
}, {
    timestamps: true,
});

export const Group = mongoose.model('Group', groupSchema);
