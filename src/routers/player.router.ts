import { Router } from 'express';

import * as playerController from '../controllers/player.controller';
import { auth } from '../middleware/auth.middleware';

export const playerRouter = Router();

playerRouter.get('/groups', auth, playerController.getTiersAndGroups);

playerRouter.get('/', auth, playerController.getPlayers);

playerRouter.get('/:playerId', auth, playerController.getPlayerDetail);

playerRouter.post('/:groupId', auth, playerController.addPlayers);

playerRouter.put('/:playerId/rankings', auth, playerController.addPlayerRanking);

playerRouter.delete('/:playerId/rankings', auth, playerController.deletePlayerRanking);