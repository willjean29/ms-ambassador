import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { createConnection } from "typeorm";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import { createClient } from "redis";
import AppError from './errors/AppError';
import { routes } from './routes';
import { producer } from './kafka/config';

dotenv.config();

export const client = createClient({
  url: 'redis://redis:6379'
});

createConnection().then(async () => {
  await producer.connect()
  await client.connect();

  const app = express();

  app.use(cookieParser());
  app.use(express.json());
  app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:4000', 'http://localhost:5000']
  }));

  routes(app);

  app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
    next(error);
  });

  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  });

  app.listen(8000, () => {
    console.log('ms-ambassador runs on port 8000');
  });
});

