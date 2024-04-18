/**
 * Stores all unique interfaces that maybe used throughout the project
 */

export interface Answer {
    answerId: number,
    answer: string,
    colour: string,
    correct: boolean
}

export interface AnswerBody {
    answer: string,
    correct: boolean
}

export interface createTokenReturn {
    token: string
}

export interface createQuestionReturn{
    questionId: number
}

export interface duplicateReturn {
    newQuestionId: number
}

export interface createQuizReturn {
    quizId: number
}

export interface Question {
    questionId: number,
    duration: number,
    points: number
    question: string,
    answers: Answer[],
    thumbnailUrl?: string
}

export interface QuestionBody {
    answers: AnswerBody[],
    duration: number,
    points: number
    question: string
    thumbnailUrl?: string
}

export interface Quiz {
    quizId: number,
    description: string,
    duration: number;
    name: string,
    thumbnailUrl?: string,
    timeCreated: number,
    timeLastEdited: number,
    questionCounter: number,
    questions: Question[]
}

export interface QuizArray {
    quizzes: QuizList[]
}

export interface QuizList {
    quizId: number,
    name: string
}

export interface UserSessions {
    userId: number
    sessionId: string
}

export interface ReturnUser {
    user:{
        userId: number,
        name: string,
        email: string,
        numSuccessfulLogins: number,
        numFailedPasswordsSinceLastLogin: number,
    }
}

export interface Trash {
    quizId: number,
    description: string,
    name: string,
    timeCreated: number,
    timeLastEdited: number,
    questions: Question[]
}

export interface User {
    userId: number,
    email: string,
    nameFirst: string,
    nameLast: string,
    oldPasswords: string[],
    numFailedPasswordsSinceLastLogin: number,
    numSuccessfulLogins: number,
    ownedQuizzes: number[],
    password: string
}

export interface DataStore {
    trash: Trash[],
    users: User[],
    userSessions: UserSessions[]
    quizCounter: number;
    quizzes: Quiz[]
    sessions: Session[];
}

export interface ErrorObject {
    error: string;
}

export interface Payload {
    [key: string]: unknown;
}

interface Attempt {
    playerId: number;
    playerName: string;
    answers: number[];
    points: number;
    timeTaken: number;
}

export interface QuizQuestionSession {
    questionId:number;
    question: string;
    duration: number;
    points: number;
    answers: Answer[];
    thumbnail: string;
    averageAnswerTime: number;
    percentCorrect: number;
    attempts: Attempt[];
}

export interface QuizSession {
    quizId: number;
    name: string;
    timeCreated: number;
    timeLastEdited: number;
    description: string;
    numQuestions: number;
    questions: QuizQuestionSession[];
    duration: number;
    thumbnail: string;
}

export enum State {
    LOBBY = 'LOBBY',
    QUESTION_COUNTDOWN = 'QUESTION_COUNTDOWN',
    QUESTION_OPEN = 'QUESTION_OPEN',
    QUESTION_CLOSE = 'QUESTION_CLOSE',
    ANSWER_SHOW = 'ANSWER_SHOW',
    FINAL_RESULTS = 'FINAL_RESULTS',
    END = 'END'
  }

export interface Message {
    playerId: number;
    messageBody: string;
    playerName: string;
    timeSent: number;
}

export interface Player {
    playerId: number;
    playerName: string;
    playerScore: number;
}

export interface Session {
    metadata: QuizSession;
    quizSessionId: number;
    state: State;
    autoStartNum: number;
    atQuestion: number;
    messages: Message[];
    players: Player[];
}

export enum Action {
    END = 'END',
    GO_TO_FINAL_RESULTS = 'GO_TO_FINAL_RESULTS',
    GO_TO_ANSWER = 'GO_TO_ANSWER',
    NEXT_QUESTION = 'NEXT_QUESTION',
    SKIP_COUNTDOWN = 'SKIP_COUNTDOWN'
}

export type validActionType = {
    valid: boolean;
    state: State;
};
