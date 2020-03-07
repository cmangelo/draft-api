import { Router } from 'express';

import * as draftController from '../controllers/draft.controller';
import { auth } from '../middleware/auth.middleware';

export const draftRouter = Router();

draftRouter.get('/:draftId', auth, draftController.getDraft);

draftRouter.get('', auth, draftController.getDrafts);

draftRouter.post('/:draftId/picks', auth, draftController.draftPlayer);

draftRouter.post('', auth, draftController.initializeDraft);

draftRouter.delete('/:draftId/picks/:overall', auth, draftController.deletePick);

draftRouter.patch('/:draftId/picks/:overall', auth, draftController.updatePick);