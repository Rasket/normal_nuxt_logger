export default {
    levels: {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
      trace: 4
    },
    
    colors: {
      error: 'crimson',
      warn: 'orange',
      info: 'dodgerblue',
      debug: 'mediumseagreen',
      trace: 'gray'
    },
    
    globalLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
    
    components: {},
    
    transports: ['console', 'nuxtConsole'],
    
    productionTransports: ['nuxtConsole']
};
  