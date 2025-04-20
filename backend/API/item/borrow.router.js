const express = require('express');
const router = express.Router();
const {createBorrow} = require('../../controller/borrow.controller');

// Tạo borrow mới
router.post('/', createBorrow);

module.exports = router;