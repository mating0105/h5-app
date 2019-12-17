<template>
    <div id="nav">
        <van-nav-bar
                :title="title || $route.meta.title || ''"
                left-text="返回"
                left-arrow
                @click-left="backFn ? backFn() : onClickLeft()"
        >
            <van-icon v-if="rightFn" name="ellipsis" slot="right" @click="rightFn" size="24"/>
        </van-nav-bar>
    </div>
</template>

<script>
  import Vue from 'vue'
  import { NavBar,Icon  } from 'vant';

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
      rightFn:Function
    }
  }
</script>

<style scoped>
    #nav {
        height: 50px;
    }
</style>
