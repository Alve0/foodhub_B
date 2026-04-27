import dotenv from "dotenv";
import express, { Application } from "express";
import cors from "cors";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

export default app;
