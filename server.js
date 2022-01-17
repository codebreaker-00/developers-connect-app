const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const post = require('./routes/api/post');


app.use( bodyParser.urlencoded({
         extended:false }));
app.use(bodyParser.json());

// db config 
const db = require('./config/keys').mongoURI;

// connect to mongoDB
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Passport MiddleWare
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport); 

// Use Routes
app.use('/api/users',users);
app.use('/api/profile',profile);
app.use('/api/post',post);

const port  = process.env.PORT || 5000;

app.listen(port , () => console.log(`server running on ${port}`));

