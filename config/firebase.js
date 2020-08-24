const admin = require('firebase-admin');
module.exports = (app) => {
  //mudas o service account para localizacao do teu arquivo json que baixaste
  const serviceAccount = require('./mpesa-pay-firebase-adminsdk-6deb1-178dcc6707.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  const db = admin.firestore();
  return db;
};
