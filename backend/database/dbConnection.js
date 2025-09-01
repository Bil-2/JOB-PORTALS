import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

//Database connection here!
const dbConnection = () => {
   mongoose.connect(process.env.DB_URL, {
      dbName: "Job_Portal",
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
      maxPoolSize: 10,
      minPoolSize: 5
   }).then(() => {
      console.log("MongoDB Connected Successfully !")
   }).catch((error) => {
      console.log(`Failed to connect to MongoDB: ${error.message}`)
      console.log("Please check your database connection string and network access")
      process.exit(1);
   })

   // Handle connection events
   mongoose.connection.on('error', (error) => {
      console.log(`MongoDB connection error: ${error}`);
   });

   mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
   });
}
export default dbConnection;