import app from "./app.js";
import { createServer } from 'http';
import cloudinary from "cloudinary";
import socketManager from './socket/socketManager.js';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // CLOUDINARY_CLIENT_NAME
  api_key: process.env.CLOUDINARY_API_KEY,       // CLOUDINARY_CLIENT_API
  api_secret: process.env.CLOUDINARY_API_SECRET, // CLOUDINARY_CLIENT_SECRET
});

// Create HTTP server
const server = createServer(app);

// Initialize Socket.io
socketManager.initialize(server);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`🚀 Server running at port ${PORT}`);
  console.log(`📡 Socket.io server initialized`);
});
