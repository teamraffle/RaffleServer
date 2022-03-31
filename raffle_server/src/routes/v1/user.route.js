const express = require('express');
const router = express.Router();

const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');




router
.route('/:user_id')
.get(validate(userValidation.getUserbyID), userController.get_user_by_id)
.patch(validate(userValidation.updateUser), userController.update_user)


router
  .route('/')
  .post(validate(userValidation.createUser), userController.create_user) 
  .get(validate(userValidation.getUserbyWallet), userController.get_user_by_wallet)


module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */

