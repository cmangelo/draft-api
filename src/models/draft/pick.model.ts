import { model, Schema } from 'mongoose';

const PickSchema = new Schema({
    overall: {
        type: Number,
        required: true,
    },
    player: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Player'
    },
    draft: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Draft'
    }
});

PickSchema.methods.toJSON = function () {
    const pick = this;
    const pickObj = pick.toObject();

    delete pickObj._id;
    delete pickObj.__v;
    return pickObj;
}

export const Pick = model('Pick', PickSchema);