import express from 'express';
import session from 'express-session';
import { errorHandler } from './middleware/errorHandler';
import './types/session';

import healthCheckRouter from './routes/healthCheckRoutes';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(errorHandler);

app.use('/api/health', healthCheckRouter);

app.get('/', (req, res) => {
  console.log(req.session);
  res.send('Welcome to the PVC2 Backend API');
});

app.get('/set-session', (req, res) => {
  const user = { id: 1, name: 'Test User' };
  req.session.user = user;
  res.send('Session data set');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
