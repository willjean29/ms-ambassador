import { getRepository } from "typeorm";
import { User } from "../entity/user.entity";
import { Request, Response } from "express";

export const Users = async (req: Request, res: Response) => {
  res.send(await getRepository(User).find());
}