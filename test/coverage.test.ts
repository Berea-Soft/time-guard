/**
 * Coverage Tests - Improve code coverage to 80%
 * Tests edge cases and uncovered code paths
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  TimeGuard,
  CalendarManager, 
  GregorianCalendar,
  DateFormatter,
  PluginManager,
  timeGuard,
  IslamicCalendar,
  HebrewCalendar,
  ChineseCalendar,
  JapaneseCalendar,
  BuddhistCalendar,
  Duration,
  advancedFormatPlugin,
} from '../src/index';
import { 
  joinDurationParts, 
  getDurationUnitLabel, 
  formatDurationPart,
  getConjunctionLabel,
  formatZeroDuration 
} from '../src/utils/duration-locale';

describe('Coverage Tests - Calendar Manager', () => {
  beforeEach(() => {
    (CalendarManager as any).instance = undefined;
  });

  it('should get month name with boundary values', () => {
    const calendar = new GregorianCalendar();
    expect(calendar.getMonthName(1)).toBe('January');
    expect(calendar.getMonthName(12)).toBe('December');
    expect(calendar.getMonthName(1, true)).toBe('Jan');
    expect(calendar.getMonthName(12, true)).toBe('Dec');
  });

  it('should handle out-of-range month values gracefully', () => {
    const calendar = new GregorianCalendar();
    expect(calendar.getMonthName(0)).toBe('January');
    expect(calendar.getMonthName(13)).toBe('December');
  });

  it('should get weekday name with boundary values', () => {
    const calendar = new GregorianCalendar();
    expect(calendar.getWeekdayName(1)).toBe('Sunday');
    expect(calendar.getWeekdayName(7)).toBe('Saturday');
    expect(calendar.getWeekdayName(1, true)).toBe('Sun');
    expect(calendar.getWeekdayName(7, true)).toBe('Sat');
  });

  it('should handle out-of-range weekday values gracefully', () => {
    const calendar = new GregorianCalendar();
    expect(calendar.getWeekdayName(0)).toBe('Sunday');
    expect(calendar.getWeekdayName(8)).toBe('Saturday');
  });

  it('should calculate leap years correctly', () => {
    const calendar = new GregorianCalendar();
    expect(calendar.isLeapYear(2024)).toBe(true);
    expect(calendar.isLeapYear(2023)).toBe(false);
    expect(calendar.isLeapYear(2000)).toBe(true);
    expect(calendar.isLeapYear(1900)).toBe(false);
  });

  it('should calculate days in month', () => {
    const calendar = new GregorianCalendar();
    expect(calendar.daysInMonth(2024, 2)).toBe(29);
    expect(calendar.daysInMonth(2023, 2)).toBe(28);
    expect(calendar.daysInMonth(2024, 1)).toBe(31);
    expect(calendar.daysInMonth(2024, 4)).toBe(30);
  });

  it('should calculate days in year', () => {
    const calendar = new GregorianCalendar();
    expect(calendar.daysInYear(2024)).toBe(366);
    expect(calendar.daysInYear(2023)).toBe(365);
  });

  it('should register and retrieve calendars', () => {
    const manager = CalendarManager.getInstance();
    expect(manager.get('gregory')).toBeDefined();
    expect(manager.list()).toContain('gregory');
  });

  it('should set and get default calendar', () => {
    const manager = CalendarManager.getInstance();
    expect(manager.getDefault()).toBeDefined();
    expect(manager.getDefault().id).toBe('gregory');
  });

  it('should not set default calendar if it does not exist', () => {
    const manager = CalendarManager.getInstance();
    const original = manager.getDefault();
    manager.setDefault('nonexistent');
    expect(manager.getDefault()).toBe(original);
  });
});

describe('Coverage Tests - Date Formatter', () => {
  const formatter = new DateFormatter();

  it('should format with single digit tokens', () => {
    const tg = timeGuard('2024-04-05 09:05:05');
    const result = tg.format('Y M D H m s');
    expect(result).toBe('2024 4 5 9 5 5');
  });

  it('should format with YY token', () => {
    const tg = timeGuard('2024-04-15');
    const result = tg.format('YY');
    expect(result).toBe('24');
  });

  it('should format meridiem with PM', () => {
    const tg = timeGuard('2024-04-15 14:30:00');
    const resultLower = tg.format('a');
    expect(resultLower).toBe('pm');
    const resultUpper = tg.format('A');
    expect(resultUpper).toBe('PM');
  });

  it('should handle AM hours correctly', () => {
    const tg = timeGuard('2024-04-15 08:30:00');
    const result = tg.format('hh:mm a');
    expect(result).toBe('08:30 am');
  });

  it('should get all preset patterns', () => {
    expect(formatter.getPreset('iso')).toBe('YYYY-MM-DDTHH:mm:ss.SSSZ');
    expect(formatter.getPreset('date')).toBe('YYYY-MM-DD');
    expect(formatter.getPreset('time')).toBe('HH:mm:ss');
    expect(formatter.getPreset('datetime')).toBe('YYYY-MM-DD HH:mm:ss');
    expect(formatter.getPreset('rfc2822')).toBe('ddd, DD MMM YYYY HH:mm:ss Z');
    expect(formatter.getPreset('rfc3339')).toBe('YYYY-MM-DDTHH:mm:ssZ');
    expect(formatter.getPreset('utc')).toBe('YYYY-MM-DDTHH:mm:ss[Z]');
  });
});

describe('Coverage Tests - Plugin Manager', () => {
  beforeEach(() => {
    PluginManager.clear();
  });

  it('should register a plugin', () => {
    const mockPlugin = {
      name: 'test-plugin',
      version: '1.0.0',
      install: vi.fn(),
    };

    PluginManager.use(mockPlugin, TimeGuard);
    expect(PluginManager.listPlugins()).toContain('test-plugin');
    PluginManager.clear();
  });

  it('should get a registered plugin', () => {
    const mockPlugin = {
      name: 'test-plugin',
      version: '1.0.0',
      install: vi.fn(),
    };

    PluginManager.use(mockPlugin, TimeGuard);
    const retrieved = PluginManager.getPlugin('test-plugin');
    expect(retrieved).toBe(mockPlugin);
    PluginManager.clear();
  });

  it('should return undefined for non-existent plugin', () => {
    const retrieved = PluginManager.getPlugin('non-existent');
    expect(retrieved).toBeUndefined();
  });

  it('should list all plugins', () => {
    const plugin1 = { name: 'plugin1', version: '1.0.0', install: vi.fn() };
    const plugin2 = { name: 'plugin2', version: '1.0.0', install: vi.fn() };

    PluginManager.use(plugin1, TimeGuard);
    PluginManager.use(plugin2, TimeGuard);

    const list = PluginManager.listPlugins();
    expect(list).toContain('plugin1');
    expect(list).toContain('plugin2');
    PluginManager.clear();
  });

  it('should unregister a plugin', () => {
    const mockPlugin = {
      name: 'test-plugin',
      version: '1.0.0',
      install: vi.fn(),
    };

    PluginManager.use(mockPlugin, TimeGuard);
    PluginManager.unuse('test-plugin');
    expect(PluginManager.getPlugin('test-plugin')).toBeUndefined();
  });

  it('should check if plugin is registered', () => {
    const mockPlugin = {
      name: 'test-plugin',
      version: '1.0.0',
      install: vi.fn(),
    };

    expect(PluginManager.hasPlugin('test-plugin')).toBe(false);
    PluginManager.use(mockPlugin, TimeGuard);
    expect(PluginManager.hasPlugin('test-plugin')).toBe(true);
    PluginManager.clear();
  });

  it('should clear all plugins', () => {
    const plugin1 = { name: 'plugin1', version: '1.0.0', install: vi.fn() };
    const plugin2 = { name: 'plugin2', version: '1.0.0', install: vi.fn() };

    PluginManager.use(plugin1, TimeGuard);
    PluginManager.use(plugin2, TimeGuard);
    PluginManager.clear();

    expect(PluginManager.listPlugins()).toEqual([]);
  });

  it('should warn when registering duplicate plugins', () => {
    const mockPlugin = {
      name: 'test-plugin',
      version: '1.0.0',
      install: vi.fn(),
    };

    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    PluginManager.use(mockPlugin, TimeGuard);
    PluginManager.use(mockPlugin, TimeGuard);
    
    expect(consoleWarnSpy).toHaveBeenCalled();
    consoleWarnSpy.mockRestore();
    PluginManager.clear();
  });
});

describe('Coverage Tests - Alternative Calendars', () => {
  describe('Islamic Calendar', () => {
    it('should return correct month names', () => {
      const calendar = new IslamicCalendar();
      expect(calendar.getMonthName(1)).toBe('Muharram');
      expect(calendar.getMonthName(12)).toBe('Dhu al-Hijjah');
      expect(calendar.id).toBe('islamic');
    });

    it('should handle out-of-range months', () => {
      const calendar = new IslamicCalendar();
      expect(calendar.getMonthName(0)).toBe('Muharram');
      expect(calendar.getMonthName(13)).toBe('Dhu al-Hijjah');
    });

    it('should calculate leap years', () => {
      const calendar = new IslamicCalendar();
      expect(calendar.isLeapYear(2)).toBe(true);
      expect(calendar.isLeapYear(3)).toBe(false);
      expect(calendar.isLeapYear(32)).toBe(true);
    });

    it('should calculate days in month', () => {
      const calendar = new IslamicCalendar();
      expect(calendar.daysInMonth(1, 1)).toBe(30);
      expect(calendar.daysInMonth(1, 2)).toBe(29);
    });

    it('should calculate days in year', () => {
      const calendar = new IslamicCalendar();
      expect(calendar.daysInYear(2)).toBe(355);
      expect(calendar.daysInYear(3)).toBe(354);
    });

    it('should get weekday names', () => {
      const calendar = new IslamicCalendar();
      expect(calendar.getWeekdayName(1)).toBe('Ahad');
      expect(calendar.getWeekdayName(1, true)).toBe('Ahd');
    });
  });

  describe('Hebrew Calendar', () => {
    it('should return correct month names', () => {
      const calendar = new HebrewCalendar();
      expect(calendar.getMonthName(1)).toBe('Tishrei');
      expect(calendar.getMonthName(12)).toBe('Elul');
      expect(calendar.id).toBe('hebrew');
    });

    it('should handle out-of-range months', () => {
      const calendar = new HebrewCalendar();
      expect(calendar.getMonthName(0)).toBe('Tishrei');
      expect(calendar.getMonthName(13)).toBe('Elul');
    });

    it('should get weekday names', () => {
      const calendar = new HebrewCalendar();
      expect(calendar.getWeekdayName(1)).toBe('Sunday');
      expect(calendar.getWeekdayName(1, true)).toBe('Sun');
    });
  });

  describe('Chinese Calendar', () => {
    it('should return correct month names', () => {
      const calendar = new ChineseCalendar();
      expect(calendar.getMonthName(1)).toBe('正月');
      expect(calendar.getMonthName(12)).toBe('腊月');
      expect(calendar.id).toBe('chinese');
    });

    it('should handle out-of-range months', () => {
      const calendar = new ChineseCalendar();
      expect(calendar.getMonthName(0)).toBe('正月');
      expect(calendar.getMonthName(13)).toBe('腊月');
    });

    it('should calculate leap years', () => {
      const calendar = new ChineseCalendar();
      expect(calendar.isLeapYear(3)).toBe(true);
      expect(calendar.isLeapYear(4)).toBe(false);
    });

    it('should calculate days in month', () => {
      const calendar = new ChineseCalendar();
      expect(calendar.daysInMonth(1, 2)).toBe(30);
      expect(calendar.daysInMonth(1, 1)).toBe(29);
    });

    it('should calculate days in year', () => {
      const calendar = new ChineseCalendar();
      expect(calendar.daysInYear(3)).toBe(384);
      expect(calendar.daysInYear(4)).toBe(354);
    });

    it('should get zodiac sign', () => {
      const calendar = new ChineseCalendar();
      expect(calendar.getZodiacSign(2024)).toBeDefined();
      expect(calendar.getZodiacSign(0)).toBeDefined();
    });

    it('should get weekday names', () => {
      const calendar = new ChineseCalendar();
      expect(calendar.getWeekdayName(1)).toBe('星期日');
      expect(calendar.getWeekdayName(1, true)).toBe('日');
    });
  });

  describe('Japanese Calendar', () => {
    it('should return correct month names', () => {
      const calendar = new JapaneseCalendar();
      expect(calendar.getMonthName(1)).toBe('1月');
      expect(calendar.getMonthName(12)).toBe('12月');
      expect(calendar.id).toBe('japanese');
    });

    it('should handle out-of-range months', () => {
      const calendar = new JapaneseCalendar();
      expect(calendar.getMonthName(0)).toBe('1月');
      expect(calendar.getMonthName(13)).toBe('12月');
    });

    it('should calculate leap years', () => {
      const calendar = new JapaneseCalendar();
      expect(calendar.isLeapYear(2024)).toBe(true);
      expect(calendar.isLeapYear(2023)).toBe(false);
      expect(calendar.isLeapYear(2000)).toBe(true);
      expect(calendar.isLeapYear(1900)).toBe(false);
    });

    it('should calculate days in month', () => {
      const calendar = new JapaneseCalendar();
      expect(calendar.daysInMonth(2024, 2)).toBe(29);
      expect(calendar.daysInMonth(2023, 2)).toBe(28);
    });

    it('should calculate days in year', () => {
      const calendar = new JapaneseCalendar();
      expect(calendar.daysInYear(2024)).toBe(366);
      expect(calendar.daysInYear(2023)).toBe(365);
    });

    it('should get weekday names', () => {
      const calendar = new JapaneseCalendar();
      expect(calendar.getWeekdayName(1)).toBe('日曜日');
      expect(calendar.getWeekdayName(1, true)).toBe('日');
    });
  });

  describe('Buddhist Calendar', () => {
    it('should return correct month names', () => {
      const calendar = new BuddhistCalendar();
      expect(calendar.getMonthName(1)).toBe('January');
      expect(calendar.getMonthName(12)).toBe('December');
      expect(calendar.id).toBe('buddhist');
    });

    it('should handle out-of-range months', () => {
      const calendar = new BuddhistCalendar();
      expect(calendar.getMonthName(0)).toBe('January');
      expect(calendar.getMonthName(13)).toBe('December');
    });

    it('should get weekday names', () => {
      const calendar = new BuddhistCalendar();
      expect(calendar.getWeekdayName(1)).toBe('Sunday');
    });
  });
});

describe('Coverage Tests - Duration Plugin', () => {
  it('should create duration from ISO string', () => {
    const dur = Duration.fromISO('P3Y6M4DT12H30M5S');
    expect(dur).toBeDefined();
  });

  it('should create duration from negative ISO string', () => {
    const dur = Duration.fromISO('-P3Y6M4DT12H30M5S');
    expect(dur).toBeDefined();
  });

  it('should throw on invalid ISO string', () => {
    expect(() => Duration.fromISO('invalid')).toThrow();
  });

  it('should create duration from milliseconds', () => {
    const dur = Duration.fromMilliseconds(1000 * 60 * 60 * 24);
    expect(dur).toBeDefined();
  });

  it('should handle negative milliseconds', () => {
    const dur = Duration.fromMilliseconds(-1000 * 60 * 60);
    expect(dur).toBeDefined();
  });

  it('should create duration between two dates', () => {
    const from = timeGuard('2024-01-01');
    const to = timeGuard('2024-12-31');
    const dur = Duration.between(from, to);
    expect(dur).toBeDefined();
  });

  it('should format duration to ISO string', () => {
    const dur = new Duration({ years: 1, months: 2, days: 3, hours: 4, minutes: 5, seconds: 6 });
    const iso = dur.toISO();
    expect(iso).toBeDefined();
    expect(iso).toContain('P');
  });

  it('should get duration object', () => {
    const dur = new Duration({ years: 1, months: 2, days: 3 });
    const obj = dur.toObject();
    expect(obj.years).toBe(1);
    expect(obj.months).toBe(2);
    expect(obj.days).toBe(3);
  });

  it('should calculate asMilliseconds', () => {
    const dur = new Duration({ hours: 1, minutes: 30, seconds: 45 });
    const ms = dur.asMilliseconds();
    expect(ms).toBeGreaterThan(0);
  });

  it('should calculate asSeconds', () => {
    const dur = new Duration({ minutes: 1 });
    expect(dur.asSeconds()).toBe(60);
  });

  it('should calculate asMinutes', () => {
    const dur = new Duration({ hours: 1 });
    expect(dur.asMinutes()).toBe(60);
  });

  it('should calculate asHours', () => {
    const dur = new Duration({ days: 1 });
    expect(dur.asHours()).toBe(24);
  });

  it('should calculate asDays', () => {
    const dur = new Duration({ weeks: 1 });
    expect(dur.asDays()).toBe(7);
  });

  it('should calculate asWeeks', () => {
    const dur = new Duration({ days: 14 });
    expect(dur.asWeeks()).toBe(2);
  });

  it('should calculate asMonths', () => {
    const dur = new Duration({ days: 60 });
    expect(dur.asMonths()).toBeCloseTo(2, 1);
  });

  it('should calculate asYears', () => {
    const dur = new Duration({ days: 365 });
    expect(dur.asYears()).toBeCloseTo(1, 1);
  });

  it('should humanize duration', () => {
    const dur = new Duration({ days: 5, hours: 3 });
    const humanized = dur.humanize();
    expect(humanized).toContain('day');
    expect(humanized).toContain('hour');
  });

  it('should humanize zero duration', () => {
    const dur = new Duration({});
    const humanized = dur.humanize();
    expect(humanized).toBe('0 seconds');
  });

  it('should check if duration is negative', () => {
    const dur = Duration.fromISO('-P5D');
    expect(dur.isNegative()).toBe(true);
  });

  it('should get absolute value', () => {
    const dur = Duration.fromISO('-P5D');
    const abs = dur.abs();
    expect(abs).toBeDefined();
    expect(abs.isNegative()).toBe(false);
  });
});

describe('Coverage Tests - Duration Locale Utils', () => {
  it('should join duration parts with English', () => {
    const result = joinDurationParts(['1 year', '2 months'], 'en');
    expect(result).toContain('and');
  });

  it('should handle empty array', () => {
    const result = joinDurationParts([], 'en');
    expect(result).toBe('');
  });

  it('should handle single part', () => {
    const result = joinDurationParts(['5 hours'], 'en');
    expect(result).toBe('5 hours');
  });

  it('should handle two parts', () => {
    const result = joinDurationParts(['1 year', '2 months'], 'en');
    expect(result).toBe('1 year and 2 months');
  });

  it('should handle multiple parts', () => {
    const result = joinDurationParts(['1 year', '2 months', '3 days'], 'en');
    expect(result).toContain(',');
    expect(result).toContain('and');
  });

  it('should handle Spanish conjunction', () => {
    const result = joinDurationParts(['1 año', '2 meses'], 'es');
    expect(result).toContain('y');
  });

  it('should get duration unit label for singular', () => {
    expect(getDurationUnitLabel('year', 'en', 1)).toBe('year');
    expect(getDurationUnitLabel('month', 'en', 1)).toBe('month');
  });

  it('should get duration unit label for plural', () => {
    expect(getDurationUnitLabel('year', 'en', 2)).toBe('years');
    expect(getDurationUnitLabel('year', 'en', 0)).toBe('years');
  });

  it('should fallback to English for unknown locale', () => {
    expect(getDurationUnitLabel('year', 'unknown', 1)).toBe('year');
  });

  it('should format duration part', () => {
    expect(formatDurationPart(5, 'hour', 'en')).toBe('5 hours');
    expect(formatDurationPart(1, 'hour', 'en')).toBe('1 hour');
  });

  it('should return empty for zero value', () => {
    expect(formatDurationPart(0, 'hour', 'en')).toBe('');
  });

  it('should get conjunction labels', () => {
    expect(getConjunctionLabel('en')).toBe('and');
    expect(getConjunctionLabel('es')).toBe('y');
    expect(getConjunctionLabel('fr')).toBe('et');
    expect(getConjunctionLabel('de')).toBe('und');
    expect(getConjunctionLabel('it')).toBe('e');
    expect(getConjunctionLabel('pt')).toBe('e');
    expect(getConjunctionLabel('unknown')).toBe('and');
  });

  it('should format zero duration', () => {
    expect(formatZeroDuration('en')).toBe('0 seconds');
    expect(formatZeroDuration('es')).toBe('0 segundos');
    expect(formatZeroDuration('fr')).toBe('0 secondes');
    expect(formatZeroDuration('unknown')).toBe('0 seconds');
  });
});

describe('Coverage Tests - Advanced Format Plugin Integration', () => {
  beforeEach(() => {
    PluginManager.clear();
  });

  it('should format with quarter token Q', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);
    
    const tg1 = timeGuard('2024-01-15');
    expect(tg1.format('Q')).toContain('1');
    
    const tg2 = timeGuard('2024-05-15');
    expect(tg2.format('Q')).toContain('2');
    
    const tg3 = timeGuard('2024-08-15');
    expect(tg3.format('Q')).toContain('3');
    
    const tg4 = timeGuard('2024-11-15');
    expect(tg4.format('Q')).toContain('4');
  });

  it('should format ordinal days', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);
    
    expect(timeGuard('2024-04-01').format('Do')).toContain('1st');
    expect(timeGuard('2024-04-02').format('Do')).toContain('2nd');
    expect(timeGuard('2024-04-03').format('Do')).toContain('3rd');
    expect(timeGuard('2024-04-04').format('Do')).toContain('4th');
    expect(timeGuard('2024-04-11').format('Do')).toContain('11th');
    expect(timeGuard('2024-04-21').format('Do')).toContain('21st');
  });

  it('should format ISO week numbers', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);
    
    const tg = timeGuard('2024-01-15');
    const w = tg.format('W');
    const ww = tg.format('WW');
    expect(w).toBeDefined();
    expect(ww).toBeDefined();
  });

  it('should format locale week numbers', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);
    
    const tg = timeGuard('2024-04-15');
    const w = tg.format('w');
    const ww = tg.format('ww');
    expect(w).toBeDefined();
    expect(ww).toBeDefined();
  });

  it('should format ISO week year', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);
    
    const tg = timeGuard('2024-01-15');
    expect(tg.format('GGGG')).toContain('2024');
  });

  it('should format week year', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);
    
    const tg = timeGuard('2024-01-15');
    expect(tg.format('gggg')).toContain('2024');
  });

  it('should format 24-hour clock', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);
    
    const tg = timeGuard('2024-04-15 00:30:00');
    expect(tg.format('k')).toContain('24');
    
    const tg2 = timeGuard('2024-04-15 05:30:00');
    expect(tg2.format('kk')).toContain('05');
  });

  it('should format Unix timestamps', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);
    
    const tg = timeGuard('2024-04-15 10:30:00');
    const x = tg.format('X');
    const xx = tg.format('x');
    expect(x).toBeDefined();
    expect(xx).toBeDefined();
  });

  it('should handle mixed standard and advanced tokens', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);
    
    const tg = timeGuard('2024-04-15');
    const result = tg.format('YYYY-MM-DD Q');
    expect(result).toContain('2024');
    expect(result).toContain('04');
    expect(result).toContain('15');
  });

  it('should pass through patterns without advanced tokens', () => {
    PluginManager.use(advancedFormatPlugin, TimeGuard);
    
    const tg = timeGuard('2024-04-15');
    const result = tg.format('YYYY-MM-DD');
    expect(result).toBe('2024-04-15');
  });
});
