/* MarkeWeed · configuración editable */
window.MW = window.MW || {};
MW.config = {
  /* Si algún día se decide mostrar el descuento para clientes de plan mensual,
     poner a true y rellenar DISCOUNT_PERCENT. Por defecto NO se muestra ninguna cifra. */
  SHOW_DISCOUNT_PERCENT: false,
  DISCOUNT_PERCENT: null,

  /* Duración de cada story (ms) */
  STORY_DURATION: 5000,

  /* Planes (sin precios). Usado por el configurador y el modal. */
  PLANS: {
    inicio:    { stories: 22, videos: 4, posts: 6, web: false },
    clubsy:    { stories: 22, videos: 4, posts: 6, web: true },
    weareclub: { stories: 32, videos: 6, posts: 8, web: false }
  },

  /* Verificación de edad: clave de almacenamiento */
  AGE_KEY: "mw-age-ok"
};
