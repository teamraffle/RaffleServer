const request = require('supertest');
const { faker } = require('@faker-js/faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { User } = require('../../src/models');
const { userEmpty, userSmall, walletEmpty, walletSmall, insertUser } = require('../fixtures/user.fixture');
// const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe.skip('User routes', () => {
  describe('POST /v1/users', () => {
    let newUser;
  
    beforeEach(() => {
        faker.seed(0);
        const zero = faker.datatype.number();
        faker.seed('eead9b11-b7f8-11ec-8244-a5e121af7480');
        const uuid_wallet = faker.datatype.uuid();
        const address = '0xaa6e16Cdc8c47e1E1E754af62a36D0d4ac7B7caa';

        newUser = {
            user_id: faker.datatype.uuid(),
            wallet_id : uuid_wallet,
            nickname: faker.name.findName(),
            profile_pic: faker.image.avatar(),
            status: zero,
            email: faker.internet.email().toLowerCase(),
            create_timestamp :faker.date.past(),
            update_timestamp : faker.date.past()
        };
          
        newWallet = {
            wallet_id : uuid_wallet,
            address : address, 
            create_timestamp : faker.date.past()
        };
    });

    test('should return 201 and successfully create new user if data is ok', async () => {
        input = {
            chain_id : 1,
            address : walletSmall.address,
            nickname : userSmall.nickname,
            email: userSmall.email,
            profile_pic : userSmall.profile_pic
        }
        
        const res = await request(app)
            .post('/v1/users')
            .send(input)
            .expect(httpStatus.CREATED);

        userSmall.user_id = res.body.user_id;

        expect(res.body).toEqual({
            user_id: expect.anything()
        });

    //   const dbUser = await User.findById(res.body.user_id);
    //   expect(dbUser).toBeDefined();
    //   expect(dbUser.password).not.toBe(newUser.password);
    //   expect(dbUser).toMatchObject({ name: newUser.name, email: newUser.email, role: newUser.role, isEmailVerified: false });
    });


    test('should return 400 error if nickname is already used', async () => {
        input = {
            chain_id : 1,
            address : walletEmpty.address,
            nickname : userSmall.nickname,
            email: userSmall.email,
            profile_pic : userSmall.profile_pic
        }
        
        await request(app)
            .post('/v1/users')
            .send(input)
            .expect(httpStatus.BAD_REQUEST);
    });

  });

  describe('GET /v1/users', () => {
    test('should return 200 and apply the default query options', async () => {

      const res = await request(app)
        .get('/v1/users')
        .query(
            {
                chain_id : 1,
                address: walletSmall.address,
            }
        )
        .send()
        .expect(httpStatus.OK);
      
      expect(res.body).toEqual({
        user_id: userSmall.user_id,
        nickname: userSmall.nickname,
        profile_pic : userSmall.profile_pic,
        email: userSmall.email,
        status: userSmall.status,
        wallet: {
            wallet_id :  expect.anything(),
            address : walletSmall.address,
            chain_id: 1
        }
      });
    });

    test('should return 400 because wallet address type is wrong', async () => {

        await request(app)
          .get('/v1/users')
          .query(
              {
                  chain_id : 1,
                  address: '0xaa6e16Cdc8c47e1E1E754af62a36D',
              }
          )
          .send()
          .expect(httpStatus.BAD_REQUEST);
    
    });

    test('should return 404 because no user was found', async () => {

        await request(app)
          .get('/v1/users')
          .query(
              {
                  chain_id : 1,
                  address: newWallet.address,
              }
          )
          .send()
          .expect(httpStatus.NOT_FOUND);
      });

  });

  describe('GET /v1/users/:user_id', () => {
    test('should return 200 and the user object if data is ok', async () => {
      const res = await request(app)
        .get(`/v1/users/${userSmall.user_id}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        user_id: userSmall.user_id,
        nickname: userSmall.nickname,
        profile_pic : userSmall.profile_pic,
        email: userSmall.email,
        status: userSmall.status,
        wallet: {
            wallet_id :  expect.anything(),
            address : walletSmall.address,
            chain_id: 1
        }
      });
    });

  });

  describe('PATCH /v1/users/:user_id', () => {
    const _updateBody = {
        profile_pic: faker.image.avatar(),
        nickname: faker.name.findName(),
      };

    test('should return 200 and successfully update user if data is ok', async () => {
      const res = await request(app)
        .patch(`/v1/users/${userSmall.user_id}`)
        .send(_updateBody)
        .expect(httpStatus.OK);

    });

    test('should return 409 because nickname is already taken', async () => {
      
        const updateBody = {
            nickname: _updateBody.nickname,
        };
  
        await request(app)
          .patch(`/v1/users/${userSmall.user_id}`)
          .send(updateBody)
          .expect(httpStatus.CONFLICT);

    });

    test('should return 200 and successfully update user profile_pic only', async () => {
      
        const updateBody = {
          profile_pic : faker.image.avatar(),
        };
  
        const res = await request(app)
          .patch(`/v1/users/${userSmall.user_id}`)
          .send(updateBody)
          .expect(httpStatus.OK);
      
      });

    test('should return 200 and successfully update user nickname only', async () => {
      
        const updateBody = {
          nickname: faker.name.findName(),
        };
  
        const res = await request(app)
          .patch(`/v1/users/${userSmall.user_id}`)
          .send(updateBody)
          .expect(httpStatus.OK);
      });
 
    

    test('should return 404 because user doesn\'t exist', async () => {
      
        const updateBody = {
          profile_pic: faker.image.avatar(),
          nickname: faker.name.findName(),
        };
  
        await request(app)
          .patch(`/v1/users/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa`)
          .send(updateBody)
          .expect(httpStatus.NOT_FOUND);
    });

  });
  


});
