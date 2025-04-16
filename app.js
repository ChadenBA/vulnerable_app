const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/vulnerable-db';

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes for serving EJS pages
app.get('/', (req, res) => {
    res.render('index');  // Main page (register/login)
});

app.get('/login', (req, res) => {
    res.render('login');  // Login page
});

app.get('/register', (req, res) => {
    res.render('register');  // Registration page
});

// Vulnerable registration route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Intentionally insecure: password is stored in plain text
    const user = new User({ username, password });

    try {
        await user.save();
        res.status(201).send('User registered');
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
app.get('/search', (req, res) => {
    const query = req.query.query;
    res.send(`<html><body><h1>Search Results</h1><p>You searched for: ${query}</p></body></html>`);
  });
  
// Vulnerable login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
       
        const user = await User.findOne(req.body);

        if (!user) {
            return res.status(401).send('Invalid credentials');
        }

        const token = jwt.sign({ id: user._id }, 'secretkey');
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
