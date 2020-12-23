<template>
  <div>
    <Detail :is-edit="false" />
  </div>
</template>

<script>
import Detail from './components/Detail'
export default {
  name: 'BookCreate',
  components: {
    Detail
  }
}
</script>

<style lang="scss">
</style>
