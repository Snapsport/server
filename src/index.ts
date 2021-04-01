/*
 * File: index.ts
 * Project: drinking-game-app-server
 * Version: 1.0.0
 * File Created: Thursday, 7th May 2020 10:42:01 am
 * Author: Eoan O'Dea - eoan@wspace.ie
 * ---------------
 * File Description: Entry point for the application, imports express and connects to the database
 * Last Modified: Thursday, 7th May 2020 11:45:23 am
 * Modified By: Eoan O'Dea - eoan@wspace.ie
 * ---------------
 * Copyright 2020 - WebSpace
 */

import config from "../config/config";
import app from "./express";
import mongoose from "mongoose";
// import Session from 'express-session'

/**
 * Mongoose Connection configurations
 */
const options = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

/**
 * Creates a global mongoose promise
 */
mongoose.Promise = global.Promise;

/**
 * Connect using the config mongoURI and options
 */
mongoose.connect(config.mongoUri, options);

/**
 * Listen for an error
 */
mongoose.connection.on("error", () => {
  throw new Error(`unable to connect to database: ${config.mongoUri}`);
});

/**
 * Listen on the specified port, and for any errors
 */
app
  .listen(config.port, () => {
    console.info("Server started on port %s.", config.port);
  })
  .on("error", (err: any) => {
    console.error("Server Error: ", err);
  });
