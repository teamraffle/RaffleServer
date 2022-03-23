const httpStatus = require('http-status');
const { NFT } = require('../models');
const ApiError = require('../utils/ApiError');
const axios = require('axios');
const config = require('../config/config');

const get_moralis_nft = async (wallet, chain_id) => {
  var chain_type;
  var total;
  var page;
  var cursor;

  const page_size = 9;
  if (chain_id == 1) {
    chain_type = 'eth';
  }
  try {
    const response = await axios.get(
      `https://deep-index.moralis.io/api/v2/${wallet}/nft/?chain=${chain_type}&format=decimal`,
      {
        headers: {
          'x-api-key': config.moralis.secret,
        },
      }
    );

    total = response.data.total;
    page = response.data.page;
    cursor = response.data.cursor;

    NFT.nftcreate(response.data, wallet);
    var repeat = Math.ceil(total / page_size) + 1;
    console.log(repeat);
    if (total > page_size) {
      while (repeat--) {
        const url = `https://deep-index.moralis.io/api/v2/${wallet}/nft/?chain=${chain_type}&format=decimal&limit=${page_size}&cursor=${cursor}`;
        const response_rp = await axios.get(url, {
          headers: {
            'x-api-key': config.moralis.secret,
          },
        });
        page = response_rp.data.page;
        cursor = response_rp.data.cursor;
        console.log('page,cursor:', page, cursor);
        console.log('sssssssssssssssssss페이지넘버' + page);
        console.log(response_rp.data);
        NFT.nft_db_save(response_rp.data, wallet);
        //DB에 저장
        // const collectionSet = await NFT.createTx(response_rp.data);
      }
    }
  } catch (err) {
    console.log('Error >>', err);
  }
};

const getAllNFTTransfers = async (wallet, chain_id) => {
  let finalSet = new Set();

  let page = 0;
  const page_size = 500;

  //0페이지
  var { collectionSet, total, cursor } = await getAndSaveTransfer(wallet, chain_id, '', page_size);
  finalSet = collectionSet;
  console.log(finalSet);
  console.log(cursor);

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

const ifCollectionExists = async (addressSet) => {
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
    NFT.save_nft_fp(Response.data.collection);
  } catch (err) {
    console.log(Error);
  }
};
const save_nft_slug = async (wallet, chain_id) => {
  var chain_type;

  if (chain_id == 1) {
    chain_type = 'eth';
  }

  axios
    .get(`https://api.opensea.io/api/v1/collections?asset_owner=${wallet}`)
    .then((Response) => {
      // console.log(Response.data);
      NFT.nft_slug_save(Response.data);
    })
    .catch((Error) => {
      console.log(Error);
    });
};

const get_nft_collections = async (missingAddresses) => {
  for (let address of missingAddresses) {
    await get_collection_opensea(address);
  }
};

const get_collection_moralis = async (address) => {
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
  get_moralis_nft,
  get_nft_fp,
  save_nft_slug,
  ifCollectionExists,
  get_nft_collections,
  getAllNFTTransfers,
};
