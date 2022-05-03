const uuidv4 = require('uuid');
const {
  query
} = require('../config/logger');
const logger = require('../config/logger');
const pool = require('./plugins/dbHelper');
const util = require('util');
let conn;

const notuser_make_ranking = async () => {
   
  try {
    conn = await pool.getConnection();

    const count_query = 'SELECT (SELECT COUNT(wallet_address) FROM tb_portfolio_eth)as cnt, b.nickname,a.wallet_address,a.create_timestamp,a.est_market_value,a.earnings_rate,a.av_holding_period,a.nft_holdings  FROM tb_portfolio_eth as a  LEFT OUTER JOIN tb_user AS b ON a.wallet_address=b.address WHERE a.sync=1 ORDER BY a.av_holding_period DESC;';


    const rows = await conn.query(count_query);

    // const rows2 = await conn.query(activity_query, [address, address, _limit, offset]);

    const resultArray = Object.values(JSON.parse(JSON.stringify(rows)));
    console.log("호출되니",resultArray)
    let index = 0;
    let finaltuple="";


    let result_Data = resultArray.map(function (item) {
      index++;

      let hand_value = hand_check(rows[0].cnt, index);
      console.log(index, hand_value)

      const rank_id= '"'+uuidv4.v1()+'"';;
      const ranking= '"'+index+'"';;
      const hands= '"'+hand_value+'"';;
      const address= '"'+item.wallet_address+'"';
      const nickname= '"'+item.nickname+'"';
      const standard='"'+"v1"+'"';
      const timestamp='"'+item.create_timestamp+'"';
      const est_market_value='"'+item.est_market_value+'"';
      const earning='"'+item.earnings_rate+'"';
      const nft_holdings='"'+item.nft_holdings+'"';
      const score='"'+item.av_holding_period+'"';
      
      let ranking_data = [rank_id, ranking, hands, address,nickname, standard, timestamp, est_market_value,
        earning,nft_holdings, score];
        let res = ranking_data.join(',');
    
        if(index==1){
        finaltuple+="("+res+")";

      }else{
        finaltuple+=",("+res+")"}

    
    });

    console.log(finaltuple)
    const delete_sql = 'DELETE FROM tb_ranking;';
    const rows3 = await conn.query(delete_sql);
  
    const sql = 'INSERT IGNORE INTO tb_ranking (rank_id, ranking, hands, address, nickname, standard, timestamp, est_market_value,earnings_rate,nft_holdings,score) VALUES'+ finaltuple;
    // 첫번째 값의 토큰 어드레스 값을 읽을 수 없을때, continue 되기 때문에 idx=0일떄 (+res+) 구조 형성이 안먹혀서 임시방편으로 사용

    const rows2 = await conn.query(sql);
  

    if (rows[0] == undefined) {
      return false;
    } 

  } finally {
    if (conn) conn.release();
  }
  };
