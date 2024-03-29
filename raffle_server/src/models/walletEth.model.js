const uuidv4 = require('uuid');
const pool = require('./plugins/dbHelper');
let conn;

const create= async (body) => {
    var wallet ={
        address : body.address,
        chainId : body.chain_id
      }
  
      try {
        conn = await pool.getConnection();
    
        const sql = `INSERT INTO tb_wallet_eth
        (
            wallet_id, chain_id, address
        ) VALUES (
            ?, ?, ?
        )`
        var splittedAddr = wallet.address;
        const wallet_id = uuidv4.v1();
        const dbRes = await conn.query(sql, [wallet_id, 1,  splittedAddr]);
        
        // console.log(dbRes);//성공 리턴
        return wallet_id;
        
      }catch(err) {
        console.log(err);
        return false;
      }
       finally {
          if (conn) conn.release(); //release to pool
      }
}

const findIdByAddress= async (body) => {
    var wallet ={
        address : body.address,
        chainId : body.chain_id
      }
      try {
        conn = await pool.getConnection();
    
        const sql = `SELECT wallet_id FROM tb_wallet_eth
        WHERE address = ?`
        var splittedAddr = wallet.address;
        const dbRes = await conn.query(sql, splittedAddr);
        
        // console.log(dbRes[0].wallet_id);//성공 리턴
        
        return dbRes[0].wallet_id;
        
      }catch(err) {
        console.log(err);
        return false;
      }
       finally {
          if (conn) conn.release(); //release to pool
      }
}

const deleteByAddr= async (address) => {
    try {
      conn = await pool.getConnection();
      const sql ="DELETE FROM tb_wallet_eth WHERE address =?"

      var splittedAddr = address;
      const dbRes = await conn.query(sql, splittedAddr);
      
      // console.log(dbRes);//성공 리턴
      
      return true;
      
    }catch(err) {
      console.log(err);
      return false;
    }
     finally {
        if (conn) conn.release(); //release to pool
    }
}

module.exports = {
    create,
    findIdByAddress,
    deleteByAddr,
};
  