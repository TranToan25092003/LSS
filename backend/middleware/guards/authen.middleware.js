const { Clerk } = require("@clerk/clerk-sdk-node");

module.exports.checkHeaders = async (req, res, next) => {
  const token = req.headers?.authorization || `Bearer ${req.cookies.__session}`;

  // console.log(req.headers);

  if (!token) {
    console.log("No valid Authorization header found");
    return res.status(401).json({
      error: "Unauthorized",
    });
  }
  req.headers["authorization"] = token;
  // console.log(req.headers["authorization"]);
  next();
};
