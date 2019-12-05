import express from 'express';
import mongoose from 'mongoose';

import { Group } from '../models/players/group.model';
import { Player } from '../models/players/player.model';
import { Tier } from '../models/players/tier.model';

export const getPlayers = async (req: express.Request, res: express.Response) => {
    const position = req.query.position;

    try {
        const players = !!position
            ? await Player.find({ position })
            : await Player.find();

        if (!players) {
            res.status(404).send();
            return;
        }
        res.send(players);
    } catch {
        res.status(400).send();
    }
}

export const addPlayers = async (req: express.Request, res: express.Response) => {
    const groupId = +req.params.groupId;

    try {
        if (Object.keys((<any>req).files).length === 0) {
            res.status(400).send();
        } else {
            let playersCSV = (<any>req).files.players.data.toString('utf8');
            let players = convertCSVToJS(playersCSV, groupId);

            let tiersObject = players.reduce(groupPlayersByTier, {});
            let groupModel = new Group({
                position: groupId
            });

            let group = await groupModel.save();
            let startingAtRankRunningTotal = 1;

            for (const key of Object.keys(tiersObject)) {
                const sortedPlayers = sortArray(tiersObject[key], 'rank');
                let playerIds = [];
                for (let player of sortedPlayers) {
                    let existingPlayer = await Player.findOne({
                        name: player.name,
                        team: player.team
                    }) as mongoose.Document & { position: number };

                    if (existingPlayer) {
                        if (existingPlayer.position = -1) {
                            existingPlayer.position = groupId;
                            await existingPlayer.save();
                        }
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
                    players: playerIds,
                    group: group._id
                });
                await tier.save();

                startingAtRankRunningTotal += playerIds.length;
            }
            res.status(201).send();
        }
    } catch {
        res.status(400).send();
    }
}

function convertCSVToJS(csv: string, groupId: number) {
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

        let position = groupId !== 4 ? groupId : -1;

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

const groupPlayersByTier = (acc: any, player: any) => {
    var tier = player.tier;
    if (!acc[tier]) {
        acc[tier] = [];
    }
    acc[tier].push(player);
    return acc;
}

const sortArray = (arr: any, property: any) => {
    return arr.sort((a: any, b: any) => {
        return parseInt(a[property]) < parseInt(b[property]) ? -1 : 1;
    });
}