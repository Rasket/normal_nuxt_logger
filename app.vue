<template>
  <div>
    <ButtonLog>

    </ButtonLog>
  </div>
</template>

<script>
// log with old style component
import ButtonLog from '@/components/ButtonLog'

export default {
  
  created() {
    this.$log.configure({ level: 'error' });
    // log from created
    this.$log.info('Компонент создан');
  },

  mounted() {
    // log from mounted
    this.$log.debug('Компонент смонтирован');
  },
  
}
</script>
