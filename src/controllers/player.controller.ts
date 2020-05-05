import { Response } from 'express';
import { Document } from 'mongoose';

import { Group as eGroup } from '../models/enums/group.enum';
import { Group } from '../models/players/group.model';
import { Player } from '../models/players/player.model';
import { Ranking } from '../models/players/ranking.model';
import { Tier } from '../models/players/tier.model';

export const getPlayers = async (req: any, res: Response) => {
    const userId = req.user._id;
    try {
        const playerProjection = {
            // bye: false,
            points: false,
            notes: false,
            risk: false
        };

        //using lean to get plain js objects, mongoose documents don't allow for adding extra properties
        const players = await Player.find({}).lean();

        const rankings = await Ranking.find({ user: userId });

        if (rankings) {
            rankings.forEach((ranking: any) => {
                let player = players.find(player => player._id.toString() === ranking.player.toString()) as any;
                player.userRank = ranking.rank;
            });
        }

        if (!players) {
            res.status(404).send();
            return;
        }
        res.send(players);
    } catch (err) {
        res.status(400).send(err.message);
    }
}

export const getTiersAndGroups = async (req: any, res: Response) => {
    const userId = req.user._id;
    try {
        const groups = await Group.find({ owner: userId });
        let alreadyFoundGroups: Array<number> = [];
        const newestOfEachGroup = sortArrayByProp(groups, 'createdAt').filter(group => {
            const alreadyFound = alreadyFoundGroups.includes(group.position);
            alreadyFoundGroups.push(group.position);
            return !alreadyFound;
        });
        let tiers: Array<any> = [];
        for (const group of newestOfEachGroup) {
            for (const tierId of group.tiers) {
                const tier = await Tier.findById(tierId);
                tiers.push(tier);
            }
        }
        res.send({ tiers, groups: newestOfEachGroup });

    } catch {
        res.status(400).send();
    }
}

export const addPlayers = async (req: any, res: Response) => {
    const groupId = +req.params.groupId;
    const userId = req.user._id;

    try {
        if (Object.keys((<any>req).files).length === 0) {
            res.status(400).send();
        } else {
            let playersCSV = (<any>req).files.players.data.toString('utf8');
            let players = convertCSVToJS(playersCSV, groupId);

            let tiersObject = players.reduce(groupPlayersByTier, {});
            let groupModel = new Group({
                position: groupId,
                owner: userId
            });

            let group = await groupModel.save();
            let startingAtRankRunningTotal = 1;

            for (const key of Object.keys(tiersObject)) {
                const sortedPlayers = sortArrayByProp(tiersObject[key], 'rank');
                let playerIds = [];
                for (let player of sortedPlayers) {
                    let existingPlayer = await Player.findOne({
                        name: player.name,
                        team: player.team
                    }) as Document & { position: number, adp: number, notes: string, points: number, risk: number, team: string };

                    if (existingPlayer) {
                        if (existingPlayer.position === eGroup.NONE) {
                            existingPlayer.position = groupId;
                        }
                        existingPlayer.adp = player.adp;
                        existingPlayer.notes = player.notes;
                        existingPlayer.points = player.points;
                        existingPlayer.risk = player.risk;
                        existingPlayer.team = player.team;
                        await existingPlayer.save();

                        playerIds.push(existingPlayer._id);
                    } else {
                        let playerModel = new Player(
                            player
                        );
                        let saved = await playerModel.save();
                        playerIds.push(saved._id);
                    }
                }

                const tier = new Tier({
                    tierNumber: parseInt(key),
                    startingAtRank: startingAtRankRunningTotal,
                    players: playerIds
                });
                await tier.save();
                (group as any).tiers.push(tier._id);
                await group.save();

                startingAtRankRunningTotal += playerIds.length;
            }
            res.status(201).send();
        }
    } catch {
        res.status(400).send();
    }
}

export const addPlayerRanking = async (req: any, res: Response) => {
    const playerId = req.params.playerId;
    const userId = req.user._id;
    const rank = req.query.rank;

    try {
        const ranking = await Ranking.findOneAndUpdate({ player: playerId, user: userId }, { rank });
        if (ranking) {
            res.status(204).send();
            return;
        }

        const newRanking = new Ranking({
            rank,
            player: playerId,
            user: userId
        });
        await newRanking.save();
        res.status(201).send();
    } catch {
        res.status(400).send();
    }
}

export const deletePlayerRanking = async (req: any, res: Response) => {
    const playerId = req.params.playerId;
    const userId = req.user._id;

    try {
        const deleted = await Ranking.findOneAndDelete({ player: playerId, user: userId });
        if (!deleted) {
            res.status(404).send();
            return;
        }

        res.send();
    } catch {
        res.status(400).send();
    }
}

const convertCSVToJS = (csv: string, groupId: number) => {
    let rows = csv.split('\n');
    let headers = rows[0].split(',').map(field => field.substring(1, field.length - 1));
    headers[headers.length - 1] = headers[headers.length - 1].substring(0, headers[headers.length - 1].length - 1); //trim new line character from last element in list
    rows.shift();
    let players: Array<any> = [];
    rows.forEach((row) => {
        let splitRow = row.split(',');
        let player: any = {};

        splitRow.forEach((field, ind) => {
            if (ind > headers.length - 1) {
                player[headers[headers.length - 1]] = splitRow.slice(headers.length - 1, ind + 1).join();
            } else {
                player[headers[ind]] = field.substring(1, field.length - 1);
            }
        });

        let position = groupId !== eGroup.FLEX ? groupId : eGroup.NONE;

        players.push({
            bye: player['Bye Week'],
            adp: player['ADP'],
            name: player['Name'],
            notes: player['Notes'],
            points: player['Points'],
            rank: player['Rank'],
            risk: player['Risk'],
            team: player['Team'],
            tier: player['Tier'],
            position
        });
    });
    return players;
}

const groupPlayersByTier = (acc: any, player: any): any => {
    var tier = player.tier;
    if (!acc[tier]) {
        acc[tier] = [];
    }
    acc[tier].push(player);
    return acc;
}

const sortArrayByProp = (arr: any, property: any): Array<any> => {
    return arr.sort((a: any, b: any) => {
        return parseInt(a[property]) < parseInt(b[property]) ? -1 : 1;
    });
}