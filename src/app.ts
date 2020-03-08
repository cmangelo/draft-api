import cors from 'cors';
import express from 'express';
import fileUpload from 'express-fileupload';

import { connect } from './db/mongoose';
import { draftRouter } from './routers/draft.router';
import { playerRouter } from './routers/player.router';
import { userRouter } from './routers/user.router';

const app = express();
app.use(express.json());
app.use(fileUpload());
app.use(cors());

connect();

app.get('/test', (req, res) => res.send('hiya'));
app.use('/users', userRouter);
app.use('/players', playerRouter);
app.use('/drafts', draftRouter);

const port = 3000;
app.listen(port, err => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server is listening on ${port}`);
});