const request = require('supertest');
const { faker } = require('@faker-js/faker');
const app = require('../../../src/app');
const setupTestDB = require('../../utils/setupTestDB');
const { Portfolio } = require('../../../src/models');
const expect = require('chai').expect;

setupTestDB();

describe('Portfolio Model test', () => {
  const _address = '0xC6eAfD3a5A919a17374c5a6d5BcE45CFE4dc76F9';

  test.skip('get nft Basic : Address, Chain id only', async () => {
    const query = {
      chain_id: 1,
      address: _address,
    };
    await Portfolio.get_nft(query);
  });

  test('get nft Page and Limit option ', async () => {
    const _limit = 5;
    const query = {
      chain_id: 1,
      address: _address,
      page: 0,
      limit: _limit,
    };
    const res = await Portfolio.get_nft(query);

    expect(JSON.parse(res).result.length).to.equal(_limit);
  });

  // afterAll(() => {
  //     User.delete_user_only(test_user_id);
  //   });
});
