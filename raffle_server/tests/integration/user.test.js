//=========================
//TODO: Mariadb 로 대체할것
//=========================
const request = require('supertest');
const { faker } = require('@faker-js/faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { User } = require('../../src/models');
const { userEmpty, userSmall, walletEmpty, walletSmall, insertUser } = require('../fixtures/user.fixture');
// const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('User routes', () => {
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

    // test('should be able to create an admin as well', async () => {
    //   await insertUsers([admin]);
    //   newUser.role = 'admin';

    //   const res = await request(app)
    //     .post('/v1/users')
    //     .set('Authorization', `Bearer ${adminAccessToken}`)
    //     .send(newUser)
    //     .expect(httpStatus.CREATED);

    //   expect(res.body.role).toBe('admin');

    //   const dbUser = await User.findById(res.body.id);
    //   expect(dbUser.role).toBe('admin');
    // });

    // test('should return 401 error if access token is missing', async () => {
    //   await request(app).post('/v1/users').send(newUser).expect(httpStatus.UNAUTHORIZED);
    // });

    // test('should return 403 error if logged in user is not admin', async () => {
    //   await insertUsers([userOne]);

    //   await request(app)
    //     .post('/v1/users')
    //     .set('Authorization', `Bearer ${userOneAccessToken}`)
    //     .send(newUser)
    //     .expect(httpStatus.FORBIDDEN);
    // });

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
            chain_id: 0
        }
      });
    });

    test('should return 400 because wallet address type is wrong', async () => {

        const res = await request(app)
          .get('/v1/users')
          .query(
              {
                  chain_id : 1,
                  address: '0xaa6e16Cdc8c47e1E1E754af62a36D',
              }
          )
          .send()
          .expect(httpStatus.OK);
        
          await request(app)
            .post('/v1/users')
            .send(input)
            .expect(httpStatus.BAD_REQUEST);
    
    });

    test('should return 404 because no user was found', async () => {

        const res = await request(app)
          .get('/v1/users')
          .query(
              {
                  chain_id : 1,
                  address: newUser.address,
              }
          )
          .send()
          .expect(httpStatus.OK);
        
          await request(app)
            .post('/v1/users')
            .send(input)
            .expect(httpStatus.NOT_FOUND);
      });

  });

  describe('GET /v1/users/:userId', () => {
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
            chain_id: 0
        }
      });
    });

    // test('should return 401 error if access token is missing', async () => {
    //   await insertUsers([userOne]);

    //   await request(app).get(`/v1/users/${userOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
    // });

    // test('should return 403 error if user is trying to get another user', async () => {
    //   await insertUsers([userOne, userTwo]);

    //   await request(app)
    //     .get(`/v1/users/${userTwo._id}`)
    //     .set('Authorization', `Bearer ${userOneAccessToken}`)
    //     .send()
    //     .expect(httpStatus.FORBIDDEN);
    // });

    // test('should return 200 and the user object if admin is trying to get another user', async () => {
    //   await insertUsers([userOne, admin]);

    //   await request(app)
    //     .get(`/v1/users/${userOne._id}`)
    //     .set('Authorization', `Bearer ${adminAccessToken}`)
    //     .send()
    //     .expect(httpStatus.OK);
    // });

    // test('should return 400 error if userId is not a valid mongo id', async () => {
    //   await insertUsers([admin]);

    //   await request(app)
    //     .get('/v1/users/invalidId')
    //     .set('Authorization', `Bearer ${adminAccessToken}`)
    //     .send()
    //     .expect(httpStatus.BAD_REQUEST);
    // });

    // test('should return 404 error if user is not found', async () => {
    //   await insertUsers([admin]);

    //   await request(app)
    //     .get(`/v1/users/${userOne._id}`)
    //     .set('Authorization', `Bearer ${adminAccessToken}`)
    //     .send()
    //     .expect(httpStatus.NOT_FOUND);
    // });
  });

//   describe('PATCH /v1/users/:userId', () => {
//     test('should return 200 and successfully update user if data is ok', async () => {
//       await insertUsers([userOne]);
//       const updateBody = {
//         name: faker.name.findName(),
//         email: faker.internet.email().toLowerCase(),
//         password: 'newPassword1',
//       };

//       const res = await request(app)
//         .patch(`/v1/users/${userOne._id}`)
//         .set('Authorization', `Bearer ${userOneAccessToken}`)
//         .send(updateBody)
//         .expect(httpStatus.OK);

//       expect(res.body).not.toHaveProperty('password');
//       expect(res.body).toEqual({
//         id: userOne._id.toHexString(),
//         name: updateBody.name,
//         email: updateBody.email,
//         role: 'user',
//         isEmailVerified: false,
//       });

