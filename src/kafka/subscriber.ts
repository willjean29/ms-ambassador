import { getRepository } from "typeorm";
import { Product } from "../entity/product.entity";

export class Subscriber {
  async productCreated(product: Product) {
    await getRepository(Product).save(product);
  }
  async productUpdated(product: Product) {
    await getRepository(Product).save(product);
  }
  async productDeleted(id: number) {
    await getRepository(Product).delete(id);
  }
}