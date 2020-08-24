const mpesa = require('mpesa-node-api');
module.exports = (app) => {
  const pay = (req, resp) => {
    mpesa.initializeApi({
      baseUrl: process.env.MPESA_API_HOST,
      origin: process.env.MPESA_ORIGIN,
      apiKey: process.env.MPESA_TEST_API_KEY,
      publicKey: process.env.MPESA_TEST_PUBLIC_KEY,
      serviceProviderCode: process.env.MPESA_TEST_SERVICE_PROVIDER_CODE,
    });
    const data = { ...req.body };
    const transaction = { id: 'T123443CAA423', thirdPartyID: 'Teste1' };
    if (data) {
      mpesa
        .initiate_c2b(
          data.amount,
          Number(`258${data.phone}`),
          transaction.id,
          transaction.thirdPartyID
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
