const uuidv4 = require('uuid');
const pool = require('./plugins/dbHelper');
let conn;

const nft_coll_db_save= async (data,wallet) => {

  let finaltuple="";

  for(idx in data){
    if(data[idx].primary_asset_contracts[0]==undefined) //등록되어있지 않은 컨트랙트일경우 넘어가기
    {
      continue;
    }
    const nft_coll_id = '\"'+uuidv4.v1()+'\"';
    const token_address = '\"'+data[idx].primary_asset_contracts[0].address.replace('0x','')+'\"';
    const symbol='\"'+data[idx].primary_asset_contracts[0].symbol+'\"';
    const name= '\"'+data[idx].primary_asset_contracts[0].name+'\"';
    const contract_type= '\"'+data[idx].primary_asset_contracts[0].schema_name+'\"';
    const collection_icon='\"'+data[idx].primary_asset_contracts[0].image_url+'\"';
    const slug = '\"'+data[idx].slug+'\"';
    
    let nft_collection_string = [nft_coll_id, token_address,symbol,name,contract_type,collection_icon,slug];
 
    let res = nft_collection_string.join(',');

    if(idx==0){
      finaltuple+="("+res+")";
 
    }else{
      finaltuple+=",("+res+")";

    }
  };
  console.log(finaltuple);

  try {
    conn = await pool.getConnection();

    const sql = 'INSERT IGNORE INTO tb_nft_collection_eth (nft_coll_id, token_address, symbol, name, contract_type,collection_icon,slug) VALUES '+ finaltuple;

    const dbRes = await conn.query(sql);


    console.log(dbRes);//성공 리턴
    return dbRes;
    
  }catch(err) {
    console.log(err);
    return false;
  }
  finally {
      if (conn) conn.release(); //release to pool
  }
}

const nft_db_save= async (data,wallet) => {

  let finaltuple="";

  for(idx in data.result){

    const nft_item_id = '\"'+uuidv4.v1()+'\"';
    const token_id='\"'+data.result[idx].token_id+'\"';
    const owner_of= '\"'+wallet.replace('0x','')+'\"';;
    const metadata= '""';
    const block_number='\"'+data.result[idx].block_number+'\"';
    const token_address='\"'+data.result[idx].token_address.replace('0x','')+'\"';
    const frozen= '\"'+data.result[idx].frozen+'\"';
    let nft_string = [nft_item_id,token_address, token_id,owner_of,metadata,frozen,block_number];
    let res = nft_string.join(',');
 
    if(idx==0){
      finaltuple+="("+res+")";
    
    }else{
      finaltuple+=",("+res+")";
    }
  };
  console.log(finaltuple);

  try {
    conn = await pool.getConnection();

    const sql = 'INSERT IGNORE INTO tb_nft_eth (nft_item_id,token_address, token_id,owner_of,metadata,frozen,block_number) VALUES '+ finaltuple;


    const dbRes = await conn.query(sql);

    console.log(dbRes);//성공 리턴
    return dbRes;
    
  }catch(err) {
    console.log(err);
    return false;
  }
  finally {
      if (conn) conn.release(); //release to pool
  }
}

const createTx= async(data) => {

  var finaltuple; 
  var collectionSet; 
  finaltuple, collectionSet = createTx_tuple(data);
  try {
    conn = await pool.getConnection();

    const sql = 'INSERT INTO tb_nft_transfer_eth (nft_trans_id, block_number, block_timestamp, block_hash, transaction_hash, transaction_index, log_index, value, transaction_type, token_address, token_id, from_address, to_address, amount, verified) VALUES '+ finaltuple;

    console.log(sql);
    const dbRes = await conn.query(sql);
    
    console.log(dbRes);//성공 리턴
    return true;
    
  }catch(err) {
    console.log(err);
    return collectionSet;
  }
  finally {
      if (conn) conn.release(); //release to pool
  }
  

}

