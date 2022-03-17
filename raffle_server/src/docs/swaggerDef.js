const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'NFT Ranks API documentation',
    version,
    license: {
      name: 'MIT',
      url: 'https://nftranks.xyz',
    },
  },
  servers: [
    {
      url: `https://nftranks.xyz:${config.port}/v1`,
    },
  ],
};

module.exports = swaggerDef;
