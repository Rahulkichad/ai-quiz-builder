import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4 // Force IPv4
});

mongoose.connection.on('error', err => {
  if (err.code === 'EPERM') {
    console.error('Windows permission error. Try running as Administrator.');
  } else if (err.code === 'EADDRINUSE') {
    console.error('Port conflict. Kill process: netstat -ano | findstr :5000');
  }
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  if (err.code === 'EPERM') {
    console.error('Windows permission error. Try running as Administrator.');
  } else if (err.code === 'EADDRINUSE') {
    console.error('Port conflict. Kill process: netstat -ano | findstr :5000');
  }
  process.exit(1);
});

app.get('/', (req, res) => {
  res.send('AI Quiz Builder Backend Running');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
