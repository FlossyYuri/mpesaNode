const { initiate_c2b } = require("./mpesa");

exports.getTransaction = (data, now) => {
  const channel = data.channel.toUpperCase();
  const username = data.username.toLowerCase();
  const ref = channel.substring(0, 20 - now.length);
  return {
    ref: `${ref}${now}`,
    thirdPartyRef: `${channel}${username}${now}`,
    amount: Number(data.amount),
    phone: data.phone,
    channel,
    username,
    createdAt: Number(now),
  };
};

exports.initializeMpesa = (mpesa, mode) => {
  if (mode === 'PRODUCTION')
    mpesa.initializeApi({
      origin: process.env.MPESA_ORIGIN,
      baseUrl: process.env.MPESA_API_HOST,
      apiKey: process.env.MPESA_API_KEY,
      publicKey: process.env.MPESA_PUBLIC_KEY,
      serviceProviderCode: process.env.MPESA_SERVICE_PROVIDER_CODE,
    });
  else
    mpesa.initializeApi({
      origin: process.env.MPESA_ORIGIN,
      baseUrl: process.env.MPESA_TEST_API_HOST,
      apiKey: process.env.MPESA_TEST_API_KEY,
      publicKey: process.env.MPESA_TEST_PUBLIC_KEY,
      serviceProviderCode: process.env.MPESA_TEST_SERVICE_PROVIDER_CODE,
    });
};

exports.c2b = async (transaction) => {
  return await initiate_c2b(
    transaction.amount,
    Number(`258${transaction.phone}`),
    transaction.ref,
    transaction.thirdPartyRef
  );
};

exports.registerTransaction = (transaction, db, mode) => {
  const collection = mode === 'PRODUCTION' ? 'payments' : 'tests';
  db.collection(collection)
    .doc(transaction.id)
    .set(transaction)
    .then(() => {
      // console.log(docRef);
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.successCase = (resp, data) => {
  if (data.output_ResponseCode === 'INS-0')
    resp.status(200).json({ message: 'ok', data });
  else
    resp.status(500).json({
      message: 'Oopss, Algo de errado ocorreu.',
      data,
    });
};

exports.allErrorCases = (resp, error) => {
  switch (error.output_ResponseCode) {
    case 'INS-1':
      resp.status(500).json({ message: 'Erro Interno', error });
      break;
    case 'INS-5':
      resp.status(401).json({ message: 'O Você cancelou a transação', error });
      break;
    case 'INS-6':
      resp.status(401).json({ message: 'A transação falhou', error });
      break;
    case 'INS-9':
      resp.status(408).json({ message: 'Você levou muito tempo', error });
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
        message: 'Existe algum problema com o seu perfil, contacte a VODACOM',
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
};
