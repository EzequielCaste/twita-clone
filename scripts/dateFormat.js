module.exports = function (date){
  let tweetTime = date.toISOString().split("T")[1].slice(0, 5);
  let tweetDay = date.toDateString().slice(4,17)
  
  return tweetTime + " " + tweetDay
};