import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to handle validation errors
 * Returns a 400 response with detailed error messages
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * Validation rules for creating a resume
 */
export const validateResume = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 255 })
    .withMessage('Title must not exceed 255 characters'),
  handleValidationErrors,
];

/**
 * Validation rules for personal info
 */
export const validatePersonalInfo = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ max: 255 })
    .withMessage('Full name must not exceed 255 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address'),
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/)
    .withMessage('Must be a valid phone number'),
  body('location')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage('Location must not exceed 255 characters'),
  body('linkedin')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('LinkedIn must be a valid URL'),
  body('website')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Website must be a valid URL'),
  body('summary')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Summary must not exceed 2000 characters'),
  handleValidationErrors,
];

/**
 * Validation rules for work experience
 * endDate is optional if current is true
 */
export const validateWorkExperience = [
  body('companyName')
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ max: 255 })
    .withMessage('Company name must not exceed 255 characters'),
  body('position')
    .trim()
    .notEmpty()
    .withMessage('Position is required')
    .isLength({ max: 255 })
    .withMessage('Position must not exceed 255 characters'),
  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .matches(/^\d{4}-\d{2}(-\d{2})?$/)
    .withMessage('Start date must be in YYYY-MM or YYYY-MM-DD format'),
  
  // Custom validation for endDate - only required if current is false
  body('endDate')
    .custom((value, { req }) => {
      // If current position, endDate can be empty
      if (req.body.current === true || req.body.current === 'true') {
        return true;
      }
      
      // If not current position, endDate is required and must be valid
      if (!value || value.trim() === '') {
        throw new Error('End date is required for past positions');
      }
      
      // Validate date format
      if (!value.match(/^\d{4}-\d{2}(-\d{2})?$/)) {
        throw new Error('End date must be in YYYY-MM or YYYY-MM-DD format');
      }
      
      return true;
    }),
  
  body('current')
    .optional()
    .isBoolean()
    .withMessage('Current must be a boolean value'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 5000 })
    .withMessage('Description must not exceed 5000 characters'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer'),
  handleValidationErrors,
];

/**
 * Validation rules for education
 * endDate is optional if current is true
 */
export const validateEducation = [
  body('institution')
    .trim()
    .notEmpty()
    .withMessage('Institution is required')
    .isLength({ max: 255 })
    .withMessage('Institution must not exceed 255 characters'),
  body('degree')
    .trim()
    .notEmpty()
    .withMessage('Degree is required')
    .isLength({ max: 255 })
    .withMessage('Degree must not exceed 255 characters'),
  body('fieldOfStudy')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage('Field of study must not exceed 255 characters'),
  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .matches(/^\d{4}-\d{2}(-\d{2})?$/)
    .withMessage('Start date must be in YYYY-MM or YYYY-MM-DD format'),
  
  // Custom validation for endDate - only required if current is false
  body('endDate')
    .custom((value, { req }) => {
      // If currently studying, endDate can be empty
      if (req.body.current === true || req.body.current === 'true') {
        return true;
      }
      
      // If graduated, endDate is required and must be valid
      if (!value || value.trim() === '') {
        throw new Error('End date is required for completed education');
      }
      
      // Validate date format
      if (!value.match(/^\d{4}-\d{2}(-\d{2})?$/)) {
        throw new Error('End date must be in YYYY-MM or YYYY-MM-DD format');
      }
      
      return true;
    }),
  
  body('current')
    .optional()
    .isBoolean()
    .withMessage('Current must be a boolean value'),
  body('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer'),
  handleValidationErrors,
];

/**
 * Validation rules for skills
 */
export const validateSkill = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Skill name is required')
    .isLength({ max: 100 })
    .withMessage('Skill name must not exceed 100 characters'),
  body('category')
    .optional({ checkFalsy: true })
    .trim()
    .isIn(['Technical', 'Soft Skills', 'Languages', 'Tools', 'Other'])
    .withMessage('Category must be one of: Technical, Soft Skills, Languages, Tools, Other'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer'),
  handleValidationErrors,
];
