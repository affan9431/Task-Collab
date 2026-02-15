/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Space Grotesk"', 'sans-serif']
      },
      colors: {
        ink: {
          900: '#0f172a',
          800: '#1f2937',
          700: '#334155'
        }
      },
      boxShadow: {
        soft: '0 20px 60px rgba(15, 23, 42, 0.15)'
      }
    }
  },
  plugins: []
};
