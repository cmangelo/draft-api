import { Request, Response } from 'express';

import { Draft } from '../models/draft/draft.model';
import { Pick } from '../models/draft/pick.model';

export const getDrafts = async (req: any, res: Response) => {
    const userId = req.user._id;
    const page = +req.query.page;

    try {
        const draftProjection = {
            QBs: false,
            RBs: false,
            WRs: false,
            TEs: false,
            FLEX: false,
            BENCH: false,
            DEF: false,
            K: false,
            updatedAt: false
        }
        const drafts = await Draft.find({ owner: userId }, draftProjection).sort({ createdAt: -1 });

        const start = (page - 1) * 10;
        const end = start + 10;

        res.send(drafts.slice(start, end));
    } catch {
        res.status(400).send();
    }
}

export const getDraft = async (req: any, res: Response) => {
    const userId = req.user._id;
    const draftId = req.params.draftId;
    try {
        const draft = await Draft.findById(draftId) as any;
        if (!draft) {
            res.status(404).send();
            return;
        }
        if (draft.owner.toString() !== userId.toString()) {
            res.status(401).send();
            return;
        }

        const picks = await Pick.find({ draft: draftId }).sort({ overall: 1 });
        res.send({ draft, picks });
    } catch (ex) {
        res.status(400).send(ex)
    }
}

export const initializeDraft = async (req: any, res: Response) => {
    const userId = req.user._id;
    try {
        const draftModel = new Draft({ ...req.body, owner: userId });
        const draft = await draftModel.save();

        res.status(201).send(draft);
    } catch {
        res.status(400).send()
    }
}

export const draftPlayer = async (req: Request, res: Response) => {
    const draftId = req.params.draftId;
    try {
        const pick = new Pick({ ...req.body, draft: draftId });
        await pick.save();

        res.status(201).send()
    } catch {
        res.status(400).send();
    }
}

export const updatePick = async (req: any, res: Response) => {
    const draftId = req.params.draftId;
    const overall = req.params.overall;
    try {
        const result = await Pick.findOneAndUpdate({ overall, draft: draftId }, { ...req.body });
        if (!result) {
            res.status(404).send();
        }
        res.status(204).send();
    } catch {
        res.status(400).send();
    }
}

export const deletePick = async (req: any, res: Response) => {
    const draftId = req.params.draftId;
    const overall = req.params.overall;
    try {
        const deletionQuery = await Pick.deleteOne({ draft: draftId, overall });
        if (deletionQuery.deletedCount === 0) {
            res.status(404).send();
            return;
        }
        res.status(204).send();
    } catch {
        res.status(400).send();
    }
}