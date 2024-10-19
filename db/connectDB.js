import mongoose from "mongoose";


const connectDB = async () => {
  const dbURI = process.env.MONGO_URI || 'your-default-mongo-uri';
  try {
    await mongoose.connect(dbURI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Exit process with failure
  }
};


export default connectDB;