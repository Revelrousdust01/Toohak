/**
 * Stores all unique interfaces that maybe used throughout the project
 */

export interface question{
    questionId: number,
    name: string,
    answers: string[],
    correctAnswer: string
}

export interface quiz {
    quizId: number,
    description: string,
    name: string,
    timeCreated: number,
    timeLastEdited: number,
    question: question[]
}

export interface user{
    userId: number,
    email: string,
    nameFirst: string,
    nameLast: string,
    oldPasswords: string[],
    numFailedPasswordsSinceLastLogin: number,
    numSuccessfulLogins: number,
    ownedQuizzes: number[],
    password: string
    sessions: { token: string }[];
}

export interface DataStore {
    users: user[],
    quizzes: quiz[]
}

export interface ErrorObject {
    error: string;
}
