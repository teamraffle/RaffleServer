const express = require('express');
const router = express.Router();

const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

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

router
  .route('/')
  .post(validate(userValidation.createUser), userController.createUser)


router.get('/', function (req, res) {
  // console.log(req.body);  
console.log(req);
  var wallet ={
    address : req.query.address,
    chainId : req.query.chainId
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

