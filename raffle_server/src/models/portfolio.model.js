const uuidv4 = require('uuid');
const { query } = require('../config/logger');
const logger = require('../config/logger');
const pool = require('./plugins/dbHelper');
let conn;

const get_user= async (wallet,chain_id) => {


    //TODO
    //우리 디비에서 유저정보가져와주기
    var wallet ={
      address : wallet,
      chain_id : chain_id
    }
    var rows;
    var rows2;
    var rows3;
    var rows4;
    const splittedAddr = wallet.address.replace('0x','');
    try {
      conn = await pool.getConnection();
  
      //TODO 체인아이디 따라 디비테이블 분기 넣을것 
      if(wallet.chain_id==1){
        //첫번째 쿼리, 두개 조인해서 닉네임 가져오기
        //두번째 쿼리, 일단 해당 사용자 값 nft 갯수 가져오기
        
      
        const query ="SELECT tb_user.nickname,tb_user.profile_pic FROM tb_wallet_eth INNER JOIN tb_user ON tb_wallet_eth.wallet_id = tb_user.wallet_id  WHERE tb_wallet_eth.address=?"
        const query2 ="SELECT COUNT( * ) FROM tb_nft_eth WHERE tb_nft_eth.owner_of=?"
        const query3 ="SELECT COUNT(DISTINCT token_address) FROM tb_nft_eth WHERE tb_nft_eth.owner_of=?";
        const query4 ="SELECT name,collection_icon FROM tb_nft_collection_eth WHERE token_address=(SELECT token_address AS counted FROM tb_nft_eth WHERE tb_nft_eth.owner_of="+'"'+splittedAddr+'"'+"GROUP BY token_address ORDER BY counted DESC LIMIT 1)";
        console.log(query4)
        rows = await conn.query(query, splittedAddr);
        rows2 = await conn.query(query2, splittedAddr);
        rows3 = await conn.query(query3,splittedAddr); 
        rows4 = await conn.query(query4); 
 
         
        console.log(rows4[0])
        if(rows[0] == undefined ||rows2[0] == undefined ||rows3[0] == undefined  ||rows4[0] == undefined){
            return false;
        }else{

        // json 반환용 -> 나중에
        // rows[0].address=wallet.address;
        // rows[0].nft_count=rows2[0]['COUNT( * )']; 
        // rows[0].collection_count=rows3[0]['COUNT(DISTINCT token_address)']; 
        // rows[0].most_collection=rows4[0].name;
        // rows[0].most_collection_icon=rows4[0].collection_icon;
        console.log("hii",rows2[0]);
        const wallet_address=wallet.address.replace('0x','');
        const nft_holdings=rows2[0]['COUNT( * )']; 
        const collections_holdings=rows3[0]['COUNT(DISTINCT token_address)']; 
        const most_collection_name=rows4[0].name;
        const most_collection_icon=rows4[0].collection_icon;
       
        const update_portfolio = `UPDATE tb_portfolio_eth SET nft_holdings=?,collections_holdings=?,most_collection_name=?,most_collection_icon=? where wallet_address=?`;
   
        const dbRes = await conn.query(update_portfolio, [nft_holdings,collections_holdings,most_collection_name,most_collection_icon,wallet_address]);
            
        
        return dbRes;//TODO 양식맞추기
        
      }
    }
    } finally {
        if (conn) conn.release();
    }    
}

const get_portfolio= async (query) => {
  //TODO
  //우리 디비에서 유저정보가져와주기
  var wallet ={
    address : query.user_id_or_address
  }
  var total = {};
  
  var rows;
  const splittedAddr = wallet.address.replace('0x','');
  try {
    conn = await pool.getConnection();

    //TODO 체인아이디 따라 디비테이블 분기 넣을것 
        
    
      const portfolio_query ="SELECT * FROM tb_portfolio_eth WHERE wallet_address=?"
      const user_query ="SELECT tb_user.nickname,tb_user.user_id,tb_user.profile_pic FROM tb_wallet_eth INNER JOIN tb_user ON tb_wallet_eth.wallet_id = tb_user.wallet_id  WHERE tb_wallet_eth.address=?"

      rows = await conn.query(portfolio_query, splittedAddr);
      rows2 = await conn.query(user_query, splittedAddr);
  

      if(rows[0] == undefined ){
          return false;
      }else{
        total.updated_at=rows[0].create_timestamp;
        total.user=rows2[0];
        total.portfolio=rows[0];
        
        delete total.portfolio.create_timestamp;
      return total;//TODO 양식맞추기
      
    }
  
  } finally {
      if (conn) conn.release();
  }    
}

module.exports = {
  get_user,
  get_portfolio
};
  