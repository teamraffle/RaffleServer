const uuidv4 = require('uuid');
const pool = require('./plugins/dbHelper');
let conn;

const nft_coll_db_save= async (data,wallet) => {
  
  var collectionSet = new Set();
  var slugSet ={};
  var check = [];
  let finaltuple="";


  for(idx in data){
    if(data[idx].primary_asset_contracts[0]==undefined) //등록되어있지 않은 컨트랙트일경우 넘어가기
    {
      continue;
    }
    
    const nft_coll_id = '\"'+uuidv4.v1()+'\"';
    
    const token_address = '\"'+data[idx].primary_asset_contracts[0].address+'\"';
    const return_token_address = data[idx].primary_asset_contracts[0].address;
    const symbol='\"'+data[idx].primary_asset_contracts[0].symbol+'\"';
    const name= '\"'+data[idx].primary_asset_contracts[0].name+'\"';
    const contract_type= '\"'+data[idx].primary_asset_contracts[0].schema_name+'\"';
    const collection_icon='\"'+data[idx].primary_asset_contracts[0].image_url+'\"';
    const slug = '\"'+data[idx].slug+'\"';
   
    
    let nft_collection_string = [nft_coll_id, token_address,symbol,name,contract_type,collection_icon,slug];
 
    let res = nft_collection_string.join(',');

    finaltuple+=",("+res+")";
    collectionSet.add(return_token_address);
   
    slugSet[data[idx].slug]=data[idx].owned_asset_count;

  
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
  
      return {collectionSet,slugSet};
  }
}

const nft_coll_one_db_save= async (collection_) => {

  try {
    conn = await pool.getConnection();
    const sql = 'INSERT IGNORE INTO tb_nft_collection_eth (nft_coll_id, token_address, symbol, name, contract_type, collection_icon, slug) VALUES (?,?,?,?,?,?,?);';
    var values = [uuidv4.v1(), collection_.token_address, collection_.symbol, collection_.name, collection_.contract_type , collection_.collection_icon, collection_.slug];
    const dbRes = await conn.query(sql, values);

    return dbRes;

  }catch(err) {
    console.log(err);
    return false;
  }
  finally {
      if (conn) conn.release(); //release to pool
  }
}

