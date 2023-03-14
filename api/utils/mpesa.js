const crypto = require('crypto');
const constants = require('constants');
const axios = require('axios')

function _getBearerToken(mpesa_public_key, mpesa_api_key) {
  const publicKey = "-----BEGIN PUBLIC KEY-----\n" + mpesa_public_key + "\n" + "-----END PUBLIC KEY-----";
  const buffer = Buffer.from(mpesa_api_key);
  const encrypted = crypto.publicEncrypt({
    'key': publicKey,
    'padding': constants.RSA_PKCS1_PADDING,
  }, buffer);
  return encrypted.toString("base64");
}


const CONFIG = {
  BASE_URL: process.env.MPESA_TEST_API_HOST,
  PUBLIC_KEY: process.env.MPESA_TEST_PUBLIC_KEY,
  API_KEY: process.env.MPESA_TEST_API_KEY,
  ORIGIN: process.env.MPESA_ORIGIN,
  SERVICE_PROVIDER_CODE: process.env.MPESA_TEST_SERVICE_PROVIDER_CODE,
}

exports.initiate_c2b = async function (amount, msisdn, transaction_ref, thirdparty_ref) {
  console.log(CONFIG)
  try {
    const response = await axios({
      method: 'post',
      url: 'https://' + CONFIG.BASE_URL + ':18352/ipg/v1x/c2bPayment/singleStage/',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + _getBearerToken(CONFIG.PUBLIC_KEY, CONFIG.API_KEY),
        'Origin': CONFIG.ORIGIN
      },
      data: {
        "input_TransactionReference": transaction_ref,
        "input_CustomerMSISDN": msisdn,
        "input_Amount": amount + "",
        "input_ThirdPartyReference": thirdparty_ref,
        "input_ServiceProviderCode": CONFIG.SERVICE_PROVIDER_CODE + ""
      }
    });
    return response.data;
  } catch (e) {
    console.log({ e: e.response.data })
    if (e.response.data) {
      throw e.response.data;
    } else {
      throw e;
    }
  }
};