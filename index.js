const app = require('express')();
const consign = require('consign');
app.set('port', process.env.PORT || 5000);
consign()
  .then('./config/middleware.js')
  .then('./api/controllers')
  .then('./api/routes')
  .into(app);
app.listen(app.get('port'), () => {
  console.log('Backend executando...');
});
