<template>
    <div id="nav">
        <van-nav-bar
                id="xh-nav"
                :title="title || $route.meta.title || ''"
                left-text="返回"
                left-arrow
                @click-left="backFn ? backFn() : onClickLeft()"
        >
            <van-icon v-if="rightMenuList" :name="iconClass" size="24" @click.stop="rightMenuFn" slot="right"/>
            <svg-icon v-else-if="rightFn" style="font-size: 1.8rem" @click.stop="rightFn" icon-class="filter" slot="right"/>
        </van-nav-bar>
        <div v-if="rightMenu" ref="box" class="rightButtonBox" name="rightButtonBox">
            <div class="sanjiao"></div>
            <div v-for="(item,index) in rightMenuList" :key="index">
                <van-button style='text-align:center;width:100%;border:0;' type="default" @click="goPageFn(item)">{{item.title || item.label}}</van-button>
            </div>
        </div>
    </div>
</template>

<script>
  import Vue from 'vue'
  import { NavBar, Icon } from 'vant';
  import { log } from 'util';

  Vue.use(NavBar).use(Icon)
  export default {
    name: "NavBar",
    data () {
      return {
        rightMenu: false,
      }
    },
    methods: {
      onClickLeft () {
        this.$router.back(-1)
      },
      rightMenuFn () {
        this.rightMenu = !this.rightMenu;
      },
      goPageFn (item) {
        if (this.goPage)
          this.goPage(item)
        this.rightMenuFn()
      }
    },
    props: {
      backFn: Function,
      title: '',
      rightFn: Function,
      iconClass: '',
      goPage: Function,
      rightMenuList: {
        type: Array,
        default: () => []
      }
    }
  }
</script>

<style lang="scss" scoped>
    #nav {
        .rightButtonBox {
            position: fixed;
            top: 52px;
            right: 10px;
            min-width: 100px;
            padding: 10px;
            background-color: #fff;
            box-shadow: 0 5px 10px 0 rgba(0, 0, 0, .2);
            z-index: 999;
            border-radius: 10px;

            .van-button--normal {
                padding: 0 8px;
            }
        }

        .sanjiao {
            position: absolute;
            top: -18px;
            right: 12px;
            width: 0;
            height: 0;
            overflow: hidden;
            font-size: 0;
            line-height: 0;
            border-color: transparent;
            border-bottom-color: #fff;
            border-style: solid;
            border-width: 10px;
        }
    }
</style>
