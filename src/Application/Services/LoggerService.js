import winston from 'winston';
import { config } from "dotenv";

config();

class LoggerService {

    static Logger() {
        const options = {
            levels: {
                fatal: 0,
                error: 1,
                warning: 2,
                info: 3,
                http: 4,
                debug: 5
            },
            colors: {
                fatal: "red",
                error: "magenta",
                warning: "yellow",
                info: "blue",
                http: "gray",
                debug: "white"
            }
        };

        winston.addColors(options.colors);

        // Development logger

        const devLogger = winston.createLogger({
            levels: options.levels,
            transports: [
                new winston.transports.Console({
                    level: "debug",
                    format: winston.format.combine(
                        winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
                        winston.format.colorize(),
                        winston.format.printf(({ timestamp, level, message }) => {
                            return `${timestamp} | ${level}: ${message}`;
                        })
                    )
                }),
            ]
        });

        // Production logger

        const prodLogger = winston.createLogger({
            levels: options.levels,
            transports: [
                new winston.transports.Console({
                    level: "info",
                    format: winston.format.combine(
                        winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
                        winston.format.colorize(),
                        winston.format.printf(({ timestamp, level, message }) => {
                            return `${timestamp} | ${level}: ${message}`;
                        })
                    )
                }),

                new winston.transports.File({
                    filename: "./errors.log",
                    level: "error",
                    format: winston.format.simple()
                })
            ]
        });

        if(process.env.NODE_ENV === "production") {
            return prodLogger;
        }
        else {
            return devLogger;
        }
    }

    static LoggerMiddleware(request, response, next) {

        const logger = LoggerService.Logger();

        response.on("finish", () => {
            const { method, originalUrl } = request;
            const { statusCode } = response;

            const custom = response.locals.message || "";
            const base = `${method} ${originalUrl} - Status code: ${statusCode}`;

            const fullMessage = custom ? `${base} - Message: ${custom}` : base;

            if (statusCode >= 500) {
                logger.fatal(fullMessage);
            } 
            else if (statusCode >= 400) {
                logger.error(fullMessage);
            } 
            else if (statusCode >= 300) {
                logger.warning(fullMessage);
            } 
            else {
                logger.http(fullMessage);
            }
        }); 

        next();
    }
}




export default LoggerService;