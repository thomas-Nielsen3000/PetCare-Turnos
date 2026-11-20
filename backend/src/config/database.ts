
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("No se encontró DATABASE_URL en el archivo .env");
}

export const pool = new Pool({
    connectionString
});
