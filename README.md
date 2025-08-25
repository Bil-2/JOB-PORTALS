# Job Portal - Full Stack Web Application

A complete job portal application built with React.js frontend and Node.js/Express backend, featuring user authentication, job posting, and application management.

## 🚀 Features

- **User Authentication**: Register/Login for Job Seekers and Employers
- **Job Management**: Post, update, delete, and view jobs
- **Application System**: Apply for jobs with resume upload
- **Role-based Access**: Different permissions for Job Seekers and Employers
- **File Upload**: Resume upload with Cloudinary integration
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Tech Stack

### Frontend
- React.js 18
- React Router DOM
- Axios for API calls
- React Hot Toast for notifications
- React Icons
- Vite for build tool

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary for file uploads
- bcrypt for password hashing
- CORS enabled

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Cloudinary account (for file uploads)

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd job-portal
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```env
PORT=4000
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
FRONTEND_URL=http://localhost:5173
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
JWT_SECRET_KEY=your_jwt_secret_key_here
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
NODE_ENV=development
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create `.env` file in frontend directory:
```env
VITE_API_URL=http://localhost:4000
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm run dev
```
Server will run on http://localhost:4000

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Application will run on http://localhost:5173

## 📁 Project Structure

```
job-portal/
├── backend/
│   ├── controllers/
│   ├── database/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔐 Environment Variables

### Backend (.env)
- `PORT`: Server port (default: 4000)
- `DB_URL`: MongoDB connection string
- `JWT_SECRET_KEY`: Secret key for JWT tokens
- `JWT_EXPIRE`: Token expiration time
- `COOKIE_EXPIRE`: Cookie expiration (days)
- `CLOUDINARY_*`: Cloudinary credentials for file uploads
- `FRONTEND_URL`: Frontend application URL

### Frontend (.env)
- `VITE_API_URL`: Backend API URL

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables on your hosting platform
2. Ensure MongoDB Atlas allows connections from your server
3. Deploy using platforms like Heroku, Railway, or Vercel

### Frontend Deployment
1. Update `VITE_API_URL` to your deployed backend URL
2. Build the project: `npm run build`
3. Deploy the `dist` folder to platforms like Netlify, Vercel, or GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Biltu Bag**
- GitHub: [@biltubag](https://github.com/biltubag)

## 🐛 Issues

If you encounter any issues, please create an issue on GitHub with detailed information about the problem.
