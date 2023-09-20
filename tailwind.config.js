const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './src/**/*.{html,js}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        mono: ['Monospace', ...defaultTheme.fontFamily.mono],
        gotham: ['GothamPro'],
        telegrama: ['Telegrama Render'],
      },
      colors: {
        eth: {
          "400": "#78a5ff",
          "600": "#5170ad",
          "700": "#3f4f8c",
          "800": "#314367",
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
