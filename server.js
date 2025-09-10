const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');

//initialize express
const app = express();

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'replace-this-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true }
  })
);

// Static files (serve both project root and /public)
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

//connect to mongoDB
mongoose
  .connect('mongodb://localhost:27017/login-form', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('connected to MongoDB'))
  .catch((error) => console.log('Database connection error', error));

// Define the schema for the user model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Login route
app.post('/login', async (req, res) => {
  try {
    const identifier = req.body.username || req.body.email;
    const { password } = req.body;

    if (!identifier || !password) {
      return res.status(400).send('Username/email and password are required');
    }

    // look for user in the database (treat email field as username for this simple example)
    const user = await User.findOne({ username: identifier });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // compare provided password with the one in the database
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      req.session.userId = user._id;
      return res.send('Login successful');
    } else {
      return res.status(401).send('Invalid credentials');
    }
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).send('Server error');
  }
});

// Register route
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send('Username and password are required');
    }

    // check for existing user
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('Username already exists');
    }

    // hash the password before storing in the database
    const hashed = await bcrypt.hash(password, 12);

    // create new user
    const newUser = new User({ username, password: hashed });
    await newUser.save();

    return res.send('Registration successful');
  } catch (err) {
    console.error('Registration error', err);
    return res.status(500).send('Server error');
  }
});

// Logout endpoint
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send('Error logging out');
    res.send('Logging out successful');
  });
});

// Middleware to protect routes
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).send('Not logged in');
  }
  next();
}

// Example of protected route
app.get('/dashboard', requireLogin, (req, res) => {
  res.send('Welcome to your dashboard');
});

// Fallback routes to serve pages if needed
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

