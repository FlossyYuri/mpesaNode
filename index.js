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

const log4js = require('log4js');

log4js.configure({
  appenders: { everything: { type: 'file', filename: 'logs.log' } },
  categories: { default: { appenders: ['everything'], level: 'ALL' } }
});

const logger = log4js.getLogger();

app.use(log4js.connectLogger(logger, { level: 'auto' }));

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

