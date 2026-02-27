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
        surface: '#fafafa',
        border: '#e5e5e5',
        ink: {
          DEFAULT: '#0a0a0a',
          secondary: '#525252',
          muted: '#a3a3a3',
          faint: '#d4d4d4',
        },
        accent: {
          DEFAULT: '#6366f1',
          light: '#eef2ff',
          muted: '#c7d2fe',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-hover': '0 4px 16px 0 rgb(0 0 0 / 0.08), 0 2px 8px -2px rgb(0 0 0 / 0.06)',
        modal: '0 20px 60px -12px rgb(0 0 0 / 0.15), 0 8px 24px -4px rgb(0 0 0 / 0.08)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'skeleton': { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.4' } },
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease both',
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': '#404040',
            '--tw-prose-headings': '#0a0a0a',
            lineHeight: '1.85',
            fontSize: '1.1rem',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
