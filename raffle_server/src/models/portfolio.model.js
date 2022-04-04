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
    var rows2;
    const splittedAddr = wallet.address.replace('0x','');
    try {
      conn = await pool.getConnection();
  
      //TODO 체인아이디 따라 디비테이블 분기 넣을것 
      if(wallet.chain_id==1){
        //첫번째 쿼리, 두개 조인해서 닉네임 가져오기
        //두번째 쿼리, 일단 해당 사용자 값 nft 갯수 가져오기
        
      
        const query ="SELECT tb_user.nickname,tb_user.profile_pic FROM tb_wallet_eth INNER JOIN tb_user ON tb_wallet_eth.wallet_id = tb_user.wallet_id  WHERE tb_wallet_eth.address=?"
        const query2 ="SELECT   COUNT( * ) FROM tb_nft_eth WHERE tb_nft_eth.owner_of=?"
        rows = await conn.query(query, splittedAddr);
        rows2 = await conn.query(query2, splittedAddr);
      
        if(rows[0] == undefined){
            return false;
        }else{

        rows[0].address=wallet.address;
        console.log(rows[0]);
        rows[0].nft_count =rows2[0]['COUNT( * )']; 
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
  