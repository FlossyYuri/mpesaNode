const { body, validationResult } = require('express-validator');
exports.save = [
  body('amount')
    .exists()
    .withMessage('CAMPO OBRIGATORIO')
    .not()
    .isEmpty()
    .withMessage('CAMPO OBRIGATORIO'),
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