const make_ranking = async () => {

  try {
    conn = await pool.getConnection();

    const count_query = 'SELECT (SELECT COUNT(wallet_address) FROM tb_portfolio_eth)as cnt, b.nickname,a.wallet_address,a.create_timestamp,a.est_market_value,a.earnings_rate,a.av_holding_period,a.nft_holdings  FROM tb_portfolio_eth as a  INNER JOIN tb_user AS b ON a.wallet_address=b.address WHERE a.sync=1 ORDER BY a.av_holding_period DESC;';


    const rows = await conn.query(count_query);

    // const rows2 = await conn.query(activity_query, [address, address, _limit, offset]);

    const resultArray = Object.values(JSON.parse(JSON.stringify(rows)));
    console.log("호출되니",resultArray)
    let index = 0;
    let finaltuple="";
    let finaltuple2="";

    let result_Data = resultArray.map(function (item) {
      index++;

      let hand_value = hand_check(rows[0].cnt, index);
      console.log(index, hand_value)

      const rank_id= '"'+uuidv4.v1()+'"';;
      const ranking= '"'+index+'"';;
      const hands= '"'+hand_value+'"';;
      const address= '"'+item.wallet_address+'"';
      const nickname= '"'+item.nickname+'"';
      const standard='"'+"v1"+'"';
      const timestamp='"'+item.create_timestamp+'"';
      const est_market_value='"'+item.est_market_value+'"';
      const earning='"'+item.earnings_rate+'"';
      const nft_holdings='"'+item.nft_holdings+'"';
      const score='"'+item.av_holding_period+'"';
      let hands_data = [address,hands];
      let ranking_data = [rank_id, ranking, hands, address,nickname, standard, timestamp, est_market_value,
        earning,nft_holdings, score];
        let res = ranking_data.join(',');
        let res2 = hands_data.join(',');
    
        if(index==1){
        finaltuple+="("+res+")";
        finaltuple2+="("+res2+")";

      }else{
        finaltuple+=",("+res+")";
        finaltuple2+=",("+res2+")";
      }

    
    });

    console.log("here",finaltuple)
    const delete_sql = 'DELETE FROM tb_ranking;';
    const rows2 = await conn.query(delete_sql);

    // const insert_hands_query='INSERT INTO tb_portfolio_eth (wallet_address,hands) VALUES '+finaltuple2+'ON DUPLICATE KEY UPDATE wallet_address=VALUES(wallet_address),hands=VALUES(hands)';
    // const rows3 = await conn.query(insert_hands_query);
    console.log()
    if(finaltuple == ""){
     
        return false;
    }
  
    const sql = 'INSERT IGNORE INTO tb_ranking (rank_id, ranking, hands, address, nickname, standard, timestamp, est_market_value,earnings_rate,nft_holdings,score) VALUES'+ finaltuple;
    // 첫번째 값의 토큰 어드레스 값을 읽을 수 없을때, continue 되기 때문에 idx=0일떄 (+res+) 구조 형성이 안먹혀서 임시방편으로 사용

    const rows4 = await conn.query(sql);
  

    if (rows[0] == undefined) {
      return false;
    } 

  } finally {
    if (conn) conn.release();
  }
};
const get_ranking = async (query) => {
  const DEFAULT_PAGE = 0;
  const DEFAULT_LIMIT = 10;

  let _page, _limit;

  if (query.query.page == undefined) {
    _page = DEFAULT_PAGE;
  } else {
    _page = query.query.page;
  }


   _limit = DEFAULT_LIMIT;

  
  let offset = _page * _limit;

  try {
    conn = await pool.getConnection();
    console.log(_limit, offset)

    const count_query = 'SELECT (SELECT COUNT(address) FROM tb_ranking)as cnt,a.rank_id,a.ranking,a.hands,a.nickname,a.address,a.timestamp,a.est_market_value,a.earnings_rate,a.nft_holdings,a.score FROM tb_ranking as a ORDER BY a.ranking LIMIT ? OFFSET ?;';  

    const rows = await conn.query(count_query,  [_limit, offset]);
    console.log("da");
    const resultArray = Object.values(JSON.parse(JSON.stringify(rows)));

    let finaltuple="";
  console.log(rows[0])

    let result_Data = resultArray.map(function (item) {

      return {
        rank_id: item.rank_id,
        ranking: item.ranking,
        nickname: item.nickname,
        hands: item.hands,
        address: item.address,
        timestamp: item.create_timestamp,
        est_market_value: item.est_market_value,
        earning: item.earnings_rate,
        nft_holdings: item.nft_holdings,
        score: item.score

      }
    });
  
    console.log(finaltuple)
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
  } finally {
    if (conn) conn.release();
  }
};
const hand_check = (total, index) => {

  let hands;
  console.log(total, index)
  if (index <= total * 0.3) {
    hands = "dia"
  } else if (total - index + 1 < total * 0.1) {
    hands = "paper"
  } else {
    hands = "normal"
  }

  return hands;
}

module.exports = {
    make_ranking,
    notuser_make_ranking,
    get_ranking

};
