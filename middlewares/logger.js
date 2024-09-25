import winston from "winston";
import { format, transports } from "winston";
import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Daily Rotate File transport for rotating log files daily
import "winston-daily-rotate-file";

// Ensure log directories exist
const logDirectories = [
  path.join(__dirname, '../logs', 'user-activity'),
  path.join(__dirname, '../logs', 'upload'),
  path.join(__dirname, '../logs', 'error')
];

logDirectories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Detect the environment (development or production)
const isDevelopment = process.env.NODE_ENV === 'development';

const customFormat = winston.format.combine(
  winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
  winston.format.printf(({ timestamp, level, message, userID, ip }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message} - UserID: ${userID || 'Guest'} - IP: ${ip || 'N/A'}`;
  })
);

  
// Logger for User Logs
const userLogger = winston.createLogger({
  level: isDevelopment ? 'debug' : 'info', // Debug mode for development
  format: customFormat,
  transports: [
    new transports.DailyRotateFile({
      filename: path.join(__dirname, '../logs', 'user-activity', 'user-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'info'
    }),
  ]
});
  
// Logger for Upload Logs
const uploadLogger = winston.createLogger({
  level: 'info',
  format: customFormat,
  transports: [
    new transports.DailyRotateFile({
      filename: path.join(__dirname, '../logs', 'upload', 'upload-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'info'
    })
  ]
});
  
// Logger for Error Logs
const errorLogger = winston.createLogger({
  level: 'error',
  format: customFormat,
  transports: [
    new transports.DailyRotateFile({
      filename: path.join(__dirname, '../logs', 'error', 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error'
    })
  ]
});

// Add console transport only in development mode
if (isDevelopment) {
  userLogger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )   
  }));
  uploadLogger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
  errorLogger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
} 
  
// Function to log user actions
function logUserAction(message, userID, ipAddress) {
  userLogger.info(message, { userID: userID || 'Guest', ipAddress: ipAddress || 'N/A', category: 'user' });
}
  
// Function to log file uploads
function logUploadAction(message, userID, ipAddress) {
  uploadLogger.info(message, { userID: userID || 'Guest', ipAddress: ipAddress || 'N/A', category: 'upload' });
}
  
// Function to log errors
function logError(message, userID, ipAddress) {
  errorLogger.error(message, { userID: userID || 'Guest', ipAddress: ipAddress || 'N/A', category: 'error' });
}

export { logUserAction, logUploadAction, logError };
