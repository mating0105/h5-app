<template>
    <div>
        <van-nav-bar
                :title="$route.meta.title || ''"
                left-text="返回"
                right-text="按钮"
                left-arrow
                @click-left="onClickLeft"
                @click-right="onClickRight"
        />
    </div>
</template>

<script>
  import Vue from 'vue'
  import { NavBar } from 'vant';

  Vue.use(NavBar)
  export default {
    name: "NavBar",
    methods: {
      onClickLeft () {
        this.$router.back(-1)
      },
      onClickRight () {

      }
    }
  }
</script>

<style scoped>

</style>
