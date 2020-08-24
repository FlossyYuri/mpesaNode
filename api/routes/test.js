module.exports = (app) => {
  app.route('/test/pay').post(app.api.controllers.test.pay);
};
