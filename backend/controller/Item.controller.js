
const { Item } = require('../model');

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

    const sortOption = {};
    sortOption[sortBy] = sortOrder === "asc" ? 1 : -1;

    const items = await Item.find(filter)
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
      if (!item) return res.status(404).json({ message: 'Not found' });
      res.json(item);
    } catch (err) { next(err); }
  };

  module.exports = {
    getAllItems,
    getItemById,

  };
