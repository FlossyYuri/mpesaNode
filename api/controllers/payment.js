const mpesa = require('mpesa-node-api');
const {
  initializeMpesa,
  getTransaction,
  successCase,
  allErrorCases,
  registerTransaction,
  c2b,
} = require('../utils/payment');
const { getPayments } = require('../utils/fetch');
module.exports = (app) => {
  const db = app.db;

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
    getPayments('payments', db, req, resp);
  };
  const ok = async (req, resp) => {
    resp.send('OK!');
  };

  return { pay, get, ok };
};
