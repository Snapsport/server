/*
 * File: auth.routes.ts
 * Project: drinking-game-app-server
 * Version: 1.0.0
 * File Created: Monday, 11th May 2020 12:36:45 pm
 * Author: Eoan O'Dea - eoan@wspace.ie
 * ---------------
 * File Description: Routes for authentication
 * Last Modified: Monday, 11th May 2020 12:40:28 pm
 * Modified By: Eoan O'Dea - eoan@wspace.ie
 * ---------------
 * Copyright 2020 - WebSpace
 */


import express from 'express'
import * as authCtrl from '../controllers/auth.controller'

const router = express.Router()
const prefix = "/api/auth"

/**
 * @method POST - Signs in a user
 */
router.route(`${prefix}/signin`)
    .post(authCtrl.signin)

/**
 * @method GET - Signs out a user
 */
router.route(`${prefix}/signout/:accessToken?`)
    .get(authCtrl.requireSignin, authCtrl.signout)

/**
 * @method GET - Get a user by their token
 */
router.route(`${prefix}/user`)
    .get(authCtrl.requireSignin, authCtrl.getUser)


/**
 * @method POST - Verify a login with a third party
 */
// router.route(`${prefix}/signin/:provider/:type`)
//     .post(authCtrl.loginWithThirdParty)

export default router