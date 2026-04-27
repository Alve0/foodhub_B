import { exit } from "node:process";
import app from "./app";
import { PORT } from "./config/envConfig";
import { prisma } from "./lib/prisma";

const server = async () => {
  try {
    app.listen(PORT, () => {
      if (!PORT) {
        console.error("PORT is not defined in environment variables.");
        exit(1);
      }

      prisma
        .$connect()
        .then(() => {
          console.log("Connected to the database successfully.");
        })
        .catch((err: any) => {
          console.error("Failed to connect to the database:", err);
          exit(1);
        });

      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Error starting the server:", err);
  }
};

server();
