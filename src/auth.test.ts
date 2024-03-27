import {
  requestAdminAuthLogin, requestAdminAuthLogout, requestAdminAuthRegister,
  requestAdminUserDetails, requestAdminUserDetailsUpdate, requestAdminUserPasswordUpdate,
  requestClear
} from './requests';
import { ErrorObject } from './interfaces';

// Clear before each test
beforeEach(() => {
  requestClear();
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

// adminAuthLogout
describe('adminAuthLogout', () => {
  const firstName = 'Christian';
  const lastName = 'Politis';
  const email = 'cpolitis@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';

  test('Valid Details', () => {
    requestAdminAuthRegister(email, password, firstName, lastName);
    const responseLogin = requestAdminAuthLogin(email, password);
    const responseLogout = requestAdminAuthLogout(responseLogin.jsonBody?.token as string);
    expect(responseLogout.jsonBody).toStrictEqual({ });
    expect(responseLogout.statusCode).toStrictEqual(200);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    requestAdminAuthLogin(email, password);
    const responseLogout = requestAdminAuthLogout(invalidToken);
    expect(responseLogout.jsonBody).toStrictEqual(ERROR);
    expect(responseLogout.statusCode).toStrictEqual(401);
  });
});

// adminAuthRegister
describe('adminAuthRegister', () => {
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
    const response = requestAdminUserDetails(user.jsonBody?.token as string);
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
  ])("Invalid or Empty Token: '$invalidToken", ({ invalidToken }) => {
    requestAdminAuthRegister(email, password, firstName, lastName);
    const response = requestAdminUserDetails(invalidToken);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(401);
  });
});

// adminUserDetailsUpdate
describe('adminUserDetailsUpdate', () => {
  const firstName = 'Samuel';
  const lastName = 'Huang';
  const email = 'shuang@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';

  test('Valid Details', () => {
    const user = requestAdminAuthRegister(email, password, firstName, lastName);
    const response = requestAdminUserDetailsUpdate(user.jsonBody.token as string,
      'shuangupdated@student.unsw.edu.au', 'UpdateSamuel', 'UpdateHuang');
    expect(response.jsonBody).toStrictEqual({ });
    expect(response.statusCode).toStrictEqual(200);
  });

  test('Email is currently used by another user', () => {
    const user = requestAdminAuthRegister(email, password, firstName, lastName);
    requestAdminAuthRegister('cpolitis@student.unsw.edu.au', 'a1b2c3d4e5f6',
      'Christian', 'Politis');
    const response = requestAdminUserDetailsUpdate(user.jsonBody.token as string,
      'cpolitis@student.unsw.edu.au', firstName, lastName);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
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
    const user = requestAdminAuthRegister(email, password, firstName, lastName);
    const response = requestAdminUserDetailsUpdate(user.jsonBody.token as string,
      badEmail, firstName, lastName);
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
    const user = requestAdminAuthRegister(email, password, firstName, lastName);
    const response = requestAdminUserDetailsUpdate(user.jsonBody.token as string, email,
      firstName.concat(character), lastName);
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
    const user = requestAdminAuthRegister(email, password, firstName, lastName);
    const response = requestAdminUserDetailsUpdate(user.jsonBody.token as string, email,
      firstName, lastName.concat(character));
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid or Empty Token: '$invalidToken", ({ invalidToken }) => {
    requestAdminAuthRegister(email, password, firstName, lastName);
    requestAdminAuthLogin(email, password);
    const response = requestAdminUserDetailsUpdate(invalidToken, email, firstName, lastName);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(401);
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
    const user = requestAdminAuthRegister(email, oldPassword, firstName, lastName);
    const response = requestAdminUserPasswordUpdate(user.jsonBody.token as string,
      oldPassword, newPassword);
    expect(response.jsonBody).toStrictEqual({ });
    expect(response.statusCode).toStrictEqual(200);
  });

  test('Old Password is not the correct old password', () => {
    const user = requestAdminAuthRegister(email, oldPassword, firstName, lastName);
    const response = requestAdminUserPasswordUpdate(user.jsonBody.token as string,
      'thisisthewrongpassword', newPassword);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
  });

  test('Old Password and New Password match exactly', () => {
    const user = requestAdminAuthRegister(email, oldPassword, firstName, lastName);
    const response = requestAdminUserPasswordUpdate(user.jsonBody.token as string,
      oldPassword, oldPassword);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
  });

  test('New Password has already been used by this user', () => {
    const user = requestAdminAuthRegister(email, oldPassword, firstName, lastName);
    requestAdminUserPasswordUpdate(user.jsonBody.token as string,
      oldPassword, newPassword);
    const response = requestAdminUserPasswordUpdate(user.jsonBody.token as string,
      newPassword, oldPassword);
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
    const user = requestAdminAuthRegister(email, oldPassword, firstName, lastName);
    const response = requestAdminUserPasswordUpdate(user.jsonBody.token as string,
      oldPassword, badPassword);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
  });

  test.each([
    { badPassword: 'AAAAAAAAAAAAAAAAAAAA' },
    { badPassword: '11111111111111111111' },
  ])("Password does not contain at least one number and at least one letter: '$badPassword'", ({ badPassword }) => {
    const user = requestAdminAuthRegister(email, oldPassword, firstName, lastName);
    const response = requestAdminUserPasswordUpdate(user.jsonBody.token as string,
      newPassword, badPassword);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid or Empty Token: '$invalidToken", ({ invalidToken }) => {
    requestAdminAuthRegister(email, oldPassword, firstName, lastName);
    const response = requestAdminUserPasswordUpdate(invalidToken, oldPassword, newPassword);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(401);
  });
});
