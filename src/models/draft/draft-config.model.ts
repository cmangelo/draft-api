import mongoose from 'mongoose';

const DraftConfigSchema = new mongoose.Schema({
    draft: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Draft'
    },
    numTeams: {
        type: Number,
        default: 12
    },
    numRounds: {
        type: Number,
        default: 15
    },
    userPosition: {
        type: Number,
        required: true
    },
    QBs: {
        type: Number,
        default: 1,
        required: true
    },
    RBs: {
        type: Number,
        default: 2,
        required: true
    },
    WRs: {
        type: Number,
        default: 2,
        required: true
    },
    TEs: {
        type: Number,
        default: 1,
        required: true
    },
    FLEX: {
        type: Number,
        default: 1,
        required: true
    },
    BENCH: {
        type: Number,
        default: 6,
        required: true
    },
    K: {
        type: Number,
        default: 1,
        required: true
    },
    DEF: {
        type: Number,
        default: 1,
        required: true
    },
});

export const DraftConfig = mongoose.model('DraftConfig', DraftConfigSchema);