const nft_db_save= async (data,wallet,fp_total) => {
  let finaltuple="";
  let idx2=0;
  for(idx in data){

    const nft_item_id = '\"'+uuidv4.v1()+'\"';
    const token_id='\"'+data[idx].token_id+'\"';
    const owner_of= '\"'+wallet+'\"';;
    const metadata= '""';
    const block_number='"'+""+'"';
    const token_address='\"'+data[idx].asset_contract.address+'\"';
    const frozen= '"'+""+'"';
    const  name= '"'+data[idx].name+'"';
    const coll_name= '"'+data[idx].asset_contract.name+'"';
    let nft_image='""';
   

    if (data[idx].image_url!= undefined) {
    
      nft_image = '"' + data[idx].image_url + '"';
   
    
    }else{
      nft_image = '"' + data[idx].asset_contract.image_url + '"';
    }
  
    let nft_string = [nft_item_id,token_address, token_id,owner_of,metadata,frozen,block_number, nft_image,name,coll_name];
    let res = nft_string.join(',');
    if(idx2==0){
      finaltuple+="("+res+")";
    
    }else{
      finaltuple+=",("+res+")";
    }
    idx2++;
  };

  try {
    conn = await pool.getConnection();

    const sql = 'INSERT IGNORE INTO tb_nft_eth (nft_item_id,token_address, token_id,owner_of,metadata,frozen,block_number,nft_image,name,coll_name) VALUES '+ finaltuple;


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

const createTx_and_portfolio= async(data,wallet, arr_ave_date,fp_total) => {
  let arr_ave_date_value=0;
  
  let {finalTuple, buy_sell_related_address} = await createTx_tuple(data,wallet);
  // console.log("wallet"+wallet)
  try {
   
    conn = await pool.getConnection();
    const sql_insert_transfer = 'INSERT IGNORE INTO tb_nft_transfer_eth (nft_trans_id, block_number, block_timestamp, block_hash, transaction_hash, transaction_index, log_index, value, transaction_type, token_address, token_id, from_address, to_address, amount, verified, action,image,coll_name) VALUES '+ finalTuple;

    const dbRes = await conn.query(sql_insert_transfer);
      // console.log(dbRes);//성공 
   
  
    if(fp_total !== 'undefined'){
      console.log(splittedAddr, 0, 0,arr_ave_date_value??0,'','',fp_total,0,0,0,buy_sell_related_address.buy_volume*Math.pow(0.1,18),buy_sell_related_address.sell_volume*Math.pow(0.1,18),buy_sell_related_address.related_address_count,0,0,"")
      const sql_insert_portfolio = `INSERT IGNORE INTO tb_portfolio_eth 
      (wallet_address,nft_holdings,collections_holdings,av_holding_period,most_collection_name,most_collection_icon, est_market_value,holding_volume,earnings_rate,total_gas_fee,buy_volume,sell_volume,related_addr_count,activity_count,sync,hands) 
      VALUES 
      (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      var splittedAddr = wallet;
      // console.log([splittedAddr, 0, 0,arr_ave_date,'','',fp_total,0,0,0,buy_sell.buy_volume*Math.pow(0.1,18),buy_sell.sell_volume*Math.pow(0.1,18)]);
      const dbRes2 = await conn.query(sql_insert_portfolio, [splittedAddr, 0, 0,arr_ave_date_value,'','',fp_total,0,0,0,buy_sell_related_address.buy_volume*Math.pow(0.1,18),buy_sell_related_address.sell_volume*Math.pow(0.1,18),buy_sell_related_address.related_address_count,0,0,""]);
      // console.log(dbRes2);//성공 
    }
    
    
  }catch(err) {
    console.log(err);
  }finally {
    if (conn) conn.release(); //release to pool

  }
  

}


const createTx = async(data,wallet, arr_ave_date) => {

  
  let {finalTuple, collectionSet, buy_sell_related_address} = await createTx_tuple(data,wallet);
  // console.log("wallet"+wallet)
  try {
    conn = await pool.getConnection();
    const sql="SELECT * FROM tb_portfolio_eth WHERE wallet_address="+wallet;
    const rows = await conn.query(sql);

    const sql_insert_transfer = 'INSERT IGNORE INTO tb_nft_transfer_eth (nft_trans_id, block_number, block_timestamp, block_hash, transaction_hash, transaction_index, log_index, value, transaction_type, token_address, token_id, from_address, to_address, amount, verified, action) VALUES '+ finalTuple;
    console.log(sql_insert_transfer)
    const dbRes = await conn.query(sql_insert_transfer);
    

    // const sql_insert_portfolio = `INSERT INTO tb_portfolio_eth 
    //   (wallet_address,nft_holdings,collections_holdings,av_holding_period,most_collection_name,most_collection_icon, est_market_value,holding_volume,earnings_rate,total_gas_fee,buy_volume,sell_volume,related_addr_count,activity_count,sync,hands) 
    //   VALUES 
    //   (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    //   var splittedAddr = wallet;
    //   // console.log([splittedAddr, 0, 0,arr_ave_date,'','',fp_total,0,0,0,buy_sell.buy_volume*Math.pow(0.1,18),buy_sell.sell_volume*Math.pow(0.1,18)]);
    //   const dbRes2 = await conn.query(sql_insert_portfolio, [splittedAddr, 0, 0,arr_ave_date,'','',0,0,0,0,buy_sell_related_address.buy_volume*Math.pow(0.1,18),buy_sell_related_address.sell_volume*Math.pow(0.1,18),buy_sell_related_address.related_address_count,0,0,""]);

    
  }catch(err) {
    console.log(err);
  }
  finally {
    if (conn) conn.release(); //release to pool
    return collectionSet;
  }
  

}

const classify_action= (from_address,to_address,wallet) => {
  let action; //(0~5가지수) 0 buy 1mint 2sell 3burn 4send 5receive

  let wallet2 = wallet.toLowerCase(); //찍어보니 모랄리스는 다 소문자화 되어있어서 변환해야함.

 
  if(from_address=="0x0000000000000000000000000000000000000000" ){ //mint
    action=1;
    return action;
  }

  if(to_address=="0x0000000000000000000000000000000000000000"){ //burn
    action=3;
    return action;
  }
  if(wallet2==from_address  ){ //send
    action=4;
    return action;
  }
  if(wallet2==to_address ){ //receive
    action=5;
    return action;
  }

}

const classify_action2= (seller,wallet) => {
  let action; //(0~5가지수) 0 buy 1mint 2sell 3burn 4send 5receive

  let wallet2 = wallet.toLowerCase(); //찍어보니 모랄리스는 다 소문자화 되어있어서 변환해야함.


  if(wallet2!=seller  ){ //buy
    action=0;
    return action;
  }
  
  if(wallet2==seller ){ //sold
    action=2;
    return action;
  }
  

}

const createTx_tuple= async(data,wallet) =>{
  var _finalTuple="";
  var _collectionSet = new Set();
  var _buysell = {};
  let buy_volume=0;
  let sell_volume=0;
  let related_address_count=0;
  let idx2=0; // 제일 첫번째값이 continue 될가능성 있으니 그걸위해서 추가하여서 맨앞 값 ,( 금지
  for(idx in data){

    const nft_trans_id = '\"'+uuidv4.v1()+'\"';
    const block_number= '"'+""+'"';
    const block_timestamp= '"'+data[idx].event_timestamp +'"';
    let block_hash='"'+""+'"';
    // if(data[idx].transaction.block_hash==null){
    //   continue;
    // }
    // else{
    //   block_hash='"'+data[idx].transaction.block_hash+'"';
    // }
    
    const transaction_hash='"'+""+'"'; //일단은 오류때매 비움
    // const transaction_index='"'+data[idx].transaction.transaction_index+'"';
    const transaction_index='"'+""+'"';  //일단은 오류때매 비움
    const log_index='"'+""+'"';
    let value='"'+""+'"';
    const transaction_type='"'+""+'"';
    const token_address='"'+(data[idx].asset?.asset_contract?.address?? "") +'"';
    const token_id='"'+(data[idx].asset?.token_id??0)+'"';
    const amount='"'+data[idx].quantity+'"';
    let image='"'+(data[idx].asset?.image_url??"")+'"';

    if(image=='""'){
      image='"'+(data[idx].asset?.collection?.image_url??"")+'"';
    }

  
    const coll_name='"'+(data[idx].asset?.asset_contract?.name??"")+'"';
    const verified='\"'+""+'\"';
    let from_address='"'+""+'"';
    let to_address='"'+""+'"';
    let action='"'+""+'"';
    if(data[idx].total_price!=null){
      value='"'+data[idx].total_price+'"';
    }
    if(data[idx].event_type=="created"){
      continue;
    }
    if(data[idx].event_type=="transfer"){
      from_address = data[idx].from_account.address;
      to_address=data[idx].to_account.address;
  
      action='"'+classify_action(from_address,to_address,wallet)+'"';
      from_address = '"'+from_address+'"';
      to_address='"'+data[idx].to_account.address+'"';
  }
    if(data[idx].event_type=="successful"){
  
      let seller = data[idx].seller.address;
      action='"'+classify_action2(seller,wallet)+'"';
      if(action=='"0"' ){
         from_address ='"'+ wallet+'"';
         to_address = '"'+seller+'"';
      }
      if(action=='"2"'){
         from_address = '"'+seller+'"';
         to_address ='"'+ wallet+'"';
      }
    }
    
    if(action=='"0"' || action=='"2"' || action=='"4"' || action=='"5"' ){
      related_address_count++;
    }
    if(action=='"0"'){
      buy_volume+=parseInt(data[idx].total_price);
    }
    if(action=='"2"'){
      sell_volume+=parseInt(data[idx].total_price);
    }
  
    let sqlData = [nft_trans_id, block_number, block_timestamp, block_hash, transaction_hash, transaction_index, log_index,
    value, transaction_type, token_address, token_id, from_address, to_address, amount, verified,action,image,coll_name];
    
    let res = sqlData.join(',');

    if(idx2==0){
    
      _finalTuple+="("+res+")";
    }else{
      _finalTuple+=",("+res+")";
    }
    idx2++;

  };
  _buysell.buy_volume=buy_volume;
  _buysell.sell_volume=sell_volume;
  _buysell.related_address_count=related_address_count;

  // console.log(_buysell);  
  // console.log(_collectionSet);

  return {finalTuple : _finalTuple, collectionSet : _collectionSet , buy_sell_related_address : _buysell };
}



const save_nft_fp= async(data) =>{
    var finalTuple="";
  
    const nft_fp_id = '\"'+uuidv4.v1()+'\"';
    const token_address= '\"'+data.primary_asset_contracts[0].address+'\"';
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
  createTx_and_portfolio,
  save_nft_fp,
  checkAddress,
  nft_coll_one_db_save,
};
  