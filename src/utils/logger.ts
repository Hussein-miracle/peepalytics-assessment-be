import winston from 'winston';
import fs from 'fs';
import DailyRotateFile  from 'winston-daily-rotate-file';
import path from 'path';
import { NextFunction, Request, Response } from 'express';

// Custom log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ level, message, timestamp, stack, ...metadata }) => {
        let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
        
        // Add metadata if exists
        if (Object.keys(metadata).length > 0) {
            log += ` ${JSON.stringify(metadata)}`;
        }
        
        // Add stack trace for errors
        if (stack) {
            log += `\n${stack}`;
        }
        
        return log;
    })
);

// Create log directory if it doesn't exist
const logDir = path.join(process.cwd(), 'logs');
const logsFolderExists = fs.existsSync(logDir);
if (!logsFolderExists) {
    fs.mkdirSync(logDir,{recursive:true});
}

// Configure daily rotate file for different log levels
const dailyRotateFileTransport:DailyRotateFile = new DailyRotateFile({
    filename: path.join(logDir, '%DATE%-combined.log'),
    datePattern: 'YYYY-MM-DD-HH',
    maxSize: '20m',
    maxFiles: '14d',
    zippedArchive: true,
    format: logFormat
});

const errorRotateFileTransport:DailyRotateFile = new DailyRotateFile({
    filename: path.join(logDir, '%DATE%-error.log'),
    datePattern: 'YYYY-MM-DD-HH',
    maxSize: '20m',
    maxFiles: '14d',
    level: 'error',
    zippedArchive: true,
    format: logFormat
});

// Create logger instance
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: logFormat,
    transports: [
        // Write all logs with importance level of `error` or less to `error.log`
        // Write all logs with importance level of `info` or less to `combined.log`
        dailyRotateFileTransport,
        errorRotateFileTransport
    ]
});

// If we're not in production then log to the console with custom format
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

// Custom logging functions
const customLogger = {
    error: (message: string, meta?: any) => {
        logger.error(message, meta);
    },
    warn: (message: string, meta?: any) => {
        logger.warn(message, meta);
    },
    info: (message: string, meta?: any) => {
        logger.info(message, meta);
    },
    debug: (message: string, meta?: any) => {
        logger.debug(message, meta);
    },
    // Log HTTP request details
    logRequest: (req: Request, res: Response, next: NextFunction) => {
        logger.info(`${req.method} ${req.path}`);

        const startHrTime = process.hrtime();

        res.on('finish', () => {
            const elapsedHrTime = process.hrtime(startHrTime);
            const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
            
            logger.info('HTTP Request', {
                method: req.method,
                url: req.url,
                status: res.statusCode,
                responseTime: `${elapsedTimeInMs.toFixed(3)}ms`,
                ip: req.ip,
                userAgent: req.get('user-agent')
            });
        });

        next();
    },

    // Log security events
    logSecurityEvent: (event: string, details: any) => {
        logger.warn('Security Event', {
            event,
            details,
            timestamp: new Date().toISOString()
        });
    }
};

export { customLogger as logger};