import { auth } from './auth.js';


describe('adminAuthRegister', () => {
    beforeAll(() => {
        clear();
        let firstName = 'Christian'
        let lastName = 'Politis'
        let email = 'cpolitis@student.unsw.edu.au'
        let password = '1234'
      });

    test('Email address is used by another user', () =>
    {
        adminAuthRegister(email, password, firstName, lastName);
        expect(adminAuthRegister(email, password, firstName, lastName))
            .toStrictEqual('Email address is already used by another user.');
    });

    test.each([
        { badEmail: 'cpolitis@@student.unsw.edu.au' },
        { badEmail: 'cpolitis@student.unsw.edu..au' },
        { badEmail: 'cpolitis@student.unsw.edu.au' },
        { badEmail: 'cpolitis@student.unsw.edu.au.' },
        { badEmail: '@student.unsw.edu.au' },
        { badEmail: '[cpolitis@student.unsw.edu.au]' },
        { badEmail: 'cpolitis' }
        ])("Email does not satisfy validator: '$badEmail'", ({ badEmail }) => {
        expect(adminAuthRegister(badEmail, password, firstName, lastName))
            .toStrictEqual('Please enter a valid email.');
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
        firstName = firstName.concat(character);
        expect(adminAuthRegister(email, password, firstName, lastName))
            .toStrictEqual('First Name contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.');
      });

    test.each([
        { badFirstName: 'a' },
        { badFirstName: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' }
        ])("NameFirst is less than 2 characters or more than 20 characers: '$badFirstName'", ({ badFirstName }) => {
        expect(adminAuthRegister(email, password, badFirstName, lastName))
            .toStrictEqual('First name must not be less than 2 characters or more than 20 characters.');
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
        lastName = lastName.concat(character);
        expect(adminAuthRegister(email, password, firstName, lastName))
            .toStrictEqual('Last Name contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.');
        });

    test.each([
        { badLastName: 'a' },
        { badLastName: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' }
        ])("NameLast is less than 2 characters or more than 20 characers: '$badLastName'", ({ badLastName }) => {
        expect(adminAuthRegister(email, password, firstName, badLastName))
            .toStrictEqual('Last name must not be less than 2 characters or more than 20 characters.');
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
            .toStrictEqual('Last Name contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes.');
        });

    test.each([
        { badPassword: 'AAAAAAAAAAAAAAAAAAAA' },
        { badPassword: '11111111111111111111' },
        ])("Password does not contain at least one number and at least one letter: '$character'", ({ badPassword }) => {
        expect(adminAuthRegister(email, badPassword, firstName, lastName))
            .toStrictEqual('Password must contain at least letter and one number.');
        });
});

