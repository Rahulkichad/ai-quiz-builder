// Mongoose models for User and Quiz
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['student', 'mentor', 'teacher'], required: true },
}, { timestamps: true });

const QuizSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  questions: [
    {
      text: String,
      options: [String],
      answer: mongoose.Schema.Types.Mixed, // int or [int]
      explanation: String
    }
  ],
  maxParticipants: { type: Number, default: 10 },
  inviteCode: { type: String, unique: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  responses: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      answers: mongoose.Schema.Types.Mixed,
      score: Number,
      submittedAt: Date
    }
  ],
  leaderboard: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      score: Number
    }
  ],
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
}, { timestamps: true });

export const User = mongoose.model('User', UserSchema);
export const Quiz = mongoose.model('Quiz', QuizSchema);
