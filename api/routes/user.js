const validate = require('../validators/user');
module.exports = (app) => {
  app.route('/user/login').post(validate.login, app.api.controllers.user.login);

  app
    .route('/user/register')
    .post(validate.register, app.api.controllers.user.register);

  app
    .route('/user/getTotal')
    .all(app.config.passport.authenticate())
    .get(app.api.controllers.user.getTotal);

  app
    .route('/user/getCredit')
    .all(app.config.passport.authenticate())
    .get(app.api.controllers.user.getCredit);

  app.route('/user/update').post(app.api.controllers.user.update);
};
