const express = require('express');
const router = express.Router();

const uuidv4 = require('uuid');
const logger = require('../../config/logger');
const pool = require('../../models/plugins/dbHelper');
let conn;

router.get('/:userId', function (req, res) {
  res.send('user');
})

router.patch('/:userId', function (req, res) {
  res.send('user');
})


router.post('/', function (req, res) {
  var wallet ={
    address : req.body.address,
    chainId : req.body.chainId
  }
  var user = {
    nickname : req.body.nickname,
    profilePic : req.body.profilePic,
    email: req.body.email
  } 

  saveNewWallet(wallet).then(function(wallet_id){
    saveNewUser(user, wallet_id) 
  }).then(function(user_id){
    res.send(user_id);
  });


})

router.get('/', function (req, res) {
  // console.log(req.body);  

  var wallet ={
    address : req.body.address,
    chainId : req.body.chainId
  }
  checkUserByWallet(wallet).then(function(output){
    // if(output.length==0){
    //   res.sendStatus(404);
    // }else{
    //   res.send(output);
    // }
    res.send(output);
  });
  
})

async function saveNewWallet(wallet) {
  try {
    conn = await pool.getConnection();

    const sql = `INSERT INTO tb_wallet_eth
    (
        wallet_id, chain_id, address, create_timestamp
    ) VALUES (
        ?, ?, ?, ?
    )`
    var splittedAddr = wallet.address.replace('0x','');
    const wallet_id = uuidv4.v1();
    const dbRes = await conn.query(sql, [wallet_id, 1,  splittedAddr, new Date().toISOString().slice(0, 19).replace('T', ' ')]);
    
    console.log(dbRes);//성공 리턴
    return wallet_id;
    
  }catch(err) {
    console.log(err);
  }
   finally {
	  if (conn) conn.release(); //release to pool
  }
  return 'success'; 
}

async function saveNewUser(user, wallet_id) {
  try {
    conn = await pool.getConnection();
    const member_id = uuidv4.v1();
    const sql = `INSERT INTO tb_user
    (
        user_id, wallet_id, nickname, profile_pic
    ) VALUES (
        ?, ?, ?, ?
    )`
    
    const user_id = uuidv4.v1();
    const dbRes = await conn.query(sql, [user_id, wallet_id, user.nickname, user.profilePic]);
    console.log(dbRes);//성공 리턴
    return user_id;

  }catch(err) {
    console.log(err);
  }
   finally {
	  if (conn) conn.release(); //release to pool
  }
  return 'success'; 
}

async function checkUserByWallet(wallet) {
  var rows;
  try {
    conn = await pool.getConnection();

    //TODO 체인아이디 따라 디비분기 넣을것 
    if(wallet.chainId==1){
      const splittedAddr = wallet.address.replace('0x','');
      const query ="SELECT tb_wallet_eth.chain_id, tb_wallet_eth.address, tb_user.user_id, tb_user.nickname, tb_user.profile_pic, tb_user.status  FROM tb_wallet_eth INNER JOIN tb_user ON tb_wallet_eth.wallet_id = tb_user.wallet_id WHERE tb_wallet_eth.address=?"
      rows = await conn.query(query, splittedAddr);
      console.log(rows[0]);  

    }
  } finally {
	  if (conn) conn.release();
  }

  return rows[0];
}

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */

