const httpStatus = require('http-status');
const { NFT } = require('../models');
const ApiError = require('../utils/ApiError');
const axios = require('axios');
const config = require('../config/config');

const get_moralis_nft = async (body) => {
 
  await axios.get('https://deep-index.moralis.io/api/v2/0x13c150622405bf2b5759663ce811b2b87f053601/nft?chain=eth&format=decimal',{
    method: 'GET',
    headers: {
      'x-api-key': config.moralis.secret
    }
  }) .then((Response)=>{
    res.status(httpStatus.OK).send(Response.data);
  }) 
  .catch((Error)=>{console.log(Error)});  
};

const getNFTTransaction = async (wallet, chain_id) => {
  var chain_type;
  if(chain_id==1){
    chain_type = 'eth'
  }
  await axios.get(`https://deep-index.moralis.io/api/v2/${wallet}/nft/transfers?${chain_type}&format=decimal`,{
    headers: {
      'x-api-key': config.moralis.secret
    }
  }) .then((Response)=>{
    //NFT.createTx(Response.data);
    console.log(Response.data);
  }) .catch((Error)=>{console.log(Error)});  
};

module.exports = {
  get_moralis_nft,
  getNFTTransaction,
};
