const request = require('supertest');
const { faker } = require('@faker-js/faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
// const { nftService } = require('../services');
setupTestDB();

describe.skip('nftService test', () => {
    
    test('should get all collection from opensea : get_nftcoll_opensea', async () => {
        nftService.get
        const res = await request(app)
        .get('/v1/register/nickname')
        .set('Content-Type', "application/json")
        .query(
            {
              chain_id : 1,
              check_value: 'THISSHOULDNEVERBENICKNAME',
            }
        )
        .send()
        .expect(httpStatus.OK);
  
    });

    afterAll(() => {
        User.delete_user_only(test_user_id);
      });
   
  
  });
  