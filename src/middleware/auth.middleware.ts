import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { User } from '../models/user.model';

export const auth = async (req: any, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = verify(token, 'draft-api') as any;
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        if (!user) {
            throw new Error();
        }
        req.user = user;
        req.token = token;
        next();
    } catch (err) {
        res.status(401).send('Please authenticate');
    }
}
