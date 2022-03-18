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

const createTx= async (data) => {

  var finaltuple = createTx_tuple(data);
  try {
    conn = await pool.getConnection();

    const sql = 'INSERT INTO tb_nft_transfer_eth (nft_trans_id, block_number, block_timestamp, block_hash, transaction_hash, transaction_index, log_index, value, transaction_type, token_address, token_id, from_address, to_address, amount, verified) VALUES '+ finaltuple;

    console.log(sql);
    const dbRes = await conn.query(sql);
    
    console.log(dbRes);//성공 리턴
    return true;
    
  }catch(err) {
    console.log(err);
    return false;
  }
  finally {
      if (conn) conn.release(); //release to pool
  }
  

}

const createTx_tuple= (data) =>{
  var finaltuple="";

  for(idx in data.result){
    const nft_trans_id = '\"'+uuidv4.v1()+'\"';
    const block_number= '\"'+data.result[idx].block_number+'\"';
    const block_timestamp= '\"'+data.result[idx].block_timestamp.replace('T',' ').replace('Z','') +'\"';
    const block_hash='\"'+data.result[idx].block_hash.replace('0x','')+'\"';
    const transaction_hash='\"'+data.result[idx].block_hash.replace('0x','')+'\"';
    const transaction_index='\"'+data.result[idx].transaction_index+'\"';
    const log_index='\"'+data.result[idx].log_index+'\"';
    const value='\"'+data.result[idx].value+'\"';
    const transaction_type='\"'+data.result[idx].transaction_type+'\"';
    const token_address='\"'+data.result[idx].token_address.replace('0x','')+'\"';
    const token_id='\"'+data.result[idx].token_id+'\"';
    const from_address = '\"'+data.result[idx].from_address.replace('0x','')+'\"';
    const to_address='\"'+data.result[idx].to_address.replace('0x','')+'\"';
    const amount='\"'+data.result[idx].amount+'\"';
    const verified='\"'+data.result[idx].verified+'\"';


    var sqlData = [nft_trans_id, block_number, block_timestamp, block_hash, transaction_hash, transaction_index, log_index,
    value, transaction_type, token_address, token_id, from_address, to_address, amount, verified];
    var res = sqlData.join(',');

    if(idx==0){
      finaltuple+="("+res+")";
    }else{
      finaltuple+=",("+res+")";
    }
  };

  console.log(finaltuple);

  return finaltuple;
}

module.exports = {
    nft,
    createTx,
};
  