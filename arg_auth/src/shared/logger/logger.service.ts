import { Logger } from "@nestjs/common";
import chalk from 'chalk';

export class AppLogger extends Logger {
  constructor(context: string) {
    super(context);
  }

  log(message: string) {
    super.log(`[INFO] ${message}`);
  }

  error(message: string, trace?: string) {
    super.error(`[ERROR] ${message}`, trace);
  }

  warn(message: string) {
    super.warn(`[WARN] ${message}`);
  }

  debug(message: string) {
    super.debug(`[DEBUG] ${message}`);
  }

  /**
   * Log timing information with red color and icons (only in development)
   * @param message - The timing message
   * @param startTime - The start time in milliseconds
   * @param level - The timing level (start, step, end)
   */
  timing(message: string, startTime: number, level: 'start' | 'step' | 'end' = 'step') {
    const isDevelopment = process.env.NODE_ENV === 'dev';

    if (isDevelopment) {
      const elapsed = Date.now() - startTime;
      const icon = level === 'start' ? '🚀' : level === 'end' ? '🏁' : '⏱️';
      const coloredMessage = chalk.red(`${icon} [TIMING] ${message}: ${elapsed}ms`);
      super.warn(coloredMessage);

      // Alert for slow operations (over 5 seconds)
      if (elapsed > 5000) {
        const slowAlert = chalk.bgRed.white(`🚨 SLOW OPERATION DETECTED: ${message} took ${elapsed}ms`);
        super.warn(slowAlert);
      }
    }
  }

  /**
   * Log shared service timing with different icons (only in development)
   * @param message - The timing message
   * @param startTime - The start time in milliseconds
   * @param level - The timing level (start, step, end)
   */
  sharedTiming(message: string, startTime: number, level: 'start' | 'step' | 'end' = 'step') {
    const isDevelopment = process.env.NODE_ENV === 'dev';

    if (isDevelopment) {
      const elapsed = Date.now() - startTime;
      const icon = level === 'start' ? '🔄' : level === 'end' ? '✅' : '⚡';
      const coloredMessage = chalk.red(`${icon} [SHARED-SERVICE] ${message}: ${elapsed}ms`);
      super.warn(coloredMessage);

      // Alert for slow operations (over 5 seconds)
      if (elapsed > 5000) {
        const slowAlert = chalk.bgRed.white(`🚨 SLOW SHARED-SERVICE: ${message} took ${elapsed}ms`);
        super.warn(slowAlert);
      }
    }
  }
}
