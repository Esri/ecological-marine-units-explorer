const colors = require('tailwindcss/colors')

module.exports = {
  content: [ 
    './src/**/*.html',
    './src/**/*.{js,jsx,ts,tsx}' 
  ],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    colors: {
      ...colors,
      custom: {
        'light-blue': '#4da6ff',
        'blue': '#006cd8',
        'sidebar': {
          default: 'rgba(0,0,0,.75)',
          'selected-item': '#002e52'
        },
        'tooltip': 'rgba(0,0,0,.9)'
      }
    },
    extend: {
      width: {
        'sidebar': '450px'
      },
      height: {
        'info-panel-item-header': '35px',
        'info-panel-item-content': '275px',
        'tooltip': '220px',
        'header': '45px'
      },
      spacing: {
        // will be used to determine the top poistion depth slider
        '45px': '45px',
        // will be used to determine the bottom position of depth slider in normal view
        '346px': '346px',
        // will be used to determine the bottom position of depth slider in mobile view
        '382px': '382px',
        '350px': '350px'
      },
      fontSize: {
        '21px': '21px'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
