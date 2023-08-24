import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Product } from "../entity/product.entity";
import { producer } from "../kafka/config";

export const Products = async (req: Request, res: Response) => {
    const products = await getRepository(Product).find();
    res.send(products);
}

export const CreateProduct = async (req: Request, res: Response) => {
    const product = await getRepository(Product).save(req.body)
    await producer.send({
        topic: 'ambassador_topic',
        messages: [{
            key: "productCreated",
            value: JSON.stringify(product)
        }]
    });
    res.status(201).send(product);
}

export const GetProduct = async (req: Request, res: Response) => {
    res.send(await getRepository(Product).findOne(req.params.id));
}

export const UpdateProduct = async (req: Request, res: Response) => {
    const repository = getRepository(Product);

    await repository.update(req.params.id, req.body);

    const product = await repository.findOne(req.params.id);

    await producer.send({
        topic: 'ambassador_topic',
        messages: [{
            key: "productUpdated",
            value: JSON.stringify(product)
        }]
    });

    res.status(202).send(product);
}

export const DeleteProduct = async (req: Request, res: Response) => {
    await getRepository(Product).delete(req.params.id);
    await producer.send({
        topic: 'ambassador_topic',
        messages: [{
            key: "productDeleted",
            value: req.params.id
        }]
    });
    res.status(204).send(null);
}
