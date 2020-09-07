const validate = require('../validators/user');
module.exports = (app) => {
  app.route('/user/login').post(validate.login, app.api.controllers.user.login);

  app
    .route('/user/register')
    .post(validate.register, app.api.controllers.user.register);

  app.route('/user/update').post(app.api.controllers.user.update);
};
