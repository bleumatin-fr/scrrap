import * as dotenv from 'dotenv-flow';
dotenv.config();

import * as Sentry from '@sentry/node';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import 'express-async-errors';
import { expressCspHeader, INLINE, SELF } from 'express-csp-header';
import boolParser from 'express-query-boolean';

import {
  authenticate,
  checkIsDocumentServer,
  checkIsInRole,
  or,
} from './authentication/authenticate';
import errorHandler from './middlewares/errorHandler';
import { Role } from './users/model';

import modelsAdminRoutes from './models/adminRoutes';
import modelsPublicRoutes from './models/publicRoutes';
import projectAdminRoutes from './projects/adminRoutes';
import projectPublicRoutes from './projects/publicRoutes';
import spreadSheetsAdminRoutes from './spreadsheets/adminRoutes';
import statsPublicRoutes from './stats/publicRoutes';
import userAdminRoutes from './users/adminRoutes';

import authenticationPublicRoutes from './authentication/publicRoutes';
import configurationAdminRoutes from './configuration/adminRoutes';
import configurationPublicRoutes from './configuration/publicRoutes';

import path from 'path';
import seedConfiguration from './configuration/seed';
import connect, { up } from './db';
import injectConfig from './injectConfig';
import seedModels from './models/seed';
import seedUsers from './users/seed';

connect().then(async ({ connection }) => {
  try {
    await up(connection);
    seedModels();
    seedConfiguration();
    seedUsers();
  } catch (err) {
    // it might be the first time, seed first to init db, up, then seed again
    console.log(
      "Seems like it's the first time, seeding first before migrating database up",
    );
    console.log(err);
    try {
      await seedModels();
      await up(connection);
      seedModels();
    } catch (err) {
      console.error(
        "There was an error seeding the database, let's continue and see",
      );
      console.error(err);
    }
  }
});

const app: Application = express();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new Sentry.Integrations.Http({ tracing: true })],
  tracesSampleRate: 1.0,
});
app.use(Sentry.Handlers.requestHandler());

const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(',')
  : [];

app.use(
  cors({
    origin: whitelist,
    credentials: true,
    allowedHeaders: [
      'X-Total-Count',
      'Content-Type',
      'Authorization',
      'baggage',
      'sentry-trace',
    ],
    exposedHeaders: [
      'X-Total-Count',
      'X-Forwarded-Host',
      'Content-Type',
      'Content-Length',
      'Content-Security-Policy',
    ],
  }),
);

const cspDirectives =
  process.env.CSP_DEFAULT_SRC?.split(',').map((csp) => csp.trim()) || [];

app.use(
  expressCspHeader({
    directives: {
      'default-src': [SELF, INLINE, ...cspDirectives],
    },
  }),
);

app.use(
  '/',
  injectConfig('FRONT_', 'REACT_APP_'),
  express.static(
    process.env.CLIENT_PATH || path.join(__dirname, '../../client/build'),
    { index: 'index.html' },
  ),
);
app.use(
  '/admin',
  injectConfig('ADMIN_', 'REACT_APP_'),
  express.static(
    process.env.ADMIN_PATH || path.join(__dirname, '../../admin/build'),
    { index: 'index.html' },
  ),
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(boolParser());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use('/api/authentication', authenticationPublicRoutes);

app.use(authenticate);

app.use('/api/stats', checkIsInRole(Role.USER, Role.ADMIN), statsPublicRoutes);

app.use(
  '/api/projects',
  checkIsInRole(Role.USER, Role.ADMIN),
  projectPublicRoutes,
);

app.use(
  '/api/models',
  checkIsInRole(Role.USER, Role.ADMIN),
  modelsPublicRoutes,
);
app.use('/api/configuration', configurationPublicRoutes);

app.use('/admin/api/projects', checkIsInRole(Role.ADMIN), projectAdminRoutes);
app.use('/admin/api/users', checkIsInRole(Role.ADMIN), userAdminRoutes);
app.use('/admin/api/models', checkIsInRole(Role.ADMIN), modelsAdminRoutes);
app.use(
  '/admin/api/configurations',
  checkIsInRole(Role.ADMIN),
  configurationAdminRoutes,
);

app.use(
  '/admin/api/spreadsheets',
  or(checkIsInRole(Role.ADMIN), checkIsDocumentServer),
  spreadSheetsAdminRoutes,
);

app.get('/admin/*', (req, response) => {
  response.sendFile('index.html', {
    root: process.env.ADMIN_PATH || path.join(__dirname, '../../admin/build'),
  });
});

app.get('/*', (req, response) => {
  response.sendFile('index.html', {
    root: process.env.CLIENT_PATH || path.join(__dirname, '../../client/build'),
  });
});

app.use(errorHandler);
app.use(Sentry.Handlers.errorHandler());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`);
});
