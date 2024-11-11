
import { body } from 'express-validator';

export const createTherapistValidator = [
  body('name').notEmpty().withMessage('Name is required'),
  body('qualification').notEmpty().withMessage('Qualification is required'),
  body('specialization').notEmpty().withMessage('Specialization is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const updateTherapistValidator = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty if provided'),
  body('qualification').optional().notEmpty().withMessage('Qualification cannot be empty if provided'),
  body('specialization').optional().notEmpty().withMessage('Specialization cannot be empty if provided'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters if provided'),
];