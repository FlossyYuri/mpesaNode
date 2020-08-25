const mpesa = require('mpesa-node-api');
module.exports = (app) => {
  const db = app.config.firebase;
  const pay = (req, resp) => {
    mpesa.initializeApi({
      origin: process.env.MPESA_ORIGIN,
      baseUrl: process.env.MPESA_TEST_API_HOST,
      apiKey: process.env.MPESA_TEST_API_KEY,
      publicKey: process.env.MPESA_TEST_PUBLIC_KEY,
      serviceProviderCode: process.env.MPESA_TEST_SERVICE_PROVIDER_CODE,
    });
    const data = { ...req.body };
    if (data) {
      const now = new Date().getTime().toString();
      const channel = data.channel.toUpperCase();
      const username = data.username.toLowerCase();
      const transaction = {
        ref: `${channel}${now}`,
        thirdPartyRef: `${channel}${username}${now}`,
        amount: data.amount,
        phone: data.phone,
        channel,
        username,
        createdAt: Number(now),
      };
      mpesa
        .initiate_c2b(
          transaction.amount,
          Number(`258${transaction.phone}`),
          transaction.ref,
          transaction.thirdPartyRef
        )
        .then(function (response) {
          transaction.id = response.output_TransactionID
            ? `W${response.output_TransactionID}`
            : `W${now}`;
          transaction.ok = response.output_ResponseCode;

          if (response.output_ResponseCode === 'INS-0')
            resp.status(200).json({ message: 'ok', response });
          else
            resp.status(500).json({
              message: 'Oopss, Algo de errado ocorreu.',
              response,
            });
        })
        .catch(function (error) {
          transaction.id =
            error.output_TransactionID || error.output_TransactionID === 'N/A'
              ? `F${now}`
              : error.output_TransactionID;
          transaction.ok = error.output_ResponseCode;
          switch (error.output_ResponseCode) {
            case 'INS-1':
              resp.status(500).json({ message: 'Erro Interno', error });
              break;
            case 'INS-5':
              resp
                .status(401)
                .json({ message: 'O Você cancelou a transação', error });
              break;
            case 'INS-6':
              resp.status(401).json({ message: 'A transação falhou', error });
              break;
            case 'INS-9':
              resp
                .status(408)
                .json({ message: 'Você levou muito tempo', error });
              break;
            case 'INS-10':
              resp.status(409).json({ message: 'Transação Duplicada', error });
              break;
            case 'INS-14':
            case 'INS-19':
              resp.status(400).json({ message: 'Referencia Invalida', error });
              break;
            case 'INS-995':
              resp.status(400).json({
                message:
                  'Existe algum problema com o seu perfil, contacte a VODACOM',
                error,
              });
              break;
            case 'INS-996':
              resp.status(400).json({
                message: 'Conta não está ativa',
                error,
              });
              break;
            case 'INS-2006':
              resp.status(422).json({
                message: 'O seu saldo é insuficiente',
                error,
              });
              break;
            case 'INS-2051':
              resp.status(400).json({
                message: 'Este numero de telefone é inválido.',
                error,
              });
              break;
            default:
              resp.status(500).json({
                message: 'Oouupss, Algo de errado ocorreu.',
                error,
              });
          }
        })
        .finally(() => {
          db.collection('tests')
            .doc(transaction.id)
            .set(transaction)
            .then(() => {
              // console.log(docRef);
            })
            .catch((error) => {
              console.log(error);
            });
        });
    } else {
      resp.send('Sem dados');
    }
  };

  return { pay };
};
