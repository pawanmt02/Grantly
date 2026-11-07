/**
 * @file useLocalStorage.ts
 * @description Custom hook for synced, type-safe LocalStorage state.
 */

import { useState, useEffect, useCallback } from 'react';
import { StorageService } from '../services/storageService';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    return StorageService.getItem<T>(key, initialValue);
  });

  useEffect(() => {
    StorageService.setItem(key, state);
  }, [key, state]);

  const updateValue = useCallback((value: T | ((prev: T) => T)) => {
    setState(prev => {
      const next = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;
      StorageService.setItem(key, next);
      return next;
    });
  }, [key]);

  return [state, updateValue];
}
