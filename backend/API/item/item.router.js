// API/items/item.routes.js
const express = require("express");
const router = express.Router();
const {
  getAllItems,
  getItemById,
} = require("../../controller/Item.controller");

router.get("/", getAllItems);
router.get("/:id", getItemById);

module.exports = router;
