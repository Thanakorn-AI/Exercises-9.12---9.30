// patientor_backend/src/index.ts
import express from 'express';
import cors from 'cors';
import diagnosesRouter from './routes/diagnoses';
import patientsRouter from './routes/patients';

const app = express();
app.use(express.json()); // Parse JSON requests
app.use(cors());
app.use('/api/diagnoses', diagnosesRouter);
app.use('/api/patients', patientsRouter);

const PORT = 3001; // Matches frontend’s apiBaseUrl

app.get('/api/ping', (_req, res) => {
  console.log('Ping received');
  res.send('pong');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});