<template>
    <div id="view-page">
        <div>
            <NavBar v-if='!headerShow' :title="title" :backFn="backFn" :rightFn='rightFn' :iconClass='iconClass' :rightMenuList="rightMenuList" :goPage='goPage'></NavBar>
            <slot name="head"></slot>
        </div>
        <div class="wrapper" ref="wrapper" :class="[wrapperClass]">
            <div :class="{'content': margin}">
                <slot></slot>
            </div>
        </div>
<!--        <van-overlay :show="loading">-->
<!--        </van-overlay>-->
    </div>
</template>

<script>
  import NavBar from './NavBar';
  import BScroll from 'better-scroll'
  import { Overlay, Loading, Toast } from 'vant';
  import Vue from 'vue'
import { log } from 'util';

  Vue.use(Overlay).use(Loading);

  export default {
    name: "ViewPage",
    data () {
      return {
        toast: null,
      }
    },
    props: {
      scroll: true,
      margin: true,
      backFn: Function,
      loading: true,
      title: '',
      rightFn:Function,
      goPage:Function,
      iconClass:'',
      rightMenuList:{
        type: Array,
        default: () => []
      },
      headerShow:Boolean,//显示返回头部   false/不传:显示；true：不显示
      wrapperClass:''
    },
    components: {
      NavBar
    },
    watch: {
      loading (value) {
        if (value) {
          this.toast = Toast.loading({
            message: '加载中...',
            forbidClick: true,
            duration: 0,
            loadingType: 'spinner',
            overlay: true
          });
        } else {
          Toast.clear(this.toast);
        }
      }
    },
    mounted () {
      if (this.scroll) {
        let wrapper = this.$refs['wrapper']
        let scroll = new BScroll(wrapper, {
          click: true
        })
      }
    }
  }
</script>

<style scoped lang="scss">
    #view-page {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .wrapper {
        /*height: calc(100% - 50px);*/
        overflow-x: hidden;
        overflow-y: auto;
        position: relative;

        > .desc {
            padding: 10px;
            margin: 10px 0;
            line-height: 20px;
            font-size: 14px;
        }

        > .content {
            margin: 1rem;
        }

        &.margin-top-1 {
            margin-top: 1rem;
        }
    }
    .wrapperClass{
        min-height: calc(100% - 50px);
        >div{
            min-height: 100%;
            height: 100%;
            overflow: auto;
        }
    }

</style>
