const { Borrow, Item } = require('../model');

const createBorrow = async (req, res, next) => {
  try {
    const { itemId, totalTime } = req.body;

    // Kiểm tra totalTime hợp lệ
    if (typeof totalTime !== 'number' || totalTime <= 0 || totalTime > 540) {
      return res.status(400).json({ message: 'totalTime must be a number between 1 and 540 hours' });
    }

    const item = await Item.findById(itemId);
    if (!item || item.status !== 'available') {
      return res.status(400).json({ message: 'Item not available' });
    }

    const totalPrice = item.isFree ? 0 : item.price * totalTime;
    const borrow = await Borrow.create({
      borrowerClerkId: req.user.id,
      item: itemId,
      totalTime,
      totalPrice
    });

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
