const axios = require('axios');
const express = require('express');
const { header } = require('express/lib/request');
const validate = require('../../middlewares/validate');
const portfolioValidation = require('../../validations/portfolio.validation');
const portfolioController = require('../../controllers/portfolio.controller');


const router = express.Router();

router
  .route('/nft')
  .get(validate(portfolioValidation.getUserbyWallet), portfolioController.test)
  
router
  .route('/fp')
  .get(validate(portfolioValidation.getUserbyWallet), portfolioController.opensea)

  router
  .route('/save_nft_slug')
  .get(validate(portfolioValidation.getUserbyWallet), portfolioController.slugsave)

  router
  .route('/test')
  .get(validate(portfolioValidation.getUserbyWallet), portfolioController.saveNFTTransactions)


module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Portfolios
 *   description: Portfolio management and retrieval
 */

