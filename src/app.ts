import dotenv from "dotenv";
import express, { Application } from "express";
import cors from "cors";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import router from "./routes/routes";

dotenv.config();

const app: Application = express();
app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(cors());
app.use(express.json());

app.use("/api/v1", router);

export default app;
