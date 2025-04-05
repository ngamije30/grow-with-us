// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0070f3',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#7c3aed',
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#ff4444',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#f3f4f6',
          foreground: '#111827',
        },
        background: '#ffffff',
        input: '#e5e7eb',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}