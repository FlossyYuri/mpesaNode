module.exports = (app) => {
  app.route('/test/pay').post(app.api.controllers.test.pay);
  app
    .route('/test/payments')
    // .all(app.config.passport.authenticate())
    .get(app.api.controllers.test.get);
};
