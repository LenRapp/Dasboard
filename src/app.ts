require("dotenv").config();
const express = require("express");
const { Client } = require("@notionhq/client");
import { Request, Response } from 'express';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

const app = express();
app.get("/list", async (req: Request, res: Response) => {
    try {
      const response = await notion.databases.query({ database_id: databaseId });
      const entries = response.results;
      res.json(entries);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
});