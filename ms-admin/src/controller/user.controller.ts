import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export const Ambassadors = async (req: Request, res: Response) => {
    const users = await UserService.get('users');
    res.send(users.filter(user => user.is_ambassador));
}

