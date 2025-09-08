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
