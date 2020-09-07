const jwt = require('jwt-simple');
const bcrypt = require('bcrypt');
const saltRounds = 5;
const {
  snapshotToArray,
  getPaymentsV2,
  sumAmounts,
} = require('../utils/fetch');
module.exports = (app) => {
  const db = app.db;

  const get = async (req, resp) => {
    const { email } = { ...req.user };
    const withdraws = snapshotToArray(
      await db.collection('withdraws').where('email', '==', email).get()
    );
    resp.json(withdraws);
  };
  const save = async (req, resp) => {
    const withdraw = { ...req.body };
    const now = new Date().getTime().toString();
    withdraw.email = req.user.email;
    withdraw.status = 'pending';
    withdraw.createdAt = now;
    db.collection('withdraws')
      .doc(now)
      .set(withdraw)
      .then(() => {
        resp.status(201).send();
      })
      .catch((error) => {
        resp.status(500).send(error);
      });
  };

  return { get, save };
};
