// const mongoose = require('mongoose');
const mariadb = require('mariadb');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

let server;
mariadb.createConnection({host: config.mariadb.host, user: config.mariadb.user, password: config.mariadb.pswd})
    .then(conn => {
      logger.info('Connected to MariaDB');
      server = app.listen(config.port, () => {
        logger.info(`Listening to port ${config.port}`);
      });
    })
    .catch(err => {
      logger.info(`Failed to connect MariaDB: ${err}`);
      //handle connection error
    });

// mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
//   logger.info('Connected to MariaDB');
//   server = app.listen(config.port, () => {
//     logger.info(`Listening to port ${config.port}`);
//   });
// });


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
