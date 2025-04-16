module.exports.checkHealth = async (req, res) => {
  res.status(200).json({
    message: "System is healthy",
  });
};
