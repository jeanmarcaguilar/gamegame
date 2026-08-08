/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: 'var(--color-bg)',
          secondary: 'var(--color-bg-secondary)',
          card: 'var(--color-card)',
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          accent: 'var(--color-accent)',
          soft: 'var(--color-primary-soft)',
          fg: 'var(--color-primary-fg)',
        },
        text: {
          DEFAULT: 'var(--color-text)',
          muted: 'var(--color-muted)',
        },
        success: 'var(--color-success)',
        border: {
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
        },
        status: {
          warn: 'var(--color-status-warn)',
          err: 'var(--color-status-err)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        body: ['Poppins', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -8px var(--color-shadow-soft)',
        glow: '0 0 30px rgba(59, 130, 246, 0.25)',
        'glow-strong': '0 0 60px rgba(59, 130, 246, 0.35)',
        card: '0 8px 32px -8px var(--color-shadow-card)',
      },
      backdropBlur: {
        xs: '2px',
        '4xl': '72px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-in': 'slideIn 0.6s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        glow: 'glow 3s ease-in-out infinite',
        'border-spin': 'borderSpin 6s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59,130,246,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(59,130,246,0.6)' },
        },
        borderSpin: {
          to: { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
};