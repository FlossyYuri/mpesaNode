const validate = require('../validators/withdraw');
module.exports = (app) => {
  app
    .route('/withdraws')
    .all(app.config.passport.authenticate())
    .get(app.api.controllers.withdraw.get);

  app
    .route('/withdraw')
    .all(app.config.passport.authenticate())
    .post(validate.save, app.api.controllers.withdraw.save);
};
