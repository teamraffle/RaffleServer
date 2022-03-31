const httpStatus = require('http-status');
const { NFT } = require('../models');
const ApiError = require('../utils/ApiError');
const axios = require('axios');
const config = require('../config/config');

const get_nftcoll_opensea = async (wallet, chain_id) => {
  let chain_type;
  let total;
  let offset=0;
  const page_size = 300;

  let collectionSet = new Set();
  try {

    const response = await axios.get(
      `https://api.opensea.io/api/v1/collections?asset_owner=${wallet}&offset=${offset}&limit=${page_size}`,
      
    );

    const data= await NFT.nft_coll_db_save(response.data, wallet);
    collectionSet = new Set([...collectionSet, ...data]);
    offset = page_size;

        while(true){
            
          const url  = `https://api.opensea.io/api/v1/collections?asset_owner=${wallet}&offset=${offset}&limit=${page_size}`;

          const response_rp = await axios.get(url);
          if(Object.keys(response_rp.data).length==0) //빈값이 응답한다면 반복 끝내기
          {
           break;
          }
          console.log(Object.keys(response_rp.data).length)
          var dataSet = await NFT.nft_coll_db_save(response_rp.data, wallet);
          if(dataSet !=0) //비어있지 않다면 추가
          {
            collectionSet = new Set([...collectionSet, ...dataSet]);
          }
          offset = offset+page_size; 
        }
      
      const union = new Set([...collectionSet]);
      return union;
    
  } catch (err) {
    console.log('Error >>', err);
  }
};

const get_nft_moralis = async (wallet, chain_id) => {
  let chain_type;
  let total;
  let cursor='';
  const page_size = 500;

  if (chain_id == 1) {
    chain_type = 'eth';
  }

  try {
  
    const response = await axios.get(
      `https://deep-index.moralis.io/api/v2/${wallet}/nft/?chain=${chain_type}&format=decimal&limit=${page_size}`,
      {
        headers: {
          'x-api-key': config.moralis.secret,
        },
      }
      
    );
    console.log(response.data);
    total = response.data.total;
    page = response.data.page;
    offset = response.data.cursor;
 
    await NFT.nft_db_save(response.data, wallet);
    var repeat = Math.ceil(total / page_size)-1;
  

    console.log(repeat);

    if(total > page_size){
        console.log("쳐넘음")
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
          console.log(response_rp.data);
          await NFT.nft_db_save(response_rp.data,wallet);
         
        }


      }
    
  } catch (err) {
    console.log('Error >>', err);
  }
};


const get_all_NFT_transfers = async (wallet, chain_id) => {
  let finalSet = new Set();

  let page = 0;
  const page_size = 500;

  //0페이지
  var { collectionSet, total, cursor } = await getAndSaveTransfer(wallet, chain_id, '', page_size);
  finalSet = collectionSet;
  // console.log(finalSet);
  // console.log(cursor);
 

  console.log(collectionSet);


  //1~끝페이지
  if (total > page_size) {
    page++;
    // console.log('페이지: '+page);
    while (page < Math.ceil(total / page_size)) {
      var { collectionSet, total, cursor } = await getAndSaveTransfer(wallet, chain_id, cursor, page_size);
      finalSet = new Set([...finalSet, ...collectionSet]);
      // console.log(finalSet);
      page++;
    }
  }

  return finalSet;
};

const getAndSaveTransfer = async (wallet, chain_id, _cursor, page_size) => {
  let chain_type;
  let total;
  let cursor;
  if (_cursor == undefined) {
    cursor = '';
  } else {
    cursor = _cursor;
  }

  if (chain_id == 1) {
    chain_type = 'eth';
  }
  try {
    const url = `https://deep-index.moralis.io/api/v2/${wallet}/nft/transfers?chain=${chain_type}&format=decimal&direction=both&limit=${page_size}&cursor=${cursor}`;
    const response = await axios.get(url, {
      headers: {
        'x-api-key': config.moralis.secret,
      },
    });
    console.log(response.data);
    total = response.data.total;
    cursor = response.data.cursor;
    //DB에 저장
    const collectionSet = await NFT.createTx(response.data);
    return { collectionSet, total, cursor };
  } catch (err) {
    console.log('Error >>', err);
  }
};

const check_collection_exists = async (addressSet) => {
  try {
    return await NFT.checkAddress(addressSet);
  } catch (err) {
    console.log('Error >>', err);
  }
};

const get_nft_fp = async (coll_name, chain_id) => {
  var chain_type;

  if (chain_id == 1) {
    chain_type = 'eth';
  }
  try {
    const Response = await axios.get('https://api.opensea.io/api/v1/collection/' + coll_name);
    console.log(Response);
    await NFT.save_nft_fp(Response.data.collection);
  } catch (err) {
    console.log(Error);
  }
};


const get_nftcoll_moralis = async (missingAddresses) => {
  for (let address of missingAddresses) {
    address = '0x'+address;
    let collection = await get_collection_moralis(address);
    await NFT.nft_coll_one_db_save(collection);
  }
};

const get_collection_moralis = async (address) => {
  try {
    const url = `https://deep-index.moralis.io/api/v2/nft/${address}?chain=eth&format=decimal&limit=1`;
    const response = await axios.get(url, {
      headers: {
        'x-api-key': config.moralis.secret,
      },
    });

    // console.log(response.data.result[0]);

    var collection = {
      token_address : response.data.result[0].token_address.replace('0x',''),
      symbol : response.data.result[0].symbol,
      name: response.data.result[0].name,
      contract_type : response.data.result[0].contract_type,
    };
    return collection;

  } catch (err) {
    console.log('Error >>', err);
  }
};

const get_collection_opensea = async (address) => {
  try {
    // const url  = `https://api.opensea.io/api/v1/collection/${address}`;
    const url = `https://api.opensea.io/api/v1/asset/0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb/1/?include_orders=false`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36',
        'sec-fetch-mode': 'cors',
        referrer: 'https://api.opensea.io/',
        'X-Api-Key': 'sss',
      },
    });
    console.log(response.data);
  } catch (err) {
    console.log('Error >>', err);
  }
};

module.exports = {
  get_nftcoll_opensea,
  get_nftcoll_moralis,
  get_nft_moralis,
  get_nft_fp,
  check_collection_exists,
  get_all_NFT_transfers,
};
