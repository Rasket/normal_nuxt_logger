<template>
    <div>
      <h1>{{ title }}</h1>
      <button @click="logSomething">Log Something</button>
    </div>
  </template>
  
<script setup>
// log with new style component
  import { ref } from 'vue';
  import { useLogger } from '~/composables/useLogger';


  // const log = useLogger('MyCustomComponentName');
  const log = useLogger();
  
  
  const title = ref('Component with log button');
  

  log.info('Component initialized with title: ', title.value);

  function innerLog() {
    log.debug('Button clicked');
  }

  function logSomething() {
    // log from innerLog method
    innerLog()
    // log from logSomething method
    log.info('Processing data...', { time: Date.now() });
  }
  
</script>
  