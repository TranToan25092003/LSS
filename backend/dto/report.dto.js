const { body } = require("express-validator");

const ReportDto = [
  body("title")
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  body("description")
    .notEmpty()
    .withMessage("Description cannot be empty")
    .isLength({ max: 10000000 })
    .withMessage("Description cannot exceed 10000000 characters"),
];

module.exports = ReportDto;
