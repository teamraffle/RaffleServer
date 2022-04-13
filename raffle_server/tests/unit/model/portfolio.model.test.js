const request = require('supertest');
const { faker } = require('@faker-js/faker');
const app = require('../../../src/app');
const setupTestDB = require('../../utils/setupTestDB');
const { Portfolio } = require('../../../src/models');
setupTestDB();

describe('Portfolio Model test', () => {
  test('get nft', async () => {
    await Portfolio.get_nft('');

  });

  // afterAll(() => {
  //     User.delete_user_only(test_user_id);
  //   });
});
