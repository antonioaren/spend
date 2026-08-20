export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
} as const;

export const type = {
  title: { fontSize: 28, fontWeight: '600' as const, letterSpacing: -0.4 },
  subtitle: { fontSize: 16, fontWeight: '500' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
} as const;

export const palettes = {
  light: {
    background: '#F7F6F3',
    surface: '#FFFFFF',
    text: '#1C1C1A',
    muted: '#6F6E69',
    line: '#E6E4DE',
    accent: '#1F6FEB',
    danger: '#C0392B',
    chart: ['#1F6FEB', '#0F766E', '#B45309', '#7C3AED', '#BE185D'],
  },
  dark: {
    background: '#111110',
    surface: '#1C1C1A',
    text: '#F4F3EE',
    muted: '#A3A29B',
    line: '#2A2A27',
    accent: '#6EA8FF',
    danger: '#F07067',
    chart: ['#6EA8FF', '#2DD4BF', '#FBBF24', '#C4B5FD', '#F9A8D4'],
  },
} as const;

export type ThemeName = keyof typeof palettes;
export type Palette = (typeof palettes)[ThemeName];

export function paletteFor(theme: ThemeName): Palette {
  return palettes[theme];
}
