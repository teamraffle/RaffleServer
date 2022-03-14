const express = require('express');
const router = express.Router();

const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');


const pool = require('../../models/plugins/dbHelper');
let conn;

// router.get('/:userId', function (req, res) {

 
//   console.log(req.params.userId);
//   checkUserByWallet2(req.params.userId).then(function(output){
//     // if(output.length==0){
//     //   res.sendStatus(404);
//     // }else{
//     //   res.send(output);
//     // }
//     res.send(output);
//   });
  
// })

router.patch('/:userId', function (req, res) {
  
  
  res.send('user');
})
router
.route('/:userId')
.get(validate(userValidation.getUserbyID), userController.getUserbyId)



router
  .route('/')
  .post(validate(userValidation.createUser), userController.createUser)
  .get(validate(userValidation.getUserbyWallet), userController.getUserbyWallet)







async function checkUserByWallet2(userId) { //id로 검색
  var rows;
  try {
    conn = await pool.getConnection();
  
      const query ="SELECT tb_wallet_eth.chain_id, tb_wallet_eth.address, tb_user.user_id, tb_user.nickname, tb_user.profile_pic, tb_user.status  FROM tb_wallet_eth INNER JOIN tb_user ON tb_wallet_eth.wallet_id = tb_user.wallet_id WHERE tb_user.user_id=?"
      rows = await conn.query(query, userId);
      console.log(rows[0]);  

    
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