const createTx_tuple= (data) =>{
  var finalTuple="";
  var collectionSet = new Set();

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


    let sqlData = [nft_trans_id, block_number, block_timestamp, block_hash, transaction_hash, transaction_index, log_index,
    value, transaction_type, token_address, token_id, from_address, to_address, amount, verified];
    let res = sqlData.join(',');

    if(idx==0){
      finalTuple+="("+res+")";
    }else{
      finalTuple+=",("+res+")";
    }

    collectionSet.add(data.result[idx].token_address.replace('0x',''));

    
  };

  console.log(finalTuple);

  return {finalTuple, collectionSet};
}



const save_nft_fp= async(data) =>{
    var finalTuple="";
  
    const nft_fp_id = '\"'+uuidv4.v1()+'\"';
    const token_address= '\"'+data.primary_asset_contracts[0].address.replace('0x','')+'\"';
    const fp='\"'+data.stats.floor_price+'\"';

    const collection_icon='\"'+data.image_url+'\"';
    var fp_table_str = [nft_fp_id, token_address, fp];
    var res = fp_table_str.join(',');
    finalTuple+="("+res+")"; // tb_nfr_fp 테이블 저장

    
   console.log(finalTuple);
  try {
    conn = await pool.getConnection();

    const sql = 'INSERT IGNORE INTO tb_nft_fp_eth (nft_fp_id, token_address, fp) VALUES '+ finalTuple;

    const query ="UPDATE innodb.tb_nft_collection_eth  SET collection_icon ="+collection_icon +"WHERE token_address="+token_address;

    const dbRes = await conn.query(sql);
    rows = await conn.query(query, token_address);
    if(rows[0] == undefined){
        return false;
    }else{
        console.log(rows[0]);
        return rows[0];//TODO 양식맞추기
    }
    

    
  }catch(err) {
    console.log(err);
    return false;
  }
  finally {
      if (conn) conn.release(); //release to pool
  }
}

const nft_slug_save= async(data) =>{
  var finalTuple="";

  
  for(idx in data){
  const nft_slug= '\"'+data[idx].slug+'\"';
  const token_address='\"'+data[idx].primary_asset_contracts[0].address.replace('0x','')+'\"';
  
  var nft_slug_str = [nft_slug, token_address];
  var res = nft_slug_str.join(',');
 

  if(idx==0){
    finalTuple+="("+res+")";
  }else{
    finalTuple+=",("+res+")";
  }
}


  
 console.log(finalTuple);
try {
  conn = await pool.getConnection();


  const query ="UPDATE innodb.tb_nft_collection_eth  SET collection_icon ="+collection_icon +"WHERE token_address="+token_address;

  const dbRes = await conn.query(sql);
  rows = await conn.query(query, token_address);
  if(rows[0] == undefined){
      return false;
  }else{
      console.log(rows[0]);
      return rows[0];//TODO 양식맞추기
  }

  console.log(dbRes);//성공 리턴
  return dbRes;
  
}catch(err) {
  console.log(err);
  return false;
}
finally {
    if (conn) conn.release(); //release to pool
}
}

const checkAddress = async(addressSet) =>{
  var missingAddress = [];
  try {
    conn = await pool.getConnection();

    for (let address of addressSet) {
      console.log('TEST 1', address);

      const sql = "SELECT token_address FROM tb_nft_collection_eth WHERE token_address= '"+address+"'";
      row = await conn.query(sql);

      console.log(row);

      //없으면 어레이에추가
      if(row[0] == undefined){
        missingAddress.push(address)
      }
    }

  }catch(err) {
    console.log(err);
    return false;
  }
  finally {
      if (conn) conn.release(); //release to pool

      return missingAddress;
  }
}

module.exports = {
  nft_coll_db_save,
  nft_db_save,
  createTx,
  save_nft_fp,
  nft_slug_save,
  checkAddress,

};
  