
const { Item } = require('../model');

const getAllItems = async (req, res, next) => {
    try {
      const items = await Item.find({ status: 'available' });
      res.json(items);
    } catch (err) { next(err); }
  };
  
const getItemById = async (req, res, next) => {
    try {
      const item = await Item.findById(req.params.id);
      if (!item) return res.status(404).json({ message: 'Not found' });
      res.json(item);
    } catch (err) { next(err); }
  };

  module.exports = {
    getAllItems,
    getItemById,

  };
