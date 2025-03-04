export default {
    // Уровни логирования
    levels: {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
      trace: 4
    },
    
    // Цвета для логов
    colors: {
      error: 'crimson',
      warn: 'orange',
      info: 'dodgerblue',
      debug: 'mediumseagreen',
      trace: 'gray'
    },
    
    // Глобальный уровень логирования
    globalLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
    
    // Настройки компонентов (файлов)
    components: {},
    
    // Активные транспорты
    transports: ['console', 'nuxtConsole'],
    
    // В production можно отключить некоторые транспорты
    productionTransports: ['nuxtConsole']
};
  