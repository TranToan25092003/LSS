const express = require("express");
const router = express.Router();
const { getUserById } = require("../../controller/user.controller");
const { requireAuth } = require("@clerk/express");

router.get("/:clerkId", requireAuth(), getUserById);

module.exports = router; 