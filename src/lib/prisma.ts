import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

import { DATABASE_URL } from "../config/envConfig";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = DATABASE_URL as string;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
