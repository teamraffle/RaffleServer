const config = require('../../config/config');
const mariadb = require('mariadb');

const config_mdb = {
      host: config.mariadb.host,
      user: config.mariadb.user,
      password: config.mariadb.pswd,
      connectionLimit: 5,
      database: "innodb",
  };

let pool = mariadb.createPool(config_mdb);

module.exports = pool;
