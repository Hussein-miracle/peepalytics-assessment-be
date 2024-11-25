import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

class LoggerMiddleware {
    static httpLogger(req: Request, res: Response, next: NextFunction) {
        // Log at the start of the request
        logger.info(`Incoming ${req.method} request to ${req.url}`, {
            headers: req.headers,
            query: req.query,
            body: this.sanitizeBody(req.body)
        });

        // Store start time
        const start = Date.now();

        // Log when the request is finished
        res.on('finish', () => {
            const duration = Date.now() - start;
            logger.info(`Completed ${req.method} ${req.url} with status ${res.statusCode}`, {
                duration: `${duration}ms`,
                ip: req.ip,
                userAgent: req.get('user-agent')
            });
        });

        next();
    }

    static errorLogger(error: Error, req: Request, res: Response, next: NextFunction) {
        logger.error('Error processing request', {
            error: error.message,
            stack: error.stack,
            path: req.path,
            method: req.method,
            ip: req.ip
        });
        next(error);
    }

    static sanitizeBody(body: Request['body']) {
        if (!body) return body;
        
        const sanitized = { ...body };
        // Remove sensitive data
        const sensitiveFields = ['password', 'cardNumber', 'cvv', 'token'];
        sensitiveFields.forEach(field => {
            if (sanitized[field]) {
                sanitized[field] = '[REDACTED]';
            }
        });
        return sanitized;
    }
}


export default LoggerMiddleware;