import { adminAuthLogin, adminUserDetails, adminUserDetailsUpdate, adminUserPasswordUpdate } from './auth.js';
import { requestAdminAuthRegister } from './requests'
import { ErrorObject } from './interfaces.js'
import { clear } from './other.js';

// Clear before each test
beforeEach(() => {
  clear();
});

const ERROR: ErrorObject = { error: expect.any(String) };

// adminAuthLogin
describe('adminAuthLogin', () => {
  const firstName = 'Christian';
  const lastName = 'Politis';
  const email = 'cpolitis@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';

  test('Valid Details', () => {
    requestAdminAuthRegister(email, password, firstName, lastName);
    expect(adminAuthLogin(email, password))
      .toStrictEqual({ authUserId: expect.any(Number) });
  });

  test('Email does not exist', () => {
    requestAdminAuthRegister(email, password, firstName, lastName);
    expect(adminAuthLogin(email.concat('.wrong'), password))
      .toStrictEqual(ERROR);
  });

  test('Invalid Password', () => {
    requestAdminAuthRegister(email, password, firstName, lastName);
    expect(adminAuthLogin(email, password.concat('.wrong')))
      .toStrictEqual(ERROR);
  });
});

// adminAuthRegister
describe('adminAuthRegister', () => {
  const firstName = 'Christian';
  const lastName = 'Politis';
  const email = 'cpolitis@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';

  test('Valid Details', () => {
    expect(requestAdminAuthRegister(email, password, firstName, lastName))
      .toStrictEqual({ token: expect.any(Number) });
  });

  test('Email address is used by another user', () => {
    requestAdminAuthRegister(email, password, firstName, lastName);
    expect(requestAdminAuthRegister(email, password, firstName, lastName))
      .toStrictEqual(ERROR);
  });

  test.each([
    { badEmail: 'cpolitis@@student.unsw.edu.au' },
    { badEmail: 'cpolitis@student.unsw.edu..au' },
    { badEmail: 'cpolitis#student.unsw.edu.au' },
    { badEmail: 'cpolitis@student.unsw.edu.au.' },
    { badEmail: '@student.unsw.edu.au' },
    { badEmail: '[cpolitis@student.unsw.edu.au]' },
    { badEmail: 'cpolitis' }
  ])("Email does not satisfy validator: '$badEmail'", ({ badEmail }) => {
    expect(requestAdminAuthRegister(badEmail, password, firstName, lastName))
      .toStrictEqual(ERROR);
  });

  test.each([
    { character: '`' },
    { character: '~' },
    { character: '+' },
    { character: '_' },
    { character: '=' },
    { character: '*' },
    { character: '/' }
  ])("NameFirst contains unwanted Characters: '$character'", ({ character }) => {
    expect(requestAdminAuthRegister(email, password, firstName.concat(character), lastName))
      .toStrictEqual(ERROR);
  });

  test.each([
    { badFirstName: 'a' },
    { badFirstName: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' }
  ])("NameFirst is less than 2 characters or more than 20 characers: '$badFirstName'", ({ badFirstName }) => {
    expect(requestAdminAuthRegister(email, password, badFirstName, lastName))
      .toStrictEqual(ERROR);
  });

  test.each([
    { character: '`' },
    { character: '~' },
    { character: '+' },
    { character: '_' },
    { character: '=' },
    { character: '*' },
    { character: '/' }
  ])("NameLast contains unwanted Characters: '$character'", ({ character }) => {
    expect(requestAdminAuthRegister(email, password, firstName, lastName.concat(character)))
      .toStrictEqual(ERROR);
  });

  test.each([
    { badLastName: 'a' },
    { badLastName: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' }
  ])("NameLast is less than 2 characters or more than 20 characers: '$badLastName'", ({ badLastName }) => {
    expect(requestAdminAuthRegister(email, password, firstName, badLastName))
      .toStrictEqual(ERROR);
  });

  test.each([
    { badPassword: 'A1' },
    { badPassword: 'A12' },
    { badPassword: 'A123' },
    { badPassword: 'A1234' },
    { badPassword: 'A12345' },
    { badPassword: 'A123456' }
  ])("Password is less than 8 characters: '$badPassword'", ({ badPassword }) => {
    expect(requestAdminAuthRegister(email, badPassword, firstName, lastName))
      .toStrictEqual(ERROR);
  });

  test.each([
    { badPassword: 'AAAAAAAAAAAAAAAAAAAA' },
    { badPassword: '11111111111111111111' },
  ])("Password does not contain at least one number and at least one letter: '$badPassword'", ({ badPassword }) => {
    expect(requestAdminAuthRegister(email, badPassword, firstName, lastName))
      .toStrictEqual(ERROR);
  });
});

// adminUserDetails
describe('adminUserDetails', () => {
  const firstName = 'Christian';
  const lastName = 'Politis';
  const email = 'cpolitis@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';

  test('Valid Details', () => {
    const user = requestAdminAuthRegister(email, password, firstName, lastName);
    expect(adminUserDetails(user.jsonBody?.token))
      .toStrictEqual({
        user: {
          userId: expect.any(Number),
          name: expect.any(String),
          email: expect.any(String),
          numSuccessfulLogins: expect.any(Number),
          numFailedPasswordsSinceLastLogin: expect.any(Number),
        }
      });
  });

  test.each([
    { invalidId: -1 },
    { invalidId: -999 },
    { invalidId: 0 },
  ])("AuthUserId is not a valid user: '$invalidId", ({ invalidId }) => {
    expect(adminUserDetails(invalidId)).toStrictEqual(ERROR);
  });
});

// adminUserDetailsUpdate
describe('adminUserDetailsUpdate', () => {
  const firstName = 'Samuel';
  const lastName = 'Huang';
  const email = 'shuang@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';

  test('Valid Details', () => {
    const UserId = requestAdminAuthRegister(email, password, firstName, lastName);
    expect(adminUserDetailsUpdate(
      UserId.jsonBody?.token,
      'shuangupdated@student.unsw.edu.au',
      'UpdateSamuel',
      'UpdateHuang'
    )).toStrictEqual({ });

    expect(adminUserDetails(UserId.jsonBody?.token)).toStrictEqual({
      user: {
        userId: UserId.jsonBody?.token,
        name: 'UpdateSamuel UpdateHuang',
        email: 'shuangupdated@student.unsw.edu.au',
        numSuccessfulLogins: expect.any(Number),
        numFailedPasswordsSinceLastLogin: expect.any(Number)
      }
    });
  });

  test('AuthUserId is not a valid User', () => {
    const UserId = requestAdminAuthRegister(email, password, firstName, lastName);
    const invalidUserId = UserId.jsonBody?.token + 1;
    expect(adminUserDetailsUpdate(
      invalidUserId.authUserId,
      'shuangupdated@student.unsw.edu.au',
      'UpdateSamuel',
      'UpdateSamuel'
    )).toStrictEqual(ERROR);
  });

  test('Email is currently used by another user', () => {
    const UserId = requestAdminAuthRegister(email, password, firstName, lastName);
    requestAdminAuthRegister('cpolitis@student.unsw.edu.au', 'a1b2c3d4e5f6', 'Christian', 'Politis');
    expect(adminUserDetailsUpdate(
      UserId.jsonBody?.token,
      'cpolitis@student.unsw.edu.au',
      'UpdateSamuel',
      'UpdateSamuel'
    )).toStrictEqual(ERROR);
  });

  test.each([
    { badEmail: 'shuang@@student.unsw.edu.au' },
    { badEmail: 'shuang@student.unsw.edu..au' },
    { badEmail: 'shuang#student.unsw.edu.au' },
    { badEmail: 'shuang@student.unsw.edu.au.' },
    { badEmail: '@student.unsw.edu.au' },
    { badEmail: '[shuang@student.unsw.edu.au]' },
    { badEmail: 'shuang' }
  ])("Email does not satisfy validator: '$badEmail'", ({ badEmail }) => {
    const UserId = requestAdminAuthRegister(email, password, firstName, lastName);
    expect(adminUserDetailsUpdate(UserId.jsonBody?.token, badEmail, firstName, lastName))
      .toStrictEqual(ERROR);
  });

  test.each([
    { character: '`' },
    { character: '~' },
    { character: '+' },
    { character: '_' },
    { character: '=' },
    { character: '*' },
    { character: '/' }
  ])("NameFirst contains unwanted Characters: '$character'", ({ character }) => {
    const UserId = requestAdminAuthRegister(email, password, firstName, lastName);
    expect(adminUserDetailsUpdate(UserId.jsonBody?.token, email, firstName.concat(character), lastName))
      .toStrictEqual(ERROR);
  });

  test.each([
    { character: '`' },
    { character: '~' },
    { character: '+' },
    { character: '_' },
    { character: '=' },
    { character: '*' },
    { character: '/' }
  ])("NameLast contains unwanted Characters: '$character'", ({ character }) => {
    const UserId = requestAdminAuthRegister(email, password, firstName, lastName);
    expect(adminUserDetailsUpdate(UserId.jsonBody?.token, email, firstName, lastName.concat(character)))
      .toStrictEqual(ERROR);
  });
});

// adminUserPasswordUpdate
describe('adminUserPasswordUpdate', () => {
  const firstName = 'Samuel';
  const lastName = 'Huang';
  const email = 'shuang@student.unsw.edu.au';
  const oldPassword = 'a1b2c3d4qwerty';
  const newPassword = 'newa1b2c3d4qwerty';

  test('Valid Details', () => {
    const UserId = requestAdminAuthRegister(email, oldPassword, firstName, lastName);
    expect(adminUserPasswordUpdate(UserId.jsonBody?.token, oldPassword, newPassword))
      .toStrictEqual({ });
  });

  test.each([
    { invalidId: -1 },
    { invalidId: -999 },
    { invalidId: 0 },
  ])("AuthUserId is not a valid user: '$invalidId", ({ invalidId }) => {
    requestAdminAuthRegister(email, oldPassword, firstName, lastName);
    expect(adminUserPasswordUpdate(invalidId, oldPassword, newPassword))
      .toStrictEqual(ERROR);
  });

  test('Old Password is not the correct old password', () => {
    const UserId = requestAdminAuthRegister(email, oldPassword, firstName, lastName);
    expect(adminUserPasswordUpdate(UserId.jsonBody?.token, 'thisisthewrongpassword', newPassword))
      .toStrictEqual(ERROR);
  });

  test('Old Password and New Password match exactly', () => {
    const UserId = requestAdminAuthRegister(email, oldPassword, firstName, lastName);
    expect(adminUserPasswordUpdate(UserId.jsonBody?.token, oldPassword, oldPassword))
      .toStrictEqual(ERROR);
  });

  test('New Password has already been used by this user', () => {
    const UserId = requestAdminAuthRegister(email, oldPassword, firstName, lastName);
    adminUserPasswordUpdate(UserId.jsonBody?.token, oldPassword, newPassword);
    expect(adminUserPasswordUpdate(UserId.jsonBody?.token, newPassword, oldPassword))
      .toStrictEqual(ERROR);
  });

  test.each([
    { badPassword: 'A1' },
    { badPassword: 'A12' },
    { badPassword: 'A123' },
    { badPassword: 'A1234' },
    { badPassword: 'A12345' },
    { badPassword: 'A123456' }
  ])("Password is less than 8 characters: '$badPassword'", ({ badPassword }) => {
    const UserId = requestAdminAuthRegister(email, oldPassword, firstName, lastName);
    expect(adminUserPasswordUpdate(UserId.jsonBody?.token, newPassword, badPassword))
      .toStrictEqual(ERROR);
  });

  test.each([
    { badPassword: 'AAAAAAAAAAAAAAAAAAAA' },
    { badPassword: '11111111111111111111' },
  ])("Password does not contain at least one number and at least one letter: '$badPassword'", ({ badPassword }) => {
    const UserId = requestAdminAuthRegister(email, oldPassword, firstName, lastName);
    expect(adminUserPasswordUpdate(UserId.jsonBody?.token, newPassword, badPassword))
      .toStrictEqual(ERROR);
  });
});
