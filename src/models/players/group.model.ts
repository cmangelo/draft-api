import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
    position: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
});

export const Group = mongoose.model('Group', groupSchema);
