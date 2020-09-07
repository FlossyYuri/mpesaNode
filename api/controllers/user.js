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

  const login = async (req, resp) => {
    const data = { ...req.body };
    const users = snapshotToArray(
      await db.collection('users').where('email', '==', data.email).get()
    );
    if (users.length === 0)
      return resp.status(400).send('Usuário não encontrado!');

    const user = users[0];

    bcrypt.compare(data.password, user.password).then((result) => {
      if (result) {
        delete user.password;

        const now = Math.floor(Date.now() / 1000);
        const payload = {
          user,
          iat: now,
          exp: now + 60 * 60 * 24 * 3,
        };

        resp.json({
          ...payload,
          token: jwt.encode(payload, process.env.JWT_SECRET),
        });
      } else {
        resp.status(401).send('Email/Senha inválidos!');
      }
    });
  };
  const register = async (req, resp) => {
    const user = { ...req.body };
    bcrypt.hash(user.password, saltRounds).then(function (hash) {
      user.password = hash;
      user.credit = 0;
      user.total = 0;
      db.collection('users')
        .doc(user.email)
        .set(user)
        .then(() => {
          resp.status(201).send();
        })
        .catch((error) => {
          resp.status(500).send(error);
        });
    });
  };

  const getTotalAmount = async (channel) => {
    const payments = await getPaymentsV2('payments', db, channel, 'success');
    return payments.reduce(sumAmounts, 0);
  };

  const getWithdrawedAmount = async (email) => {
    const withdraws = snapshotToArray(
      await db.collection('withdraws').where('email', '==', email).get()
    );
    return withdraws.reduce(sumAmounts, 0);
  };

  const getCredit = async (req, resp) => {
    const { channel, email } = req.user;
    const totalAmount = await getTotalAmount(channel);
    const withdrawedAmount = await getWithdrawedAmount(email);
    resp.json({ credit: totalAmount - withdrawedAmount });
  };
  const getTotal = async (req, resp) => {
    const { channel } = req.user;
    resp.json({ total: await getTotalAmount(channel) });
  };
  const update = async (req, resp) => {
    resp.send('Sem dados');
  };

  return { login, register, update, getCredit, getTotal };
};
