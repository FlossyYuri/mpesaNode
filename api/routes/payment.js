module.exports = (app) => {
  app.route('/pay').post(app.api.controllers.payment.pay);
  app.route('/payments').get(app.api.controllers.payment.get);
};
