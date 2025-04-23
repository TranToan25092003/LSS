const express = require("express");
const router = express.Router();
const returnController = require("../../controller/return.controller");

const { checkHeaders } = require("../../middleware/guards/authen.middleware");
const { requireAuth } = require("@clerk/express");

router.use(checkHeaders, requireAuth());

/**
 * Người mượn xác nhận đã trả đồ
 * Body: { borrowId }
 */
router.post("/borrower-confirm", returnController.borrowerConfirmReturn);

/**
 * Chủ đồ xác nhận đã nhận lại đồ
 * Body: { borrowId }
 */
router.post("/owner-confirm", returnController.ownerConfirmReturn);

/**
 * Lấy toàn bộ lịch sử trả đồ (admin hoặc test)
 */
router.get("/all", returnController.getAllReturns);

module.exports = router;
