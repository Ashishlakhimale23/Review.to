/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    
    extend: {
      fontFamily:{
        space:[" 'Space Mono' ", "monospace"]
      },
      backgroundColor:{
        silver:"#323436"
      },
      borderColor:{
         silver:"#323436"
      },
     screens:{
      'middle':"870px"

    },
    },
  },
  plugins: [],
}