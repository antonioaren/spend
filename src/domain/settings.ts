export type Locale = 'en' | 'es';
export type ThemePreference = 'light' | 'dark' | 'system';
export type StoragePreference = 'local' | 'icloud';

export type Settings = {
  locale: Locale;
  theme: ThemePreference;
  storage: StoragePreference;
};

export const defaultSettings = (): Settings => ({
  locale: 'en',
  theme: 'system',
  storage: 'local',
});
