// Comprehensive logging utility

export enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG'
}

class Logger {
    private logs: string[] = [];

    log(level: LogLevel, message: string, data?: any): void {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${level}] ${message}`;

        console.log(logMessage, data || '');
        this.logs.push(logMessage + (data ? ` ${JSON.stringify(data)}` : ''));
    }

    info(message: string, data?: any): void {
        this.log(LogLevel.INFO, message, data);
    }

    warn(message: string, data?: any): void {
        this.log(LogLevel.WARN, message, data);
    }

    error(message: string, data?: any): void {
        this.log(LogLevel.ERROR, message, data);
    }

    debug(message: string, data?: any): void {
        this.log(LogLevel.DEBUG, message, data);
    }

    getLogs(): string[] {
        return this.logs;
    }

    clear(): void {
        this.logs = [];
    }
}

export const logger = new Logger();
