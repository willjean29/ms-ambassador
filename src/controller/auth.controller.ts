import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Order } from "../entity/order.entity";
import { UserService } from "../services/user.service";

export const Register = async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    try {
        const user = await UserService.post("register", {
            ...body,
            is_ambassador: req.path === "/api/ambassador/register",
        });

        res.send(user);
    } catch (error) {
        return next(error);
    }
};

export const Login = async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    try {
        const data = await UserService.post("login", {
            ...body,
            scope: req.path === "/api/admin/login" ? "admin" : "ambassador",
        });

        res.cookie("jwt", data.jwt, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, //1 day
        });

        res.send({
            message: "success",
        });
    } catch (error) {
        return next(error);
    }
};

export const AuthenticatedUser = async (req: Request, res: Response, next: NextFunction) => {
    const user = req["user"];
    try {
        if (req.path === "/api/admin/user") {
            return res.send(user);
        }

        const orders = await getRepository(Order).find({
            where: {
                user_id: user.id,
                complete: true,
            },
            relations: ["order_items"],
        });

        user.revenue = orders.reduce((s, o) => s + o.ambassador_revenue, 0);

        res.send(user);
    } catch (error) {
        return next(error);
    }
};

export const Logout = async (req: Request, res: Response, next: NextFunction) => {
    const jwt = req.cookies["jwt"];
    try {
        await UserService.post("logout", {}, jwt);
        res.cookie("jwt", "", { maxAge: 0 });
        res.send({
            message: "success",
        });
    } catch (error) {
        return next(error);
    }
};

export const UpdateInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jwt = req.cookies["jwt"];
        const data = await UserService.put("users/info", req.body, jwt);
        res.send(data);
    } catch (error) {
        return next(error);
    }
};

export const UpdatePassword = async (req: Request, res: Response, next: NextFunction) => {
    const jwt = req.cookies["jwt"];
    try {
        const data = await UserService.put("users/password", req.body, jwt);
        res.send(data);
    } catch (error) {
        return next(error);
    }
};
