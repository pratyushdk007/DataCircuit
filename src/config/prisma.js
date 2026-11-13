import "dotenv/config";

import {Prisma, PrismaClient} from"../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

if(!process.env.DATABASE_URL){
    throw new Error("DATABASE_URL is Missing")
}

const adapter=new PrismaPg({
    connectionString:process.env.DATABASE_URL
})

export const prisma=new PrismaClient({
  adapter
});