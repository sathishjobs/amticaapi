let mongoose = require("mongoose");
let constants = require("./constants");

//Remove the warning with Promise
mongoose.Promise = global.Promise;

//Connect the db with the url provide
try {
  console.log("----")
  console.log(constants.MONGO_URL)
  mongoose.connect(constants.MONGO_URL,{ useNewUrlParser: true });
} catch (err) {
  console.log("***");
  mongoose.createConnection(constants.MONGO_URL);
}

mongoose.connection
  .once('open', () => {
    console.log('MongoDb Running');
  })
  .on('error', e => {
    throw e;
  });
