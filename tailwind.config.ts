import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC', // Slate 50 warm daylight canvas
        foreground: '#0F172A', // Slate 900 high-contrast text
        surface: {
          50: '#FFFFFF', // Pure white card
          100: '#F8FAFC', // Canvas base
          200: '#F1F5F9', // Inset / secondary well
          300: '#E2E8F0', // Border divider
          400: '#94A3B8',
          500: '#64748B', // Supporting metadata text
        },
        brand: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          600: '#2563EB',
          700: '#1D4ED8', // Primary trust indigo
          800: '#1E40AF',
        },
        risk: {
          high: '#DC2626',
          'high-bg': '#FEF2F2',
          'high-border': '#FECACA',
          'high-text': '#991B1B',
          suspicious: '#D97706',
          'suspicious-bg': '#FFFBEB',
          'suspicious-border': '#FDE68A',
          'suspicious-text': '#92400E',
          neutral: '#059669',
          'neutral-bg': '#ECFDF5',
          'neutral-border': '#A7F3D0',
          'neutral-text': '#065F46',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
