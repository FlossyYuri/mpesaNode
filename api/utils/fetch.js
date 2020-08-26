const snapshotToArray = (snapshot) => {
  const payments = [];
  if (!snapshot.empty) snapshot.forEach((doc) => payments.push(doc.data()));
  return payments;
};
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
        paymentsRef = paymentsRef.where('ok', '==', 'INS-0');
    }
    snapshot = await paymentsRef.get();
  } catch (error) {
    console.log('=================>', error);
  }
  const payments = snapshot ? snapshotToArray(snapshot) : [];
  if (payments.length > 0 || snapshot.empty) {
    resp.status(200).json(payments);
  } else {
    resp.status(500).json(payments);
  }
};
