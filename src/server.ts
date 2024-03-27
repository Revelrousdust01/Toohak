import {
  adminAuthLogin, adminAuthLogout, adminAuthRegister,
  adminUserDetails, adminUserDetailsUpdate, adminUserPasswordUpdate
} from './auth';
import {
  adminQuizCreate, adminQuizEmptyTrash, adminQuizRemove,
  adminQuizNameUpdate, adminQuizViewTrash
} from './quiz';
import { clear } from './other';
import express, { json, Request, Response } from 'express';
import { echo } from './newecho';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import YAML from 'yaml';
import sui from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import process from 'process';

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

  if ('error' in response) {
    return res.status(400).json(response);
  }
  res.json(response);
});

app.post('/v1/admin/auth/logout', (req: Request, res: Response) => {
  const { token } = req.body;
  const response = adminAuthLogout(token);

  if ('error' in response) {
    return res.status(401).json(response);
  }
  res.json(response);
});

app.post('/v1/admin/auth/register', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  const response = adminAuthRegister(email, password, nameFirst, nameLast);

  if ('error' in response) {
    return res.status(400).json(response);
  }
  res.json(response);
});

app.get('/v1/admin/user/details', (req: Request, res: Response) => {
  const response = adminUserDetails(req.query.token as string);

  if ('error' in response) {
    return res.status(401).json(response);
  }
  res.json(response);
});

app.put('/v1/admin/quiz/:quizid/name', (req: Request, res: Response) => {
  const { token, quizid, name } = req.body;
  const response = adminQuizNameUpdate(token, quizid, name);
  if ('error' in response) {
    if (response.error === 'Quiz ID does not refer to a valid quiz.' || response.error === 'Quiz ID does not refer to a quiz that this user owns.') {
      return res.status(403).json(response);
    } else if (response.error === 'Token is empty or invalid') {
      return res.status(401).json(response);
    } else {
      return res.status(400).json(response);
    }
  }

  return res.status(200).json({});
});

app.put('/v1/admin/user/details', (req: Request, res: Response) => {
  const { token, email, nameFirst, nameLast } = req.body;
  const response = adminUserDetailsUpdate(token, email, nameFirst, nameLast);

  if ('error' in response) {
    if (response.error === 'Token is empty or invalid.') {
      return res.status(401).json(response);
    } else {
      return res.status(400).json(response);
    }
  }
  res.json(response);
});

app.put('/v1/admin/user/password', (req: Request, res: Response) => {
  const { token, oldPassword, newPassword } = req.body;
  const response = adminUserPasswordUpdate(token, oldPassword, newPassword);

  if ('error' in response) {
    if (response.error === 'Token is empty or invalid.') {
      return res.status(401).json(response);
    } else {
      return res.status(400).json(response);
    }
  }
  res.json(response);
});

app.get('/v1/admin/quiz/trash', (req: Request, res: Response) => {
  const response = adminQuizViewTrash(req.query.token as string);

  if ('error' in response) {
    return res.status(401).json(response);
  }
  res.json(response);
});

app.delete('/v1/admin/quiz/:quizid', (req: Request, res: Response) => {
  const response = adminQuizRemove(req.query.token as string, parseInt(req.params.quizid));

  if ('error' in response) {
    if (response.error === 'Token is empty or invalid.') {
      return res.status(401).json(response);
    } else {
      return res.status(403).json(response);
    }
  }
  res.json(response);
});

app.post('/v1/admin/quiz', (req: Request, res: Response) => {
  const { token, name, description } = req.body;
  const response = adminQuizCreate(token, name, description);

  if ('error' in response) {
    if (response.error === 'Token is empty or invalid.') {
      return res.status(401).json(response);
    } else {
      return res.status(400).json(response);
    }
  }
  res.json(response);
});

app.delete('/v1/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const quizIds = req.query.quizIds as string[];
  const numberQuizIds = quizIds.map(id => parseInt(id));
  const response = adminQuizEmptyTrash(req.query.token as string, numberQuizIds);

  if ('error' in response) {
    if (response.error === 'Token is empty or invalid.') {
      return res.status(401).json(response);
    } else {
      return res.status(403).json(response);
    }
  }
  res.json(response);
});

app.delete('/v1/clear', (req: Request, res: Response) => {
  const response = clear();
  res.json(response);
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

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
