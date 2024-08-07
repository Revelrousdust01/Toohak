import {
  adminAuthLogin, adminAuthLogout, adminAuthRegister,
  adminUserDetails, adminUserDetailsUpdate, adminUserPasswordUpdate,
} from './auth';
import {
  adminQuizQuestionUpdate, adminQuizCreate, adminQuizDescriptionUpdate, adminQuizEmptyTrash,
  adminQuizList, adminQuizNameUpdate, adminQuizQuestionCreate, adminQuizQuestionDelete,
  adminQuizQuestionMove, adminQuizRemove, adminQuizTransfer, adminQuizViewTrash,
  adminQuizRestore, adminQuizQuestionDuplicate, adminQuizInfo,
  adminQuizThumbnailUpdate
} from './quiz';
import {
  adminQuizSession, adminQuizSessionUpdate, adminViewQuizSessions, adminQuizSessionStatus
} from './session';
import { clear } from './other';
import { createClient } from '@vercel/kv';
import express, { json, Request, Response } from 'express';
import { echo } from './newecho';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';
import YAML from 'yaml';
import sui from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import process from 'process';
import { adminPlayerJoin, adminPlayerSubmission, playerSendMessage, playerQuestionInformation, adminGuestPlayerStatus, adminQuestionResult, playerSessionMessages } from './player';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());
// for logging errors (print to terminal)
app.use(morgan('dev'));
// for producing the docs that define the API
const file = fs.readFileSync(path.join(process.cwd(), 'swagger.yaml'), 'utf8');
app.get('/', (req: Request, res: Response) => res.redirect('/docs'));
app.use('/docs', sui.serve, sui.setup(YAML.parse(file), { swaggerOptions: { docExpansion: config.expandDocs ? 'full' : 'list' } }));

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || '127.0.0.1';

// ====================================================================
//  ================= WORK IS DONE BELOW THIS LINE ===================
// ====================================================================

// Example get request
app.get('/echo', (req: Request, res: Response) => {
  const data = req.query.echo as string;
  return res.json(echo(data));
});

app.post('/v1/admin/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const response = adminAuthLogin(email, password);
  res.json(response);
});

app.post('/v1/admin/auth/logout', (req: Request, res: Response) => {
  const { token } = req.body;
  const response = adminAuthLogout(token);
  res.json(response);
});

app.post('/v2/admin/auth/logout', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const response = adminAuthLogout(token);
  res.json(response);
});

app.post('/v1/admin/auth/register', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  const response = adminAuthRegister(email, password, nameFirst, nameLast);
  res.json(response);
});

app.get('/v1/admin/user/details', (req: Request, res: Response) => {
  const response = adminUserDetails(req.query.token as string);
  res.json(response);
});

app.get('/v2/admin/user/details', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const response = adminUserDetails(token);
  res.json(response);
});

app.get('/v1/admin/quiz/trash', (req: Request, res: Response) => {
  const response = adminQuizViewTrash(req.query.token as string);
  res.json(response);
});

app.get('/v2/admin/quiz/trash', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const response = adminQuizViewTrash(token);
  res.json(response);
});

app.delete('/v1/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const quizIds = req.query.quizIds as string[];
  const numberQuizIds = quizIds.map(id => parseInt(id));
  const token = req.query.token as string;
  const response = adminQuizEmptyTrash(token, numberQuizIds);
  res.json(response);
});

app.delete('/v2/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const quizIds = req.query.quizIds as string[];
  const numberQuizIds = quizIds.map(id => parseInt(id));
  const token = req.headers.token as string;
  const response = adminQuizEmptyTrash(token, numberQuizIds);
  res.json(response);
});

app.get('/v1/admin/quiz/list', (req: Request, res: Response) => {
  const response = adminQuizList(req.query.token as string);
  res.json(response);
});

app.get('/v2/admin/quiz/list', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const response = adminQuizList(token);
  res.json(response);
});

app.get('/v1/admin/quiz/:quizid', (req: Request, res: Response) => {
  const response = adminQuizInfo(req.query.token as string, parseInt(req.params.quizid));
  res.json(response);
});

app.get('/v2/admin/quiz/:quizid', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  res.json(adminQuizInfo(token, parseInt(req.params.quizid)));
});

app.put('/v1/admin/quiz/:quizid/description', (req: Request, res: Response) => {
  const { token, description } = req.body;
  const response = adminQuizDescriptionUpdate(token, parseInt(req.params.quizid), description);
  res.json(response);
});

app.put('/v2/admin/quiz/:quizid/description', (req: Request, res: Response) => {
  const { description } = req.body;
  const token = req.headers.token as string;
  const response = adminQuizDescriptionUpdate(token, parseInt(req.params.quizid), description);
  res.json(response);
});

app.put('/v1/admin/quiz/:quizid/name', (req: Request, res: Response) => {
  const { token, name } = req.body;
  const response = adminQuizNameUpdate(token, parseInt(req.params.quizid), name);
  res.json(response);
});

