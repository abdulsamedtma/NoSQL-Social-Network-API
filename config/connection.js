const mongoose = require("mongoose"); // import mongoose
// connect to the Mongo DB
mongoose.connect(
  process.env.MONGODB_URI ||
    "mongodb://127.0.0.1:27017/nosql-social-network-api", //
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
// Use this to log mongo queries being executed!
mongoose.set("debug", true);

module.exports = mongoose.connection;
