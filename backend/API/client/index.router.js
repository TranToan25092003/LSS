const testRouter = require("./test.router");

module.exports = (app) => {
  app.use("/", testRouter);
};
