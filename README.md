# JobZee Portal - Next-Level MERN Stack Job Portal

A **modern, enterprise-grade** job portal application built with cutting-edge technologies, featuring real-time notifications, advanced search, admin analytics, and AI-powered job matching.

## Next-Level Features

### Core Enhancements
- **Redux Toolkit** with RTK Query for advanced state management
- **Real-time notifications** with Socket.io
- **Modern UI** with Tailwind CSS + shadcn/ui components
- **Advanced search & filtering** with debounced queries
- **Admin dashboard** with comprehensive analytics
- **Email notifications** for job alerts and updates
- **Enhanced security** with rate limiting and input validation
- **File upload security** with type validation and size limits

### Admin Dashboard
- Real-time system monitoring
- User analytics and trends
- Job posting statistics
- Application tracking
- Memory usage and server health
- Connected users monitoring

### Real-time Features
- Instant job application notifications
- Application status updates
- Job matching alerts
- System announcements
- Online user tracking

### Security Features
- Rate limiting (auth, applications, general)
- Input validation and sanitization
- XSS protection
- Security headers with Helmet
- File upload validation
- CORS configuration

## Tech Stack

### Frontend
- **React 18** with modern hooks
- **Redux Toolkit** + RTK Query
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Socket.io Client** for real-time features
- **React Hook Form** with Zod validation
- **Recharts** for analytics visualization
- **Lucide React** for icons
- **Vite** for fast development

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Socket.io** for real-time communication
- **JWT** authentication with secure cookies
- **Cloudinary** for file storage
- **Nodemailer** for email services
- **Express Rate Limit** for security
- **Helmet** for security headers
- **Express Validator** for input validation

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Cloudinary account
- SMTP email service (Gmail recommended)

## Installation & Setup

### 1. Clone the Repository
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
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
DB_URL=

# JWT Configuration
JWT_SECRET_KEY=your_super_secure_jwt_secret_key_here
JWT_EXPIRE=7d
COOKIE_EXPIRE=7

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:5173
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

## Running the Application

### Development Mode

**Start Backend Server:**
```bash
cd backend
npm run dev
```
Server runs on http://localhost:4000

**Start Frontend Development Server:**
```bash
cd frontend
npm run dev
```
Application runs on http://localhost:5173

### Production Build

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## Enhanced Project Structure

```
job-portal/
├── backend/
│   ├── controllers/
│   │   ├── adminController.js      # Admin dashboard & analytics
│   │   ├── applicationController.js
│   │   ├── jobController.js
│   │   └── userController.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   ├── catchAsyncError.js
│   │   ├── error.js
│   │   └── security.js             # Rate limiting & validation
│   ├── models/
│   │   ├── applicationSchema.js
│   │   ├── jobSchema.js
│   │   └── userSchema.js
│   ├── routes/
│   │   ├── adminRoutes.js          # Admin routes
│   │   ├── applicationRoutes.js
│   │   ├── jobRoutes.js
│   │   └── userRoutes.js
│   ├── socket/
│   │   └── socketManager.js        # Real-time communication
│   ├── utils/
│   │   ├── emailService.js         # Email notifications
│   │   └── jwtToken.js
│   ├── app.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   └── AdminDashboard.jsx
│   │   │   ├── advanced/
│   │   │   │   ├── JobSearch.jsx
│   │   │   │   └── NotificationCenter.jsx
│   │   │   ├── ui/                 # Reusable UI components
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   └── Input.jsx
│   │   │   └── [existing components]
│   │   ├── hooks/
│   │   │   └── useSocket.js        # Socket.io hook
│   │   ├── lib/
│   │   │   └── utils.js            # Utility functions
│   │   ├── store/
│   │   │   ├── api/                # RTK Query APIs
│   │   │   │   ├── authApi.js
│   │   │   │   ├── jobApi.js
│   │   │   │   ├── applicationApi.js
│   │   │   │   └── notificationApi.js
│   │   │   ├── slices/             # Redux slices
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── uiSlice.js
│   │   │   │   └── notificationSlice.js
│   │   │   └── store.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
└── README.md
```

