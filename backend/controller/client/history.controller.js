const Borrow = require("../../model/borrow.model");
const Return = require("../../model/returned.model");
const Item = require("../../model/item.model");

/**
 * ====================================
 * [GET] /history
 * get user's borrow history
 * ====================================
 */
module.exports.getUserHistory = async (req, res) => {
  try {
    console.log("Getting history for user:", req.auth.userId);

    // Lấy tất cả các lần mượn của người dùng
    const borrows = await Borrow.find({
      borrowerClerkId: req.auth.userId,
    }).populate({
      path: "item",
      model: Item,
    });

    console.log("Found borrows:", borrows);

    // Lấy thông tin trả đồ tương ứng
    const history = await Promise.all(
      borrows.map(async (borrow) => {
        const returnInfo = await Return.findOne({ borrow: borrow._id });
        console.log("Return info for borrow", borrow._id, ":", returnInfo);

        return {
          _id: borrow._id,
          item: borrow.item,
          totalTime: borrow.totalTime,
          totalPrice: borrow.totalPrice,
          createdAt: borrow.createdAt,
          returnInfo: returnInfo
            ? {
                timeReturned: returnInfo.timeReturned,
                ownerConfirm: returnInfo.ownerConfirm,
                borrowerConfirm: returnInfo.borrowerConfirm,
              }
            : null,
        };
      })
    );

    console.log("Final history:", history);

    return res.status(200).json({
      data: history,
    });
  } catch (error) {
    console.error("Error in getUserHistory:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
