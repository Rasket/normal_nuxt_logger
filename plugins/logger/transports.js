// Транспорты для вывода логов


export default {
    // Логирование в консоль браузера с сохранением источника файла для отображения
    console: (level, message, options) => {

      const { 
        componentName, 
        color, 
        sourceFile, 
        fileName, 
        timestamp, 
        args,
        functionName, 
        lineNumber
      } = options;
      if (typeof window === 'undefined') return;
      if (typeof console[level] !== 'function') {
        // Fallback на console.log, если метода нет
        console.log(`[${level.toUpperCase()}] ${componentName}:`, message);
        return;
      }
      



      // Создаем специальный цветной префикс
      const prefix = `%c${timestamp} [${level.toUpperCase()}] ${componentName}`;
      const style = `color: ${color}; font-weight: bold;`;
    
      // Основная группа для каждого лога - так мы можем расширять/сворачивать логи
      console.group(prefix, style);
      
      console.log(`Функция ${functionName}`)

      // Показываем сообщение
      if (typeof message === 'object') {
        console.dir(message);
      } else {
        console.log(message);
      }
      if (args && args.length > 0) {
        args.forEach(arg => console.log(arg));
      }
      
      // Показываем источник (это будет правильно отображаться как ссылка в консоли)
      console.log(`Source: %c${fileName}`, 'font-weight: bold;');
      console.groupEnd();
    },
    
    // Логирование в консоль запуска Nuxt
    nuxtConsole: (level, message, options) => {

        // Только в серверном окружении
        if (import.meta.server && process.stdout && process.stdout.write) {
          const { componentName, timestamp, fileName, args } = options;
              
          // Форматируем сообщение
          let formattedMessage = typeof message === 'object' 
            ? JSON.stringify(message, null, 2) 
            : message;
            
          // Добавляем аргументы
          if (args && args.length > 0) {
            formattedMessage += ' ' + args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg) : arg
            ).join(' ');
          }
          
          // Выводим в серверную консоль
          const output = `${timestamp} [${level.toUpperCase()}] ${componentName} (${fileName}): ${formattedMessage}`;
          process.stdout.write(output + '\n');
        }
    },
    
    // Логирование в localStorage (имитация файла)
    file: (level, message, options) => {
      const { componentName, timestamp, fileName } = options;
      
      if (typeof window !== 'undefined' && window.localStorage) {
        const formattedMessage = typeof message === 'object' ? JSON.stringify(message) : message;
        const logEntry = {
          timestamp,
          level: level.toUpperCase(),
          component: componentName,
          file: fileName,
          message: formattedMessage
        };
        
        try {
          const logs = JSON.parse(localStorage.getItem('appLogs') || '[]');
          logs.push(logEntry);
          
          // Ограничиваем количество логов
          if (logs.length > 1000) {
            logs.splice(0, logs.length - 1000);
          }
          
          localStorage.setItem('appLogs', JSON.stringify(logs));
        } catch (e) {
          console.error('Failed to write logs to localStorage', e);
        }
      }
    }
  };
  