const uuidv4 = require('uuid');
const pool = require('./plugins/dbHelper');
let conn;

const create= async (body, wallet_id) => {
    var user = {
        nickname : body.nickname,
        profilePic : body.profilePic,
        email: body.email
      } 

    try {
        conn = await pool.getConnection();
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
        return false;
      }
       finally {
          if (conn) conn.release(); //release to pool
      }
}

module.exports = {
    create,
};
  