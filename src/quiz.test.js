import { adminQuizCreate } from './quiz.js';
import { adminAuthRegister } from './auth.js';
import { clear } from './other.js';

// Clear before each test
beforeEach(() => {
    clear();
});

const ERROR = { error: expect.any(String) };

describe('Test adminQuizCreate', () => {
    test('Valid inputs', () => {
        const admin = adminAuthRegister('jeffery.zhang385@gmail.com', 'str0ngpassword', 'Jeffery', 'Zhang');
        const newQuiz = adminQuizCreate(admin.authUserId, 'New Quiz', 'This is a new quiz');
        expect(newQuiz).toHaveProperty('quizId');
        expect(newQuiz.quizId).toStrictEqual(expect.any(Number));
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
        expect(adminQuizCreate(admin.authUserId, 'aa', 'This is a new quiz')).toStrictEqual(ERROR);
        expect(adminQuizCreate(admin.authUserId, 'a'.repeat(31), 'This is a new quiz')).toStrictEqual(ERROR);
    });
    test('Name is already used', () => {
        const admin = adminAuthRegister('jeffery.zhang385@gmail.com', 'str0ngpassword', 'Jeffery', 'Zhang');
        console.log('This is where the test is');
        const newQuiz = adminQuizCreate(admin.authUserId, 'New Quiz', 'This is a new quiz');
        expect(adminQuizCreate(admin.authUserId, 'New Quiz', 'This is another new quiz')).toStrictEqual(ERROR);
    });
    test('Description is too long', () => {
        const admin = adminAuthRegister('jeffery.zhang385@gmail.com', 'str0ngpassword', 'Jeffery', 'Zhang');
        expect(adminQuizCreate(admin.authUserId, 'New Quiz', 'a'.repeat(101))).toStrictEqual(ERROR);
    });
});