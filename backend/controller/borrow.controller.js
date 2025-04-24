const { Borrow, Item } = require('../model');

const createBorrow = async (req, res, next) => {
  try {
    const { borrowerClerkId, itemId, totalTime, totalPrice } = req.body;

    
    if (typeof totalTime !== 'number' || totalTime <= 0 || totalTime > 540) {
      return res.status(400).json({ message: 'totalTime must be a number between 1 and 540 hours' });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(400).json({ message: 'Item not found' });
    }
    if (item.status !== 'available') {
      return res.status(400).json({ message: 'Item is currently not available' });
    }
    

    // Tạo bản ghi Borrow
    const borrow = await Borrow.create({
      borrowerClerkId,
      item: itemId,
      totalTime,
      totalPrice,
    });

    // Cập nhật trạng thái sản phẩm
    item.status = 'notAvailable';
    await item.save();

    res.status(201).json(borrow);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBorrow,
};