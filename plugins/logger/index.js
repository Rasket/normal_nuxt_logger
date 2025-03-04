import config from './config';
import transports from './transports';
import formatters from './formatters';

// Класс логгера
class Logger {
  constructor(componentInfo = {}) {
    this.fileName = componentInfo.fileName || 'Unknown';
    this.sourceFile = componentInfo.sourceFile || 'Unknown';
    this.componentName = componentInfo.componentName || formatters.getComponentName(this.fileName);
    
    // Создаем методы логирования для каждого уровня
    Object.keys(config.levels).forEach(level => {
      this[level] = (message, ...args) => {
        return this.log(level, message, ...args);
      };
    });
  }
  
  getCallerInfo() {
    // Создаем объект Error для получения стека вызовов
    const err = new Error();
    const stack = err.stack || '';

    // Разбиваем стек на строки
    const stackLines = stack.split('\n');
    
    // Пропускаем первые две строки (Error и вызов этого метода)
    // Третья строка - это вызов метода log
    // Четвертая строка - это место, откуда был вызван лог
    const callerLine = stackLines[3] || '';
    
    // Парсим строку стека для получения информации
    // Формат: "    at FunctionName (file:line:column)"
    // или:   "    at file:line:column"
    const match = callerLine.match(/(.*)@/);
    
    if (!match) {
      return { functionName: '?'};
    }
    
    let functionName;
    
    if (match) {
      // Формат "at FunctionName (file:line:column)"
      functionName = match[1];
    } else {
      // Формат "at file:line:column"
      functionName = '(anonymous)';
    }
    
    
    return {
      functionName
    };
  }

  // Проверяет, нужно ли логировать сообщение данного уровня
  shouldLog(level) {
    // Получаем уровень для компонента или используем глобальный
    const componentLevel = config.components[this.componentName] || config.globalLevel;
    return config.levels[level] <= config.levels[componentLevel];
  }
  
  // Основной метод логирования
  log(level, message, ...args) {
    if (!this.shouldLog(level)) return;
    
    const timestamp = formatters.timestamp();


    const stackInfo = this.getCallerInfo();
    
    // Опции для транспортов
    const options = {
      componentName: this.componentName,
      sourceFile: this.sourceFile,
      fileName: this.fileName,
      timestamp,
      color: config.colors[level],
      lineNumber: stackInfo.lineNumber,
      functionName: stackInfo.functionName,
      fullStack: stackInfo.fullStack,
      args: args // Теперь передаем аргументы
    };
    
    // Определяем, какие транспорты использовать
    const activeTransports = process.env.NODE_ENV === 'production' 
      ? config.productionTransports
      : config.transports;
      
    // Отправляем лог во все активные транспорты
    activeTransports.forEach(transportName => {
      if (transports[transportName]) {
        transports[transportName](level, message, options);
      }
    });
    
    return message;
  }
  
  // Возможность кастомизации логгера для компонента
  configure(options = {}) {
    if (options.level) {
      config.components[this.componentName] = options.level;
    }
    return this;
  }
}

// Утилиты для управления логгером
const loggerUtils = {
  // Включить логирование для компонента
  enableLogging: (componentName, level = 'debug') => {
    config.components[componentName] = level;
  },
  
  // Выключить логирование для компонента
  disableLogging: (componentName) => {
    config.components[componentName] = 'error';
  },
  
  // Установить глобальный уровень
  setGlobalLevel: (level) => {
    if (config.levels[level] !== undefined) {
      config.globalLevel = level;
    }
  },
  
  // Получить текущую конфигурацию
  getConfig: () => ({ ...config }),
  
  // Активировать/деактивировать транспорты
  setTransports: (transportsList) => {
    config.transports = transportsList.filter(t => transports[t]);
  },
  
  // Экспортировать логи
  exportLogs: () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const logs = localStorage.getItem('appLogs') || '[]';
        const blob = new Blob([logs], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `logs-${formatters.timestamp()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
      } catch (e) {
        console.error('Failed to export logs', e);
      }
    }
  },
  
  // Очистить сохраненные логи
  clearLogs: () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('appLogs');
    }
  }
};

// Функция для получения информации о компоненте
function getComponentInfo() {
  // Мы получим имя компонента из контекста позже
  return {
    fileName: 'Unknown.vue', 
    sourceFile: 'Unknown.vue',
    componentName: 'Unknown'
  };
}

// Глобальный логгер для сервисов
const globalLogger = new Logger({
  fileName: 'app.vue',
  sourceFile: 'app.vue',
  componentName: 'App'
});

// Композабл для создания логгера в любом компоненте
export function useComponentLogger(componentName) {
  // Если название компонента передано, используем его
  const finalComponentName = componentName || 'Component';
  
  // Создаем логгер для этого компонента
  return new Logger({
    fileName: `${finalComponentName}.vue`,
    sourceFile: `${finalComponentName}.vue`,
    componentName: finalComponentName
  });
}

// Создание Nuxt плагина
export default defineNuxtPlugin((nuxtApp) => {
  // Добавляем логгер в глобальный контекст для доступа отовсюду
  nuxtApp.provide('log', globalLogger);
  nuxtApp.provide('logger', globalLogger);
  nuxtApp.provide('loggerUtils', loggerUtils);
  
  // Функция для создания логгера для именованного компонента/модуля
  nuxtApp.provide('createLogger', (name) => {
    return new Logger({
      fileName: `${name}.vue`,
      sourceFile: `${name}.vue`,
      componentName: name
    });
  });
  
  // Для удобства создаем глобальные доступы
  if (typeof window !== 'undefined') {
    window.$log = globalLogger;
    window.$loggerUtils = loggerUtils;
  }
  
  // Для Node.js
  if (process.server) {
    globalThis.$log = globalLogger;
    globalThis.$loggerUtils = loggerUtils;
  }
  
  return {
    provide: {
      // Экспортируем вспомогательную функцию для использования в компонентах
      useComponentLogger
    }
  };
});
