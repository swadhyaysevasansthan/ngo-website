import express from 'express';
import { body } from 'express-validator';
import { 
  registerParticipant, 
  getParticipantById, 
  verifyParticipant 
} from '../controllers/participantController.js';
import { validateRequest } from '../middleware/validation.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Registration validation rules
const registrationValidation = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('Name must be between 3 and 255 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit Indian mobile number'),
  
  body('dateOfBirth')
    .notEmpty()
    .withMessage('Date of birth is required')
    .isISO8601()
    .withMessage('Please provide a valid date'),
  
  body('age')
    .isInt({ min: 17, max: 23 })
    .withMessage('Age must be between 17 and 23 years'),

  body('gender')
    .notEmpty().withMessage('Gender is required')
    .isIn(['Male', 'Female', 'Other', 'Prefer not to say'])
    .withMessage('Invalid gender option'),
  
  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  
  body('state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  
  body('collegeName')
    .trim()
    .notEmpty()
    .withMessage('College name is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('College name must be between 3 and 255 characters'),

  body('course')
    .trim()
    .notEmpty()
    .withMessage('Course/Program is required')
    .isLength({ min: 2 })
    .withMessage('Course/Program is too short'),

  body('yearOfStudy')
    .notEmpty()
    .withMessage('Year of study is required')
    .isIn(['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Postgraduate'])
    .withMessage('Invalid year of study'),
  
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['Nature', 'Wildlife'])
    .withMessage('Category must be either Nature or Wildlife'),

  body('declarationAccepted')
    .equals('true')
    .withMessage('You must agree to the declaration'),
];

// Routes
router.post('/register', rateLimiter, registrationValidation, validateRequest, registerParticipant);
router.get('/:participantId', getParticipantById);
router.post('/verify', verifyParticipant);

export default router;
