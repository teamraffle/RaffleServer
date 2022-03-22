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
    
        while(repeat--){
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

const getAllNFTTransfers = async (wallet, chain_id) => {
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
    cursor = '';
    const url  = `https://deep-index.moralis.io/api/v2/${wallet}/nft/transfers?chain=${chain_type}&format=decimal&direction=both&limit=${page_size}`;
    const response = await axios.get(url,{
      headers: {
        'x-api-key': config.moralis.secret
      }
    });
    console.log(response.data);
    console.log('페이지 0');
    total = response.data.total;
    page = response.data.page;
    cursor = response.data.cursor;


    //DB에 저장
    // const collectionSet = await NFT.createTx(response.data);


    //두번째부터 반복
    if(total > page_size){
      const total_ = Math.ceil(total/page_size);
      console.log('토탈 : '+total);
      console.log('사이즈: '+page_size);
      console.log('토탈 실행횟수: '+total_);

      page++;
      while( page < Math.ceil(total/page_size)){
        console.log('시작페이지: '+page);
        const url  = `https://deep-index.moralis.io/api/v2/${wallet}/nft/transfers?chain=${chain_type}&format=decimal&direction=both&limit=${page_size}&cursor=${cursor}`;
        const response_rp = await axios.get( url,{
          headers: {
            'x-api-key': config.moralis.secret
          }
        });

        page++;
        cursor = response_rp.data.cursor;

        console.log(response_rp.data);

        //DB에 저장
        // const collectionSet = await NFT.createTx(response_rp.data);
        console.log("sssssssssssssssssss페이지넘버"+ page);
     
      }

    }
  } catch(err) {
    console.log("Error >>", err);
  }
  

  // console.log(collectionSet);
  //콜렉션세트 더하기
  // return collectionSet;
}


const get_nft_fp = async(coll_name,chain_id)=> {
  var chain_type;

 
  if(chain_id==1){
    chain_type = 'eth'
  }
  
  axios.get(`https://api.opensea.io/api/v1/collection/${coll_name}`
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
  getAllNFTTransfers,
  get_nft_fp
};
