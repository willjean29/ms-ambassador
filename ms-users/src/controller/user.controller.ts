import { getRepository } from "typeorm";
import { User } from "../entity/user.entity";
import { Request, Response } from "express";

export const Users = async (req: Request, res: Response) => {
  res.send(await getRepository(User).find());
}

export const UserById = async (req: Request, res: Response) => {
  res.send(await getRepository(User).findOne(req.params.id));
} 