app.put('/v2/admin/quiz/:quizid/name', (req: Request, res: Response) => {
  const { name } = req.body;
  const token = req.headers.token as string;
  const response = adminQuizNameUpdate(token, parseInt(req.params.quizid), name);
  res.json(response);
});

app.put('/v1/admin/quiz/:quizid/thumbnail', (req: Request, res: Response) => {
  const { imgUrl } = req.body;
  const token = req.headers.token as string;
  const response = adminQuizThumbnailUpdate(token, parseInt(req.params.quizid), imgUrl);
  res.json(response);
});

app.post('/v1/admin/quiz/:quizid/restore', (req: Request, res: Response) => {
  const { token } = req.body;
  const response = adminQuizRestore(token, parseInt(req.params.quizid));
  res.json(response);
});

app.post('/v2/admin/quiz/:quizid/restore', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const response = adminQuizRestore(token, parseInt(req.params.quizid));
  res.json(response);
});

app.put('/v1/admin/user/details', (req: Request, res: Response) => {
  const { token, email, nameFirst, nameLast } = req.body;
  const response = adminUserDetailsUpdate(token, email, nameFirst, nameLast);
  res.json(response);
});

app.put('/v2/admin/user/details', (req: Request, res: Response) => {
  const { email, nameFirst, nameLast } = req.body;
  const token = req.headers.token as string;
  const response = adminUserDetailsUpdate(token, email, nameFirst, nameLast);
  res.json(response);
});

app.put('/v1/admin/user/password', (req: Request, res: Response) => {
  const { token, oldPassword, newPassword } = req.body;
  const response = adminUserPasswordUpdate(token, oldPassword, newPassword);
  res.json(response);
});

app.put('/v2/admin/user/password', (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const token = req.headers.token as string;
  const response = adminUserPasswordUpdate(token, oldPassword, newPassword);
  res.json(response);
});

app.post('/v1/admin/quiz/:quizid/question', (req: Request, res: Response) => {
  const { token, questionBody } = req.body;
  const response = adminQuizQuestionCreate(token, parseInt(req.params.quizid), questionBody, 1);
  res.json(response);
});

app.post('/v2/admin/quiz/:quizid/question', (req: Request, res: Response) => {
  const { questionBody } = req.body;
  const token = req.headers.token as string;
  const response = adminQuizQuestionCreate(token, parseInt(req.params.quizid), questionBody, 2);
  res.json(response);
});

app.post('/v1/admin/quiz/:quizid/question/:questionid/duplicate', (req: Request, res: Response) => {
  const { token } = req.body;
  const response = adminQuizQuestionDuplicate(token, parseInt(req.params.quizid), parseInt(req.params.questionid));
  res.json(response);
});

app.post('/v2/admin/quiz/:quizid/question/:questionid/duplicate', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const response = adminQuizQuestionDuplicate(token, parseInt(req.params.quizid), parseInt(req.params.questionid));
  res.json(response);
});

app.put('/v1/admin/quiz/:quizid/question/:questionid/move', (req: Request, res: Response) => {
  const { token, newPosition } = req.body;
  const response = adminQuizQuestionMove(token, parseInt(req.params.quizid), parseInt(req.params.questionid), newPosition);
  res.json(response);
});

app.put('/v2/admin/quiz/:quizid/question/:questionid/move', (req: Request, res: Response) => {
  const { newPosition } = req.body;
  const token = req.headers.token as string;
  const response = adminQuizQuestionMove(token, parseInt(req.params.quizid), parseInt(req.params.questionid), newPosition);
  res.json(response);
});

app.put('/v1/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const { token, questionBody } = req.body;
  const response = adminQuizQuestionUpdate(token, parseInt(req.params.quizid), parseInt(req.params.questionid), questionBody, 1);
  res.json(response);
});

app.put('/v2/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const { questionBody } = req.body;
  const token = req.headers.token as string;
  const response = adminQuizQuestionUpdate(token, parseInt(req.params.quizid), parseInt(req.params.questionid), questionBody, 2);
  res.json(response);
});

app.delete('/v1/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const response = adminQuizQuestionDelete(req.query.token as string, parseInt(req.params.quizid), parseInt(req.params.questionid));
  res.json(response);
});

app.delete('/v2/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const response = adminQuizQuestionDelete(token, parseInt(req.params.quizid), parseInt(req.params.questionid));
  res.json(response);
});

app.post('/v1/admin/quiz/:quizid/transfer', (req: Request, res: Response) => {
  const { token, userEmail } = req.body;
  const response = adminQuizTransfer(token, parseInt(req.params.quizid), userEmail, 1);
  res.json(response);
});

app.post('/v2/admin/quiz/:quizid/transfer', (req: Request, res: Response) => {
  const { userEmail } = req.body;
  const token = req.headers.token as string;
  const response = adminQuizTransfer(token, parseInt(req.params.quizid), userEmail, 2);
  res.json(response);
});

app.delete('/v1/admin/quiz/:quizid', (req: Request, res: Response) => {
  const response = adminQuizRemove(req.query.token as string, parseInt(req.params.quizid), 1);
  res.json(response);
});

