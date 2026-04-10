/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      // Fuentes personalizadas
      fontFamily: {
        // 'sans' es la fuente por defecto de Tailwind, la sobreescribimos
        'sans': ['Montserrat', 'sans-serif'],
        // O podemos crear una clase específica
        'minimal': ['Montserrat', 'sans-serif'],
      },

      // Colores personalizados
      colors: {
        // Definimos nuestros tonos tierra personalizados
        'tierra-claro': '#d1d1c6ff', // Un blanco hueso/piedra
        'tierra-base': '#c4afa1ff',  // Un gris piedra cálido
        'tierra-acento': '#78716c', // Un café arcilla
        'cafe-medio': '#584739ff',
        'cafe': '#4a3728', // Un café oscuro para acentos y botones
        'tierra-grisaceo': '#5c5856ff', 
      }
    },
  },
  plugins: [],
}
