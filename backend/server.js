import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { User, Quiz } from './models.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongo: isDBConnected ? 'connected' : 'disconnected'
  });
});

// MongoDB Connection
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn('MONGO_URI not found in .env file. Using mock data.');
      return false;
    }
    
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4 // Force IPv4
    });
    
    console.log('MongoDB connected successfully');
    return true;
  } catch (err) {
    console.warn('MongoDB connection error:', err.message);
    console.warn('Running in mock mode - no data will be persisted');
    return false;
  }
};

// Initialize DB connection
let isDBConnected = false;
connectDB().then(connected => {
  isDBConnected = connected;
});

// --- Collaborative Quiz API Stubs ---

// Utility: generate a random 6-character invite code
function generateInviteCode() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

// Create a quiz (manual creation)
app.post('/api/quiz/create', async (req, res) => {
  try {
    const { userId, role, title, questions, maxParticipants } = req.body;
    if (!userId || !role || !title || !questions) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (!['student','mentor','teacher'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const inviteCode = generateInviteCode();
    const quiz = new Quiz({
      ownerId: userId,
      title,
      questions,
      maxParticipants: maxParticipants || 10,
      inviteCode,
      participants: [],
      responses: [],
      leaderboard: [],
      status: 'active'
    });
    await quiz.save();
    res.json({ status: 'ok', quizId: quiz._id, inviteCode });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI Quiz Creation Endpoint (mock)
app.post('/api/quiz/create-ai', async (req, res) => {
  console.log('Received create-ai request:', req.body);
  
  const { title, role, topic, difficulty = 'medium', maxParticipants = 5 } = req.body;
  
  // Input validation
  if (!title || !topic) {
    console.error('Missing required fields:', { title, topic });
    return res.status(400).json({ 
      success: false,
      error: "Title and topic are required fields" 
    });
  }

  try {
    // Generate mock questions based on topic and difficulty
    const questions = [
      { 
        text: `What is the main purpose of ${topic}?`, 
        options: [
          `To provide a framework for ${topic} development`,
          `To entertain users`,
          `To manage databases`,
          `To design graphics`
        ], 
        answer: 0 
      },
      { 
        text: `Which of the following is a key feature of ${topic}?`,
        options: [
          `Automatic memory management`,
          `Built-in AI capabilities`,
          `Cross-platform compatibility`,
          `All of the above`
        ],
        answer: 3
      },
      {
        text: `What is the primary benefit of using ${topic} for ${role}s?`,
        options: [
          `Faster development`,
          `Better performance`,
          `Easier maintenance`,
          `All of the above`
        ],
        answer: 3
      },
      { 
        text: `Write a simple code snippet in ${topic} to print 'Hello World'.`,
        options: [],
        answer: null,
        type: 'code'
      },
      {
        text: `Rate the difficulty of ${topic} for beginners:`, 
        options: ['Easy', 'Medium', 'Hard'],
        answer: difficulty === 'easy' ? 0 : (difficulty === 'medium' ? 1 : 2)
      }
    ];

    // Generate a unique invite code
    const inviteCode = generateInviteCode();
    
    console.log('Generated quiz:', { inviteCode, questionCount: questions.length });
    
    // Save to database if connected
    if (isDBConnected) {
      const quiz = new Quiz({
        title,
        questions,
        inviteCode,
        maxParticipants: parseInt(maxParticipants) || 5,
        status: 'active',
        createdAt: new Date()
      });
      await quiz.save();
    }

    // Return success response
    res.json({
      success: true,
      inviteCode,
      questions,
      message: isDBConnected ? 'Quiz saved to database' : 'Running in mock mode - data not persisted'
    });

  } catch (error) {
    console.error('Error in create-ai:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate quiz',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Invite participants (generate/share code)
app.post('/api/quiz/invite', async (req, res) => {
  try {
    const { quizId, userId } = req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    if (quiz.ownerId.toString() !== userId) return res.status(403).json({ error: 'Only owner can invite' });
    res.json({ status: 'ok', inviteCode: quiz.inviteCode });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Join a quiz
app.post('/api/quiz/join', async (req, res) => {
  try {
    const { userId, inviteCode } = req.body;
    const quiz = await Quiz.findOne({ inviteCode });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    if (quiz.participants.length >= quiz.maxParticipants) {
      return res.status(403).json({ error: 'Quiz is full' });
    }
    if (quiz.participants.includes(userId)) {
      return res.json({ status: 'ok', message: 'Already joined' });
    }
    quiz.participants.push(userId);
    await quiz.save();
    res.json({ status: 'ok', quizId: quiz._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit answers
app.post('/api/quiz/submit', async (req, res) => {
  try {
    const { userId, quizId, answers } = req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    if (!quiz.participants.includes(userId)) {
      return res.status(403).json({ error: 'Not a participant' });
    }
    // Score calculation
    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (JSON.stringify(q.answer) === JSON.stringify(answers[idx])) {
        score++;
      }
    });
    // Save response
    quiz.responses.push({ userId, answers, score, submittedAt: new Date() });
    // Update leaderboard
    const existing = quiz.leaderboard.find(l => l.userId.toString() === userId);
    if (existing) {
      existing.score = score;
    } else {
      quiz.leaderboard.push({ userId, score });
    }
    await quiz.save();
    res.json({ status: 'ok', score });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get leaderboard
app.get('/api/quiz/:id/leaderboard', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('leaderboard.userId','name email');
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json({ status: 'ok', leaderboard: quiz.leaderboard });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get quiz results
app.get('/api/quiz/:id/results', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('responses.userId','name email');
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json({ status: 'ok', responses: quiz.responses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('AI Quiz Builder Backend Running');
});

const PORT = 3001; // Use a consistent port
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});
