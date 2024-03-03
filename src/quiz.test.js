import { adminQuizCreate } from './quiz.js';
import { clear } from './other.js';

// Clear before each test
beforeEach(() => {
    clear();
});

const ERROR = { error: expect.any(String) };

describe('Test adminQuizCreate', () => {
    test('Valid inputs', () => {
        const admin = adminAuthRegister('jeffery.zhang385@gmail.com', 'str0ngpassword', 'Jeffery', 'Zhang');
        expect(adminQuizCreate(admin.authUserId, 'New Quiz', 'This is a new quiz')).toStrictEqual(expect.any(Number));
    });
    test('Invalid AuthUserId', () => {
        expect(adminQuizCreate(-999, 'New Quiz', 'This is a new quiz')).toStrictEqual(ERROR);
    });
    test('Name contains invalid characters', () => {
        const admin = adminAuthRegister('jeffery.zhang385@gmail.com', 'str0ngpassword', 'Jeffery', 'Zhang');
        expect(adminQuizCreate(admin.authUserId, '*New-Quiz*', 'This is a new quiz')).toStrictEqual(ERROR);
    });
    test('Name is too short or too long', () => {
        const admin = adminAuthRegister('jeffery.zhang385@gmail.com', 'str0ngpassword', 'Jeffery', 'Zhang');
        expect(adminQuizCreate(admin.authUserId, 'NQ', 'This is a new quiz')).toStrictEqual(ERROR);
        expect(adminQuizCreate(admin.authUserId, 'New Quiz'.repeat(10), 'This is a new quiz')).toStrictEqual(ERROR);

    });
    test('Name is already used', () => {
        const admin = adminAuthRegister('jeffery.zhang385@gmail.com', 'str0ngpassword', 'Jeffery', 'Zhang');
        expect(adminQuizCreate(admin.authUserId, 'New Quiz', 'This is a new quiz')).toStrictEqual(expect.any(Number));
        expect(adminQuizCreate(admin.authUserId, 'New Quiz', 'This is a new quiz')).toStrictEqual(ERROR);
    });
    test('Description is too long', () => {
        const admin = adminAuthRegister('jeffery.zhang385@gmail.com', 'str0ngpassword', 'Jeffery', 'Zhang');
        expect(adminQuizCreate(admin.authUserId, 'New Quiz', 'This is a new quiz'.repeat(10))).toStrictEqual(ERROR);
    });
});