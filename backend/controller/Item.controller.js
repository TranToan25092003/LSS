const { clerkClient } = require("../config/clerk");
const { Item, Lend } = require("../model");

const getAllItems = async (req, res) => {
  try {
    const {
      category,
      status,
      rate,
      isFree,
      minPrice = 0,
      maxPrice = 100000000,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const filter = {
      price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
    };

    // Search theo tiêu đề hoặc mô tả
    const search = req.query.search;
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (category) {
      filter.category = { $regex: new RegExp(category, "i") };
    }

    if (status) {
      filter.status = status;
    }

    if (rate) {
      filter.rate = rate;
    }

    if (isFree === "true") {
      filter.price = 0;
    }

    const totalItems = await Item.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limit);

    const lends = await Lend.find({
      status: "approved",
    }).select("item -_id");

    const data = lends.map((item) => {
      return item.item;
    });

    filter._id = {
      $in: data,
    };

    const sortOption = {};
    sortOption[sortBy] = sortOrder === "asc" ? 1 : -1;
    let items = await Item.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sortOption);

    res.json({
      page,
      limit,
      totalItems,
      totalPages,
      items,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách items:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách items", error: error.message });
  }
};

const getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, description, price, isFree, rate, status, images } =
      req.body;

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Update fields
    item.name = name || item.name;
    item.category = category || item.category;
    item.description = description || item.description;
    item.price = isFree ? 0 : price || item.price;
    item.isFree = isFree !== undefined ? isFree : item.isFree;
    item.rate = rate || item.rate;
    item.status = status || item.status;
    item.images = images || item.images;

    const updatedItem = await item.save();
    res.json({
      message: "Item updated successfully",
      item: updatedItem,
    });
  } catch (err) {
    console.error("Lỗi khi cập nhật item:", err);
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật item", error: err.message });
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Xóa tất cả bản ghi mượn liên quan đến item
    await Lend.deleteMany({ item: id });

    // Xóa item
    await item.deleteOne(); // Thay remove() bằng deleteOne()
    res.json({ message: "Item and related lends deleted successfully" });
  } catch (err) {
    console.error("Lỗi khi xóa item:", err);
    res.status(500).json({ message: "Lỗi khi xóa item", error: err.message });
  }
};

module.exports = {
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
};
