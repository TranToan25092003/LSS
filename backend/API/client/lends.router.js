const express = require("express");
const router = new express.Router();
const controller = require("../../controller/client/lends.controller");
const itemValidation = require("../../dto/item.dto");
const {
  throwErrors,
} = require("../../middleware/validate-data/throwErrors.middleware");
const { validateItemStatus } = require("../../dto/lendStatus.dto");
const { getLendHistory } = require("../../controller/lend.controller");
const { requireAuth } = require("@clerk/express");

/**
 * ====================================
 * [POST] /lends
 * create item for lend
 * ====================================
 */
router.post("/", itemValidation, throwErrors, controller.createLends);

/**
 * ====================================
 * [GET] /lends/supplies
 * get all supplies approved
 * ====================================
 */
router.get("/supplies", controller.getLendsSupplies);

/**
 * ====================================
 * [PUT] /lends/supplies/:id
 * update lend status
 * ====================================
 */
router.put(
  "/supplies/:id",
  validateItemStatus,
  throwErrors,
  controller.updateLendStatus
);

router.get("/history/:clerkId", requireAuth(), getLendHistory);

module.exports = router;
