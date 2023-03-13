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
    initializeMpesa(mpesa, 'TEST');
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
      registerTransaction(transaction, db, 'TEST');
    } else {
      resp.send('Sem dados');
    }
  };
  const payEbook = async (req, resp) => {
    initializeMpesa(mpesa, 'TEST');
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
        // new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail({

        //   "sender": { "email": "contacto@flossyyuri.com", "name": "FL Digital" },
        //   "subject": `${data.fullName}, Sua compra do ebook 'Receitas Para Emagrecer' foi aprovada!`,
        //   "templateId": 3,
        //   "params": {
        //     "FIRSTNAME": data.fullName,
        //     "fullName": data.fullName,
        //   },
        //   "messageVersions": [
        //     {
        //       "to": [
        //         {
        //           "email": data.email,
        //           "name": data.fullName
        //         },
        //       ],
        //     },
        //   ]

        // }).then(function (data) {
        //   console.log(data);
        // }, function (error) {
        //   console.error(error);
        // });
        successCase(resp, response);
      } catch (error) {
        transaction.id =
          error.output_TransactionID || error.output_TransactionID === 'N/A'
            ? `F${now}`
            : error.output_TransactionID;
        transaction.status = error.output_ResponseCode;
        allErrorCases(resp, error);
      }
      db.collection("ebooks")
        .doc(transaction.id)
        .set({ ...transaction, ...data })
        .then(() => {
          // console.log(docRef);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      resp.send('Sem dados');
    }
  };

  const get = async (req, resp) => {
    getPayments('tests', db, req, resp);
  };

  return { pay, get, payEbook };
};
