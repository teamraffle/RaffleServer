const uuidv4 = require('uuid');
const { query } = require('../config/logger');
const logger = require('../config/logger');
const pool = require('./plugins/dbHelper');
const util = require('util');
let conn;

const save_portfolio = async (wallet, chain_id) => {
  try {
    conn = await pool.getConnection();
    await save_portfolio_no_user(wallet);
    //유저 존재하는지 확인
    // const user = if_user_exist(wallet);
    // console.log("2");

    // if (!user) {
    // console.log("2");

    //   save_portfolio_no_user(wallet);
    // } else {
    //   save_portfolio_with_user(wallet, user);
    // }
  } finally {
    if (conn) conn.release();
  }
};

const if_user_exist = async (wallet) => {
  //조인해서 닉네임 가져오기
  const portfolio_basic =
    'SELECT tb_user.nickname,tb_user.profile_pic FROM tb_wallet_eth INNER JOIN tb_user ON tb_wallet_eth.wallet_id = tb_user.wallet_id  WHERE tb_wallet_eth.address=?';
  const rows = await conn.query(portfolio_basic, wallet);
  if (rows[0] == undefined) {
    return false;
  } else {
    return rows[0];
  }
};

const save_portfolio_with_user = async (wallet, user) => {
  var rows2;
  var rows3;
  var rows4;
  var rows5;
  //TODO 체인아이디 따라 디비테이블 분기 넣을것

  //해당 사용자 값 nft 갯수 가져오기
  const nft_count = 'SELECT COUNT( * ) as cnt FROM tb_nft_eth WHERE tb_nft_eth.owner_of=?';
  const nft_coll_count = 'SELECT COUNT(DISTINCT token_address) as cnt FROM tb_nft_eth WHERE tb_nft_eth.owner_of=?';
  const activity_query = 'SELECT COUNT(*) as cnt FROM tb_nft_transfer_eth WHERE from_address=? OR to_address=?';
  const collection =
    'SELECT name,collection_icon FROM tb_nft_collection_eth WHERE token_address=(SELECT token_address AS counted FROM tb_nft_eth WHERE tb_nft_eth.owner_of=' +
    '"' +
    wallet +
    '"' +
    'GROUP BY token_address ORDER BY counted DESC LIMIT 1)';

  rows2 = await conn.query(nft_count, wallet);
  rows3 = await conn.query(nft_coll_count, wallet);
  rows4 = await conn.query(collection);
  rows5 = await conn.query(activity_query, [wallet, wallet]);

  if (rows2[0] == undefined || rows3[0] == undefined || rows4[0] == undefined) {
    return false;
  } else {
    const wallet_address = wallet;
    const nft_holdings = rows2[0].cnt;
    const collections_holdings = rows3[0].cnt;
    const most_collection_name = rows4[0].name;
    const most_collection_icon = rows4[0].collection_icon;
    const activity_count = rows5[0].cnt;

    const update_portfolio = `UPDATE tb_portfolio_eth SET nft_holdings=?,collections_holdings=?,most_collection_name=?,most_collection_icon=?,activity_count=?,sync=? where wallet_address=?`;

    const dbRes = await conn.query(update_portfolio, [
      nft_holdings,
      collections_holdings,
      most_collection_name,
      most_collection_icon,
      activity_count,
      1,
      wallet_address,
    ]);

    return dbRes; //TODO 양식맞추기
  }
};

const save_portfolio_no_user = async (wallet) => {
  var rows2;
  var rows3;
  var rows4;
  var rows5;
  //TODO 체인아이디 따라 디비테이블 분기 넣을것

  //해당 사용자 값 nft 갯수 가져오기
  const nft_count = 'SELECT COUNT( * ) as cnt FROM tb_nft_eth WHERE tb_nft_eth.owner_of=?';
  const nft_coll_count = 'SELECT COUNT(DISTINCT token_address) as cnt FROM tb_nft_eth WHERE tb_nft_eth.owner_of=?';
  const activity_query = 'SELECT COUNT(*) as cnt FROM tb_nft_transfer_eth WHERE from_address=? OR to_address=?';
  const collection =
    'SELECT name,collection_icon FROM tb_nft_collection_eth WHERE token_address=(SELECT token_address AS counted FROM tb_nft_eth WHERE tb_nft_eth.owner_of=' +
    '"' +
    wallet +
    '"' +
    'GROUP BY token_address ORDER BY counted DESC LIMIT 1)';

  rows2 = await conn.query(nft_count, wallet);
  rows3 = await conn.query(nft_coll_count, wallet);
  rows4 = await conn.query(collection);
  rows5 = await conn.query(activity_query, [wallet, wallet]);

  if (rows2[0] == undefined || rows3[0] == undefined) {
    return false;
  } else {
    const wallet_address = wallet;
    const nft_holdings = rows2[0].cnt;
    const collections_holdings = rows3[0].cnt;
    let most_collection_name;
    let most_collection_icon;
    if (rows4[0] == undefined) {
      most_collection_name = '';
      most_collection_icon = '';
    } else {
      most_collection_name = rows4[0].name;
      most_collection_icon = rows4[0].collection_icon;
    }

    const activity_count = rows5[0].cnt;

    const update_portfolio = `UPDATE tb_portfolio_eth SET nft_holdings=?,collections_holdings=?,most_collection_name=?,most_collection_icon=?,activity_count=?,sync=? where wallet_address=?`;
    console.log('here', nft_holdings, collections_holdings, most_collection_name, most_collection_icon, wallet_address);
    const dbRes = await conn.query(update_portfolio, [
      nft_holdings,
      collections_holdings,
      most_collection_name,
      most_collection_icon,
      activity_count,
      1,
      wallet_address,
    ]);

    return dbRes;
  }
};

