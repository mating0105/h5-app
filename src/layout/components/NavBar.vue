<template>
    <div id="nav">
        <van-nav-bar
                id="xh-nav"
                :title="title || $route.meta.title || ''"
                left-text="返回"
                left-arrow
                @click-left="backFn ? backFn() : onClickLeft()"
        >
            <svg-icon v-if="rightFn" style="font-size: 1.8rem" @click.stop="rightFn" icon-class="filter" slot="right"/>
        </van-nav-bar>
    </div>
</template>

<script>
  import Vue from 'vue'
  import { NavBar, Icon } from 'vant';

  Vue.use(NavBar).use(Icon)
  export default {
    name: "NavBar",
    methods: {
      onClickLeft () {
        this.$router.back(-1)
      }
    },
    props: {
      backFn: Function,
      title: '',
      rightFn: Function
    }
  }
</script>

<style scoped>
    #nav {
        height: 50px;
    }
</style>
