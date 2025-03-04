export default {
  // Форматирование времени
  timestamp: () => {
    const now = new Date();
    return now.toISOString().replace('T', ' ').substr(0, 19);
  },
  
  // Форматирование сообщения
  message: (msg) => {
    return msg;
  },
  
  // Получение имени компонента из пути к файлу
  getComponentName: (filePath = '') => {
    if (!filePath) return 'Unknown';
    
    // Извлекаем имя файла из пути
    const parts = filePath.split('/');
    const fileName = parts[parts.length - 1] || '';
    return fileName.replace(/\.(js|vue|ts)$/, '');
  }
};
