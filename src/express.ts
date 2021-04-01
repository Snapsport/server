/*
 * File: express.ts
 * Project: drinking-game-app-server
 * Version: 1.0.0
 * File Created: Thursday, 7th May 2020 10:42:01 am
 * Author: Eoan O'Dea - eoan@wspace.ie
 * ---------------
 * File Description: Initialize and run the Express Server
 * Last Modified: Thursday, 7th May 2020 10:58:00 am
 * Modified By: Eoan O'Dea - eoan@wspace.ie
 * ---------------
 * Copyright 2020 - WebSpace
 */

/**
 * Import primary dependencies
 */
import express, { Application, Request, Response } from "express";
import path from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import helmet from "helmet";
import cors from "cors";

/**
 * Import Routes
 */
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";

/**
 * Declare express app
 */
const app: Application = express();

/**
 * Get the current working directory
 */
const CURRENT_WORKING_DIR = process.cwd();

/**
 * parse body params and attache them to req.body
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());

/**
 * Secure apps by setting various HTTP headers
 */
app.use(helmet());

/**
 * enable CORS - Cross Origin Resource Sharing
 */
app.use(cors());

/**
 * Compile to dist directory
 */
app.use("/dist", express.static(path.join(CURRENT_WORKING_DIR, "dist")));

/**
 * Mount Routes
 *
 */
app.use("/", userRoutes);
app.use("/", authRoutes);

export default app;
// export default app
