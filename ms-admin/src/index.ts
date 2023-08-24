import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { createConnection } from "typeorm";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import { routes } from './routes';
import AppError from './errors/AppError';

dotenv.config();
createConnection().then(async () => {
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
        console.log('ms-admin runs on port 8000');
    });
});

