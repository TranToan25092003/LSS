const express = require("express");
const router = express.Router();
const controller = require("../../controller/client/history.controller");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
require("dotenv").config();

// Sử dụng middleware xác thực của Clerk
router.use(ClerkExpressRequireAuth());

/**
 * ====================================
 * [GET] /history
 * get user's borrow history
 * ====================================
 */
router.get("/", controller.getUserHistory);

module.exports = router;
