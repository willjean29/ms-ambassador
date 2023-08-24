import { getRepository } from "typeorm";
import { Product } from "../entity/product.entity";
import { Link } from "../entity/link.entity";

export class Subscriber {
  static async linkCreated(link: Link) {
    await getRepository(Link).save(link);
  }
}