const { body, validationResult } = require('express-validator');
exports.register = [
  body('channel')
    .exists()
    .withMessage('CAMPO OBRIGATORIO')
    .not()
    .isEmpty()
    .isLength({
      min: 3,
    })
    .withMessage('CANAL_INVALIDO_MIN_5'),
  body('name')
    .exists()
    .withMessage('CAMPO OBRIGATORIO')
    .not()
    .isEmpty()
    .isLength({
      min: 5,
    })
    .withMessage('NOME_INVALIDO_MIN_5'),
  body('phone')
    .exists()
    .withMessage('CAMPO OBRIGATORIO')
    .not()
    .isEmpty()
    .withMessage('VAZIO')
    .isLength({
      min: 9,
    })
    .withMessage('TELEFONE_INVALIDO_MIN_9'),
  body('email')
    .exists()
    .withMessage('CAMPO OBRIGATORIO')
    .not()
    .isEmpty()
    .withMessage('VAZIO')
    .isEmail()
    .withMessage('EMAIL_INVALIDO'),
  body('password')
    .exists()
    .withMessage('CAMPO OBRIGATORIO')
    .not()
    .isEmpty()
    .withMessage('VAZIO')
    .isLength({
      min: 5,
    })
    .withMessage('SENHA_INVALIDA_MIN_5'),
  (req, res, next) => {
    validateResults(req, res, next);
  },
];

/**
 * Valida a solicitação de login
 */
exports.login = [
  body('email')
    .exists()
    .withMessage('CAMPO OBRIGATORIO')
    .not()
    .isEmpty()
    .withMessage('VAZIO')
    .isEmail()
    .withMessage('EMAIL_INVALIDO'),
  body('password')
    .exists()
    .withMessage('CAMPO OBRIGATORIO')
    .not()
    .isEmpty()
    .withMessage('VAZIO')
    .isLength({
      min: 5,
    })
    .withMessage('SENHA_INVALIDA_MIN_5'),
  (req, res, next) => {
    validateResults(req, res, next);
  },
];

const validateResults = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }

  res.status(422).json({ errors: result.array() });
};
