const { Item } = require("../model");
const Borrow = require("../model/borrow.model");
const Return = require("../model/returned.model");
const { clerkClient } = require("../config/clerk");

const getLendHistory = async (req, res) => {
  try {
    const { clerkId } = req.params;

    // Get all items owned by the user
    const items = await Item.find({ ownerClerkId: clerkId });
    const itemIds = items.map((item) => item._id);

    // Get all borrows for these items
    const borrows = await Borrow.find({ item: { $in: itemIds } })
      .populate("item")
      .sort({ createdAt: -1 });

    // Get return status and user info for each borrow
    const borrowsWithDetails = await Promise.all(
      borrows.map(async (borrow) => {
        const [returnStatus, borrowerUser] = await Promise.all([
          Return.findOne({ borrow: borrow._id }),
          clerkClient.users.getUser(borrow.borrowerClerkId),
        ]);

        return {
          ...borrow.toObject(),
          returnStatus: returnStatus || null,
          borrowerName: borrowerUser
            ? `${borrowerUser.firstName} ${borrowerUser.lastName}`
            : "Unknown User",
        };
      })
    );

    res.status(200).json({
      success: true,
      data: borrowsWithDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getLendHistory,
};
