const config = require('../../config/config');
const mariadb = require('mariadb');

const config_mdb = {
      host: config.mariadb.host,
      user: config.mariadb.user,
      password: config.mariadb.pswd,
      connectionLimit: 7,
      database: config.mariadb.dbName,
  };

let pool = mariadb.createPool(config_mdb);

module.exports = pool;
