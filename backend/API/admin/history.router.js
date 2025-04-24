const express = require("express");
const router = new express.Router();
const controller = require("../../controller/admin/history.controller");

/**
 * ====================================
 * [GET] /admin/history
 * get all lends
 * ====================================
 */
router.get("/", controller.getHistory);

/**
 * ====================================
 * [GET] /admin/history/report
 * ====================================
 */
router.get("/report", controller.getReport);

module.exports = router;
