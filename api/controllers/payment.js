const mpesa = require('mpesa-node-api');
const {
  initializeMpesa,
  getTransaction,
  successCase,
  allErrorCases,
  registerTransaction,
  c2b,
} = require('../utils/payment');
module.exports = (app) => {
  const db = app.config.firebase;
  const pay = async (req, resp) => {
    initializeMpesa(mpesa, 'PRODUCTION');
    const data = { ...req.body };
    if (data) {
      const now = new Date().getTime().toString();
      const transaction = getTransaction(data, now);
      try {
        const response = await c2b(mpesa, transaction);
        transaction.id = response.output_TransactionID
          ? `W${response.output_TransactionID}`
          : `W${now}`;
        transaction.status = response.output_ResponseCode;

        successCase(resp, response);
      } catch (error) {
        transaction.id =
          error.output_TransactionID || error.output_TransactionID === 'N/A'
            ? `F${now}`
            : error.output_TransactionID;
        transaction.status = error.output_ResponseCode;
        allErrorCases(resp, error);
      }
      registerTransaction(transaction, db, 'PRODUCTION');
    } else {
      resp.send('Sem dados');
    }
  };

  const get = async (req, resp) => {
    const paymentsRef = db.collection('payments').orderBy('createdAt', 'desc');
    if (req.query.channel)
      paymentsRef.where('channel', '==', req.query.channel);
    if (req.query.username)
      paymentsRef.where('username', '==', req.query.username);
    const snapshot = await paymentsRef.get();
    const payments = [];
    if (!snapshot.empty) snapshot.forEach((doc) => payments.push(doc.data()));
    if (payments.length > 0) {
      resp.status(200).json(payments);
    } else {
      resp.status(500).json(payments);
    }
  };

  return { pay, get };
};
