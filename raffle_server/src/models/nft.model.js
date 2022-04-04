const uuidv4 = require('uuid');
const pool = require('./plugins/dbHelper');
let conn;

const nft_coll_db_save= async (data,wallet) => {
  var collectionSet = new Set();
  let finaltuple="";

  for(idx in data){
    if(data[idx].primary_asset_contracts[0]==undefined) //등록되어있지 않은 컨트랙트일경우 넘어가기
    {
      continue;
    }
    
    const nft_coll_id = '\"'+uuidv4.v1()+'\"';
    const token_address = '\"'+data[idx].primary_asset_contracts[0].address.replace('0x','')+'\"';
    const return_token_address = data[idx].primary_asset_contracts[0].address.replace('0x','');
    const symbol='\"'+data[idx].primary_asset_contracts[0].symbol+'\"';
    const name= '\"'+data[idx].primary_asset_contracts[0].name+'\"';
    const contract_type= '\"'+data[idx].primary_asset_contracts[0].schema_name+'\"';
    const collection_icon='\"'+data[idx].primary_asset_contracts[0].image_url+'\"';
    const slug = '\"'+data[idx].slug+'\"';
    
    let nft_collection_string = [nft_coll_id, token_address,symbol,name,contract_type,collection_icon,slug];
 
    let res = nft_collection_string.join(',');

    finaltuple+=",("+res+")";
    collectionSet.add(return_token_address);
  };
  if(finaltuple=="") //아예 빈값일 수 있음 그럴때 return하기
  return 0;
  
  try {
    conn = await pool.getConnection();

    const sql = 'INSERT IGNORE INTO tb_nft_collection_eth (nft_coll_id, token_address, symbol, name, contract_type,collection_icon,slug) VALUES '+ finaltuple.slice(1);
    // 첫번째 값의 토큰 어드레스 값을 읽을 수 없을때, continue 되기 때문에 idx=0일떄 (+res+) 구조 형성이 안먹혀서 임시방편으로 사용

    const dbRes = await conn.query(sql);


    // console.log(dbRes);//성공 리턴
    return dbRes;
    
  }catch(err) {
    console.log(err);
    return false;
  }
  finally {
      if (conn) conn.release(); //release to pool

      return collectionSet;
  }
}

const nft_coll_one_db_save= async (collection_) => {

  try {
    conn = await pool.getConnection();

    const sql = 'INSERT IGNORE INTO tb_nft_collection_eth (nft_coll_id, token_address, symbol, name, contract_type) VALUES (?,?,?,?,?);';
    var values = [uuidv4.v1(), collection_.token_address, collection_.symbol, collection_.name, collection_.contract_type ];
    const dbRes = await conn.query(sql, values);

    // console.log(dbRes);//성공 리턴
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
  console.log("here:"+data.result.length)
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
    console.log(idx+":"+token_id);
    
    if(idx==0){
      finaltuple+="("+res+")";
    
    }else{
      finaltuple+=",("+res+")";
    }
  };

  try {
    conn = await pool.getConnection();

    const sql = 'INSERT IGNORE INTO tb_nft_eth (nft_item_id,token_address, token_id,owner_of,metadata,frozen,block_number) VALUES '+ finaltuple;


    const dbRes = await conn.query(sql);

    // console.log(dbRes);//성공 리턴
    return dbRes;
    
  }catch(err) {
    console.log(err);
    return false;
  }
  finally {
      if (conn) conn.release(); //release to pool
  }
}

const createTx= async(data,wallet) => {
  let {finalTuple, collectionSet} = createTx_tuple(data,wallet);
  // console.log("wallet"+wallet)
  try {
    conn = await pool.getConnection();

    const sql = 'INSERT INTO tb_nft_transfer_eth (nft_trans_id, block_number, block_timestamp, block_hash, transaction_hash, transaction_index, log_index, value, transaction_type, token_address, token_id, from_address, to_address, amount, verified, action) VALUES '+ finalTuple;

    const dbRes = await conn.query(sql);
    
    // console.log(dbRes);//성공 
    
  }catch(err) {
    console.log(err);
  }
  finally {
    if (conn) conn.release(); //release to pool
    return collectionSet;
  }
  

}
const classify_action= (value,from_address,to_address,wallet) => {
  let action; //(0~5가지수) 0 buy 1mint 2sell 3burn 4send 5receive

  let wallet2 = wallet.toLowerCase(); //찍어보니 모랄리스는 다 소문자화 되어있어서 변환해야함.
  //여기다가 조건문 6개 하면 되지않을지
  if(wallet2==to_address && value!="0" ){ //buy
    action=0;
    return action;
  }
  if(from_address=="0x0000000000000000000000000000000000000000" ){ //mint
    action=1;
    return action;
  }
  if(wallet2==from_address && value!="0" ){ //sold
    action=2;
    return action;
  }
  if(to_address=="0x0000000000000000000000000000000000000000"){ //burn
    action=3;
    return action;
  }
  if(wallet2==from_address && value=="0" ){ //send
    action=4;
    return action;
  }
  if(wallet2==to_address && value=="0"  ){ //receive
    action=5;
    return action;
  }

}
const createTx_tuple= (data,wallet) =>{
  var _finalTuple="";
  var _collectionSet = new Set();

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


    const action ='\"'+  classify_action(data.result[idx].value,data.result[idx].from_address,data.result[idx].to_address,wallet)+'\"';
    //여기서는 " "넣어서 보내면 불편하니 그냥 보내기 그리고 0x변환도 안해야 비교하니 빠르니 그냥 보내기

    let sqlData = [nft_trans_id, block_number, block_timestamp, block_hash, transaction_hash, transaction_index, log_index,
    value, transaction_type, token_address, token_id, from_address, to_address, amount, verified,action];
    let res = sqlData.join(',');

    if(idx==0){
      _finalTuple+="("+res+")";
    }else{
      _finalTuple+=",("+res+")";
    }

    _collectionSet.add(data.result[idx].token_address.replace('0x',''));

    
  };

  
  // console.log(_collectionSet);
  // console.log(_finalTuple);

  return {finalTuple : _finalTuple, collectionSet : _collectionSet};
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


  try {
    conn = await pool.getConnection();

    const sql = 'INSERT IGNORE INTO tb_nft_fp_eth (nft_fp_id, token_address, fp) VALUES '+ finalTuple;

    const query ="UPDATE innodb.tb_nft_collection_eth  SET collection_icon ="+collection_icon +"WHERE token_address="+token_address;

    const dbRes = await conn.query(sql);
    rows = await conn.query(query, token_address);
    if(rows[0] == undefined){
        return false;
    }else{
        // console.log(rows[0]);
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



const checkAddress = async(addressSet) =>{
  var missingAddress = [];
  try {
    conn = await pool.getConnection();
    for (let address of addressSet) {
      // console.log('TEST 1', address);

      const sql = "SELECT token_address FROM tb_nft_collection_eth WHERE token_address= '"+address+"'";
      row = await conn.query(sql);

      // console.log(row);

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
  checkAddress,
  nft_coll_one_db_save,
};
  