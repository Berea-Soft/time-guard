/**
 * TimeGuard Relative Time Plugin
 * Adds human-readable time differences (e.g., "2 hours ago", "in 3 days")
 * Follows SOLID principles and Temporal API standards
 */

import type { ITimeGuardPlugin } from '../../types';
import type { TimeGuard } from '../../time-guard';
import type { RelativeTimeConfig, RelativeTimeFormats, RelativeTimeThreshold } from './types';

const DEFAULT_THRESHOLDS: RelativeTimeThreshold[] = [
  { l: 's', r: 44, d: 'second' },
  { l: 'm', r: 89 },
  { l: 'mm', r: 44, d: 'minute' },
  { l: 'h', r: 89 },
  { l: 'hh', r: 21, d: 'hour' },
  { l: 'd', r: 35 },
  { l: 'dd', r: 25, d: 'day' },
  { l: 'M', r: 45 },
  { l: 'MM', r: 10, d: 'month' },
  { l: 'y', r: 17 },
  { l: 'yy', d: 'year' },
];

const DEFAULT_FORMATS: RelativeTimeFormats = {
  future: 'in %s',
  past: '%s ago',
  s: 'a few seconds',
  m: 'a minute',
  mm: '%d minutes',
  h: 'an hour',
  hh: '%d hours',
  d: 'a day',
  dd: '%d days',
  M: 'a month',
  MM: '%d months',
  y: 'a year',
  yy: '%d years',
};

export class RelativeTimePlugin implements ITimeGuardPlugin {
  name = 'relative-time';
  version = '1.0.0';
  
  private config: RelativeTimeConfig;
  private formats: RelativeTimeFormats;

  constructor(config?: RelativeTimeConfig) {
    this.config = {
      thresholds: config?.thresholds || DEFAULT_THRESHOLDS,
      rounding: config?.rounding || Math.round,
    };
    this.formats = DEFAULT_FORMATS;
  }

  /**
   * Install plugin into TimeGuard
   */
  install(TimeGuardClass: typeof TimeGuard): void {
    const plugin = this;

    /**
     * Get relative time string (e.g., "2 hours ago")
     */
    (TimeGuardClass.prototype as any).fromNow = function (withoutSuffix?: boolean): string {
      return plugin.formatRelativeTime(this, false, withoutSuffix);
    };

    /**
     * Get future relative time string (e.g., "in 3 days")
     */
    (TimeGuardClass.prototype as any).toNow = function (withoutSuffix?: boolean): string {
      return plugin.formatRelativeTime(this, true, withoutSuffix);
    };

    /**
     * Get human-readable duration
     */
    (TimeGuardClass.prototype as any).humanize = function (
      other?: TimeGuard,
      withoutSuffix?: boolean,
    ): string {
      if (other) {
        return plugin.formatRelativeTime(this, other.isAfter(this), withoutSuffix);
      }
      return plugin.formatRelativeTime(this, false, withoutSuffix);
    };
  }

  /**
   * Format relative time
   */
  private formatRelativeTime(
    date: TimeGuard,
    isFuture: boolean,
    withoutSuffix?: boolean,
  ): string {
    const now = (date.constructor as typeof TimeGuard).now();
    let diff = now.diff(date, 'millisecond');
    const absDiff = Math.abs(diff);
    const isFromNow = diff > 0;
    const actualIsFuture = isFuture ?? !isFromNow;

    let result = this.getRelativeTimeString(absDiff);

    if (withoutSuffix) {
      return result;
    }

    const suffix = actualIsFuture ? this.formats.future : this.formats.past;
    return suffix.replace('%s', result);
  }

  /**
   * Get relative time string based on milliseconds
   */
  private getRelativeTimeString(milliseconds: number): string {
    const thresholds = this.config.thresholds || DEFAULT_THRESHOLDS;
    const rounding = this.config.rounding || Math.round;

    for (let i = 0; i < thresholds.length; i++) {
      const threshold = thresholds[i];
      const nextThreshold = i + 1 < thresholds.length ? thresholds[i + 1] : null;

      // Skip if we haven't reached this threshold
      if (nextThreshold && threshold.r && milliseconds < threshold.r * 1000) {
        continue;
      }

      // Convert to appropriate unit
      let value: number;
      if (threshold.d) {
        const unitMs = this.getUnitMilliseconds(threshold.d);
        value = rounding(milliseconds / unitMs);
      } else {
        value = 1;
      }

      const label = threshold.l;
      const format = (this.formats as any)[label] || label;

      if (typeof format === 'string') {
        return format.includes('%d')
          ? format.replace('%d', String(value))
          : format;
      }

      return format;
    }

    // Fallback
    return `${rounding(milliseconds / 1000)} seconds`;
  }

  /**
   * Get milliseconds per unit
   */
  private getUnitMilliseconds(unit: string): number {
    const msMap: Record<string, number> = {
      second: 1000,
      minute: 1000 * 60,
      hour: 1000 * 60 * 60,
      day: 1000 * 60 * 60 * 24,
      month: 1000 * 60 * 60 * 24 * 30,
      year: 1000 * 60 * 60 * 24 * 365,
    };
    return msMap[unit] || 1;
  }

  /**
   * Set format strings
   */
  setFormats(formats: Partial<RelativeTimeFormats>): void {
    Object.assign(this.formats, formats);
  }

  /**
   * Get current formats
   */
  getFormats(): RelativeTimeFormats {
    return { ...this.formats };
  }
}

/**
 * Create and export default instance
 */
export default new RelativeTimePlugin();
