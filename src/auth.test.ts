import { adminUserDetails, adminUserDetailsUpdate, adminUserPasswordUpdate } from './auth';
import { requestAdminAuthLogin, requestAdminAuthRegister, requestAdminUserDetails } from './requests';
import { ErrorObject } from './interfaces';
import { clear } from './other';

// Clear before each test
beforeEach(() => {
  clear();
});

const ERROR: ErrorObject = { error: expect.any(String) };

// adminAuthLogin
describe.skip('adminAuthLogin', () => {
  const firstName = 'Christian';
  const lastName = 'Politis';
  const email = 'cpolitis@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';

  test('Valid Details', () => {
    requestAdminAuthRegister(email, password, firstName, lastName);
    const response = requestAdminAuthLogin(email, password);
    expect(response.jsonBody).toStrictEqual({ token: expect.any(String) });
    expect(response.statusCode).toStrictEqual(200);
  });

  test('Email does not exist', () => {
    requestAdminAuthRegister(email, password, firstName, lastName);
    const response = requestAdminAuthLogin(email.concat('.wrong'), password);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
  });

  test('Invalid Password', () => {
    requestAdminAuthRegister(email, password, firstName, lastName);
    const response = requestAdminAuthLogin(email, password.concat('.wrong'));
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
  });
});

