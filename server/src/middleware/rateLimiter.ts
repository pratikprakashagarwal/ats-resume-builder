import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter
 * Limits each IP to 100 requests per 15 minutes
 * Prevents abuse and protects against DDoS attacks
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip rate limiting for health checks
  skip: (req) => req.path === '/health',
});

/**
 * Strict rate limiter for AI endpoints
 * Limits each IP to 10 AI requests per hour
 * AI operations are expensive, so stricter limits apply
 */
export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 AI requests per hour
  message: {
    error: 'Too many AI requests. Please try again later.',
    retryAfter: '1 hour',
    tip: 'AI features are limited to prevent abuse. Consider caching results.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict rate limiter for create operations
 * Limits each IP to 20 creates per hour
 * Prevents spam and abuse of create endpoints
 */
export const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 creates per hour
  message: {
    error: 'Too many create requests. Please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Only apply to POST requests
  skip: (req) => req.method !== 'POST',
});
