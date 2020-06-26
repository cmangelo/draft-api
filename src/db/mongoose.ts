import mongoose from 'mongoose';

// mongodb://127.0.0.1:27017/draft-api-ts
// export const connect = () => mongoose.connect('mongodb://heroku_pxcz10ss:dfnekm19hq8ko6791sa5e0hcgs@ds053140.mlab.com:53140/heroku_pxcz10ss', {
const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/draft-api-ts';
export const connect = () => mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});