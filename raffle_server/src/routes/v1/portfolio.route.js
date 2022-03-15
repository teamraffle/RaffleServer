const axios = require('axios');
const express = require('express');
const { header } = require('express/lib/request');
const validate = require('../../middlewares/validate');
const portfolioValidation = require('../../validations/portfolio.validation');
const portfolioController = require('../../controllers/portfolio.controller');


const router = express.Router();
const userAction = async () => {
  

  axios.get('https://deep-index.moralis.io/api/v2/0x13c150622405bf2b5759663ce811b2b87f053601/nft?chain=eth&format=decimal',{
    method: 'GET',
    headers: {
      'x-api-key': 'ob3tEdcftYbkpUiInzVe2pn2yO7ncdqZOomeymK2f69lIjFrbd4b3zyGLOHwylEr'
    }
  }) .then((Response)=>{
    console.log(Response.data);
    return JSON.stringify(Response.data);
  }) 
  .catch((Error)=>{console.log(Error)})



}

router
  .route('/nft')
  .get(validate(portfolioValidation.getUserbyWallet), portfolioController.test)
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Portfolios
 *   description: Portfolio management and retrieval
 */

