import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/user.entity";
import { client } from "../index";
import { UserService } from "../services/user.service";

export const Ambassadors = async (req: Request, res: Response) => {
    const users = await UserService.get('users');
    res.send(users.filter(user => user.is_ambassador));
}

export const Rankings = async (req: Request, res: Response) => {
    const result: string[] = await client.sendCommand(['ZREVRANGEBYSCORE', 'rankings', '+inf', '-inf', 'WITHSCORES']);
    let name;

    res.send(result.reduce((o, r) => {
        if (isNaN(parseInt(r))) {
            name = r;
            return o;
        } else {
            return {
                ...o,
                [name]: parseInt(r)
            };
        }
    }, {}));
}
