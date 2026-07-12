/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Humne orange theme rakha hai, toh yahan extra colors add kar sakte hain
      colors: {
        brand: '#ea580c', // Orange-600
      },
    },
  },
  plugins: [],
}