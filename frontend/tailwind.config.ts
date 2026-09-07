import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ibvap: {
          bg: '#0A0F14',
          'bg-secondary': '#0F151C',
          surface: '#141C24',
          'surface-elevated': '#18222C',
          border: '#263442',
          'border-strong': '#344454',
          'text-primary': '#F3F6F8',
          'text-secondary': '#A7B2BD',
          'text-muted': '#6E7B87',
          'text-disabled': '#4E5A64',
          accent: '#37B9FF',
          success: '#39D98A',
          warning: '#F4C95D',
          danger: '#FF5C67',
          'high-threat': '#FF8A4C',
          info: '#63A8FF',
          sidebar: '#0B1117',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-in': 'slideIn 0.3s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
