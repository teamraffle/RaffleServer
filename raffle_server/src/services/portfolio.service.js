const httpStatus = require('http-status');
const { NFT } = require('../models');
const ApiError = require('../utils/ApiError');
const axios = require('axios');
const config = require('../config/config');

const get_moralis_nft = async(wallet, chain_id)=> {
  var chain_type;
  if(chain_id==1){
    chain_type = 'eth'
  }
  await axios.get(`https://deep-index.moralis.io/api/v2/${wallet}/nft/?chain=${chain_type}&format=decimal`,{
    headers: {
      'x-api-key': config.moralis.secret
    }
  }) .then((Response)=>{
 
  
    NFT.nft(Response.data);
  }) .catch((Error)=>{console.log(Error)});  


};

const getNFTTransaction = async (wallet, chain_id) => {
  var chain_type;
  if(chain_id==1){
    chain_type = 'eth'
  }
  await axios.get(`https://deep-index.moralis.io/api/v2/${wallet}/nft/transfers?chain=${chain_type}&format=decimal&direction=both&limit=100`,{
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
