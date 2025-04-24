const { body } = require("express-validator");

const itemValidation = [
  body("name").isString().notEmpty().withMessage("Name is required"),

  body("category").isString().notEmpty().withMessage("Category is required"),

  body("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array")
    .default([]),

  body("description")
    .isString()
    .notEmpty()
    .withMessage("Description is required"),

  body("price")
    .customSanitizer((value) => {
      if (typeof value === "string" || typeof value === "number") {
        return Number(value);
      }
      return undefined;
    })
    .isFloat({ min: 0 })
    .withMessage("Price must be positive"),

  body("rate")
    .isIn(["hour", "day"])
    .withMessage("Rate must be one of: hour, day"),

  body("isFree").isBoolean().withMessage("isFree must be a boolean"),

  body("status")
    .isIn(["available", "notAvailable"])
    .withMessage("Status must be one of: available or unavailable"),
];

module.exports = itemValidation;
