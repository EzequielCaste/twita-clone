const router = require('express').Router();
const verify = require('./verifyToken')
const User = require('../models/users');
const Tweet = require('../models/tweet');
const jwt = require('jsonwebtoken')
require('dotenv').config();

router.get('/compose', verify, (req, res) => {  
  res.render('tweet/compose')  
})

router.post('/compose', verify, async (req, res) => {
  try {
    const userId = await jwt.verify(req.session.authToken, process.env.TOKEN_SECRET)

    const user = await User.findById(userId).populate('tweets').exec();    

    const newTweet = await Tweet.create({
      text: req.body.tweetText,
      author: {
        _id: user._id,
        username: user.username
      },
      created: Date.now()
    })    
    user.tweets.unshift(newTweet)
    await newTweet.save()
    await user.save()
    // user.populate('tweets').execPopulate().then(
    //   console.log(user.tweets)
    //   //res.render("home", { user: user})
    // )
    res.render("home", { user: user})
    

    } catch (err) {
    res.send(err)
  }
  //res.send(req.body.tweetText)
});

router.get('/:id', async (req, res) => { 
    const userId = await jwt.verify(req.session.authToken, process.env.TOKEN_SECRET)

    const user = await User.findById(userId).populate('tweets').exec();    
    
    let found = user.tweets.findIndex( function(tweet, index) {
      if (tweet._id == req.params.id)
        return true;
    });

    user.tweets.splice(found,1);
    await user.save();

    await Tweet.findByIdAndRemove(req.params.id, function(err, removed) {
      if (err) console.log(err);
      console.log(removed)
      res.render('home', { user: user})
    });
   
})

module.exports = router;