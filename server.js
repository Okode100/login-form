const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

//initialize express
const app = express();

//middleware
app.use(bodyParser.urlencoded({ extended: true }));

//connect to mongoDB
mongoose.connect('mongodb://localhost:27017/login-form', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("connected to MongoDB"))
.catch(error => console.log("Database connection error", error));

// Define the schema for the user model
const userSchema = new mongoose.Schema({
    username = String,
    password = String
});

app.use(express.static(login-form /public));

// import the user model
const User = require('./models/user');
 
// handle post request when user submits the form
app.post('login',  async (req, res) => {
    const {username, password} = req.body;
});
 //look for user in the database 
 const user = await User.findOne({emali});

 if(!user){
    return res.status(401).json({message: 'Invalid credentials'});

 }

 //compare permited password with the one in the database
 const match = await bcrypt.compare(password, user.password);
 if(match){
    req.session.userId = user._id;
    return res.send("Login successful");
} else {
    return res.status(401).send("Invalid credentials");
}

//Register route
app.post('/register', async (req, res) => {
    const  {username, password} = req.body;
 
// chech for existing user 
const existingUser = await user.findOne({email});
if(existingUser){
    return res.status(400).send('Email already exists');

};
 // hash the password befor storing in the database 
 const hashed = await bcrypt.hash(password, 12);

 //create new user
 const newUser = new User({username, password: hashed});

 await newUser.save();
 return res,send('Registration successfull');
});

//Logout endpoint
app.get('/logout',(req, res) => {
req.session.destroy(err => {
    if(err) return res.status(500).send('Error logging out');
    res.send('Logging out succesfull');
})

});

//Middleware to protect routes 
function requiredLogin(req,res,next){
    if(!req.session.userId){
        return res.status(401).send('Not log in');
    }
}

// Example of protected routes 
app.get('/dashboard', requiredLogin, (req, res) => {
    res.send('Welcome to your dashboard');
});

