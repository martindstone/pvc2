import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { errorHandler } from './middleware/errorHandler';

import healthCheckRouter from './routes/healthCheckRouter';
import authRouter from './routes/authRouter';

import { authGuard } from './middleware/authGuard';

const SESSION_SECRET = process.env.SESSION_SECRET || 'your-secret-key';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: "auto" }
}));

// Initialize Passport (must be after express-session)
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/health', healthCheckRouter);
app.use('/auth', authRouter);

// test protected route
app.get('/', authGuard, (req, res) => {
  res.send('Welcome to the PVC2 Backend API');
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
