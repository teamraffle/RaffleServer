const uuidv4 = require('uuid');
const { query } = require('../config/logger');
const logger = require('../config/logger');
const pool = require('./plugins/dbHelper');
let conn;

const save_moralis_nft= async (res) => {
    //TODO
    //모랄리스에서 가져온 데이터를 
    //우리 db의 NFT 테이블과 NFT Collection 테이블에 넣는다
}

const save_moralis_transfer= async (res) => {
  //TODO
  //모랄리스에서 가져온 데이터를 
  //우리 db의 NFT activity 테이블에 넣는다
}

const save_opensea_fp= async (res) => {
  //TODO
  //모랄리스에서 가져온 데이터를 
  //우리 db의 NFT FP 테이블에 넣는다
} 

module.exports = {
    create,
    searchByWallet,
    searchById,
    updatepatchUserById,
    isNicknameTaken,
};
  