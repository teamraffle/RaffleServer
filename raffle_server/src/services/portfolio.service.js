const httpStatus = require('http-status');
const { User, WalletEth } = require('../models');
const ApiError = require('../utils/ApiError');
const axios = require('axios');
const createUser = async (body) => {
 
    var returndata ="";
    axios.get('https://deep-index.moralis.io/api/v2/0x13c150622405bf2b5759663ce811b2b87f053601/nft?chain=eth&format=decimal',{
        method: 'GET',
        headers: {
          'x-api-key': 'ob3tEdcftYbkpUiInzVe2pn2yO7ncdqZOomeymK2f69lIjFrbd4b3zyGLOHwylEr'
        }
      }) .then((Response)=>{
        returndata = JSON.stringify(Response.data)
        
      }) 
      .catch((Error)=>{console.log(Error)})
      
      
};

module.exports = {
  createUser,
 
  // deleteUserById,
};
