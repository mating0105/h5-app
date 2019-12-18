<template>
    <div id="nav">
        <van-nav-bar
                :title="title || $route.meta.title || ''"
                left-text="返回"
                left-arrow
                @click-left="backFn ? backFn() : onClickLeft()"
        >
<<<<<<< HEAD
            <van-icon v-if="rightFn" name="ellipsis" slot="right" @click.stop="rightFn" size="24"/>
=======
            <svg-icon v-if="rightFn" style="font-size: 1.8rem" @click="rightFn" icon-class="filter" slot="right"/>
>>>>>>> a2d3aebe70cdada75cb7e204db8bd276074d13cb
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
