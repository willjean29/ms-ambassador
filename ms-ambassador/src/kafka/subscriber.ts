import { getRepository } from "typeorm";
import { Product } from "../entity/product.entity";
import { client } from "../index";

export class Subscriber {
  static async productCreated(product: Product) {
    await getRepository(Product).save(product);
    await client.del('products_frontend')
    await client.del('products_backend')
  }
  static async productUpdated(product: Product) {
    await getRepository(Product).save(product);
    await client.del('products_frontend')
    await client.del('products_backend')
  }
  static async productDeleted(id: number) {
    await getRepository(Product).delete(id);
    await client.del('products_frontend')
    await client.del('products_backend')
  }
}