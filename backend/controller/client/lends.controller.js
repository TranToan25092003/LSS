const Item = require("../../model/item.model");
const Lend = require("../../model/lend.model");

/**
 * ====================================
 * [POST] /lends
 * create item for lend
 * ====================================
 */
module.exports.createLends = async (req, res) => {
  try {
    const newItem = await Item.create({
      ownerClerkId: req.auth.userId,
      ...req.body,
    });

    const newLend = await Lend.create({
      item: newItem.id + "",
      status: "pending",
    });

    return res.json({
      message: "Waiting for approved",
      // data: newLend,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      errors: "Something wrong",
    });
  }
};

/**
 * ====================================
 * [GET]
 * get all supplies approved
 * ====================================
 */
module.exports.getLendsSupplies = async (req, res) => {
  const items = await Lend.find({
    status: "approved",
    item: {
      $in: await Item.find({ ownerClerkId: req.auth.userId }).distinct("_id"),
    },
  })
    .sort({
      createdAt: 1,
    })
    .populate("item");

  return res.status(200).json({
    data: items,
  });
};

/**
 * ====================================
 * [PUT] /lends/supplies/:id
 * update lend status
 * ====================================
 */

module.exports.getItemById = async (req, res) => {
  console.log("9999999999999999999999999999999999999999999");

  try {
    const lend = await Lend.findOne({
      item: req.params.id,
      status: "approved",
    }).populate("item");

    if (!lend || !lend.item) {
      return res.status(404).json({ message: "Lend item not found" });
    }

    // Verify ownership
    if (lend.item.ownerClerkId !== req.auth.userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    return res.status(200).json(lend);
  } catch (error) {
    console.error("Error fetching lend item:", error);
    return res.status(500).json({
      message: "Error fetching lend item",
      error: error.message,
    });
  }
};

module.exports.updateLendStatus = async (req, res) => {
  console.log(req.params.id);

  console.log(req.body);

  res.json({
    message: "success",
  });
};
