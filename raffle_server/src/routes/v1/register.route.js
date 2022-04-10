const express = require('express');
const router = express.Router();

const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

router
  .route('/nickname')
  .get(validate(userValidation.checkNickname), userController.check_nickname_duplication)


module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Register
 *   description: Help register process
 */
