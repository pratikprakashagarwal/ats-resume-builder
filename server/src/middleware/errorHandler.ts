import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  // Default error
  let statusCode = 500;
  let message = 'Internal server error';

  // Custom error handling
  if (err.message === 'Resume not found') {
    statusCode = 404;
    message = err.message;
  } else if (err.message.includes('AI service error')) {
    statusCode = 503;
    message = 'AI service temporarily unavailable';
  } else if (err.message.includes('required')) {
    statusCode = 400;
    message = err.message;
  }

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
