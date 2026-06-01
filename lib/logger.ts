type LogLevel = 'log' | 'error' | 'warn' | 'info'

class Logger {
  private isProduction = process.env.NODE_ENV === 'production'

  log(...args: any[]) {
    if (!this.isProduction) {
      console.log(...args)
    }
  }

  error(...args: any[]) {
    if (this.isProduction) {
      console.error('[Error]', args[0])
    } else {
      console.error(...args)
    }
  }

  warn(...args: any[]) {
    if (!this.isProduction) {
      console.warn(...args)
    }
  }

  info(...args: any[]) {
    if (!this.isProduction) {
      console.info(...args)
    }
  }

  audit(action: string, userId?: string, metadata?: Record<string, any>) {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      action,
      userId: userId || 'unknown',
      metadata: metadata || {},
    }
    
    console.error('[AUDIT]', JSON.stringify(logEntry))
  }
}

export const logger = new Logger()

