import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
	windowMs: process.env.RATE_LIMIT_WINDOW_MS as unknown as number || 15 * 60 * 1000, // 15 minutes
	limit: !isNaN(Number(process.env.RATE_LIMIT_MAX_REQUESTS)) ? Number(process.env.RATE_LIMIT_MAX_REQUESTS) : parseInt('100'), // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	message: 'Too many requests from your IP address, please try again later',
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false 
})

export default limiter;