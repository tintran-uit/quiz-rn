


// src/styles/theme.ts

export const colors = {
  primary: '#4338CA', // Indigo-700
  primaryHover: '#6366F1', // Indigo-500
  secondary: '#10B981', // Emerald-500
  background: '#F8FAFC', // Slate-50
  text: '#1E293B', // Slate-800
  textLight: '#64748B', // Slate-500
  border: '#E2E8F0', // Slate-200
  success: '#22C55E', // Green-500
  error: '#EF4444', // Red-500
  warning: '#F59E0B', // Amber-500
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  title: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  full: 9999,
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 5,
  },
  button: {
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
};

const theme = { colors, spacing, fontSizes, borderRadius, shadow };
export default theme;
