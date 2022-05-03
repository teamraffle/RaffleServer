const axios = require('axios');
const express = require('express');
const { header } = require('express/lib/request');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');


const router = express.Router();

router.route('/login').post(validate(authValidation.login), authController.login)

router.route('/logout').post(validate(authValidation.logout), authController.logout)

// router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);


module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Status
 *   description: Check if user is logged in or out
 */

