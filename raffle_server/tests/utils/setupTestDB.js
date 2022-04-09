const pool = require('../../src/models/plugins/dbHelper');

const setupTestDB = () => {
  let conn;

  beforeAll(async () => {
    conn = await pool.getConnection();
  });

  afterAll(async () => {
    await conn.release();
  });
};

module.exports = setupTestDB
;
