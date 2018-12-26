const required = require("../validation/required");
const isEmpty = require("../validation/is-empty");
const isEmail = require("../validation/is-email");

const VALIDATION_METHODS = {
  required,
  isEmpty,
  isEmail
};

function validateBody(validation) {
  return function(req, res, next) {
    let hasErrors = false;
    const errors = {};

    for (let field in validation) {
      const fieldErrors = [];
      const fieldValidations = validation[field];
      const value = req.body[field];

      for (let fieldValidation in fieldValidations) {
        const validationMethod = VALIDATION_METHODS[fieldValidation];
        const validationMessage = fieldValidations[fieldValidation];

        if (!validationMethod(value)) {
          fieldErrors.push(validationMessage);
        }
      }

      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
        hasErrors = true;
      }
    }

    if (!hasErrors) {
      next();
    } else {
      res.status(400).send(errors);
    }
  };
}

module.exports = validateBody;
