const { Borrow, Item } = require("../model");
const Return = require("../model/returned.model");

const createBorrow = async (req, res, next) => {
  try {
    const { borrowerClerkId, itemId, totalTime, totalPrice } = req.body;

    if (typeof totalTime !== "number" || totalTime <= 0 || totalTime > 540) {
      return res.status(400).json({
        message: "totalTime must be a number between 1 and 540 hours",
      });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(400).json({ message: "Item not found" });
    }
    if (item.status !== "available") {
      return res
        .status(400)
        .json({ message: "Item is currently not available" });
    }

    // Tạo bản ghi Borrow
    const borrow = await Borrow.create({
      borrowerClerkId,
      item: itemId,
      totalTime,
      totalPrice,
    });

    // Cập nhật trạng thái sản phẩm
    item.status = "notAvailable";
    await item.save();

    res.status(201).json(borrow);
  } catch (err) {
    next(err);
  }
};

const getBorrowHistory = async (req, res) => {
  try {
    const { clerkId } = req.params;

    // Get all borrows for the user
    const borrows = await Borrow.find({ borrowerClerkId: clerkId })
      .populate("item")
      .sort({ createdAt: -1 });

    // Get return status for each borrow
    const borrowsWithReturnStatus = await Promise.all(
      borrows.map(async (borrow) => {
        const returnStatus = await Return.findOne({ borrow: borrow._id });
        return {
          ...borrow.toObject(),
          returnStatus: returnStatus || null,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: borrowsWithReturnStatus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createBorrow,
  getBorrowHistory,
};
