module.exports = (app) => {
  app.route('/test/pay').post(app.api.controllers.test.pay);
  app.route('/test/payments').get(app.api.controllers.test.get);
};
