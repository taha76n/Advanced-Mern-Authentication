import mongoose from "mongoose";

const connectDb = () => {
  try {
    mongoose.connect(process.env.MONGODB_URI);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.log("Error: " + error);
    process.exit(1);
  }
};

export default connectDb;
