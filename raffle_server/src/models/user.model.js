const uuidv4 = require('uuid');
const logger = require('../config/logger');
const pool = require('./plugins/dbHelper');
let conn;

const create= async (body, wallet_id) => {
    var user = {
        nickname : body.nickname,
        profilePic : body.profilePic,
        email: body.email
      } 

    try {
        conn = await pool.getConnection();
        const sql = `INSERT INTO tb_user
        (
            user_id, wallet_id, nickname, profile_pic
        ) VALUES (
            ?, ?, ?, ?
        )`
        
        const user_id = uuidv4.v1();
        const dbRes = await conn.query(sql, [user_id, wallet_id, user.nickname, user.profilePic]);
        logger.info(dbRes);//성공 리턴
        return user_id;
    
      }catch(err) {
        logger.error(err);
        return false;
      }
       finally {
          if (conn) conn.release(); //release to pool
      }
}

const searchByWallet= async (query) => {
    var wallet ={
        address : query.address,
        chainId : query.chainId
      }
      
    var rows;
    try {
      conn = await pool.getConnection();
  
      //TODO 체인아이디 따라 디비테이블 분기 넣을것 
      if(wallet.chainId==1){
        const splittedAddr = wallet.address.replace('0x','');
        const query ="SELECT tb_wallet_eth.chain_id, tb_wallet_eth.address, tb_user.user_id, tb_user.nickname, tb_user.profile_pic, tb_user.status  FROM tb_wallet_eth INNER JOIN tb_user ON tb_wallet_eth.wallet_id = tb_user.wallet_id WHERE tb_wallet_eth.address=?"
        rows = await conn.query(query, splittedAddr);
        if(rows == undefined){
            return false;
        }else{
            logger.info(rows[0]);
            return rows[0];//TODO 양식맞추기
        }
      }
    } finally {
        if (conn) conn.release();
    }    
}
const searchById= async (params) => {
  var userId = params.userId;
  console.log(userId);
  var rows;
  try {
    conn = await pool.getConnection();

    //TODO 체인아이디 따라 디비테이블 분기 넣을것 

      const query ="SELECT tb_wallet_eth.chain_id, tb_wallet_eth.address, tb_user.user_id, tb_user.nickname, tb_user.profile_pic, tb_user.status  FROM tb_wallet_eth INNER JOIN tb_user ON tb_wallet_eth.wallet_id = tb_user.wallet_id WHERE tb_user.user_id=?"
      rows = await conn.query(query, userId);
      if(rows == undefined){
          return false;
      }else{
          logger.info(rows[0]);
          return rows[0];//TODO 양식맞추기
      }
    
  } finally {
      if (conn) conn.release();
  }    
}

module.exports = {
    create,
    searchByWallet,
    searchById
};
  