const morgan = require('morgan');
const { createLogger, transports, format } = require('winston');
require('winston-daily-rotate-file');

const logger = createLogger({
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(), 
                format.simple()
            )
        }),
        new transports.DailyRotateFile({
            filename: 'logs/server-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20mb',
            // level: 'info',
            format: format.combine(
                format.timestamp({ format: 'MM-DD-YYYY HH:mm:ss' }),
                format.printf( info => `${info.level}: ${[info.timestamp]}: ${info.message}`)
            )
        })
    ]
});

// Call exceptions.handle with a transport to handle exceptions
logger.exceptions.handle(
    new transports.File({ filename: 'logs/exceptions.log' })
  );

module.exports = logger;