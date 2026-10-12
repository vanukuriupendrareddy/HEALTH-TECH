import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import animalRoutes from './routes/animals.js';
import recordRoutes from './routes/records.js';
import vaccinationRoutes from './routes/vaccinations.js';
import checkupRoutes from './routes/checkups.js';
import riskRoutes from './routes/risk.js';
import infoRoutes from './routes/info.js';
import dashboardRoutes from './routes/dashboard.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '100kb' }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/animals', animalRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/vaccinations', vaccinationRoutes);
app.use('/api/checkups', checkupRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/info', infoRoutes);

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(', ') });
  }
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid id' });
  if (err.code === 11000) return res.status(409).json({ message: 'Duplicate value' });
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set. Copy .env.example to .env and set it.');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/healthtech')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`HEALTH TECH API running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