//       const dbUser = await User.findById(userOne._id);
//       expect(dbUser).toBeDefined();
//       expect(dbUser.password).not.toBe(updateBody.password);
//       expect(dbUser).toMatchObject({ name: updateBody.name, email: updateBody.email, role: 'user' });
//     });

//     // test('should return 401 error if access token is missing', async () => {
//     //   await insertUsers([userOne]);
//     //   const updateBody = { name: faker.name.findName() };

//     //   await request(app).patch(`/v1/users/${userOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
//     // });

//     // test('should return 403 if user is updating another user', async () => {
//     //   await insertUsers([userOne, userTwo]);
//     //   const updateBody = { name: faker.name.findName() };

//     //   await request(app)
//     //     .patch(`/v1/users/${userTwo._id}`)
//     //     .set('Authorization', `Bearer ${userOneAccessToken}`)
//     //     .send(updateBody)
//     //     .expect(httpStatus.FORBIDDEN);
//     // });

//     // test('should return 200 and successfully update user if admin is updating another user', async () => {
//     //   await insertUsers([userOne, admin]);
//     //   const updateBody = { name: faker.name.findName() };

//     //   await request(app)
//     //     .patch(`/v1/users/${userOne._id}`)
//     //     .set('Authorization', `Bearer ${adminAccessToken}`)
//     //     .send(updateBody)
//     //     .expect(httpStatus.OK);
//     // });

//     // test('should return 404 if admin is updating another user that is not found', async () => {
//     //   await insertUsers([admin]);
//     //   const updateBody = { name: faker.name.findName() };

//     //   await request(app)
//     //     .patch(`/v1/users/${userOne._id}`)
//     //     .set('Authorization', `Bearer ${adminAccessToken}`)
//     //     .send(updateBody)
//     //     .expect(httpStatus.NOT_FOUND);
//     // });

//     // test('should return 400 error if userId is not a valid mongo id', async () => {
//     //   await insertUsers([admin]);
//     //   const updateBody = { name: faker.name.findName() };

//     //   await request(app)
//     //     .patch(`/v1/users/invalidId`)
//     //     .set('Authorization', `Bearer ${adminAccessToken}`)
//     //     .send(updateBody)
//     //     .expect(httpStatus.BAD_REQUEST);
//     // });

//     // test('should return 400 if email is invalid', async () => {
//     //   await insertUsers([userOne]);
//     //   const updateBody = { email: 'invalidEmail' };

//     //   await request(app)
//     //     .patch(`/v1/users/${userOne._id}`)
//     //     .set('Authorization', `Bearer ${userOneAccessToken}`)
//     //     .send(updateBody)
//     //     .expect(httpStatus.BAD_REQUEST);
//     // });

//     // test('should return 400 if email is already taken', async () => {
//     //   await insertUsers([userOne, userTwo]);
//     //   const updateBody = { email: userTwo.email };

//     //   await request(app)
//     //     .patch(`/v1/users/${userOne._id}`)
//     //     .set('Authorization', `Bearer ${userOneAccessToken}`)
//     //     .send(updateBody)
//     //     .expect(httpStatus.BAD_REQUEST);
//     // });

//     // test('should not return 400 if email is my email', async () => {
//     //   await insertUsers([userOne]);
//     //   const updateBody = { email: userOne.email };

//     //   await request(app)
//     //     .patch(`/v1/users/${userOne._id}`)
//     //     .set('Authorization', `Bearer ${userOneAccessToken}`)
//     //     .send(updateBody)
//     //     .expect(httpStatus.OK);
//     // });

//     // test('should return 400 if password length is less than 8 characters', async () => {
//     //   await insertUsers([userOne]);
//     //   const updateBody = { password: 'passwo1' };

//     //   await request(app)
//     //     .patch(`/v1/users/${userOne._id}`)
//     //     .set('Authorization', `Bearer ${userOneAccessToken}`)
//     //     .send(updateBody)
//     //     .expect(httpStatus.BAD_REQUEST);
//     // });

//     // test('should return 400 if password does not contain both letters and numbers', async () => {
//     //   await insertUsers([userOne]);
//     //   const updateBody = { password: 'password' };

//     //   await request(app)
//     //     .patch(`/v1/users/${userOne._id}`)
//     //     .set('Authorization', `Bearer ${userOneAccessToken}`)
//     //     .send(updateBody)
//     //     .expect(httpStatus.BAD_REQUEST);

//     //   updateBody.password = '11111111';

//     //   await request(app)
//     //     .patch(`/v1/users/${userOne._id}`)
//     //     .set('Authorization', `Bearer ${userOneAccessToken}`)
//     //     .send(updateBody)
//     //     .expect(httpStatus.BAD_REQUEST);
//     // });
//   });


});
