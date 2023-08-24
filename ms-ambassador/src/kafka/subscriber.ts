import { getRepository } from "typeorm";
import { Product } from "../entity/product.entity";

export class Subscriber {
  static async productCreated(product: Product) {
    await getRepository(Product).save(product);
  }
  static async productUpdated(product: Product) {
    await getRepository(Product).save(product);
  }
  static async productDeleted(id: number) {
    await getRepository(Product).delete(id);
  }
}