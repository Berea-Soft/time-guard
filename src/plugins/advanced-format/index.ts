/**
 * TimeGuard Advanced Format Plugin
 * Adds advanced format tokens: Q (quarter), Do (ordinal), w (week), etc.
 * Follows SOLID principles and extends core formatting capabilities
 */

import type { ITimeGuardPlugin } from '../../types';
import type { TimeGuard } from '../../time-guard';
import type { Temporal } from '@js-temporal/polyfill';

export class AdvancedFormatPlugin implements ITimeGuardPlugin {
  name = 'advanced-format';
  version = '1.0.0';

  /**
   * Install plugin into TimeGuard
   */
  install(TimeGuardClass: typeof TimeGuard): void {
    // Store original format method
    const originalFormat = TimeGuardClass.prototype.format;

    /**
     * Extended format method with advanced tokens
     */
    (TimeGuardClass.prototype as any).format = function (pattern: string) {
      if (!pattern || typeof pattern !== 'string') {
        return originalFormat.call(this, pattern);
      }

      // Check if pattern contains advanced tokens
      if (!/Q|Do|w|W|gggg|GGGG|k{1,2}|X|x|zzz?/.test(pattern)) {
        return originalFormat.call(this, pattern);
      }

      // Get the underlying Temporal object
      const temporal = this.toTemporal();
      const temporal_dt =
        'toPlainDateTime' in temporal
          ? (temporal as any).toPlainDateTime()
          : (temporal as Temporal.PlainDateTime);
      
      const ordinalFn = (n: number) => {
        const suffixes = ['th', 'st', 'nd', 'rd'];
        const v = n % 100;
        return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
      };
      const padFn = (n: number, length: number) => String(n).padStart(length, '0');
      const getISOWeek = (temporal: any) => {
        const jan4 = new Date(temporal.year, 0, 4);
        const week1Start = new Date(jan4);
        week1Start.setDate(jan4.getDate() - jan4.getDay() + (jan4.getDay() === 0 ? -6 : 1));
        const currentDate = new Date(temporal.year, temporal.month - 1, temporal.day);
        const weekNum = Math.floor((currentDate.getTime() - week1Start.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
        return Math.max(1, weekNum);
      };
      const getWeekOfYear = (temporal: any) => {
        const weekNum = Math.ceil(((temporal.day + new Date(temporal.year, temporal.month - 1, 1).getDay()) / 7));
        return Math.max(1, weekNum);
      };
      const getISOWeekYear = (temporal: any) => {
        const currentDate = new Date(temporal.year, temporal.month - 1, temporal.day);
        const yearAdjust = currentDate.getTime() < new Date(temporal.year, 0, 1).getTime() ? -1 : currentDate.getTime() >= new Date(temporal.year + 1, 0, 1).getTime() ? 1 : 0;
        return temporal.year + yearAdjust;
      };
      const getWeekYear = (temporal: any) => {
        const yearAdjust = temporal.month === 1 && temporal.day < 4 ? -1 : temporal.month === 12 && temporal.day > 28 ? 1 : 0;
        return temporal.year + yearAdjust;
      };

      // Replace advanced tokens - wrap results in brackets to protect from standard formatter
      let result = pattern.replace(
        /Q|Do|w|W|gggg|GGGG|k{1,2}|X|x|zzz?/g,
        (match) => {
          let replacement = '';
          switch (match) {
            // Quarter
            case 'Q':
              replacement = String(Math.ceil((temporal_dt.month) / 3));
              break;

            // Ordinal day
            case 'Do':
              replacement = ordinalFn(temporal_dt.day);
              break;

            // Week of year (ISO)
            case 'W':
            case 'WW':
              replacement = padFn(getISOWeek(temporal_dt), match === 'W' ? 1 : 2);
              break;

            // Week of year (locale)
            case 'w':
            case 'ww':
              replacement = padFn(getWeekOfYear(temporal_dt), match === 'w' ? 1 : 2);
              break;

            // ISO week year
            case 'GGGG':
              replacement = String(getISOWeekYear(temporal_dt));
              break;

            // Week year
            case 'gggg':
              replacement = String(getWeekYear(temporal_dt));
              break;

            // Hour (1-24)
            case 'k':
            case 'kk':
              const hour = temporal_dt.hour === 0 ? 24 : temporal_dt.hour;
              replacement = padFn(hour, match === 'k' ? 1 : 2);
              break;

            // Unix seconds timestamp
            case 'X':
              replacement = String(Math.floor(this.valueOf() / 1000));
              break;

            // Unix milliseconds timestamp
            case 'x':
              replacement = String(this.valueOf());
              break;

            // Timezone offset
            case 'z':
              replacement = `${this.getTimezoneOffset()}`;
              break;

            case 'zzz':
              replacement = `${this.getTimezoneOffsetLong()}`;
              break;

            default:
              return match;
          }
          // Wrap in brackets to protect from standard formatter
          return `[${replacement}]`;
        },
      );

      // Apply standard format to the result
      return originalFormat.call(this, result);
    };
  }

  /**
   * Get ordinal suffix (1st, 2nd, 3rd, etc.)
   */
  // @ts-expect-error - Method called dynamically within replace callback
  private getOrdinal(n: number): string {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  }

  /**
   * Pad number with leading zeros
   */
  // @ts-expect-error - Method called dynamically within replace callback
  private padNumber(n: number, length: number): string {
    return String(n).padStart(length, '0');
  }

  /**
   * Get ISO week number
   */
  // @ts-expect-error - Method called dynamically within replace callback
  private getISOWeek(temporal: Temporal.PlainDateTime): number {
    // Simple ISO week calculation
    const jan4 = new Date(temporal.year, 0, 4);
    const week1Start = new Date(jan4);
    week1Start.setDate(jan4.getDate() - jan4.getDay() + (jan4.getDay() === 0 ? -6 : 1));

    const currentDate = new Date(temporal.year, temporal.month - 1, temporal.day);
    const weekNum = Math.floor(
      (currentDate.getTime() - week1Start.getTime()) / (7 * 24 * 60 * 60 * 1000),
    ) + 1;

    return Math.max(1, weekNum);
  }

  /**
   * Get week of year (locale-based)
   */
  // @ts-expect-error - Method called dynamically within replace callback
  private getWeekOfYear(temporal: Temporal.PlainDateTime): number {
    const weekNum = Math.ceil(
      ((temporal.day + new Date(temporal.year, temporal.month - 1, 1).getDay()) / 7),
    );
    return Math.max(1, weekNum);
  }

  /**
   * Get ISO week year
   */
  // @ts-expect-error - Method called dynamically within replace callback
  private getISOWeekYear(temporal: Temporal.PlainDateTime): number {
    const currentDate = new Date(temporal.year, temporal.month - 1, temporal.day);
    const yearAdjust =
      currentDate.getTime() < new Date(temporal.year, 0, 1).getTime()
        ? -1
        : currentDate.getTime() >= new Date(temporal.year + 1, 0, 1).getTime()
          ? 1
          : 0;

    return temporal.year + yearAdjust;
  }

  /**
   * Get week year
   */
  // @ts-expect-error - Method called dynamically within replace callback
  private getWeekYear(temporal: Temporal.PlainDateTime): number {
    const yearAdjust =
      temporal.month === 1 && temporal.day < 4
        ? -1
        : temporal.month === 12 && temporal.day > 28
          ? 1
          : 0;
    return temporal.year + yearAdjust;
  }

  /**
   * Get timezone offset short form
   */
  // @ts-expect-error - Method called dynamically within replace callback
  private getTimezoneOffset(): string {
    try {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC',
        timeZoneName: 'short',
      });
      return formatter.formatToParts(now).find(p => p.type === 'timeZoneName')?.value || 'UTC';
    } catch {
      return 'UTC';
    }
  }

  /**
   * Get timezone offset long form
   */
  // @ts-expect-error - Method called dynamically within replace callback
  private getTimezoneOffsetLong(): string {
    try {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC',
        timeZoneName: 'long',
      });
      return formatter.formatToParts(now).find(p => p.type === 'timeZoneName')?.value || 'Coordinated Universal Time';
    } catch {
      return 'Coordinated Universal Time';
    }
  }
}

/**
 * Create and export default instance
 */
export default new AdvancedFormatPlugin();
