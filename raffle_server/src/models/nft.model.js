const uuidv4 = require('uuid');
const pool = require('./plugins/dbHelper');
let conn;

const nft= async (data) => {

  var finaltuple;
  for(idx in data.result){
  
    

    const nft_coll_id = '\"'+uuidv4.v1()+'\"';
    const token_address = '\"'+data.result[idx].token_address+'\"';
    const symbol='\"'+data.result[idx].symbol+'\"';
    const name= '\"'+data.result[idx].name+'\"';
    const contract_type= '\"'+data.result[idx].contract_type+'\"';
    const collection_icon='\"'+data.result[idx].token_uri+'\"';
    const splittedAddr = token_address.replace('0x','');
    var langs = [nft_coll_id, splittedAddr,symbol,name,contract_type,collection_icon];
    var res = langs.join(',');

    finaltuple+=",("+res+")";
};
console.log(finaltuple.slice(10) );
try {
  conn = await pool.getConnection();

  const sql = 'INSERT INTO tb_nft_collection_eth (nft_coll_id, token_address, symbol, name, contract_type,collection_icon) VALUES '+ finaltuple.slice(10);

  console.log(sql);
  const dbRes = await conn.query(sql);
  
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
    nft,
    
};
  