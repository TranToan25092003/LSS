const express = require("express");
const router = new express.Router();
const controller = require("../../controller/admin/review.controller");
const { clerkClient } = require("../../config/clerk");
const {
  throwErrors,
} = require("../../middleware/validate-data/throwErrors.middleware");
const validateLendStatus = require("../../dto/lendStatus.dto");

/**
 * ====================================
 * [GET] /admin/reviews
 * get all lends
 * ====================================
 */
router.get("/", controller.getLendsAdmin);

/**
 * ====================================
 * [PUT] /admin/reviews
 * ====================================
 */
router.put("/", validateLendStatus, throwErrors, controller.reviewLends);

/**
 * ====================================
 * [GET] /admin/reviews/items
 * ====================================
 */
router.get("/items", controller.getItems);

module.exports = router;
