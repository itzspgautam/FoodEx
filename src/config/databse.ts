const mongoose = require("mongoose");

const DbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      w: "majority",
    });
    console.log("Connected");
  } catch (error) {
    console.error(error);
  }
};

export default DbConnect;
