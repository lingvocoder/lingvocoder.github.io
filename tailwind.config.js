/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      './index.html',
      './pages/**/*.{js,html}',
      './scripts/**/*.mjs',
      './components/**/*.{js,html}',
  ],
  theme: {
    extend: {
      animation: {
        marquee: 'marquee var(--marquee-duration) linear infinite',
        rotate: 'rotateCircle var(--rotation-duration) linear infinite',
      },
      keyframes: {
        marquee: {
          from:{
            transform: 'translateX(0)',
          },
          to: {
            transform: 'translateX(-100%)'
          }
        },
        rotateCircle: {
          from: {
            transform: 'rotateZ(0deg)'
          },
          to: {
            transform: 'rotateZ(360deg)'
          }
        }
      },
      fontFamily: {
        Golos: ['Golos Text', 'sans-serif'],
        Merriweather: ['Merriweather', 'sans-serif'],
      },
      colors: {
        'yac-jet': {
          '100': '#313131',
        },
        'yac-gray': {
          '100': '#838383',
        },
        'yac-blue': {
          '100': '#3057A2',
        },
        'yac-sunglow': {
          '100': '#FBCE51',
        },
        'yac-almond': {
          '100': '#E9DED4',
        },
        'yac-timberwolf': {
          '100': '#D6D6D6',
        },
        'yac-wolf': {
          '100': '#D0D0D0',
        },
        'yac-red': {
          '100': '#F54932',
        },
      },
    },
  },
  plugins: [],
}

