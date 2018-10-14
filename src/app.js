let express = require("express");
let constants = require("./config/constants");
let middleWareConfig = require("./config/middlewares");
let path = require('path');
//link database config
require("./config/database");

//import booking routes
let bookingRoutes = require("./bookingModule/booking.routes");

const app = express();

//link middleware to app
middleWareConfig(app);


app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname + '/public/index.html'));
})

app.use("/screens/",bookingRoutes.routes);

function errorHandler(err, req, res, next) {
    res.status(400);
    res.json(err);
  }

//link error handler to the app
app.use(errorHandler);

app.listen(constants.PORT, err => {
    if (err) {
      throw err;
    } else {
      console.log(`
                  Server running on port : ${constants.PORT}
                  ------
                  Running on ${process.env.NODE_ENV}
                  ------
                  ENV ${process.env.NODE_ENV}
                  Make something great 
              `);
    }
  });
  