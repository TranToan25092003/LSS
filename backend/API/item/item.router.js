// API/items/item.routes.js
const express = require('express');
const router = express.Router();
const { 
    getAllItems,
    getItemById,
    updateItem,
    deleteItem
} = require('../../controller/Item.controller');

router.get('/', getAllItems);
router.get('/:id', getItemById);
router.put('/update/:id', updateItem);
router.delete('/delete/:id', deleteItem);


module.exports = router;