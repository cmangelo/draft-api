import express from 'express';

import { User, UserDocType, UserModelType } from '../models/user.model';

export const createUser = async (req: express.Request, res: express.Response) => {
    const user = new User(req.body) as UserDocType;
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (err) {
        res.status(400).send(err);
    }
};

export const loginUser = async (req: express.Request, res: express.Response) => {
    try {
        const user = await (<UserModelType>User).findByCredentials(req.body.email, req.body.password);
        const token: string = await user.generateAuthToken();
        res.send({ user, token });
    } catch {
        res.status(400).send();
    }
}