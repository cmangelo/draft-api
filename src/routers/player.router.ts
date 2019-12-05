import express from 'express';

import * as playerController from '../controllers/player.controller';

export const playerRouter = express.Router();

playerRouter.get('', playerController.getPlayers);

playerRouter.post('/:groupId', playerController.addPlayers);