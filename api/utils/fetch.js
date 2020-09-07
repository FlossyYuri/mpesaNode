const snapshotToArray = (snapshot) => {
  const array = [];
  if (!snapshot.empty) snapshot.forEach((doc) => array.push(doc.data()));
  return array;
};
exports.snapshotToArray = snapshotToArray;
exports.getPayments = async (collection, db, req, resp) => {
  let paymentsRef = db.collection(collection);
  let snapshot;
  try {
    if (req.query.channel) {
      paymentsRef = paymentsRef.where('channel', '==', req.query.channel);
    }
    if (req.query.username) {
      paymentsRef = paymentsRef.where('username', '==', req.query.username);
    }
    if (req.query.status) {
      if (req.query.status === 'success')
        paymentsRef = paymentsRef.where('status', '==', 'INS-0');
    }
    snapshot = await paymentsRef.get();
  } catch (error) {
    console.log('=================>', error);
  }
  const payments = snapshot ? snapshotToArray(snapshot) : [];
  payments.sort((a, b) => {
    return b.createdAt - a.createdAt;
  });
  if (payments.length > 0 || snapshot.empty) {
    resp.status(200).json(payments);
  } else {
    resp.status(500).json(payments);
  }
};
exports.getPaymentsV2 = async (collection, db, channel, status) => {
  let paymentsRef = db.collection(collection);
  let snapshot;
  try {
    if (channel) {
      paymentsRef = paymentsRef.where('channel', '==', channel);
    }
    if (status) {
      if (status === 'success')
        paymentsRef = paymentsRef.where('status', '==', 'INS-0');
    }
    snapshot = await paymentsRef.get();
  } catch (error) {
    console.log('=================>', error);
  }
  const payments = [];
  snapshot.forEach((doc) => {
    payments.push(doc.data());
  });
  return payments;
};
exports.sumAmounts = (total, payment) => {
  return Number(total) + Number(payment.amount);
};
