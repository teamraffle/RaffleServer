const express = require('express');
const router = express.Router();

const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');




router
.route('/:user_id')
.get(validate(userValidation.getUserbyID), userController.getUserbyId)
.patch(validate(userValidation.updateUser), userController.updateUser)



router
  .route('/')
  .post(validate(userValidation.createUser), userController.createUser) 
  .get(validate(userValidation.getUserbyWallet), userController.getUserbyWallet)


module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */

