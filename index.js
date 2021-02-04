const express = require('express');
const app = express();
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const User = require('./models/users');
const Tweet = require('./models/tweet')
const session = require('express-session');
require('dotenv').config();

//CONNECT TO DB
mongoose.connect(process.env.MONGODB_URL, {  useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });

//Import Routes
const authRoute = require("./routes/auth");
const tweetRoute = require("./routes/tweet");

//Server config
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname+"/public"))
app.use(session({
  secret: 'aolopwe32384',
  resave: false,
  saveUninitialized: false
}))


app.use("/user", authRoute);
app.use('/tweet',tweetRoute);

// Index Welcome Route
app.get('/', async (req, res) => {  

  const feed = await Tweet.find({});

  feed.sort( function compare(a, b) {
      var dateA = new Date(a.created);
      var dateB = new Date(b.created);
      return dateB - dateA;
  })
   
   res.render("index", {feed: feed})
  
  // Tweet.find({}).populate('author').exec(function(err, tweets) {
  //   if (err) console.log(err);
  //   console.log(tweets)
  //   //res.render("index", {feed: tweets})
  // }); 
 
});

app.locals.setDateFormat = require('./scripts/dateFormat')


//Login Route
app.post('/login', async (req, res) => {

  User.findOne({username: req.body.username}, async (err, userFound) => {
   if (err) return console.log(err)

   if (userFound) {
    await bcrypt.compare(
      req.body.password, 
      userFound.password, 
      function(err, result) {
        if (result) {
          req.session.user = userFound
          res.render("home", {user: userFound}) 
         } else { res.render("login") }
      })
   } else {
     res.send("User Not Found")
   }
  });
})

//Compose Route
app.get('/compose', (req, res) => {
  console.log(req.session.user)
  res.render("compose", {user: req.session.user})
})

app.listen(process.env.PORT || 5000, console.log("Server up"))