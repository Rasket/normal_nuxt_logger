import { getCurrentInstance, computed, onBeforeMount } from 'vue';
import { useComponentLogger } from '~/plugins/logger';

/**
 * Композабл для работы с логгером внутри компонентов
 * 
 * @param {string} [customName] - Кастомное имя компонента для логгера
 * @returns {Object} logger - Инстанс логгера для текущего компонента
 */
export function useLogger(customName) {
  // Получаем экземпляр компонента
  const instance = getCurrentInstance();
  
  // Определяем имя компонента
  const componentName = computed(() => {
    if (customName) return customName;
    
    if (instance) {
      // Получаем имя из компонента
      const { type } = instance?.vnode || {};
      
      // Приоритет - явное имя компонента
      if (type?.name) return type.name;
      
      // Если есть __file - получаем имя из файла
      if (type?.__file) {
        const parts = type.__file.split('/');
        const fileName = parts[parts.length - 1] || '';
        return fileName.replace(/\.(vue|js|ts)$/, '');
      }
    }
    
    return 'Component';
  });
  
  // Создаем логгер для компонента
  const logger = useComponentLogger(componentName.value);
  
  // Выводим дебаг-сообщение при монтировании (можно убрать)
  onBeforeMount(() => {
    logger.debug(`Component initialized: ${componentName.value}`);
  });
  
  return logger;
}
