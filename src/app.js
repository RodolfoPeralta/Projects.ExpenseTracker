import express from "express";
import { config } from "dotenv";
import MongoDbService from "./Infraestructure/Services/MongoDbService.js";
import apiRouter from './Application/Api/Routes/Index.js';
import LoggerService from "./Application/Services/LoggerService.js";
config();

const MONGO_URL = process.env.MONGO_URL;

const app = express();

// Logger
app.use(LoggerService.LoggerMiddleware);

// MongoDB connection
MongoDbService.Connect(MONGO_URL);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Routes
app.use("/api/v1", apiRouter);

export default app;

