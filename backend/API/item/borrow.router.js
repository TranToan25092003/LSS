const express = require('express');
const router = express.Router();
const { createBorrow } = require('../../controller/borrow.controller');

router.post('/', createBorrow);

module.exports = router;