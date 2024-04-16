import {
  v1RequestAdminAuthLogout, v2RequestAdminAuthLogout, v1RequestAdminAuthRegister, v1RequestAdminAuthLogin,
  v1RequestAdminUserDetails, v2RequestAdminUserDetails, v1RequestAdminUserDetailsUpdate, v2RequestAdminUserDetailsUpdate, 
  requestAdminUserPasswordUpdate, requestClear
} from './requests';
import { ErrorObject } from './interfaces';
import HTTPError from 'http-errors';

// Clear before each test
beforeEach(() => {
  requestClear();
});

afterAll(() => {
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
    v1RequestAdminAuthRegister(email, password, firstName, lastName);
    expect(v1RequestAdminAuthLogin(email, password)).toStrictEqual({ token: expect.any(String) });
  });

  test('Email does not exist', () => {
    v1RequestAdminAuthRegister(email, password, firstName, lastName);
    expect(() => v1RequestAdminAuthLogin(email.concat('.wrong'), password)).toThrow(HTTPError[400]);
  });

  test('Invalid Password', () => {
    v1RequestAdminAuthRegister(email, password, firstName, lastName);
    expect(() => v1RequestAdminAuthLogin(email, password.concat('.wrong'))).toThrow(HTTPError[400]);
  });
});

// adminAuthLogout
describe('V1 - adminAuthLogout', () => {
  const firstName = 'Christian';
  const lastName = 'Politis';
  const email = 'cpolitis@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';

  test('Valid Details', () => {
    const register = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    expect(v1RequestAdminAuthLogout(register.token as string)).toStrictEqual({ });
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    v1RequestAdminAuthRegister(email, password, firstName, lastName);
    expect(() => v1RequestAdminAuthLogout(invalidToken)).toThrow(HTTPError[401]);
  });
});

describe('V2 - adminAuthLogout', () => {
  const firstName = 'Christian';
  const lastName = 'Politis';
  const email = 'cpolitis@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';

  test('Valid Details', () => {
    const register = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    expect(v2RequestAdminAuthLogout(register.token as string)).toStrictEqual({ });
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid Token: '$invalidToken", ({ invalidToken }) => {
    v1RequestAdminAuthRegister(email, password, firstName, lastName);
    expect(() => v2RequestAdminAuthLogout(invalidToken)).toThrow(HTTPError[401]);
  });
});