app.delete('/v2/admin/quiz/:quizid', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const response = adminQuizRemove(token, parseInt(req.params.quizid), 2);
  res.json(response);
});

app.post('/v1/admin/quiz/:quizid/session/start', (req: Request, res: Response) => {
  const { autoStartNum } = req.body;
  const token = req.headers.token as string;
  const response = adminQuizSession(token, parseInt(req.params.quizid), autoStartNum);
  res.json(response);
});

app.put('/v1/admin/quiz/:quizid/session/:sessionid', (req: Request, res: Response) => {
  const { action } = req.body;
  const token = req.headers.token as string;
  const response = adminQuizSessionUpdate(token, parseInt(req.params.quizid), parseInt(req.params.sessionid), action);
  res.json(response);
});

app.post('/v1/admin/quiz', (req: Request, res: Response) => {
  const { token, name, description } = req.body;
  const response = adminQuizCreate(token, name, description);
  res.json(response);
});

app.post('/v2/admin/quiz', (req: Request, res: Response) => {
  const { name, description } = req.body;
  const token = req.headers.token as string;
  const response = adminQuizCreate(token, name, description);
  res.json(response);
});

app.get('/v1/admin/quiz/:quizid/session/:sessionid', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const response = adminQuizSessionStatus(token, parseInt(req.params.quizid), parseInt(req.params.sessionid));

  res.json(response);
});

app.get('/v1/player/:playerid', (req: Request, res: Response) => {
  const response = adminGuestPlayerStatus(parseInt(req.params.playerid));
  console.log(response);

  res.json(response);
});

app.delete('/v1/clear', (req: Request, res: Response) => {
  const response = clear();
  res.json(response);
});

app.post('/v1/player/join', (req: Request, res: Response) => {
  const { sessionId, name } = req.body;
  const response = adminPlayerJoin(sessionId, name);
  res.json(response);
});

app.get('/v1/admin/quiz/:quizid/sessions', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const response = adminViewQuizSessions(token, parseInt(req.params.quizid));
  res.json(response);
});

app.put('/v1/player/:playerid/question/:questionposition/answer', (req: Request, res: Response) => {
  const { answerIds } = req.body;
  const response = adminPlayerSubmission(parseInt(req.params.playerid), parseInt(req.params.questionposition), answerIds.map((id: string) => parseInt(id)));
  res.json(response);
});

app.get('/v1/player/:playerid/question/:questionposition/results', (req: Request, res: Response) => {
  const response = adminQuestionResult(parseInt(req.params.playerid), parseInt(req.params.questionposition));
  res.json(response);
});

app.post('/v1/player/:playerid/chat', (req: Request, res: Response) => {
  const { messageBody } = req.body;
  const response = playerSendMessage(parseInt(req.params.playerid), messageBody);
  res.json(response);
});

app.get('/v1/player/:playerid/question/:questionposition', (req: Request, res: Response) => {
  const response = playerQuestionInformation(parseInt(req.params.playerid), parseInt(req.params.questionposition));
  res.json(response);
});

app.get('/v1/player/:playerid/chat', (req: Request, res: Response) => {
  const response = playerSessionMessages(parseInt(req.params.playerid));
  res.json(response);
});

// When using vercel
app.get('/data', async (req: Request, res: Response) => {
  const data = await database.hgetall("data:names");
  res.status(200).json(data);
});

app.put('/data', async (req: Request, res: Response) => {
  const { data } = req.body;
  await database.hset("data:names", { data });
  return res.status(200).json({});
});

// ====================================================================
//  ================= WORK IS DONE ABOVE THIS LINE ===================
// ====================================================================

app.use((req: Request, res: Response) => {
  const error = `
    Route not found - This could be because:
      0. You have defined routes below (not above) this middleware in server.ts
      1. You have not implemented the route ${req.method} ${req.path}
      2. There is a typo in either your test or server, e.g. /posts/list in one
         and, incorrectly, /post/list in the other
      3. You are using ts-node (instead of ts-node-dev) to start your server and
         have forgotten to manually restart to load the new changes
      4. You've forgotten a leading slash (/), e.g. you have posts/list instead
         of /posts/list in your server.ts or test file
  `;
  res.json({ error });
});

// For handling errors
app.use(errorHandler());

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});

// When using vercel

// Replace this with your API_URL
// E.g. https://large-poodle-44208.kv.vercel-storage.com
const KV_REST_API_URL="https://tough-hawk-39034.upstash.io";
// Replace this with your API_TOKEN
// E.g. AaywASQgOWE4MTVkN2UtODZh...
const KV_REST_API_TOKEN="AZh6ASQgMTkzMTQyNTEtMGYzYy00ZWEwLWI4NWUtMWI0ZGZhODE5MWEwNGU3MmQ5MjE5YTQ0NDg1ODg4NDllYzgxYjBmMzhlMWQ=";

const database = createClient({
  url: KV_REST_API_URL,
  token: KV_REST_API_TOKEN,
});
