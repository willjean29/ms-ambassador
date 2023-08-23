import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export const AuthMiddleware = async (req: Request, res: Response, next: Function) => {
    try {
        const jwt = req.cookies['jwt'];
        const data = await UserService.get('user', jwt);

        req["user"] = data;

        next();
    } catch (e) {
        return res.status(401).send({
            message: 'unauthenticated'
        });
    }
}
