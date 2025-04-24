const { body } = require("express-validator");

const validateLendStatus = [
  body("status")
    .isString()
    .isIn(["approved", "rejected"])
    .withMessage("Invalid status, status must is approved or rejected"),
];

const validateItemStatus = [
  body("status")
    .isString()
    .isIn(["available", "notAvailable"])
    .withMessage("Invalid status, status must is approved or rejected"),
];

module.exports = validateLendStatus;
module.exports = validateItemStatus;
