import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { body, validationResult } from 'express-validator';
import ErrorHandler from './error.js';

// Rate limiting configurations
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: {
    error: 'Too many login attempts, please try again later.',
  },
  skipSuccessfulRequests: true,
});

export const applicationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 job applications per hour
  message: {
    error: 'Too many job applications, please try again later.',
  },
});

// Security headers middleware
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", process.env.FRONTEND_URL],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// Input validation schemas
export const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Name must be between 3 and 30 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),

  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),

  body('phone')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),

  body('password')
    .isLength({ min: 8, max: 32 })
    .withMessage('Password must be between 8 and 32 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

  body('role')
    .isIn(['Job Seeker', 'Employer'])
    .withMessage('Role must be either Job Seeker or Employer'),
];

export const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  body('role')
    .isIn(['Job Seeker', 'Employer'])
    .withMessage('Role must be either Job Seeker or Employer'),
];

export const jobValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Job title must be between 3 and 100 characters'),

  body('description')
    .trim()
    .isLength({ min: 30, max: 2000 })
    .withMessage('Job description must be between 30 and 2000 characters'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Job category is required'),

  body('country')
    .trim()
    .notEmpty()
    .withMessage('Country is required'),

  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),

  body('location')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Location must be between 10 and 200 characters'),

  body('fixedSalary')
    .optional()
    .isInt({ min: 1000, max: 999999999 })
    .withMessage('Fixed salary must be between 1000 and 999999999'),

  body('salaryFrom')
    .optional()
    .isInt({ min: 1000, max: 999999999 })
    .withMessage('Salary from must be between 1000 and 999999999'),

  body('salaryTo')
    .optional()
    .isInt({ min: 1000, max: 999999999 })
    .withMessage('Salary to must be between 1000 and 999999999'),
];

export const applicationValidation = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Name must be between 3 and 50 characters'),

  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),

  body('phone')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),

  body('coverLetter')
    .trim()
    .isLength({ min: 50, max: 1000 })
    .withMessage('Cover letter must be between 50 and 1000 characters'),

  body('address')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Address must be between 10 and 200 characters'),
];

// Validation result handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return next(new ErrorHandler(errorMessages.join(', '), 400));
  }
  next();
};

// XSS Protection
export const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        // Remove potentially dangerous HTML tags and scripts
        obj[key] = obj[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '');
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);

  next();
};

// File upload security
export const validateFileUpload = (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next();
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  for (let fileKey in req.files) {
    const file = req.files[fileKey];

    if (!allowedTypes.includes(file.mimetype)) {
      return next(new ErrorHandler('Invalid file type. Only JPEG, PNG, WEBP, and PDF files are allowed.', 400));
    }

    if (file.size > maxSize) {
      return next(new ErrorHandler('File size too large. Maximum size is 5MB.', 400));
    }
  }

  next();
};