## Environment Variables

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `4000` |
| `DB_URL` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET_KEY` | JWT secret key | `your_secret_key` |
| `JWT_EXPIRE` | Token expiration | `7d` |
| `COOKIE_EXPIRE` | Cookie expiration (days) | `7` |
| `CLOUDINARY_*` | Cloudinary credentials | See Cloudinary dashboard |
| `SMTP_*` | Email service credentials | Gmail SMTP settings |
| `FRONTEND_URL` | Frontend URL | `http://localhost:5173` |

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:4000` |

## New API Endpoints

### Admin Routes
```
GET    /api/v1/admin/dashboard-stats     # Dashboard analytics
GET    /api/v1/admin/users               # User management
GET    /api/v1/admin/jobs                # Job management
GET    /api/v1/admin/applications        # Application management
GET    /api/v1/admin/system-health       # System monitoring
POST   /api/v1/admin/broadcast-message   # System announcements
```

### Enhanced Features
- **Advanced Search**: `/api/v1/job/search` with filtering
- **Real-time Notifications**: Socket.io events
- **Email Notifications**: Automated email alerts
- **File Validation**: Enhanced security for uploads

## UI Components

### Modern Design System
- **Consistent theming** with CSS variables
- **Dark/Light mode** support
- **Responsive design** for all devices
- **Smooth animations** with Framer Motion
- **Accessible components** following WCAG guidelines

### Key Components
- `Button` - Multiple variants and sizes
- `Card` - Flexible content containers
- `Input` - Form inputs with validation states
- `JobSearch` - Advanced search with filters
- `NotificationCenter` - Real-time notifications
- `AdminDashboard` - Comprehensive analytics

## Analytics & Monitoring

### Dashboard Features
- **User Statistics**: Total users, new registrations, role distribution
- **Job Analytics**: Posted jobs, categories, trends
- **Application Tracking**: Status distribution, success rates
- **System Health**: Memory usage, uptime, connected users
- **Real-time Data**: Live user connections, activity monitoring

### Charts & Visualizations
- Line charts for trends
- Bar charts for comparisons
- Pie charts for distributions
- Progress bars for metrics

## Notification System

### Real-time Events
- **Job Applications**: Instant employer notifications
- **Status Updates**: Application status changes
- **Job Matches**: Personalized job recommendations
- **System Messages**: Admin announcements

### Email Notifications
- Welcome emails for new users
- Job application confirmations
- Status update notifications
- Interview scheduling alerts

## Security Features

### Rate Limiting
- **General**: 100 requests per 15 minutes
- **Authentication**: 5 login attempts per 15 minutes
- **Applications**: 10 job applications per hour

### Input Validation
- **Server-side validation** with express-validator
- **XSS protection** with input sanitization
- **File upload security** with type and size validation
- **CORS configuration** for secure cross-origin requests

## Deployment

### Backend Deployment (Railway/Heroku)
1. Set environment variables on hosting platform
2. Ensure MongoDB Atlas allows connections
3. Configure SMTP settings for email service
4. Deploy with `npm start`

### Frontend Deployment (Vercel/Netlify)
1. Update `VITE_API_URL` to production backend URL
2. Build: `npm run build`
3. Deploy `dist` folder

### Environment-specific Configurations
- **Development**: Local MongoDB, console email logging
- **Production**: MongoDB Atlas, SMTP email service

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Biltu Bag**
- GitHub: [@biltubag](https://github.com/biltubag)
- Email: your.email@example.com

## Issues & Support

If you encounter any issues:
1. Check the [Issues](https://github.com/biltubag/job-portal/issues) page
2. Create a new issue with detailed information
3. Include error logs and steps to reproduce

## Acknowledgments

- React team for the amazing framework
- Redux Toolkit for state management
- Tailwind CSS for utility-first styling
- Socket.io for real-time communication
- All contributors and supporters

---

**Built with ❤️ using modern web technologies**
