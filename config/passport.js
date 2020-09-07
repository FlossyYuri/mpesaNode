const passport = require('passport');
const passportJwt = require('passport-jwt');
const { Strategy, ExtractJwt } = passportJwt;

module.exports = (app) => {
  const params = {
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  const strategy = new Strategy(params, (payload, done) => {
    app.db
      .collection('users')
      .doc(payload.user.email)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          done(null, doc.data() ? doc.data() : false);
        }
      })
      .catch((err) => done(err, false));
  });

  passport.use(strategy);

  return {
    authenticate: () => passport.authenticate('jwt', { session: false }),
  };
};
