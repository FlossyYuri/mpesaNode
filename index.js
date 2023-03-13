require('dotenv-safe').config();
const app = require('express')();
const consign = require('consign');
const admin = require('firebase-admin');

const serviceAccount = require('./config/mpesa-pay-firebase-adminsdk-6deb1-178dcc6707.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
app.db = db;

const winston = require('winston');

// Create a logger for application errors
const errorLogger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    })
  ]
});

// Create a middleware function for catching errors and logging them
function logErrors(err, req, res, next) {
  // Log the error to the error logger
  errorLogger.error(err);

  // Pass the error to the next middleware
  next(err);
}

// Use the middleware function to catch and log errors in your application
app.use(logErrors);

// Example route that throws an error
app.get('/', (req, res) => {
  throw new Error('Something went wrong!');
});

consign()
  .include('./config/passport.js')
  .then('./config/middleware.js')
  // .then('./config/firebase.js')
  .then('./api/controllers')
  .then('./api/routes')
  .into(app);
app.listen(process.env.PORT || 5000, () => {
  console.log('Backend executando...');
});

