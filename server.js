// server.js (ESM version)
import express from "express";
import dotenv from "dotenv";
import { Client } from "@notionhq/client";
import appRoutes from "./app.js";

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

if (!process.env.NOTION_API_KEY || !databaseId) {
  throw new Error("NOTION_API_KEY ou NOTION_DATABASE_ID manquant dans .env");
}

const app = express();
app.locals.notion = notion;
app.locals.databaseId = databaseId;

appRoutes(app);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});
