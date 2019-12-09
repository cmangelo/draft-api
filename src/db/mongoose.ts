import mongoose from 'mongoose';

export const connect = () => mongoose.connect('mongodb://127.0.0.1:27017/draft-api-ts', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});