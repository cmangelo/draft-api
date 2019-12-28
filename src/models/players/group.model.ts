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

groupSchema.methods.toJSON = function () {
    const group = this;
    const groupObj = group.toObject();

    delete groupObj.createdAt;
    delete groupObj.updatedAt;
    delete groupObj.__v;
    delete groupObj.owner;
    return groupObj;
}

export const Group = mongoose.model('Group', groupSchema);
