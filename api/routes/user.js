module.exports = (app) => {
  app.route('/user/signIn').post(app.api.controllers.user.signIn);
  app.route('/user/signUp').post(app.api.controllers.user.signUp);
  app.route('/user/update').post(app.api.controllers.user.update);
};
