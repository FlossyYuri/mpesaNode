module.exports = (app) => {
  app.route('/pay').post(app.api.controllers.payment.pay);
};
