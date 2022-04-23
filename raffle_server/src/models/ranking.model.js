const uuidv4 = require('uuid');
const { query } = require('../config/logger');
const logger = require('../config/logger');
const pool = require('./plugins/dbHelper');
const util = require('util');
let conn;


const get_ranking = async (query) => {
  const DEFAULT_PAGE = 0;
  const DEFAULT_LIMIT = 10;

  let _page, _limit;


  if (query.page == undefined) {
    _page = DEFAULT_PAGE;
  } else {
    _page = query.page;
  }

  if (query.limit == undefined) {
    _limit = DEFAULT_LIMIT;
  } else {
    _limit = query.limit;
  }
  console.log(_page, _limit)
  const offset = _page * _limit;

  try {
    conn = await pool.getConnection();
    console.log(_limit, offset)

    const count_query = 'SELECT (SELECT COUNT(wallet_address) FROM tb_portfolio_eth)as cnt,b.nickname,a.wallet_address,a.create_timestamp,a.est_market_value,a.earnings_rate,a.av_holding_period  FROM tb_portfolio_eth as a  INNER JOIN tb_user AS b ON a.wallet_address=b.address WHERE a.sync=1 ORDER BY a.av_holding_period DESC LIMIT ? OFFSET ?;';


    const rows = await conn.query(count_query,[_limit, offset]);

    // const rows2 = await conn.query(activity_query, [address, address, _limit, offset]);

    const resultArray = Object.values(JSON.parse(JSON.stringify(rows)));
  
    let index=0;
    let index2=0; //hand_check 용
    
    let result_Data = resultArray.map(function (item) {
        index++;
 
    let hand_value=hand_check(rows[0].cnt,index);
    console.log(index,hand_value)
      return {
        ranking:index,
        nickname:item.nickname,
        hands:hand_value,
        address:item.wallet_address,
        timestamp:item.create_timestamp,
        est_market_value:item.est_market_value,
        earning:item.earnings_rate,
        avg_holding_period:item.av_holding_period

    }});


    if (rows[0] == undefined) {
      return false;
    } else {
        
      const _page_size = Math.ceil(rows[0].cnt / _limit);
      var final_json = {
        total: rows[0].cnt,
        page: _page,
        page_size: _page_size,
        result: result_Data,
   
      };
      console.log(util.inspect(JSON.stringify(final_json), false, null, true));
      return JSON.stringify(final_json, null, 2);
    }
    
}
   finally {
    if (conn) conn.release();
  }
};

const hand_check= (total,index) => {

    let hands;
    console.log(total,index)
    if(index<=total*0.3){
        hands="dia"
    }
    else if(total-index+1<total*0.1){
        hands="paper"
    }
    else{
        hands="normal"
    }
 
    return hands;
}

module.exports = {
  get_ranking,
 
};
