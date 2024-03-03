import { adminAuthLogin, adminAuthRegister } from './auth.js';
import { clear } from './other.js';

//Clear before each test
beforeEach(() => {
    clear();
  });

//adminAuthLogin
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
        .toStrictEqual({ error: "No account found with the provided email address."});
    });

    test('Invalid Password', () => {
        adminAuthRegister(email, password, firstName, lastName)
        expect(adminAuthLogin(email, password.concat(".wrong")))
        .toStrictEqual({ error: "Incorrect password."});
    });
})

//AdminAuthRegister
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
            .toStrictEqual({error: 'Email address is already used by another user.'});
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
            .toStrictEqual({ error: 'Please enter a valid email.'});
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
            .toStrictEqual({ error: 'First name contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.'});
      });

    test.each([
        { badFirstName: 'a' },
        { badFirstName: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' }
        ])("NameFirst is less than 2 characters or more than 20 characers: '$badFirstName'", ({ badFirstName }) => {
        expect(adminAuthRegister(email, password, badFirstName, lastName))
            .toStrictEqual({error:'First name must not be less than 2 characters or more than 20 characters.'});
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
            .toStrictEqual({ error: 'Last name contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.'});
        });

    test.each([
        { badLastName: 'a' },
        { badLastName: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' }
        ])("NameLast is less than 2 characters or more than 20 characers: '$badLastName'", ({ badLastName }) => {
        expect(adminAuthRegister(email, password, firstName, badLastName))
            .toStrictEqual({ error: 'Last name must not be less than 2 characters or more than 20 characters.'});
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
            .toStrictEqual({ error: 'Password must contain at least 8 characters.'});
        });

    test.each([
        { badPassword: 'AAAAAAAAAAAAAAAAAAAA' },
        { badPassword: '11111111111111111111' },
        ])("Password does not contain at least one number and at least one letter: '$badPassword'", ({ badPassword }) => {
        expect(adminAuthRegister(email, badPassword, firstName, lastName))
            .toStrictEqual({ error: 'Password must contain at least letter and one number.'});
        });
});

