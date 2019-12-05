import express from 'express';

import { connect } from './db/mongoose';
import { userRouter } from './routers/user.router';

const app = express();
app.use(express.json());

connect();

app.use('/users', userRouter);

const port = 3000;
app.listen(port, err => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server is listening on ${port}`);
});