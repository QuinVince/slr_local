module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
      },
      fontSize: {
        sm: ['0.875rem', '1.25rem'],    // 14px
        base: ['0.9375rem', '1.375rem'], // 15px
        lg: ['1.0625rem', '1.5rem'],     // 17px
        xl: ['1.1875rem', '1.75rem'],    // 19px
      },
      colors: {
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
           500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
    },
  },
  plugins: [],
}
