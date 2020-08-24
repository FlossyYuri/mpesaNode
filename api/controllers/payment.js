const mpesa = require('mpesa-node-api');
module.exports = (app) => {
  const pay = (req, resp) => {
    mpesa.initializeApi({
      baseUrl: process.env.MPESA_API_HOST,
      origin: process.env.MPESA_ORIGIN,
      apiKey: process.env.MPESA_API_KEY,
      publicKey: process.env.MPESA_PUBLIC_KEY,
      serviceProviderCode: process.env.MPESA_SERVICE_PROVIDER_CODE,
    });
    const data = { ...req.body };
    if (data) {
      mpesa
        .initiate_c2b(
          /* amount */ data.amount,
          /* msisdn */ Number(`258${data.phone}`),
          /* transaction ref */ 'T12344CAA4345',
          /*3rd party ref*/ 'ref22323'
        )
        .then(function (response) {
          // logging the response
          resp.send(response);
        })
        .catch(function (error) {
          // TODO: handle errors
          resp.send(error);
        });
    } else {
      resp.send('Sem dados');
    }
  };

  return { pay };
};
