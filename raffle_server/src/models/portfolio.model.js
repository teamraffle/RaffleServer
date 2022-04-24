const uuidv4 = require('uuid');
const { query } = require('../config/logger');
const logger = require('../config/logger');
const pool = require('./plugins/dbHelper');
const util = require('util');
let conn;

const get_user = async (wallet, chain_id) => {
  //TODO
  //우리 디비에서 유저정보가져와주기
  var wallet = {
    address: wallet,
    chain_id: chain_id,
  };
  var rows;
  var rows2;
  var rows3;
  var rows4;
  var rows5;
  const splittedAddr = wallet.address;
  try {
    conn = await pool.getConnection();

    //TODO 체인아이디 따라 디비테이블 분기 넣을것
    if (wallet.chain_id == 1) {
      //첫번째 쿼리, 두개 조인해서 닉네임 가져오기
      //두번째 쿼리, 일단 해당 사용자 값 nft 갯수 가져오기

      const portfolio_basic =
        'SELECT tb_user.nickname,tb_user.profile_pic FROM tb_wallet_eth INNER JOIN tb_user ON tb_wallet_eth.wallet_id = tb_user.wallet_id  WHERE tb_wallet_eth.address=?';
      const nft_count = 'SELECT COUNT( * ) as cnt FROM tb_nft_eth WHERE tb_nft_eth.owner_of=?';
      const nft_coll_count = 'SELECT COUNT(DISTINCT token_address) as cnt FROM tb_nft_eth WHERE tb_nft_eth.owner_of=?';
      const activity_query = 'SELECT COUNT(*) as cnt FROM tb_nft_transfer_eth WHERE from_address=? OR to_address=?';
      const collection = 'SELECT name,collection_icon FROM tb_nft_collection_eth WHERE token_address=(SELECT token_address AS counted FROM tb_nft_eth WHERE tb_nft_eth.owner_of=' +
        '"' +
        splittedAddr +
        '"' +
        'GROUP BY token_address ORDER BY counted DESC LIMIT 1)';

      rows = await conn.query(portfolio_basic, splittedAddr);
      rows2 = await conn.query(nft_count, splittedAddr);
      rows3 = await conn.query(nft_coll_count, splittedAddr);
      rows4 = await conn.query(collection);
      rows5 = await conn.query(activity_query,[splittedAddr,splittedAddr]);

      if (rows[0] == undefined || rows2[0] == undefined || rows3[0] == undefined || rows4[0] == undefined) {
        return false;
      } else {
     
        const wallet_address = wallet.address;
        const nft_holdings = rows2[0].cnt;
        const collections_holdings = rows3[0].cnt;
        const most_collection_name = rows4[0].name;
        const most_collection_icon = rows4[0].collection_icon;
        const activity_count=rows5[0].cnt;

        const update_portfolio = `UPDATE tb_portfolio_eth SET nft_holdings=?,collections_holdings=?,most_collection_name=?,most_collection_icon=?,activity_count=?,sync=? where wallet_address=?`;
        console.log('here', nft_holdings, collections_holdings, most_collection_name, most_collection_icon, wallet_address);
        const dbRes = await conn.query(update_portfolio, [
          nft_holdings,
          collections_holdings,
          most_collection_name,
          most_collection_icon,
          activity_count,1,
          wallet_address
        ]);

        return dbRes; //TODO 양식맞추기
      }
    }
  } finally {
    if (conn) conn.release();
  }
};

const get_portfolio = async (query) => {
  var wallet = {
    address: query.address,
  };
  var total = {};

  var rows;
  const splittedAddr = wallet.address;
  try {
    conn = await pool.getConnection();

    //TODO 체인아이디 따라 디비테이블 분기 넣을것

    const portfolio_query = 'SELECT * FROM tb_portfolio_eth WHERE wallet_address=?';
    const user_query =
      'SELECT tb_user.nickname,tb_user.user_id,tb_user.profile_pic FROM tb_wallet_eth INNER JOIN tb_user ON tb_wallet_eth.wallet_id = tb_user.wallet_id  WHERE tb_wallet_eth.address=?';

    rows = await conn.query(portfolio_query, splittedAddr);
    rows2 = await conn.query(user_query, splittedAddr);

    if (rows[0] == undefined) {
      return false;
    } else {
      total.updated_at = rows[0].create_timestamp;
      total.user = rows2[0];
      total.portfolio = rows[0];

      delete total.portfolio.create_timestamp;
      return total; //TODO 양식맞추기
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
      tb_nft_collection_eth.nft_coll_id, tb_nft_collection_eth.symbol , tb_nft_collection_eth.name ,\ tb_nft_collection_eth.collection_icon ,final.fp\
      FROM tb_nft_eth\
      JOIN tb_nft_collection_eth ON tb_nft_eth.token_address = tb_nft_collection_eth.token_address \
      JOIN (SELECT m1.* FROM tb_nft_fp_eth m1,(SELECT max(update_timestamp) as max_time,fp,token_address  from tb_nft_fp_eth group by token_address) m2 WHERE m1.update_timestamp = m2.max_time AND m1.token_address = m2.token_address)final ON tb_nft_eth.token_address = final.token_address\
      WHERE tb_nft_eth.owner_of=?\
      ORDER BY tb_nft_eth.block_number DESC \
      LIMIT ? OFFSET ?';

    // const timestamp_query =
    //   'SELECT block_timestamp FROM tb_nft_transfer_eth WHERE token_address = ? AND token_id =? \
    //   ORDER BY block_timestamp DESC LIMIT 1 ';

    const rows = await conn.query(count_query, address);
    const rows2 = await conn.query(nft_coll_query, [address, _limit, offset]); //, limit, page*limit

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

    //TODO 이러면 페이지 크기만큼 sql을 추가로 실행하게됨;  이게 과연 빠를까???
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
        in_timestamp: item.token_address,
        action: item.action,
        collection: {
          icon: item.collection_icon,
          id: item.nft_coll_id,
          name: item.name,
          token_address: item.collection_icon,
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
  get_user,
  get_portfolio,
  get_nft,
  get_portfolio_activity,
};
