const express = require("express");
const router = express.Router();
const {
  createBorrow,
  getBorrowHistory,
  getAllBorrows,
} = require("../../controller/borrow.controller");
const { requireAuth } = require("@clerk/express");

router.post("/", createBorrow);
router.get("/history/:clerkId", requireAuth(), getBorrowHistory);
router.get("/all", requireAuth(), getAllBorrows);

module.exports = router;
