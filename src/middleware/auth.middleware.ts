import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export const AuthMiddleware = async (req: Request, res: Response, next: Function) => {
    try {
        const scope = req.path.indexOf('api/ambassador') >= 0 ? 'ambassador' : 'admin';
        const jwt = req.cookies['jwt'];
        const data = await UserService.get(`users/${scope}`, jwt);

        req["user"] = data;

        next();
    } catch (e) {
        return res.status(401).send({
            message: 'unauthenticated'
        });
    }
}
