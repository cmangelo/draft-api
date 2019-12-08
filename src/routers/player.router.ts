import { Router } from 'express';

import * as playerController from '../controllers/player.controller';
import { auth } from '../middleware/auth.middleware';

export const playerRouter = Router();

playerRouter.get('/groups', auth, playerController.getTiersAndGroups);

playerRouter.get('/', auth, playerController.getPlayers);

playerRouter.post('/:groupId', auth, playerController.addPlayers);