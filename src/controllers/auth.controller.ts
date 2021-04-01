/*
 * File: auth.controller.ts
 * Project: drinking-game-app-server
 * Version: 1.0.0
 * File Created: Thursday, 7th May 2020 12:26:48 pm
 * Author: Eoan O'Dea - eoan@wspace.ie
 * ---------------
 * File Description: Controller for User Authentication
 * Last Modified: Thursday, 7th May 2020 12:29:06 pm
 * Modified By: Eoan O'Dea - eoan@wspace.ie
 * ---------------
 * Copyright 2020 - WebSpace
 */

/**
 * Primary dependencies
 */
import { Request, Response, NextFunction } from "express";
import RequestMiddleware from "../interfaces/express";

/**
 * Model Schema
 */
import User from "../models/user.model";

/**
 * JSON Web token imports
 */
import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";

/**
 * Importing environment variables
 */
import config from "./../../config/config";

/**
 * Helpers for success / error responses
 */
import { handleError, handleSuccess } from "../helpers/responseHandler";

/**
 * Handle a user signin
 *
 * @param req
 * @param res
 */
export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    /**
     * Find a user with this email
     */
    const user: any = await User.findOne({ email });

    /**
     * If no user is found, or if the password
     * doesn't match, drrthrow an error
     */
    if (!user) throw new Error(`No user exists with the email ${email}`);

    if (!user.authenticate(password))
      throw new Error("Email and Password don't match");

    /**
     * Sign the user's unique ID into a
     * JSON Web Token string payload
     */
    const token = jwt.sign(
      {
        _id: user._id,
      },
      config.jwtSecret
    );

    /**
     * Set the token as a cookie in the response
     */
    res.cookie("t", token, {
      expires: new Date(Date.now() + parseInt(config.SESSION_TTL, 10)),
      httpOnly: false,
    });

    /**
     * Return a 200 response with the token and user
     */
    return res.status(200).json(
      handleSuccess({
        token,
        user: { name: user.name, email: user.email, _id: user._id },
      })
    );
  } catch (err) {
    return res.status(401).json(handleError(err));
  }
};

/**
 * Clears the token from the response cookies
 * and responds with a 200 status
 *
 * @param req
 * @param res
 */
export const signout = async (req: Request, res: Response) => {
  const accessToken = req.params.accessToken;

  /**
   * If there is an access token, run the signout with google function
   */
  // if (accessToken) return signoutwithGoogle(accessToken, res);

  res.clearCookie("t");
  return res.status(200).json(handleSuccess("Signed out"));
};

/**
 * Clears the Google access token from the DB
 *
 * @param {string} accessToken
 * @param {Response} res
 */
// const signoutwithGoogle = async (accessToken: string, res: Response) => {
//   try {
//     const user = await User.findOneAndUpdate(
//       { accessToken },
//       { $set: { accessToken: null } },
//       { new: true }
//     );

//     res.clearCookie("t");

//     return res.status(200).json(handleSuccess(user));
//   } catch (err) {
//     console.log("error signing out with google: ", err);
//     return res.status(200).json(handleError(err));
//   }
// };

/**
 * Ensure a user is signed in before continuing
 */
interface IExpressJWT {
  secret: string;
  userProperty: string;
}

export const requireSignin = expressJwt({
  secret: config.jwtSecret,
  userProperty: "auth",
  algorithms: ["HS256"]
});

/**
 * Ensure a user has authorization, and is the logged in user before continuing
 * If not, respond with a 403 response
 */
export const hasAuthorization = (
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  const authorized =
    req.profile && req.auth && req.profile._id.toString() === req.auth._id;

  if (!authorized) {
    return res
      .status(403)
      .json(handleError("You are not authorized to access this information"));
  }

  next();
};

/**
 * Get a user by their access token
 *
 * @param {Request} req
 * @param {Response} res
 */
export const getUser = async (req: RequestMiddleware, res: Response) => {
  /**
   * Find a user with this email
   */
  const user: any = await User.findById(req.auth._id);

  /**
   * Return a 200 response with the token and user
   */
  return res.status(200).json(
    handleSuccess({
      token: req.params.token,
      user: { name: user.name, email: user.email, _id: user._id },
    })
  );
};

/**
 * Verifies a login with a third party
 *
 * -Google
 * -Apple (iOS only)
 *
 * Returns the user and a token to the frontend
 *
 * @param {Request} req
 * @param {Response} res
 */
// export const loginWithThirdParty = async (req: Request, res: Response) => {
//   const { provider, type } = req.params;
//   let user: any;
//   console.log("provider!", provider, type);
//   try {
//     if (provider === "google")
//       user = await loginWithGoogle(type, req.body.token, req.body.accessToken);
//     else user = await loginWithApple(req.body);

//     /**
//      * Either create or update a user in our database
//      * with the email provided from the ticket payload
//      */
//     const response = await User.findOneAndUpdate({ email: user.email }, user, {
//       new: true,
//       upsert: true,
//     });

//     console.log("user created or updated!", response);

//     /**
//      * Sign the user's unique ID into a
//      * JSON Web Token string payload
//      */
//     const token = jwt.sign(
//       {
//         _id: response._id,
//       },
//       config.jwtSecret
//     );

//     /**
//      * Set the token as a cookie in the response
//      */
//     res.cookie("t", token, {
//       expires: new Date(Date.now() + parseInt(config.SESSION_TTL, 10)),
//       httpOnly: false,
//     });

//     /**
//      * Create a response object to be sent
//      * back to the frontend
//      */
//     const responseUser: any = {
//       name: response.name,
//       email: response.email,
//       _id: response._id,
//     };

//     /**
//      * If the user has an access token
//      * append it onto the responseUser
//      */
//     // @ts-ignore
//     if (response.accessToken) responseUser.accessToken = response.accessToken;

//     /**
//      * Return a 200 response with the token and user
//      */
//     return res.status(200).json(handleSuccess({ token, user: responseUser }));
//   } catch (err) {
//     console.log("error authenticating third party!", err);

//     return res.status(401).json(handleError(err.toString()));
//   }
// };
