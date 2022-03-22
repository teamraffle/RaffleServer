const httpStatus = require('http-status');
const { NFT } = require('../models');
const ApiError = require('../utils/ApiError');
const axios = require('axios');
const config = require('../config/config');



const get_moralis_nft = async(wallet, chain_id)=> {
  var chain_type;
  var total;
  var page;
  var cursor;
 
  const page_size = 9;
  if(chain_id==1){
    chain_type = 'eth'
  }
  try{

  const response = await axios.get(`https://deep-index.moralis.io/api/v2/${wallet}/nft/?chain=${chain_type}&format=decimal`,{
    headers: {
      'x-api-key': config.moralis.secret
    }
  }) 

    total = response.data.total;
    page = response.data.page;
    cursor = response.data.cursor;

    NFT.nftcreate(response.data,wallet);
    var repeat =  Math.ceil(total/page_size)+1;
    console.log(repeat);
   if(total > page_size){
    var i = 0;
      while(repeat--){

        console.log(i);
        i++; 
        const url  = `https://deep-index.moralis.io/api/v2/${wallet}/nft/?chain=${chain_type}&format=decimal&limit=${page_size}&cursor=${cursor}`;
        const response_rp = await axios.get( url,{
          headers: {
            'x-api-key': config.moralis.secret
          }
        });
        page = response_rp.data.page;
        cursor = response_rp.data.cursor;
        console.log("page,cursor:",page,cursor);
        console.log("sssssssssssssssssss페이지넘버"+ page);
        console.log(response_rp.data);

        //DB에 저장
        // const collectionSet = await NFT.createTx(response_rp.data);
      }

    }

  
  
  } 
  catch(err) {
    console.log("Error >>", err);
  }
  

};

const getNFTTransfers = async (wallet, chain_id) => {
  // var mergedCollectionSet = new Set([...set1, ...set2, ...set3])
  // console.log('sssssssssssssssssssss');
  getAndSaveTransfer(wallet, chain_id);


};

const getAndSaveTransfer= async (wallet, chain_id) =>{
  var chain_type;
  var total;
  var page;
  var cursor;
  // const page_size = 500;
  const page_size = 5;


  if(chain_id==1){
    chain_type = 'eth'
  }
  try {
    //처음가져옴
    const response = await axios.get(`https://deep-index.moralis.io/api/v2/${wallet}/nft/transfers?chain=${chain_type}&format=decimal&direction=both&limit=${page_size}`,{
      headers: {
        'x-api-key': config.moralis.secret
      }
    });
    console.log(response.data);
    total = response.data.total;
    page = response.data.page;
    cursor = response.data.cursor;
    //DB에 저장
    // const collectionSet = await NFT.createTx(response.data);

    var i = 0;
    //두번째부터 반복
    if(total > page_size){
      while((page+1) != Math.round(total/page_size)){
        console.log(i);
        i++; 
        const url  = `https://deep-index.moralis.io/api/v2/${wallet}/nft/transfers?chain=${chain_type}&format=decimal&direction=both&limit=${page_size}&cursor=${cursor}`;
        const response_rp = await axios.get( url,{
          headers: {
            'x-api-key': config.moralis.secret
          }
        });
        page = response_rp.data.page;
        cursor = response_rp.data.cursor;

        console.log("sssssssssssssssssss페이지넘버"+ page);
        console.log(response_rp.data);

        //DB에 저장
        // const collectionSet = await NFT.createTx(response_rp.data);
      }

    }
  } catch(err) {
    console.log("Error >>", err);
  }
  

  // console.log(collectionSet);
  //콜렉션세트 더하기
  // return collectionSet;
}


const get_nft_fp = async(chain_id)=> {
  var chain_type;

 
  if(chain_id==1){
    chain_type = 'eth'
  }
  
  axios.get('https://api.opensea.io/api/v1/collection/doodles-official'
     ).
  then((Response)=>{

    console.log(Response.data.collection.image_url);
    NFT.nft_fp_create(Response.data.collection);
}).catch((Error)=>{
    console.log(Error);
})

};


const getTransferAllPages= async (wallet, chain_id) =>{

}

module.exports = {
  get_moralis_nft,
  getNFTTransfers,
  get_nft_fp
};
