const uuidv4 = require('uuid');
const pool = require('./plugins/dbHelper');
let conn;

const createTx= async (data) => {
    
      try {
        conn = await pool.getConnection();
    
        const sql = `INSERT INTO tb_wallet_eth
        (
            wallet_id, chain_id, address
        ) VALUES (
            ?, ?, ?
        )`
        var splittedAddr = wallet.address.replace('0x','');
        const wallet_id = uuidv4.v1();
        const dbRes = await conn.query(sql, [wallet_id, 1,  splittedAddr]);
        
        console.log(dbRes);//성공 리턴
        return wallet_id;
        
      }catch(err) {
        console.log(err);
        return false;
      }
       finally {
          if (conn) conn.release(); //release to pool
      }
}

module.exports = {
    createTx,
    
};
  