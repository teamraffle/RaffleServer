const request = require('supertest');
const { faker } = require('@faker-js/faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { User } = require('../../src/models');
setupTestDB();

describe.skip('Register routes', () => {
    
    let user = {
        nickname : faker.name.findName(),
        profile_pic : faker.image.avatar(),
        email: faker.internet.email().toLowerCase(),
    }
    const wallet_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
    
    let test_user_id;

    describe('GET /v1/register/nickname', () => {
      test('should return 200 and apply the default query options', async () => {
        
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
  
      test('should return 409 because nickname has conflicted', async () => {
        test_user_id = await User.create(user, wallet_id);
        await request(app)
          .get('/v1/register/nickname')
          .query(
              {
                chain_id : 1,
                check_value: user.nickname,
              }
          )
          .send()
          .expect(httpStatus.CONFLICT);
      });
  
      
  
    });

    afterAll(() => {
        User.delete_user_only(test_user_id);
      });
   
  
  });
  