const check_get_user = async (res_user, res_portfolio) => {
  let _user_nickname;
  let _user_id;
  let _profile_pic;

  if (res_user == undefined) {
    _user_nickname = res_portfolio.wallet_address;
    _user_id = '';
    _profile_pic = '';
  } else {
    _user_nickname = res_user.nickname;
    _user_id = res_user.user_id;
    _profile_pic = res_user.profile_pic;
  }

  return { _user_nickname, _user_id, _profile_pic };
};

const get_portfolio = async (query) => {
  var wallet = {
    address: query.address,
  };

  const splittedAddr = wallet.address;
  try {
    conn = await pool.getConnection();

    //TODO 체인아이디 따라 디비테이블 분기 넣을것

    const portfolio_query = 'SELECT a.wallet_address,a.nft_holdings,a.collections_holdings,a.av_holding_period,\
a.most_collection_name,a.most_collection_icon,a.est_market_value,a.holding_volume,a.earnings_rate,a.total_gas_fee,\
a.buy_volume,a.sell_volume,a.related_addr_count,a.activity_count,tb_ranking.hands FROM tb_portfolio_eth as a INNER JOIN tb_ranking ON tb_ranking.address  = a.wallet_address WHERE wallet_address=?';

    const user_query =
      'SELECT tb_user.nickname,tb_user.user_id,tb_user.profile_pic FROM tb_wallet_eth INNER JOIN tb_user ON tb_wallet_eth.wallet_id = tb_user.wallet_id  WHERE tb_wallet_eth.address=?';

    const rows = await conn.query(portfolio_query, splittedAddr);
    const rows2 = await conn.query(user_query, splittedAddr);

    if (rows[0] == undefined) {
      return false;
    } else {
      const { _user_nickname, _user_id, _profile_pic } = await check_get_user(rows2[0], rows[0]);

      return {
        sync: rows[0].sync,
        updated_at: rows[0].create_timestamp,
        user: {
          nickname: _user_nickname,
          user_id: _user_id,
          profile_pic: _profile_pic,
        },
        portfolio: {
          wallet_address: rows[0].wallet_address,
          nft_holdings: rows[0].nft_holdings,
          collections_holdings: rows[0].collections_holdings,
          av_holding_period: rows[0].av_holding_period,
          most_collection_name: rows[0].most_collection_name,
          most_collection_icon: rows[0].most_collection_icon,
          est_market_value: rows[0].est_market_value,
          holding_volume: rows[0].holding_volume,
          earnings_rate: rows[0].earnings_rate,
          total_gas_fee: rows[0].total_gas_fee,
          buy_volume: rows[0].buy_volume,
          sell_volume: rows[0].sell_volume,
          related_addr_count: rows[0].related_addr_count,
          activity_count: rows[0].activity_count,
          hands: rows[0].hands,
        },
      };
    }
  } finally {
    if (conn) conn.release();
  }
};

