/**
 * TimeGuard Plugin Manager
 * Singleton pattern for managing plugin registration and lifecycle
 * Follows SOLID principles - Single Responsibility & Dependency Inversion
 */

import type { ITimeGuardPlugin } from '../types';
import type { TimeGuard } from '../time-guard';

/**
 * Plugin Manager - handles plugin registration and initialization
 * Uses Singleton pattern to ensure single instance across application
 */
export class PluginManager {
  private static instance: PluginManager;
  private plugins: Map<string, ITimeGuardPlugin> = new Map();

  /**
   * Get singleton instance
   */
  static getInstance(): PluginManager {
    if (!PluginManager.instance) {
      PluginManager.instance = new PluginManager();
    }
    return PluginManager.instance;
  }

  /**
   * Register a plugin
   * @param plugin - The plugin to register
   * @param timeGuardClass - Reference to TimeGuard class
   * @param config - Optional plugin configuration
   */
  static use(
    plugin: ITimeGuardPlugin,
    timeGuardClass: typeof TimeGuard,
    config?: unknown,
  ): void {
    const manager = PluginManager.getInstance();
    manager.register(plugin, timeGuardClass, config);
  }

  /**
   * Register multiple plugins at once
   * @param plugins - Array of plugins to register
   * @param timeGuardClass - Reference to TimeGuard class
   * @param config - Optional plugin configuration
   */
  static useMultiple(
    plugins: ITimeGuardPlugin[],
    timeGuardClass: typeof TimeGuard,
    config?: unknown,
  ): void {
    const manager = PluginManager.getInstance();
    plugins.forEach(plugin => manager.register(plugin, timeGuardClass, config));
  }

  /**
   * Get registered plugin by name
   * @param name - Plugin name
   * @returns Plugin instance or undefined
   */
  static getPlugin(name: string): ITimeGuardPlugin | undefined {
    const manager = PluginManager.getInstance();
    return manager.plugins.get(name);
  }

  /**
   * Check if plugin is registered
   * @param name - Plugin name
   * @returns True if plugin is registered
   */
  static hasPlugin(name: string): boolean {
    const manager = PluginManager.getInstance();
    return manager.plugins.has(name);
  }

  /**
   * Get all registered plugins
   * @returns Array of registered plugin names
   */
  static listPlugins(): string[] {
    const manager = PluginManager.getInstance();
    return Array.from(manager.plugins.keys());
  }

  /**
   * Unregister a plugin
   * @param name - Plugin name
   */
  static unuse(name: string): boolean {
    const manager = PluginManager.getInstance();
    return manager.plugins.delete(name);
  }

  /**
   * Clear all plugins
   */
  static clear(): void {
    const manager = PluginManager.getInstance();
    manager.plugins.clear();
  }

  /**
   * Internal register method
   */
  private register(
    plugin: ITimeGuardPlugin,
    timeGuardClass: typeof TimeGuard,
    config?: unknown,
  ): void {
    if (this.plugins.has(plugin.name)) {
      console.warn(`Plugin "${plugin.name}" is already registered. Skipping...`);
      return;
    }

    try {
      plugin.install(timeGuardClass, config);
      this.plugins.set(plugin.name, plugin);
      console.debug(`Plugin "${plugin.name}" v${plugin.version} registered successfully`);
    } catch (error) {
      console.error(`Failed to register plugin "${plugin.name}":`, error);
      throw new Error(
        `Failed to register plugin "${plugin.name}": ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
