<template>
  <div>
    <h1>Мой компонент</h1>
    <button @click="handleClick">Нажми меня</button>
    <buttonme>

    </buttonme>
  </div>
</template>

<script setup>
import buttonme from '@/components/buttonme'

</script>

<script>
export default {
  name: 'MyComponent', // Имя компонента для логгера
  
  mounted() {
    this.$log.configure({ level: 'debug' });
    // Логгер уже доступен через this.$logger или this.$log
    this.$log.info('Компонент смонтирован');
    this.$logger.debug('Отладочная информация',  { a: 1, b: 2 });
  },
  
  methods: {
    handleClick() {
      this.$log.info('Кнопка была нажата');
      
      // Можно настроить уровень логирования для этого компонента
      // this.$log.configure({ level: 'trace' });
      
      this.$log.trace('Это теперь будет отображаться');
    }
  }
}
</script>
