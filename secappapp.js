const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const helmet = require('helmet');
const sanitizeHtml = require('sanitize-html');
const escapeHtml = require('escape-html');
const rateLimit = require('express-rate-limit');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/secure-db';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecuresecret';

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// User model
const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});
const User = mongoose.model('User', UserSchema);

// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiter
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 3,
  message: 'Too many requests'
}));

// XSS-safe search route
app.get('/search', (req, res) => {
  const rawQuery = req.query.query || '';
  const sanitizedQuery = escapeHtml(sanitizeHtml(rawQuery));
  res.send(`<html><body><h1>Search Results</h1><p>You searched for: ${sanitizedQuery}</p></body></html>`);
});

// Secure registration route
app.post('/register', async (req, res) => {
  try {
    let { username, password } = req.body;

    // Sanitize inputs
    username = sanitizeHtml(username.trim());
    password = sanitizeHtml(password.trim());

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).send('Username already taken');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });

    await user.save();
    res.status(201).send('User registered successfully');
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Secure login route
app.post('/login', async (req, res) => {
  try {
    let { username, password } = req.body;

    // Sanitize inputs
    username = sanitizeHtml(username.trim());
    password = sanitizeHtml(password.trim());

    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`HTTP Server running on port ${PORT}`);
});
