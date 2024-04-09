import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
    // "block" user for 15 minutes
    windowMs: 15 * 60 * 1000,
    // limit of 2000 requests per minute
    max: 2000, 
    message: {message: 'Too many requests from this IP, please try again later', date: Date.now(), status: 429}
});

export const emailLimiter = rateLimit({
    // "block" user for 1 hour
    windowMs: 60 * 60 * 1000,
    // limit of 10 requests per minute
    max: 10,
    message: {message: 'Too many requests from this IP, please try again later', date: Date.now(), status: 429}
});
