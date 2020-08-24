const mongoose = require('mongoose');
const loadModels = require('../app/models');

module.exports = () => {
  const connect = () => {
    mongoose.Promise = global.Promise;
    let DB_URL = '';
    const startupMode = process.env.NODE_ENV.toLocaleUpperCase();

    if (startupMode === 'PRODUCTION') {
      DB_URL = process.env.MONGO_URI;
    } else {
      DB_URL = process.env.MONGO_URI_TEST;
    }

    mongoose.connect(
      DB_URL,
      {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      },
      (err) => {
        // Se houver algum erro depois da conexão apresente no log
        let dbStatus = '';

        if (err) {
          dbStatus = `*    Error connecting to DB: ${err}\n****************************\n`;
        } else {
          dbStatus = `*   DB Connection: OK       *\n*****************************\n`;
        }

        if (startupMode === 'HOMOLOGATION') {
          // Prints initialization
          console.log('\n*****************************');
          console.log('*   Starting Server         *');
          console.log(`*   Port: ${process.env.PORT || 3000}              *`);
          console.log(`*   NODE_ENV: ${startupMode}  *`);
          console.log(`*   Database: MongoDB       *`);
          console.log(dbStatus);
          // require('opn')(`http://localhost:${process.env.PORT || 3000}`)
        }
        if (startupMode === 'PRODUCTION') {
          console.log('\n*****************************');
          console.log(dbStatus);
        }
      }
    );
  };

  connect();

  mongoose.connection.on('error', (err) => {
    console.log(err);
  });
  mongoose.connection.on('disconnected', connect);
};
