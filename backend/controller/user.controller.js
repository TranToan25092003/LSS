const { clerkClient } = require("../config/clerk");

const getUserById = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const user = await clerkClient.users.getUser(clerkId);
    
    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      message: "Không thể lấy thông tin người dùng",
      error: error.message
    });
  }
};

module.exports = {
  getUserById
}; 