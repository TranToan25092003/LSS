const express = require("express");
const router = new express.Router();
const controller = require("../../controller/client/report.controller");
const ReportDto = require("../../dto/report.dto");
const {
  throwErrors,
} = require("../../middleware/validate-data/throwErrors.middleware");

/**
 * ====================================
 * [POST] /lends
 * create item for lend
 * ====================================
 */
router.post("/", ReportDto, throwErrors, controller.sendReport);

module.exports = router;
