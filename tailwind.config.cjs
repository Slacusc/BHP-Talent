/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'orange-2-bph':'#F77F00',
        'orange-1-bph':'#DD5900',
        'orange-3-bph':'#FCBA5E',
        'orange-4-bph':'#FFD691',
        'blue-grey-1-bph':'#2B5368',
        'blue-grey-2-bph':'#45768B',
        'blue-grey-3-bph':'#6BA4B8',
        'blue-grey-4-bph':'#BFCED6'
         }
    },
  },
  plugins: [],
}