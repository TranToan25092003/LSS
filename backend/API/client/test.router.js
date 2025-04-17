const express = require("express");
const router = new express.Router();
const controller = require("../../controller/test.controller");
const {
  throwErrors,
} = require("../../middleware/validate-data/throwErrors.middleware");
const validateActivityLog = require("../../dto/log.dto");

router.get("/", validateActivityLog, throwErrors, controller.checkHealth);

module.exports = router;
