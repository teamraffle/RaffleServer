const axios = require('axios');
const express = require('express');
const { header } = require('express/lib/request');
const validate = require('../../middlewares/validate');
const portfolioValidation = require('../../validations/portfolio.validation');
const portfolioController = require('../../controllers/portfolio.controller');


const router = express.Router();

router
  .route('/basic/:user_id_or_address')
  .get(validate(portfolioValidation.getPortfolio), portfolioController.get_portfolio)




module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Portfolios
 *   description: Portfolio management and retrieval
 */

