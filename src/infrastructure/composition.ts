import { createPersistentPorts } from '@/infrastructure/persistent-ports';
import type { AppPorts } from '@/application/ports';

export function webKeyValue() {
  const memory = new Map<string, string>();
  return {
    getItem: (key: string) => {
      if (typeof localStorage !== 'undefined') return localStorage.getItem(key);
      return memory.get(key) ?? null;
    },
    setItem: (key: string, value: string) => {
      if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
      else memory.set(key, value);
    },
  };
}

export function isICloudAvailable(): boolean {
  if (typeof localStorage !== 'undefined' && localStorage.getItem('spend.icloud.available') === '1') {
    return true;
  }
  return false;
}

export function createDefaultPorts(now = new Date()): AppPorts {
  return createPersistentPorts({
    kv: webKeyValue(),
    now,
    iCloudAvailable: isICloudAvailable,
  });
}
