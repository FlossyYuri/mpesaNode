const mpesa = require('mpesa-node-api');
module.exports = (app) => {
  const pay = (req, resp) => {
    mpesa.initializeApi({
      origin: process.env.MPESA_ORIGIN,
      baseUrl: process.env.MPESA_API_HOST,
      apiKey: process.env.MPESA_API_KEY,
      publicKey: process.env.MPESA_PUBLIC_KEY,
      serviceProviderCode: process.env.MPESA_SERVICE_PROVIDER_CODE,
    });
    const data = { ...req.body };
    if (data) {
      mpesa
        .initiate_c2b(
          data.amount,
          Number(`258${data.phone}`),
          `TEST${Math.round(Math.random() * 100000000)}`,
          `Test${Math.round(Math.random() * 100000000)}`
        )
        .then(function (response) {
          resp.send(response);
        })
        .catch(function (error) {
          resp.send(error);
        });
    } else {
      resp.send('Sem dados');
    }
  };

  return { pay };
};
