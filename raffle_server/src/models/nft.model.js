const uuidv4 = require('uuid');
const pool = require('./plugins/dbHelper');
let conn;

const nftcreate= async (data,wallet) => {

  var finaltuple;
  var finaltuple2;
  for(idx in data.result){
    const nft_coll_id = '\"'+uuidv4.v1()+'\"';
    const token_address = '\"'+data.result[idx].token_address+'\"';
    const symbol='\"'+data.result[idx].symbol+'\"';
    const name= '\"'+data.result[idx].name+'\"';
    const contract_type= '\"'+data.result[idx].contract_type+'\"';
    // const collection_icon='\"'+data.result[idx].token_uri+'\"';
    const splittedAddr = token_address.replace('0x','');
    var langs = [nft_coll_id, splittedAddr,symbol,name,contract_type];
    var res = langs.join(',');
    finaltuple+=",("+res+")";

    const nft_item_id = '\"'+uuidv4.v1()+'\"';
    const token_id='\"'+data.result[idx].token_id+'\"';
    const owner_of='\"'+wallet+'\"';
    const meatadata= '\"'+data.result[idx].meatadata+'\"';
    const frozen = '\"'+data.result[idx].frozen+'\"';
    const block_number = '\"'+data.result[idx].block_number+'\"';
    const splittedAddr2 = owner_of.replace('0x','');
    var langs2 = [nft_item_id,nft_coll_id,token_id,splittedAddr2,meatadata,frozen,block_number];
    var res2 = langs2.join(',');

    finaltuple2+=",("+res2+")";
};
console.log(finaltuple.slice(10));

console.log(finaltuple2.slice(10));
try {
  conn = await pool.getConnection();

  const sql = 'INSERT INTO tb_nft_collection_eth (nft_coll_id, token_address, symbol, name, contract_type) VALUES '+ finaltuple.slice(10);

  const sql2 = 'INSERT INTO tb_nft_eth (nft_item_id ,nft_coll_id, token_id, owner_of, metadata, frozen,block_number) VALUES '+ finaltuple2.slice(10);
  console.log(sql);
  console.log(sql2);
  const dbRes = await conn.query(sql);
  const dbRes2 = await conn.query(sql2);


  console.log(dbRes);//성공 리턴
  return dbRes,dbRes2;
  
}catch(err) {
  console.log(err);
  return false;
}
 finally {
    if (conn) conn.release(); //release to pool
}

}


module.exports = {
    
    nftcreate

    
};
  