const uuidv4 = require('uuid');
const { query } = require('../config/logger');
const logger = require('../config/logger');
const pool = require('./plugins/dbHelper');
let conn;

const get_user= async (query) => {
    //TODO
    //우리 디비에서 유저정보가져와주기
    var wallet ={
      address : query.user_id_or_address,
      chain_id : query.chain_id
    }
    var rows;
    const splittedAddr = wallet.address.replace('0x','');
    try {
      conn = await pool.getConnection();
  
      //TODO 체인아이디 따라 디비테이블 분기 넣을것 
      if(wallet.chain_id==1){
      
        const query ="SELECT tb_user.nickname,tb_user.profile_pic FROM tb_wallet_eth INNER JOIN tb_user ON tb_wallet_eth.wallet_id = tb_user.wallet_id WHERE tb_wallet_eth.address=?"
        rows = await conn.query(query, splittedAddr);
        rows[0].address=wallet.address;
        console.log(rows[0]);
        if(rows[0] == undefined){
            return false;
        }else{
            console.log(rows[0]);
            return rows[0];//TODO 양식맞추기
        }
      }
    } finally {
        if (conn) conn.release();
    }    
}


module.exports = {
  get_user
};
  