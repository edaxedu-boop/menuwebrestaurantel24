import konstaConfig from 'konsta/config';

export default konstaConfig({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#e63946',
        secondary: '#f1faee',
      }
    },
  },
  plugins: [],
});
