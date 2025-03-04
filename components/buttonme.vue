<template>
    <div>
      <h1>{{ title }}</h1>
      <button @click="logSomething">Log Something</button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useLogger } from '~/composables/useLogger';
  
  // Имя компонента определится автоматически из имени файла
  const log = useLogger();
  
  // Или можно явно указать имя
  // const log = useLogger('MyCustomComponentName');
  
  const title = ref('My Component');
  
  // Пример использования логгера
  log.info('Component initialized with title:', title.value);
  
  function innerLog() {
    log.debug('Button clicked');

  }

  function logSomething() {
    innerLog()
    log.info('Processing data...', { time: Date.now() });
  }
  
  // Настройка уровня логирования для этого компонента
  log.configure({ level: 'debug' });
  </script>
  