const Return = require("../model/returned.model");
const Borrow = require("../model/borrow.model");
const Lend = require("../model/lend.model");
const Item = require("../model/item.model");

module.exports.borrowerConfirmReturn = async (req, res) => {
    const borrowerId = req.auth.userId; 
//  const borrowerId = "borrower_xyz_001";//test hardcode
    const { borrowId } = req.body;

    if (!borrowId) {
        return res.status(400).json({ message: "Missing borrowId" });
    }

    try {
        const borrow = await Borrow.findById(borrowId);
        if (!borrow) {
            return res.status(404).json({ message: "Borrow record not found" });
        }

        if (borrow.borrowerClerkId !== borrowerId) {
            return res.status(403).json({ message: "You are not the borrower of this item" });
        }

        const existingReturn = await Return.findOne({ borrow: borrowId });
        if (existingReturn) {
            return res.status(400).json({ message: "Return already exists" });
        }

        const newReturn = await Return.create({
            borrowerConfirm: true,
            borrow: borrowId
        });

        res.status(201).json({ message: "Borrower confirmed return", data: newReturn });
    } catch (err) {
        console.error("borrowerConfirmReturn error:", err);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports.ownerConfirmReturn = async (req, res) => {
    const ownerClerkId = req.auth.userId; 
    //const ownerClerkId = "owner_abc_001"; //test hardcode
    const { itemId } = req.body;

    if (!itemId) {
        return res.status(400).json({ message: "Missing itemId" });
    }

    try {
        const item = await Item.findById(itemId);

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        if (item.ownerClerkId !== ownerClerkId) {
            return res.status(403).json({ message: "You are not the owner of this item" });
        }

        // Tìm bản ghi borrow theo item
        const borrowRecord = await Borrow.findOne({ item: itemId }).sort({ createdAt: -1 });
        if (!borrowRecord) {
            return res.status(404).json({ message: "Borrow record not found" });
        }

        //Tìm bản ghi return theo borrowId
        const returnRecord = await Return.findOne({ borrow: borrowRecord._id });

        if (!returnRecord) {
            return res.status(404).json({ message: "Return record not found" });
        }

        if (!returnRecord.borrowerConfirm) {
            return res.status(400).json({ message: "Borrower has not confirmed return yet" });
        }

        //overTime
        const createdAt = borrowRecord.createdAt;
        const allowedHours = borrowRecord.totalTime;
        const now = new Date();
        const usedHours = (now - createdAt) / (1000 * 60 * 60);
        const overtime = Math.max(0, usedHours - allowedHours);

        //Cập nhật return + item
        returnRecord.ownerConfirm = true;
        returnRecord.timeReturned = now;
        returnRecord.overTime = Math.round(overtime * 100) / 100;
        await returnRecord.save();

        item.status = "available";
        await item.save();

        res.status(200).json({
            message: "Owner confirmed return",
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





// Lấy toàn bộ lịch sử trả đồ
module.exports.getAllReturns = async (req, res) => {
    try {
        const returns = await Return.find()
            .populate("borrow")
            .sort({ createdAt: -1 });

        res.status(200).json({ data: returns });
    } catch (err) {
        console.error("getAllReturns error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
