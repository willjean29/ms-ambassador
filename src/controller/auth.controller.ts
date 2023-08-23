import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Order } from "../entity/order.entity";

import { UserService } from "../services/user.service";
export const Register = async (req: Request, res: Response) => {
    const body = req.body
    const user = await UserService.post('register', {
        ...body,
        is_ambassador: req.path === '/api/ambassador/register'
    });

    res.send(user);
}

export const Login = async (req: Request, res: Response) => {
    const body = req.body
    const data = await UserService.post('login', {
        ...body,
        scope: req.path === '/api/admin/login' ? 'admin' : 'ambassador'
    });

    res.cookie("jwt", data.jwt, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000//1 day
    })

    res.send({
        message: 'success'
    });
}

export const AuthenticatedUser = async (req: Request, res: Response) => {
    const user = req["user"];

    if (req.path === '/api/admin/user') {
        return res.send(user);
    }

    const orders = await getRepository(Order).find({
        where: {
            user_id: user.id,
            complete: true
        },
        relations: ['order_items']
    });

    user.revenue = orders.reduce((s, o) => s + o.ambassador_revenue, 0);

    res.send(user);
}

export const Logout = async (req: Request, res: Response) => {
    const jwt = req.cookies['jwt'];
    await UserService.post('logout', {}, jwt);
    res.cookie("jwt", "", { maxAge: 0 });
    res.send({
        message: 'success'
    });
}

export const UpdateInfo = async (req: Request, res: Response) => {
    const jwt = req.cookies['jwt'];
    const data = await UserService.put('users/info', req.body, jwt);
    res.send(data);
}

export const UpdatePassword = async (req: Request, res: Response) => {
    const jwt = req.cookies['jwt'];
    const data = await UserService.put('users/password', req.body, jwt);
    res.send(data);
}
