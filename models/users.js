const mongoose = require("mongoose");
const Schema = mongoose.Schema;


//USER SCHEMA
const userSchema = new Schema({
  username: String,
  password: String,
  tweets: [
    { 
      type: Schema.Types.ObjectId, 
      ref: 'Tweet' 
    }
  ]
});

module.exports = mongoose.model("User", userSchema)

/*
tweets: [
    { 
      type: Schema.Types.ObjectId, 
      ref: 'Tweet' 
    }
  ]*/
  