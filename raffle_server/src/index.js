const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const pool = require('./models/plugins/dbHelper');

let server;

const startServer = () => {
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
}

async function mariaDBFunction() {
  let conn;
  try {
	conn = await pool.getConnection();
  logger.info('Connected to MariaDB');
  startServer();

	// const rows = await conn.query("SELECT 1 as val");
	// // rows: [ {val: 1}, meta: ... ]

	// const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
	// // res: { affectedRows: 1, insertId: 1, warningStatus: 0 }

  } finally {
	if (conn) conn.release(); //release to pool
  }
}

mariaDBFunction();




const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
