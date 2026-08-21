import { DomainError, ErrorCodes } from '../domain/errors';
import { defaultSettings, type Locale, type StoragePreference, type ThemePreference } from '../domain/settings';
import type { AppPorts } from './ports';

export function settingsUseCases(ports: AppPorts) {
  return {
    get: () => ports.settings.get(),
    async setLocale(locale: Locale) {
      const settings = await ports.settings.get();
      await ports.settings.save({ ...settings, locale });
    },
    async setTheme(theme: ThemePreference) {
      const settings = await ports.settings.get();
      await ports.settings.save({ ...settings, theme });
    },
    async setStorage(storage: StoragePreference) {
      if (storage === 'icloud') {
        const available = await ports.iCloud.isAvailable();
        if (!available) {
          throw new DomainError(ErrorCodes.ICLOUD_UNAVAILABLE, 'iCloud account is not available');
        }
      }
      const settings = await ports.settings.get();
      await ports.settings.save({ ...settings, storage });
    },
    defaults: defaultSettings,
  };
}
