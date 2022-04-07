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

  let collectionSet = new Set(); //token_address 리턴
  let slugSet = new Set(); //slug 리턴
  try {

    const response = await axios.get(
      `https://api.opensea.io/api/v1/collections?asset_owner=${wallet}&offset=${offset}&limit=${page_size}`,
      
    );

    const data= await NFT.nft_coll_db_save(response.data, wallet);
  
    collectionSet = new Set([...collectionSet, ...data.collectionSet]);
    slugSet = new Set([...slugSet, ...data.slugSet]);
    offset = page_size;

        while(true){
            
          const url  = `https://api.opensea.io/api/v1/collections?asset_owner=${wallet}&offset=${offset}&limit=${page_size}`;

          const response_rp = await axios.get(url);
          if(Object.keys(response_rp.data).length==0) //빈값이 응답한다면 반복 끝내기
          {
           break;
          }
          // console.log(Object.keys(response_rp.data).length)
          var dataSet = await NFT.nft_coll_db_save(response_rp.data, wallet);
          if(dataSet !=0) //비어있지 않다면 추가
          {
            collectionSet = new Set([...collectionSet, ...dataSet.collectionSet]);
            slugSet = new Set([...slugSet, ...dataSet.slugSet]);
          }
          offset = offset+page_size; 
        }
     
      return {coll_set: collectionSet, slug_set: slugSet};
    
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
    // console.log(response.data);
    total = response.data.total;
    page = response.data.page;
    cursor = response.data.cursor;
 
    await NFT.nft_db_save(response.data, wallet);
    var repeat = Math.ceil(total / page_size)-1;
  


    if(total > page_size){
        // console.log("쳐넘음")
        while(repeat--){
          const url  = `https://deep-index.moralis.io/api/v2/${wallet}/nft/?chain=${chain_type}&format=decimal&limit=${page_size}&cursor=${cursor}`;
          const response_rp = await axios.get( url,{
            headers: {
              'x-api-key': config.moralis.secret
            }
          });
          page = response_rp.data.page;
          cursor = response_rp.data.cursor;
          // console.log("page,cursor:",page,cursor);
          // console.log(response_rp.data);
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
    if (wallet.length ==40){
      wallet = '0x'+wallet
    }
  }

  let map_ave_date = new Map();

  try {
    const url = `https://deep-index.moralis.io/api/v2/${wallet}/nft/transfers?chain=${chain_type}&format=decimal&direction=both&limit=${page_size}&cursor=${cursor}`;
    const response = await axios.get(url, {
      headers: {
        'x-api-key': config.moralis.secret,
      },
    });
    // console.log(response.data);
    total = response.data.total;
    cursor = response.data.cursor;
    //평균홀딩기간
    const arr_ave_date = await get_ave_holding_date(response.data, map_ave_date);
    console.log("됏냐"+arr_ave_date);
    //DB에 저장
    const collectionSet = await NFT.createTx_and_portfolio(response.data, wallet);
    
    return { collectionSet, total, cursor };
  } catch (err) {
    console.log('Error >>', err);
  }
};

const get_ave_holding_date = async(data, map_ave_date) =>{
  let arr_ave_date= [];

  //out 된 nft의 평균기간
  for(idx in data.result){

    const token_address= data.result[idx].token_address.replace('0x','');
    const token_id= data.result[idx].token_id;
    const block_timestamp= data.result[idx].block_timestamp;

    get_holding_date(map_ave_date, arr_ave_date, token_address, token_id, block_timestamp);
  };

  //현재홀딩중인 NFT의 평균기간
  for (let value of map_ave_date.values()){
    console.log(value);
    const out_time = Date.now();
    const in_time = new Date(value.block_timestamp);
    //타임스탬프간 시간 계산
    const diffTime = Math.abs(out_time - in_time);
    const holding_date = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    console.log(holding_date + " days-");
    //날짜 어레이에 추가
    arr_ave_date.push(holding_date)
  }
 
 
  console.log('완성 리스트 : %O', arr_ave_date );

 
  return average(arr_ave_date);

}
const average = arr => arr.reduce((a,b) => a + b, 0) / arr.length;

const get_holding_date = async (nftMap, timeArray, token_address, token_id, timestamp) => {
  const key = token_address.toString() +token_id.toString();
  console.log('홀딩'+timestamp);

  if(nftMap.has(key)){
    const out_time = new Date(nftMap.get(key).block_timestamp);
    const in_time = new Date(timestamp);

    console.log(out_time);
    console.log(in_time);
    //타임스탬프간 시간 계산
    const diffTime = Math.abs(out_time - in_time);
    const holding_date = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    console.log(holding_date + " days");
    //날짜 어레이에 추가
    timeArray.push(holding_date)

    //맵에서 지움
    nftMap.delete(key)

  }else{
    nftMap.set(key, {block_timestamp: timestamp})//이게 판매일 가능성 높음 최신부터 들어오기때문에
  }

};


const check_collection_exists = async (addressSet) => {
  try {
    return await NFT.checkAddress(addressSet);
  } catch (err) {
    console.log('Error >>', err);
  }
};

const get_nft_fp = async(slug_set) => {
  console.log(slug_set)
  
  for(let idx of slug_set){
  // console.log("https://api.opensea.io/api/v1/collection/" + idx)
  try {
    const Response = await axios.get('https://api.opensea.io/api/v1/collection/' + idx);
    // console.log(Response);
    await NFT.save_nft_fp(Response.data.collection);
  } catch (err) {
    console.log(Error);
    }
  }
};


const get_and_save_nftcoll = async (missingAddresses) => {
  for (let address of missingAddresses) {
    address = '0x'+address;
    let collection = await get_collection_opensea(address);
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
    const url  = `https://api.opensea.io/api/v1/asset_contract/${address}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36',
        'sec-fetch-mode': 'cors',
        referrer: 'https://api.opensea.io/',
        'X-Api-Key': config.opensea.secret,
      },
    });
    // console.log(response.data);

    var collection = {
      token_address : response.data.address.replace('0x',''),
      symbol : response.data.symbol,
      name: response.data.name,
      contract_type : response.data.schema_name,
      slug: response.data.collection.slug,
      collection_icon : response.data.image_url,
    };
    return collection;

  } catch (err) {
    console.log('Error >>', err);
  }
};

function remove_SetA_from_SetB (a, b) {
  if (!a instanceof Set || !b instanceof Set) {
    //  console.log("The given objects are not of type Set");
     return null;
  }
  let newSet = new Set();
  b.forEach(elem => newSet.add(elem));
  a.forEach(elem => newSet.delete(elem));
  return newSet;
}

module.exports = {
  get_nftcoll_opensea,
  get_collection_opensea,
  get_and_save_nftcoll,
  get_nft_moralis,
  get_nft_fp,
  check_collection_exists,
  get_all_NFT_transfers,
  remove_SetA_from_SetB,
};
