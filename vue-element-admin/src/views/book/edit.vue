<template>
  <div>
    <Detail :is-edit="true" />
  </div>
</template>

<script>
import Detail from './components/Detail'
export default {
  name: 'BookEdit',
  components: {
    Detail
  }
}
</script>

<style lang="scss">
</style>
