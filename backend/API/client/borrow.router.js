const express = require("express");
const router = express.Router();
const {
  createBorrow,
  getBorrowHistory,
} = require("../../controller/borrow.controller");

// ... existing code ...

router.get("/history/:clerkId", getBorrowHistory);

module.exports = router;
