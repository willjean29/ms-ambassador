import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { MoreThanOrEqual, getRepository } from "typeorm";
import { User } from "../entity/user.entity";
import { Token } from "../entity/token.entity";

export const AuthMiddleware = async (req: Request, res: Response, next: Function) => {
    try {
        const jwt = req.cookies['jwt'];
        const payload = verify(jwt, process.env.SECRET_KEY) as any;
        if (!payload) {
            return res.status(401).send({
                message: 'unauthenticated'
            });
        }

        const user = await getRepository(User).findOne(payload.id);

        const userToken = await getRepository(Token).findOne({
            user_id: user.id,
            expired_at: MoreThanOrEqual(new Date())
        })

        if (!userToken) {
            return res.status(401).send({
                message: 'unauthenticated'
            });
        }

        req["user"] = user;
        req["scope"] = payload.scope;

        next();
    } catch (e) {
        console.log("error en ms-users")
        console.log(e)
        return res.status(401).send({
            message: 'unauthenticated'
        });
    }
}
