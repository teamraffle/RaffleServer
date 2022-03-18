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
 

    NFT.nftcreate(Response.data,wallet);
  }) 
  
  .catch((Error)=>{console.log(Error)});  


};

const getNFTTransaction = async (wallet, chain_id) => {
  var chain_type;
  var total;
  var page;

  if(chain_id==1){
    chain_type = 'eth'
  }
  const response = await axios.get(`https://deep-index.moralis.io/api/v2/${wallet}/nft/transfers?chain=${chain_type}&format=decimal&direction=both&limit=500`,{
    headers: {
      'x-api-key': config.moralis.secret
    }
  });
  var total = response.data.total;
  var page = response.data.page;
  
  const collectionSet = await NFT.createTx(response.data);
  console.log('sssssssssssssssssssss');
  console.log(collectionSet);

};

module.exports = {
  get_moralis_nft,
  getNFTTransaction,
};
