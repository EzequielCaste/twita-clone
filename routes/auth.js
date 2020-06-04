const router = require('express').Router();
const User = require('../models/users');
const Tweets = require('../models/tweet')
const bcrypt = require('bcrypt')
const {registerValidation, loginValidation} = require('./validation')
const jwt = require('jsonwebtoken')
require('dotenv').config();


// User Login Page
router.get('/login', (req, res) => {
  res.render('login')
})

// Handle LOGIN Route
router.post("/login", async (req, res) => {
  //Validate data before 
  const { error } = loginValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);
    //Check if the email exists
    const user = await User.findOne({username: req.body.username}).populate('tweets').exec();

    if(!user) return res.status(400).send('Email or password is wrong')
    //PASSWORD IS CORRECT
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).send('Invalid Email or password is wrong')

    //CREATE AND ASSIGN A TOKEN
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
    //res.set('auth-token', token).render("home", { user: user});
    req.session.authToken = token;
    //user.populate('tweets')
    res.render("home", { user: user})
    
    
    // Tweets.find({}).populate('author').exec(function (err, tweet) {
    //   if (err) console.log(err);
    //   res.render("home", { user: user } )
    // })
});



// User Registration Page
router.get('/register', (req, res) => {
  res.render('register')
});

// Handle Registration Route
router.post("/register", async (req, res) => {
  //Validate data before 
  const { error } = registerValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  //Check if user is already in DB
  const nameExist = await User.findOne({username: req.body.username})
  if(nameExist) return res.status(400).send('Name already registered')

  //HASH THE PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt)

  //Create new user
  const user = new User({
    username: req.body.username,    
    password: hashPassword,
    tweets: []
  });
  try {
    const savedUser = await user.save()
    //res.send({user: savedUser.id})
    res.redirect('/user/login')
  }catch(err){
    res.status(400).send(err).redirect('/')
  }
});






module.exports = router;