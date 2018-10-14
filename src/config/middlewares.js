let morgan = require("morgan");
let bodyParser = require("body-parser");
let compression = require("compression");
let helmet = require("helmet");
let cors = require("cors");

//check the app environment 
const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

module.exports = app => {
    if (isProd) {
        app.use(compression());
        app.use(helmet());
      }
      app.use(bodyParser.json({ limit: '50mb' }));
      app.use(cors({ origin: '*' }));
    
      if (isDev) {
        app.use(morgan('dev'));
      }
}