const Item = require("../../model/item.model");
const Lend = require("../../model/lend.model");

/**
 * ====================================
 * [GET] /admin/reviews
 * get all lends
 * ====================================
 */
module.exports.getLendsAdmin = async (req, res) => {
  const lends = await Lend.find().populate("item").sort({
    createdAt: -1,
  });

  return res.status(200).json({
    data: lends,
  });
};

/**
 * ====================================
 * [PUT] /admin/reviews
 * ====================================
 */
module.exports.reviewLends = async (req, res) => {
  const { status, lendId, reason } = req.body;

  try {
    const updateLend = await Lend.findOneAndUpdate(
      {
        _id: lendId,
      },
      {
        $set: {
          status: status,
          rejectReason: reason,
        },
      },
      {
        new: true,
      }
    );
    return res.json({
      data: updateLend,
    });
  } catch (error) {
    return res.status(404).json({
      errors: "Data does not exist",
    });
  }
};

/**
 * ====================================
 * [GET] /admin/reviews/items
 * ====================================
 */
module.exports.getItems = async (req, res) => {
  const items = await Lend.find({
    status: req.query.status,
  })
    .sort({
      createdAt: 1,
    })
    .populate("item");

  return res.status(200).json({
    data: items,
  });
};
