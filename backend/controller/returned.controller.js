const Return = require("../model/returned.model");
const Borrow = require("../model/borrow.model");
const Lend = require("../model/lend.model");
const Item = require("../model/item.model");

module.exports.borrowerConfirmReturn = async (req, res) => {
  const borrowerId = req.auth.userId;
  // const borrowerId = "borrower_xyz_001";// test hardcode
  const { borrowId, confirmStatus } = req.body;
  console.log(req.body);

  if (!borrowId) {
    return res.status(400).json({ message: "Missing borrowId" });
  }

  try {
    const borrow = await Borrow.findById(borrowId);
    if (!borrow) {
      return res.status(404).json({ message: "Borrow record not found" });
    }

    if (borrow.borrowerClerkId !== borrowerId) {
      return res
        .status(403)
        .json({ message: "You are not the borrower of this item" });
    }

    const existingReturn = await Return.findOne({ borrow: borrowId });

    if (existingReturn) {
      // Nếu đã tồn tại bản ghi return
      existingReturn.borrowerConfirm = confirmStatus; // Cập nhật trạng thái confirm
      await existingReturn.save();
      return res
        .status(200)
        .json({ message: "Return status updated", data: existingReturn });
    } else {
      // Nếu không có bản ghi return
      const newReturn = await Return.create({
        borrowerConfirm: confirmStatus,
        borrow: borrowId,
      });

      res
        .status(201)
        .json({ message: "Return created and confirmed", data: newReturn });
    }
  } catch (err) {
    console.error("borrowerConfirmReturn error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// module.exports.ownerConfirmReturn = async (req, res) => {
//     const ownerClerkId = req.auth.userId;
//     //const ownerClerkId = "owner_abc_001"; //test hardcode
//     const { itemId, confirmStatus } = req.body;
//     console.log(req.body);

//     if (!itemId) {
//         return res.status(400).json({ message: "Missing itemId" });
//     }

//     try {
//         const item = await Item.findById(itemId);

//         if (!item) {
//             return res.status(404).json({ message: "Item not found" });
//         }

//         if (item.ownerClerkId !== ownerClerkId) {
//             return res.status(403).json({ message: "You are not the owner of this item" });
//         }

//         // Tìm bản ghi borrow theo item
//         const borrowRecord = await Borrow.findOne({ item: itemId }).sort({ createdAt: -1 });
//         if (!borrowRecord) {
//             return res.status(404).json({ message: "Borrow record not found" });
//         }

//         //Tìm bản ghi return theo borrowId
//         const returnRecord = await Return.findOne({ borrow: borrowRecord._id });

//         if (!returnRecord) {
//             return res.status(404).json({ message: "Return record not found" });
//         }

//         if (!returnRecord.borrowerConfirm) {
//             return res.status(400).json({ message: "Borrower has not confirmed return yet" });
//         }

//         //overTime
//         const createdAt = borrowRecord.createdAt;
//         const allowedHours = borrowRecord.totalTime;
//         const now = new Date();
//         const usedHours = (now - createdAt) / (1000 * 60 * 60);
//         const overtime = Math.max(0, usedHours - allowedHours);

//         //Cập nhật return + item
//         returnRecord.ownerConfirm = true;
//         returnRecord.timeReturned = now;
//         returnRecord.overTime = Math.round(overtime * 100) / 100;
//         await returnRecord.save();

//         item.status = "available";
//         await item.save();

//         res.status(200).json({
//             message: "Owner confirmed return",
//             data: {
//                 returnRecord,
//                 item,
//             },
//         });
//     } catch (err) {
//         console.error("ownerConfirmReturn error:", err);
//         res.status(500).json({ message: "Server error" });
//     }
// };

module.exports.ownerConfirmReturn = async (req, res) => {
  const ownerClerkId = req.auth.userId;
  //const ownerClerkId = "owner_abc_001"; //test hardcode
  const { itemId, confirmStatus } = req.body;
  console.log(req.body);

  if (!itemId) {
    return res.status(400).json({ message: "Missing itemId" });
  }

  try {
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.ownerClerkId !== ownerClerkId) {
      return res
        .status(403)
        .json({ message: "You are not the owner of this item" });
    }

    // Tìm bản ghi borrow theo item
    const borrowRecord = await Borrow.findOne({ item: itemId }).sort({
      createdAt: -1,
    });
    if (!borrowRecord) {
      return res.status(404).json({ message: "Borrow record not found" });
    }

    // Tìm bản ghi return theo borrowId
    const returnRecord = await Return.findOne({ borrow: borrowRecord._id });

    if (!returnRecord) {
      return res.status(404).json({ message: "Return record not found" });
    }

    if (!returnRecord.borrowerConfirm) {
      return res
        .status(400)
        .json({ message: "Borrower has not confirmed return yet" });
    }

    // Tính thời gian quá hạn
    const createdAt = borrowRecord.createdAt;
    const allowedHours = borrowRecord.totalTime;
    const now = new Date();
    const usedHours = (now - createdAt) / (1000 * 60 * 60);
    const overtime = Math.max(0, usedHours - allowedHours);

    // Cập nhật trạng thái ownerConfirm thành true hoặc false
    returnRecord.ownerConfirm = confirmStatus; // Set trạng thái confirmStatus từ client
    returnRecord.timeReturned = confirmStatus ? now : null; // Nếu xác nhận, set thời gian trả lại, nếu không set null
    returnRecord.overTime = confirmStatus
      ? Math.round(overtime * 100) / 100
      : 0; // Nếu xác nhận, tính overtime
    await returnRecord.save();

    if (confirmStatus) {
      item.status = "available"; // Nếu ownerConfirm là true, thay đổi trạng thái của item
    } else {
      item.status = "notAvailable"; // Nếu ownerConfirm là false, trạng thái item có thể là unavailable
    }
    await item.save();

    res.status(200).json({
      message: confirmStatus
        ? "Owner confirmed return"
        : "Owner undone confirm",
      data: {
        returnRecord,
        item,
      },
    });
  } catch (err) {
    console.error("ownerConfirmReturn error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// module.exports.ownerConfirmReturn = async (req, res) => {
//     const ownerClerkId = req.auth.userId;
//     const { itemId } = req.body;

//     if (!itemId) {
//         return res.status(400).json({ message: "Missing itemId" });
//     }

//     try {
//         const item = await Item.findById(itemId);
//         if (!item) {
//             return res.status(404).json({ message: "Item not found" });
//         }

//         if (item.ownerClerkId !== ownerClerkId) {
//             return res.status(403).json({ message: "You are not the owner of this item" });
//         }

//         // Tìm bản ghi borrow theo itemId
//         const borrowRecord = await Borrow.findOne({ item: itemId });
//         if (!borrowRecord) {
//             return res.status(404).json({ message: "Borrow record not found" });
//         }

//         // Tìm bản ghi return theo borrowId
//         const returnRecord = await Return.findOne({ borrow: borrowRecord._id });

//         if (!returnRecord) {
//             return res.status(404).json({ message: "Return record not found" });
//         }

//         if (!returnRecord.borrowerConfirm) {
//             return res.status(400).json({ message: "Borrower has not confirmed return yet" });
//         }

//         // overTime
//         const createdAt = borrowRecord.createdAt;
//         const allowedHours = borrowRecord.totalTime;
//         const now = new Date();
//         const usedHours = (now - createdAt) / (1000 * 60 * 60);
//         const overtime = Math.max(0, usedHours - allowedHours);

//         // Cập nhật return + item
//         returnRecord.ownerConfirm = true;
//         returnRecord.timeReturned = now;
//         returnRecord.overTime = Math.round(overtime * 100) / 100;
//         await returnRecord.save();

//         item.status = "available";
//         await item.save();

//         res.status(200).json({
//             message: "Owner confirmed return",
//             data: {
//                 returnRecord,
//                 item,
//             },
//         });
//     } catch (err) {
//         console.error("ownerConfirmReturn error:", err);
//         res.status(500).json({ message: "Server error" });
//     }
// };

// Lấy toàn bộ lịch sử trả đồ
// module.exports.getAllReturns = async (req, res) => {
//     const userId = req.auth.userId;

//     try {
//         const returns = await Return.find()
//             .populate("borrow")
//             .sort({ createdAt: -1 });

//         // Lọc thủ công sau khi populate
//         const filtered = returns.filter(ret => {
//             const borrowerMatch = ret.borrow?.borrowerClerkId == userId;
//             const ownerMatch = ret.borrow?.item && ret.borrow.item.ownerClerkId == userId;
//             return borrowerMatch || ownerMatch;
//         });

//         res.status(200).json({ data: filtered });
//     } catch (err) {
//         console.error("getAllReturns error:", err);
//         res.status(500).json({ message: "Server error" });
//     }
// };

// module.exports.getAllReturns = async (req, res) => {
//     const userId = req.auth.userId;

//     try {
//         // Lấy các bản ghi từ bảng Borrow và Lend
//         const borrowRecords = await Borrow.find({ borrowerClerkId: userId })
//             .populate("item") // Lấy thông tin item từ bảng Item
//             .sort({ createdAt: -1 });

//         const lendRecords = await Lend.find({ "item.ownerClerkId": userId })
//             .populate("item") // Lấy thông tin item từ bảng Item
//             .sort({ createdAt: -1 });

//         // Gộp các bản ghi mượn (borrow) và cho mượn (lend)
//         const allRecords = [...borrowRecords, ...lendRecords];

//         // Nếu có các bản ghi mượn thì map qua và thêm thông tin cần thiết
//         const returnData = allRecords.map((record) => {
//             // Kiểm tra nếu là mượn (borrow) thì không có return, ngược lại sẽ có returnRecord
//             const isBorrow = record instanceof Borrow;
//             const returnRecord = isBorrow ? null : record; // Thêm nếu có bảng Return, nếu không thì trả null

//             return {
//                 _id: record._id,
//                 borrowerClerkId: record.borrowerClerkId || record.item.ownerClerkId, // Tạo dữ liệu giống với Return
//                 ownerClerkId: record.item.ownerClerkId,
//                 item: record.item.name,
//                 itemId: record.item._id, // Thêm itemId từ bảng Item
//                 itemStatus: record.item.status,
//                 timeReturned: returnRecord ? returnRecord.timeReturned : "Not Returned", // Thêm thông tin trả lại nếu có
//                 overTime: returnRecord ? returnRecord.overTime : 0, // Nếu có Return thì tính overtime
//                 createdAt: record.createdAt,
//             };
//         });

//         res.status(200).json({ data: returnData });
//     } catch (err) {
//         console.error("getAllReturns error:", err);
//         res.status(500).json({ message: "Server error" });
//     }
// };

const mongoose = require("mongoose"); // Đảm bảo mongoose được import

module.exports.getAllReturns = async (req, res) => {
  const userId = req.auth.userId; // Lấy userId từ xác thực người dùng (JWT hoặc session)

  try {
    let allRecords = [];

    // Bước 1: Lấy tất cả itemId mà người dùng là chủ sở hữu (ownerClerkId) từ bảng Item
    const itemRecords = await Item.find({
      ownerClerkId: userId,
      status: "notAvaialble",
    }) // Truy vấn theo ownerClerkId
      .select("_id") // Lấy chỉ ID của item
      .sort({ createdAt: -1 });

    // Bước 2: Sử dụng itemId để lấy các bản ghi trong bảng Lend
    const lendRecords = await Lend.find({
      item: { $in: itemRecords.map((item) => item._id) },
    }) // Sử dụng $in để tìm tất cả itemId
      .populate("item") // Lấy thông tin item từ bảng Item
      .sort({ createdAt: -1 });

    console.log("Lend Records:", lendRecords); // Kiểm tra các bản ghi Lend

    // Bước 3: Lấy các bản ghi từ bảng Borrow (người mượn)
    const borrowRecords = await Borrow.find({ borrowerClerkId: userId })
      .populate("item") // Lấy thông tin item từ bảng Item
      .sort({ createdAt: -1 });

    // Gộp các bản ghi mượn và cho mượn
    allRecords = [...borrowRecords, ...lendRecords];

    // Nếu không phải người mượn cũng không phải người cho mượn
    if (borrowRecords.length === 0 && lendRecords.length === 0) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Duyệt qua các bản ghi để chuẩn bị dữ liệu trả về
    const returnData = await Promise.all(
      allRecords.map(async (record) => {
        const isBorrow = record instanceof Borrow; // Kiểm tra là mượn hay cho mượn
        let returnRecord = null;

        // Tìm bản ghi trong bảng Return nếu có (chỉ tìm khi là người mượn)
        if (isBorrow) {
          returnRecord = await Return.findOne({ borrow: record._id }); // Tìm bản ghi Return theo borrowId
        }

        // Nếu không có bản ghi Return thì mặc định là chưa confirm
        const borrowerConfirm = returnRecord
          ? returnRecord.borrowerConfirm
          : false;
        const ownerConfirm = returnRecord ? returnRecord.ownerConfirm : false;

        // Trả về dữ liệu bao gồm thông tin item
        return {
          _id: record._id,
          borrowerClerkId: record.borrowerClerkId,
          ownerClerkId: record.item.ownerClerkId, // Thông tin người cho mượn (owner)
          item: record.item.name,
          itemId: record.item._id,
          itemStatus: record.item.status,
          timeReturned: returnRecord
            ? returnRecord.timeReturned
            : "Not Returned", // Nếu có Return thì tính thời gian trả lại
          overTime: returnRecord ? returnRecord.overTime : 0, // Nếu có Return thì tính overtime
          borrowerConfirm: borrowerConfirm, // Hiển thị trạng thái borrowerConfirm
          ownerConfirm: ownerConfirm, // Hiển thị trạng thái ownerConfirm
          createdAt: record.createdAt,
        };
      })
    );

    res.status(200).json({ data: returnData });
  } catch (err) {
    console.error("getAllReturns error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
