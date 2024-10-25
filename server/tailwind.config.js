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
        primary: {
          DEFAULT: '#62B6CB',
          light: '#C2E2EB',
        },
        border: '#D6D6D6',
      },
    },
  },
  plugins: [],
}
