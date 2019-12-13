<template>
    <div id="nav">
        <van-nav-bar
                :title="title || $route.meta.title || ''"
                left-text="返回"
                left-arrow
                @click-left="backFn ? backFn() : onClickLeft()"
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
      }
    },
    props: {
      backFn: Function,
      title: ''
    }
  }
</script>

<style scoped>
    #nav {
        height: 50px;
    }
</style>
