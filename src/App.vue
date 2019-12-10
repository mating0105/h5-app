<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
    #app {
        min-width: 100vw;
        color: #323233;
        font-family: 'PingFang SC', Helvetica, 'STHeiti STXihei', 'Microsoft YaHei', Tohoma, Arial, sans-serif;
        line-height: 1;
        background-color: #f7f8fa;
        -webkit-font-smoothing: antialiased;
    }
</style>
