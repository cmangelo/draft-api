import express from 'express';

import * as userController from '../controllers/user.controller';

export const userRouter = express.Router();

userRouter.post('/login', userController.loginUser);

userRouter.post('', userController.createUser);