/**
 * @file storageService.ts
 * @description Safe LocalStorage service with JSON schema error handling and fallback mechanism.
 */

export class StorageService {
  /**
   * Safely retrieves and parses an item from LocalStorage.
   * @param key Storage key
   * @param fallback Default value returned on error or null
   */
  static getItem<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return fallback;
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`[StorageService] Failed to read key: ${key}. Using fallback.`, error);
      return fallback;
    }
  }

  /**
   * Safely writes an item to LocalStorage with JSON serialization.
   * @param key Storage key
   * @param value Data to serialize
   */
  static setItem<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`[StorageService] Failed to write key: ${key}. Storage quota may be exceeded.`, error);
      return false;
    }
  }

  /**
   * Removes an item from storage.
   * @param key Storage key
   */
  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`[StorageService] Failed to remove key: ${key}`, error);
    }
  }

  /**
   * Clears all grantly-related keys.
   */
  static clearGrantlyData(): void {
    const keys = ['grantly_profile', 'grantly_scholarships', 'grantly_tracked', 'grantly_vault', 'grantly_dark_mode'];
    keys.forEach(k => {
      try {
        localStorage.removeItem(k);
      } catch (e) {
        // ignore
      }
    });
  }
}
