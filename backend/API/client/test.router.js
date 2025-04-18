const express = require("express");
const router = new express.Router();
const controller = require("../../controller/test.controller");

router.get("/", controller.checkHealth);

module.exports = router;
