const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//TWEET SCHEMA
const tweetSchema = new Schema({
  text: String,
  created: { type: Date, default: Date.now },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  }
})

module.exports = mongoose.model("Tweet", tweetSchema)