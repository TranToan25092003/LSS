//# connect to mongoose
const { connect } = require("mongoose");

module.exports.connectToDatabase = async () => {
  try {
    await connect(process.env.URL_DATABASE);
    console.log("successfully connect to database");
  } catch (error) {
    console.log(error);
  }
};
