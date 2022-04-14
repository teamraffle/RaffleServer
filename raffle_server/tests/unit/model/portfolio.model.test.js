const request = require('supertest');
const { faker } = require('@faker-js/faker');
const app = require('../../../src/app');
const setupTestDB = require('../../utils/setupTestDB');
const { Portfolio } = require('../../../src/models');
setupTestDB();

describe('Portfolio Model test', () => {
  test('get nft Basic : Address, Chain id only', async () => {
    // const page = query.page;
    // const limit = query.limit;
    const query = {
      chain_id: 1,
      address: '0xC6eAfD3a5A919a17374c5a6d5BcE45CFE4dc76F9',
    };
    await Portfolio.get_nft(query);
  });

  // afterAll(() => {
  //     User.delete_user_only(test_user_id);
  //   });
});