// adminAuthRegister
describe('adminAuthRegister', () => {
  const firstName = 'Christian';
  const lastName = 'Politis';
  const email = 'cpolitis@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';

  test('Valid Details', () => {
    expect(v1RequestAdminAuthRegister(email, password, firstName, lastName)).toStrictEqual({ token: expect.any(String) });
  });

  test('Email address is used by another user', () => {
    v1RequestAdminAuthRegister(email, password, firstName, lastName);
    expect(() => v1RequestAdminAuthRegister(email, password, firstName, lastName)).toThrow(HTTPError[400]);
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
    expect(() => v1RequestAdminAuthRegister(badEmail, password, firstName, lastName)).toThrow(HTTPError[400]);
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
    expect(() => v1RequestAdminAuthRegister(email, password, firstName.concat(character), lastName)).toThrow(HTTPError[400]);
  });

  test.each([
    { badFirstName: 'a' },
    { badFirstName: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' }
  ])("NameFirst is less than 2 characters or more than 20 characers: '$badFirstName'", ({ badFirstName }) => {
    expect(() => v1RequestAdminAuthRegister(email, password, badFirstName, lastName)).toThrow(HTTPError[400]);
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
    expect(() => v1RequestAdminAuthRegister(email, password, firstName, lastName.concat(character))).toThrow(HTTPError[400]);
  });

  test.each([
    { badLastName: 'a' },
    { badLastName: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' }
  ])("NameLast is less than 2 characters or more than 20 characers: '$badLastName'", ({ badLastName }) => {
    expect(() => v1RequestAdminAuthRegister(email, password, firstName, badLastName)).toThrow(HTTPError[400]);
  });

  test.each([
    { badPassword: 'A1' },
    { badPassword: 'A12' },
    { badPassword: 'A123' },
    { badPassword: 'A1234' },
    { badPassword: 'A12345' },
    { badPassword: 'A123456' }
  ])("Password is less than 8 characters: '$badPassword'", ({ badPassword }) => {
    expect(() => v1RequestAdminAuthRegister(email, badPassword, firstName, lastName)).toThrow(HTTPError[400]);
  });

  test.each([
    { badPassword: 'AAAAAAAAAAAAAAAAAAAA' },
    { badPassword: '11111111111111111111' },
  ])("Password does not contain at least one number and at least one letter: '$badPassword'", ({ badPassword }) => {
    expect(() => v1RequestAdminAuthRegister(email, badPassword, firstName, lastName)).toThrow(HTTPError[400]);
  });
});

// adminUserDetails
describe('V1 - adminUserDetails', () => {
  const firstName = 'Christian';
  const lastName = 'Politis';
  const email = 'cpolitis@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';

  test('Valid Details', () => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    expect(v1RequestAdminUserDetails(user.token as string)).toMatchObject({
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
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid or Empty Token: '$invalidToken", ({ invalidToken }) => {
    v1RequestAdminAuthRegister(email, password, firstName, lastName);
    expect(() => v1RequestAdminUserDetails(invalidToken)).toThrow(HTTPError[401]);
  });
});

describe('V2 - adminUserDetails', () => {
  const firstName = 'Christian';
  const lastName = 'Politis';
  const email = 'cpolitis@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';

  test('Valid Details', () => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    expect(v2RequestAdminUserDetails(user.token as string)).toMatchObject({
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
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid or Empty Token: '$invalidToken", ({ invalidToken }) => {
    v1RequestAdminAuthRegister(email, password, firstName, lastName);
    expect(() => v2RequestAdminUserDetails(invalidToken)).toThrow(HTTPError[401]);
  });
});

// adminUserDetailsUpdate
describe('V1 - adminUserDetailsUpdate', () => {
  const firstName = 'Samuel';
  const lastName = 'Huang';
  const email = 'shuang@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';
  
  test('Valid Details', () => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    expect(v1RequestAdminUserDetailsUpdate(user.token as string,
      'shuangupdated@student.unsw.edu.au', 'UpdateSamuel', 'UpdateHuang')).toStrictEqual({ });
  });
  
  test('Email is currently used by another user', () => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    v1RequestAdminAuthRegister('cpolitis@student.unsw.edu.au', 'a1b2c3d4e5f6',
      'Christian', 'Politis');
    expect(v1RequestAdminUserDetailsUpdate(user.token as string,
      'cpolitis@student.unsw.edu.au', firstName, lastName)).toThrow(HTTPError[400]);
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
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    expect(() => v1RequestAdminUserDetailsUpdate(user.token as string, 
      badEmail, firstName, lastName)).toThrow(HTTPError[400]);
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
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    expect(() => v1RequestAdminUserDetailsUpdate(user.token as string, email,
      firstName.concat(character), lastName)).toThrow(HTTPError[400]);
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
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    expect(() => v1RequestAdminUserDetailsUpdate(user.token as string, email,
      firstName, lastName.concat(character))).toThrow(HTTPError[400]);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid or Empty Token: '$invalidToken", ({ invalidToken }) => {
    v1RequestAdminAuthRegister(email, password, firstName, lastName);
    expect(() => v1RequestAdminUserDetailsUpdate(invalidToken, email, firstName, lastName)).toThrow(HTTPError[401]);
  });
});

describe('V2 - adminUserDetailsUpdate', () => {
  const firstName = 'Samuel';
  const lastName = 'Huang';
  const email = 'shuang@student.unsw.edu.au';
  const password = 'a1b2c3d4e5f6';
  
  test('Valid Details', () => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    expect(v2RequestAdminUserDetailsUpdate(user.token as string,
      'shuangupdated@student.unsw.edu.au', 'UpdateSamuel', 'UpdateHuang')).toStrictEqual({ });
  });
  
  test('Email is currently used by another user', () => {
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    v1RequestAdminAuthRegister('cpolitis@student.unsw.edu.au', 'a1b2c3d4e5f6',
      'Christian', 'Politis');
    expect(v2RequestAdminUserDetailsUpdate(user.token as string,
      'cpolitis@student.unsw.edu.au', firstName, lastName)).toThrow(HTTPError[400]);
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
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    expect(() => v2RequestAdminUserDetailsUpdate(user.token as string, 
      badEmail, firstName, lastName)).toThrow(HTTPError[400]);
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
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    expect(() => v2RequestAdminUserDetailsUpdate(user.token as string, email,
      firstName.concat(character), lastName)).toThrow(HTTPError[400]);
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
    const user = v1RequestAdminAuthRegister(email, password, firstName, lastName);
    expect(() => v2RequestAdminUserDetailsUpdate(user.token as string, email,
      firstName, lastName.concat(character))).toThrow(HTTPError[400]);
  });

  test.each([
    { invalidToken: '' },
    { invalidToken: '123' },
    { invalidToken: 'b77d409a-10cd-4a47-8e94-b0cd0ab50aa1' },
    { invalidToken: 'abc' },
  ])("Invalid or Empty Token: '$invalidToken", ({ invalidToken }) => {
    v1RequestAdminAuthRegister(email, password, firstName, lastName);
    expect(() => v2RequestAdminUserDetailsUpdate(invalidToken, email, firstName, lastName)).toThrow(HTTPError[401]);
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
    const user = v1RequestAdminAuthRegister(email, oldPassword, firstName, lastName);
    const response = requestAdminUserPasswordUpdate(user.token as string,
      oldPassword, newPassword);
    expect(response.jsonBody).toStrictEqual({ });
    expect(response.statusCode).toStrictEqual(200);
  });

  test('Old Password is not the correct old password', () => {
    const user = v1RequestAdminAuthRegister(email, oldPassword, firstName, lastName);
    const response = requestAdminUserPasswordUpdate(user.token as string,
      'thisisthewrongpassword', newPassword);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
  });

  test('Old Password and New Password match exactly', () => {
    const user = v1RequestAdminAuthRegister(email, oldPassword, firstName, lastName);
    const response = requestAdminUserPasswordUpdate(user.token as string,
      oldPassword, oldPassword);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
  });

  test('New Password has already been used by this user', () => {
    const user = v1RequestAdminAuthRegister(email, oldPassword, firstName, lastName);
    requestAdminUserPasswordUpdate(user.token as string,
      oldPassword, newPassword);
    const response = requestAdminUserPasswordUpdate(user.token as string,
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
    const user = v1RequestAdminAuthRegister(email, oldPassword, firstName, lastName);
    const response = requestAdminUserPasswordUpdate(user.token as string,
      oldPassword, badPassword);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(400);
  });

  test.each([
    { badPassword: 'AAAAAAAAAAAAAAAAAAAA' },
    { badPassword: '11111111111111111111' },
  ])("Password does not contain at least one number and at least one letter: '$badPassword'", ({ badPassword }) => {
    const user = v1RequestAdminAuthRegister(email, oldPassword, firstName, lastName);
    const response = requestAdminUserPasswordUpdate(user.token as string,
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
    v1RequestAdminAuthRegister(email, oldPassword, firstName, lastName);
    const response = requestAdminUserPasswordUpdate(invalidToken, oldPassword, newPassword);
    expect(response.jsonBody).toStrictEqual(ERROR);
    expect(response.statusCode).toStrictEqual(401);
  });
});