// adminAuthRegister
describe.skip('adminAuthRegister', () => {
  const firstName = 'Christian';
  const lastName = 'Politis';
  const email = 'cpolitis@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';

  test('Valid Details', () => {
    const response = requestAdminAuthRegister(email, password, firstName, lastName);
    expect(response.jsonBody).toStrictEqual({ token: expect.any(String) });
    expect(response.statusCode).toStrictEqual(200);
  });

  test('Email address is used by another user', () => {
    requestAdminAuthRegister(email, password, firstName, lastName);
    const response = requestAdminAuthRegister(email, password, firstName, lastName);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
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
    const response = requestAdminAuthRegister(badEmail, password, firstName, lastName);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
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
    const response = requestAdminAuthRegister(email, password, firstName.concat(character), lastName);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
  });

  test.each([
    { badFirstName: 'a' },
    { badFirstName: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' }
  ])("NameFirst is less than 2 characters or more than 20 characers: '$badFirstName'", ({ badFirstName }) => {
    const response = requestAdminAuthRegister(email, password, badFirstName, lastName);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
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
    const response = requestAdminAuthRegister(email, password, firstName, lastName.concat(character));
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
  });

  test.each([
    { badLastName: 'a' },
    { badLastName: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' }
  ])("NameLast is less than 2 characters or more than 20 characers: '$badLastName'", ({ badLastName }) => {
    const response = requestAdminAuthRegister(email, password, firstName, badLastName);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
  });

  test.each([
    { badPassword: 'A1' },
    { badPassword: 'A12' },
    { badPassword: 'A123' },
    { badPassword: 'A1234' },
    { badPassword: 'A12345' },
    { badPassword: 'A123456' }
  ])("Password is less than 8 characters: '$badPassword'", ({ badPassword }) => {
    const response = requestAdminAuthRegister(email, badPassword, firstName, lastName);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
  });

  test.each([
    { badPassword: 'AAAAAAAAAAAAAAAAAAAA' },
    { badPassword: '11111111111111111111' },
  ])("Password does not contain at least one number and at least one letter: '$badPassword'", ({ badPassword }) => {
    const response = requestAdminAuthRegister(email, badPassword, firstName, lastName);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
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
    const response = requestAdminUserDetails(user.jsonBody?.token as string)
    expect(response.jsonBody).toMatchObject({ 
        user: {
          userId: expect.any(Number),
          name: expect.any(String),
          email: expect.any(String),
          numSuccessfulLogins: expect.any(Number),
          numFailedPasswordsSinceLastLogin: expect.any(Number),
        }
      });
    expect(user.statusCode).toStrictEqual(200);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("AuthUserId is not a valid user: '$invalidToken", ({ invalidToken }) => {
    expect(adminUserDetails(invalidToken)).toStrictEqual(ERROR);
  });
});

// adminUserDetailsUpdate
describe.skip('adminUserDetailsUpdate', () => {
  const firstName = 'Samuel';
  const lastName = 'Huang';
  const email = 'shuang@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';

  test('Valid Details', () => {
    const UserId = requestAdminAuthRegister(email, password, firstName, lastName);
    expect(adminUserDetailsUpdate(
      UserId.jsonBody?.token as number,
      'shuangupdated@student.unsw.edu.au',
      'UpdateSamuel',
      'UpdateHuang'
    )).toStrictEqual({ });

    expect(adminUserDetails(UserId.jsonBody?.token as string)).toStrictEqual({
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
    const invalidUserId = UserId.jsonBody?.token as number + 1;
    expect(adminUserDetailsUpdate(
      invalidUserId,
      'shuangupdated@student.unsw.edu.au',
      'UpdateSamuel',
      'UpdateSamuel'
    )).toStrictEqual(ERROR);
  });

  test('Email is currently used by another user', () => {
    const UserId = requestAdminAuthRegister(email, password, firstName, lastName);
    requestAdminAuthRegister('cpolitis@student.unsw.edu.au', 'a1b2c3d4e5f6', 'Christian', 'Politis');
    expect(adminUserDetailsUpdate(
      UserId.jsonBody?.token as number,
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
    expect(adminUserDetailsUpdate(UserId.jsonBody?.token as number, badEmail, firstName, lastName))
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
    expect(adminUserDetailsUpdate(UserId.jsonBody?.token as number, email, firstName.concat(character), lastName))
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
    expect(adminUserDetailsUpdate(UserId.jsonBody?.token as number, email, firstName, lastName.concat(character)))
      .toStrictEqual(ERROR);
  });
});

// adminUserPasswordUpdate
describe.skip('adminUserPasswordUpdate', () => {
  const firstName = 'Samuel';
  const lastName = 'Huang';
  const email = 'shuang@student.unsw.edu.au';
  const oldPassword = 'a1b2c3d4qwerty';
  const newPassword = 'newa1b2c3d4qwerty';

  test('Valid Details', () => {
    const UserId = requestAdminAuthRegister(email, oldPassword, firstName, lastName);
    expect(adminUserPasswordUpdate(UserId.jsonBody?.token as number, oldPassword, newPassword))
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
    expect(adminUserPasswordUpdate(UserId.jsonBody?.token as number, 'thisisthewrongpassword', newPassword))
      .toStrictEqual(ERROR);
  });

  test('Old Password and New Password match exactly', () => {
    const UserId = requestAdminAuthRegister(email, oldPassword, firstName, lastName);
    expect(adminUserPasswordUpdate(UserId.jsonBody?.token as number, oldPassword, oldPassword))
      .toStrictEqual(ERROR);
  });

  test('New Password has already been used by this user', () => {
    const UserId = requestAdminAuthRegister(email, oldPassword, firstName, lastName);
    adminUserPasswordUpdate(UserId.jsonBody?.token as number, oldPassword, newPassword);
    expect(adminUserPasswordUpdate(UserId.jsonBody?.token as number, newPassword, oldPassword))
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
    expect(adminUserPasswordUpdate(UserId.jsonBody?.token as number, newPassword, badPassword))
      .toStrictEqual(ERROR);
  });

  test.each([
    { badPassword: 'AAAAAAAAAAAAAAAAAAAA' },
    { badPassword: '11111111111111111111' },
  ])("Password does not contain at least one number and at least one letter: '$badPassword'", ({ badPassword }) => {
    const UserId = requestAdminAuthRegister(email, oldPassword, firstName, lastName);
    expect(adminUserPasswordUpdate(UserId.jsonBody?.token as number, newPassword, badPassword))
      .toStrictEqual(ERROR);
  });
});
