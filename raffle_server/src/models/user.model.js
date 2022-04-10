const uuidv4 = require('uuid');
const { query } = require('../config/logger');
const logger = require('../config/logger');
const pool = require('./plugins/dbHelper');
let conn;

const create= async (body, wallet_id) => {
    var user = {
        nickname : body.nickname,
        profile_pic : body.profile_pic,
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
        const dbRes = await conn.query(sql, [user_id, wallet_id, user.nickname, user.profile_pic]);
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

    var rows;
    var rows2;
    try {
      conn = await pool.getConnection();
      
      //TODO 체인아이디 따라 디비테이블 분기 넣을것 
      if(query.chain_id==1){
        const splittedAddr = query.address.replace('0x','');
      
        const sqlquery ="SELECT tb_user.user_id,tb_user.nickname,tb_user.profile_pic, tb_user.status,tb_user.email  FROM tb_wallet_eth INNER JOIN tb_user ON tb_wallet_eth.wallet_id = tb_user.wallet_id WHERE tb_wallet_eth.address=?"

        const sqlquery2 ="SELECT tb_wallet_eth.wallet_id,tb_wallet_eth.address, tb_wallet_eth.chain_id  FROM tb_wallet_eth INNER JOIN tb_user ON tb_wallet_eth.wallet_id = tb_user.wallet_id WHERE tb_wallet_eth.address=?"
        rows = await conn.query(sqlquery, splittedAddr);
        rows2 = await conn.query(sqlquery2, splittedAddr);
        if(rows[0] == undefined){
            return false;
        }else{
            rows[0].wallet=rows2[0];
            return rows[0];//TODO 양식맞추기
        }
      }
    } finally {
        if (conn) conn.release();
    }    
}
const searchById= async (params) => {
  var user_id = params.user_id;
  var rows;
  var rows2;


  try {
    conn = await pool.getConnection();

      const query ="SELECT tb_user.user_id,tb_user.nickname,tb_user.profile_pic, tb_user.status,tb_user.email FROM tb_wallet_eth INNER JOIN tb_user ON tb_wallet_eth.wallet_id = tb_user.wallet_id WHERE tb_user.user_id=?"

      const query2 ="SELECT tb_wallet_eth.wallet_id,tb_wallet_eth.address, tb_wallet_eth.chain_id FROM tb_wallet_eth INNER JOIN tb_user ON tb_wallet_eth.wallet_id = tb_user.wallet_id WHERE tb_user.user_id=?"

      rows = await conn.query(query, user_id);
      rows2 = await conn.query(query2, user_id);
      if(rows[0] == undefined){
          return false;
      }else{
          rows[0].wallet=rows2[0]
          logger.info(rows[0]);
          return rows[0];//TODO 양식맞추기
      }
    
  } finally {
      if (conn) conn.release();
  }    
}

const updatepatchUserById= async (params,body) => {
  var user_id = params.user_id;
  var nickname = body.nickname;
  var profile_pic = body.profile_pic;

  var rows;

  var query = "";
  if(typeof profile_pic =="undefined"){
    query ="UPDATE tb_user SET nickname='"+nickname+"'WHERE tb_user.user_id='"+ user_id+ "'";
    ;}
  else if(typeof nickname =="undefined")
  { 
  query ="UPDATE tb_user SET profile_pic='"+profile_pic+"'WHERE tb_user.user_id='"+ user_id+ "'";
  }
  else{
   
    query ="UPDATE tb_user SET nickname='"+nickname +"',profile_pic='"+profile_pic+"'WHERE tb_user.user_id='"+ user_id+ "'";
  }

  try {
  
    conn = await pool.getConnection();

    //TODO 체인아이디 따라 디비테이블 분기 넣을것 
      rows = await conn.query(query);

      if(rows == undefined){
          return false;
      }else{
          logger.info(rows[0]);
          return true;//TODO 양식맞추기
      }
    
  } finally {
      if (conn) conn.release();
  }    
}
const isNicknameTaken= async (body) => {
    var user = {
        nickname : body.nickname,
      } 
    
      var rows;
    if(user.nickname){
    try {
      conn = await pool.getConnection();
  
        const query ="SELECT nickname FROM tb_user WHERE nickname =?"
        rows = await conn.query(query, user.nickname);
        if(rows[0] == undefined){
            return false;
        }else{
        
            return true;
            ;
        }
    } finally {
        if (conn) conn.release();
    } }
    else{
      return false;
    }

}


module.exports = {
    create,
    searchByWallet,
    searchById,
    updatepatchUserById,
    isNicknameTaken,
};
  