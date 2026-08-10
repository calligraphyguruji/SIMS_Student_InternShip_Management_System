import mongoose from "mongoose";

const defaultMongoUri = "mongodb+srv://<db_user>:<db_user>@sims.cw9yfgt.mongodb.net/?appName=SIMS";

const getMongoUri = () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (uri) return uri;

  if (process.env.NODE_ENV === "production") {
    throw new Error("MONGO_URI is required in production. Set it to your MongoDB Atlas connection string.");
  }

  return defaultMongoUri;
};

const connectDB = async () => {
  try {
    const uri = getMongoUri();
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    throw err;
  }
};

export default connectDB;
