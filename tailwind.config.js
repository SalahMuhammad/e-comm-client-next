// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './node_modules/flowbite/**/*.js',
    './styles/**/*.{css,pcss}',
  ],
  theme: {
    extend: {
      colors: {
        lightBg: '#f9f9fb',
        lightCard: '#ffffff',
        lightText: '#1f2937',
        darkBg: '#1e293b',
        darkCard: '#273549',
        darkText: '#e2e8f0',
      },
    },
  },
  // plugins: [require('flowbite/plugin'), require('tailwind-scrollbar')],
  plugins: [require('flowbite/plugin')],
};

// module.exports = {
//         darkMode: 'class', 
        // content : [
        //     "./pages/**/*.{js,ts,jsx,tsx}",
        //     "./components/**/*.{js,ts,jsx,tsx}",
        //     "./node_modules/flowbite/**/*.js"
        // ],
//         plugins: [
//             require('flowbite/plugin')
//         ]
// }

// -------------------------

// export const content = [
//     "./pages/**/*.{js,ts,jsx,tsx}",
//     "./components/**/*.{js,ts,jsx,tsx}",
//     "./node_modules/flowbite/**/*.js"
// ];
// export const plugins = [
//     require('flowbite/plugin')
// ];