import { adminAuthLogin, adminAuthRegister, adminUserDetails } from './auth.js';
import { clear } from './other.js';

// Clear before each test
beforeEach(() => {
    clear();
  });

const ERROR = { error: expect.any(String) };

// adminAuthLogin
describe('adminAuthLogin', () =>{
    let firstName = 'Christian'
    let lastName = 'Politis'
    let email = 'cpolitis@student.unsw.edu.au'
    let password = 'a1b2c3d4e5f6'

    test('Valid Details', () => {
        adminAuthRegister(email, password, firstName, lastName)
        expect(adminAuthLogin(email, password))
        .toStrictEqual({ authUserId: expect.any(Number) });
    });

    test('Email does not exist', () => {
        adminAuthRegister(email, password, firstName, lastName)
        expect(adminAuthLogin(email.concat(".wrong"), password))
        .toStrictEqual(ERROR);
    });

    test('Invalid Password', () => {
        adminAuthRegister(email, password, firstName, lastName)
        expect(adminAuthLogin(email, password.concat(".wrong")))
        .toStrictEqual(ERROR);
    });
})

// adminAuthRegister
describe('adminAuthRegister', () => {
    let firstName = 'Christian'
    let lastName = 'Politis'
    let email = 'cpolitis@student.unsw.edu.au'
    let password = 'a1b2c3d4e5f6'

    test('Valid Details', () =>
    {
        expect(adminAuthRegister(email, password, firstName, lastName))
            .toStrictEqual({ authUserId: expect.any(Number) });
    });

    test('Email address is used by another user', () =>
    {

        adminAuthRegister(email, password, firstName, lastName);
        expect(adminAuthRegister(email, password, firstName, lastName))
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
        expect(adminAuthRegister(badEmail, password, firstName, lastName))
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
        expect(adminAuthRegister(email, password, firstName.concat(character), lastName))
            .toStrictEqual(ERROR);
      });

    test.each([
        { badFirstName: 'a' },
        { badFirstName: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' }
        ])("NameFirst is less than 2 characters or more than 20 characers: '$badFirstName'", ({ badFirstName }) => {
        expect(adminAuthRegister(email, password, badFirstName, lastName))
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
        expect(adminAuthRegister(email, password, firstName, lastName.concat(character)))
            .toStrictEqual(ERROR);
        });

    test.each([
        { badLastName: 'a' },
        { badLastName: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' }
        ])("NameLast is less than 2 characters or more than 20 characers: '$badLastName'", ({ badLastName }) => {
        expect(adminAuthRegister(email, password, firstName, badLastName))
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
        expect(adminAuthRegister(email, badPassword, firstName, lastName))
            .toStrictEqual(ERROR);
        });

    test.each([
        { badPassword: 'AAAAAAAAAAAAAAAAAAAA' },
        { badPassword: '11111111111111111111' },
        ])("Password does not contain at least one number and at least one letter: '$badPassword'", ({ badPassword }) => {
        expect(adminAuthRegister(email, badPassword, firstName, lastName))
            .toStrictEqual(ERROR);
        });
});

// adminUserDetails
describe('adminUserDetails', () =>{
    let firstName = 'Christian'
    let lastName = 'Politis'
    let email = 'cpolitis@student.unsw.edu.au'
    let password = 'a1b2c3d4e5f6'

    test('Valid Details', () => {
        const user = adminAuthRegister(email, password, firstName, lastName);
        expect(adminUserDetails(user.authUserId))
        .toStrictEqual({ 
                        user:{
                            userId: expect.any(Number),
                            name: expect.any(String),
                            email: expect.any(String),
                            numSuccessfulLogins: expect.any(Number),
                            numFailedPasswordsSinceLastLogin: expect.any(Number),
                        }});
    });

    test.each([
        { invalidId: '-1' },
        { invalidId: 'a' },
        { invalidId: '/' },
    ])("AuthUserId is not a valid user: '$invalidId", ({ invalidId }) => {
        expect(adminUserDetails(invalidId)).toStrictEqual(ERROR);
    });
});

// adminUserDetailsUpdate
describe('adminUserDetailsUpdate', () => {
    let firstName = 'Samuel'
    let lastName = 'Huang'
    let email = 'shuang@student.unsw.edu.au'
    let password = 'a1b2c3d4e5f6'
    const UserId = adminAuthRegister(email, password, firstName, lastName)

    test('Valid Details', () => {
        expect(adminUserDetailsUpdate(
            UserId, 
            'shuangupdated@student.unsw.edu.au', 
            'UpdateSamuel', 
            'UpdateHuang'
        )).toStrictEqual({})
        
        expect(adminUserDetails(UserId)).toStrictEqual({
            user: {
                userId: UserId,
                name: 'UpdateSamuel UpdateHuang',
                email: 'shuangupdated@student.unsw.edu.au'
            }
        });
    });

    test('AuthUserId is not a valid User', () => {
        const invalidUserId = UserId + 1
        expect(adminUserDetailsUpdate(
            invalidUserId,
            'shuangupdated@student.unsw.edu.au',
            'UpdateSamuel',
            'UpdateSamuel'
        )).toStrictEqual(ERROR)
    });

    test('Email is currently used by another user', () => {
        adminAuthRegister('cpolitis@student.unsw.edu.au', 'a1b2c3d4e5f6', 'Christian', 'Politis')
        expect(adminUserDetailsUpdate(
            UserId,
            'cpolitis@student.unsw.edu.au',
            'UpdateSamuel',
            'UpdateSamuel'
        )).toStrictEqual(ERROR)
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
        expect(adminUserDetailsUpdate(UserId, badEmail, firstName, lastName))
            .toStrictEqual({ error: ERROR})
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
        expect(adminAuthRegister(UserId, email, firstName.concat(character), lastName))
            .toStrictEqual({ error: ERROR})
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
        expect(adminUserDetailsUpdate(UserId, email, firstName, lastName.concat(character)))
            .toStrictEqual({ error: ERROR})
        });
});