const get_nft = async (query) => {
  const DEFAULT_PAGE = 0;
  const DEFAULT_LIMIT = 12;

  //TODO 체인아이디 따라 디비테이블 분기 넣을것

  const chain_id = query.chain_id;
  const address = query.address;
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

  const offset = _page * _limit;

  try {
    conn = await pool.getConnection();

    const count_query = 'SELECT COUNT(*) as cnt FROM tb_nft_eth WHERE owner_of=?';
    const nft_coll_query =
      'SELECT tb_nft_eth.nft_item_id, tb_nft_eth.token_address, tb_nft_eth.token_id , tb_nft_eth.nft_image , tb_nft_eth.block_number,\
      tb_nft_collection_eth.nft_coll_id, tb_nft_collection_eth.symbol , tb_nft_collection_eth.name , tb_nft_collection_eth.collection_icon ,final.fp\
      FROM tb_nft_eth\
      JOIN tb_nft_collection_eth ON tb_nft_eth.token_address = tb_nft_collection_eth.token_address \
      JOIN (SELECT m1.* FROM tb_nft_fp_eth m1,(SELECT max(update_timestamp) as max_time,fp,token_address  from tb_nft_fp_eth group by token_address) m2 WHERE m1.update_timestamp = m2.max_time AND m1.token_address = m2.token_address)final ON tb_nft_eth.token_address = final.token_address\
      WHERE tb_nft_eth.owner_of=?\
      ORDER BY tb_nft_eth.block_number DESC \
      LIMIT ? OFFSET ?';

    const get_sync = 'SELECT sync FROM tb_portfolio_eth WHERE wallet_address=?';

    // const timestamp_query =
    //   'SELECT block_timestamp FROM tb_nft_transfer_eth WHERE token_address = ? AND token_id =? \
    //   ORDER BY block_timestamp DESC LIMIT 1 ';

    const rows = await conn.query(count_query, address);
    const rows2 = await conn.query(nft_coll_query, [address, _limit, offset]); //, limit, page*limit
    const rows3 = await conn.query(get_sync, address); //, limit, page*limit

    const resultArray = Object.values(JSON.parse(JSON.stringify(rows2)));
    let result_Data = resultArray.map(function (item) {
      return {
        nft_item_id: item.nft_item_id,
        token_address: item.token_address,
        token_id: item.token_id,
        in_timestamp: '',
        nft_image: item.nft_image,
        collection: {
          nft_coll_id: item.nft_coll_id,
          symbol: item.symbol,
          name: item.name,
          collection_icon: item.collection_icon,
          fp: item.fp,
        },
      };
    });

    // TODO 이러면 페이지 크기만큼 sql을 추가로 실행하게됨;  이게 과연 빠를까???
    // result_Data.forEach(async function (element, index) { //
    //   // console.log(index);
    //   let timestamp = await conn.query(timestamp_query, [element.token_address, element.token_id]);
    //   // console.log(timestamp[0].block_timestamp)
    //   result_Data[index].in_timestamp = timestamp[0].block_timestamp;
    //   console.log(result_Data[index]);
    // });

    if (rows[0] == undefined) {
      return false;
    } else {
      // console.log(rows[0].cnt / _limit);
      const _page_size = Math.ceil(rows[0].cnt / _limit);
      var final_json = {
        total: rows[0].cnt,
        page: _page,
        page_size: _page_size,
        sync: rows3[0].sync,
        result: result_Data,
      };

      console.log(util.inspect(JSON.stringify(final_json), false, null, true));
      return JSON.stringify(final_json, null, 2);
    }
  } finally {
    if (conn) conn.release();
  }
};

const get_portfolio_activity = async (query) => {
  const DEFAULT_PAGE = 0;
  const DEFAULT_LIMIT = 10;

  //TODO 체인아이디 따라 디비테이블 분기 넣을것
  const chain_id = query.chain_id;
  const address = query.address;
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

  const offset = _page * _limit;

  try {
    conn = await pool.getConnection();

    const count_query = 'SELECT COUNT(*) as cnt FROM tb_nft_transfer_eth WHERE from_address=? OR to_address=?';
    const activity_query =
      'SELECT trans.nft_trans_id,trans.block_timestamp,trans.from_address,\
      trans.to_address,trans.action,trans.token_id,coll.collection_icon,\
      coll.nft_coll_id,coll.name,coll.token_address,trans.value,\
      trans.transaction_hash \
      FROM tb_nft_transfer_eth trans LEFT OUTER JOIN tb_nft_collection_eth coll ON coll.token_address=trans.token_address WHERE trans.from_address=? \
      OR trans.to_address=? ORDER BY trans.block_timestamp desc LIMIT ? OFFSET ?';

    const rows = await conn.query(count_query, [address, address]);
    const rows2 = await conn.query(activity_query, [address, address, _limit, offset]);

    const resultArray = Object.values(JSON.parse(JSON.stringify(rows2)));
    let result_Data = resultArray.map(function (item) {
      return {
        nft_trans_id: item.nft_item_id,
        in_timestamp: item.block_timestamp,
        action: item.action,
        collection: {
          icon: item.collection_icon,
          id: item.nft_coll_id,
          name: item.name,
          token_address: item.token_address,
        },
        token_id: item.token_id,
        from_address: item.from_address,
        to_address: item.to_address,
        value: item.value,
        transaction_hash: item.transaction_hash,
      };
    });

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

module.exports = {
  save_portfolio,
  get_portfolio,
  get_nft,
  get_portfolio_activity,
};
