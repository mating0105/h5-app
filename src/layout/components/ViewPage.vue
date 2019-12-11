<template>
    <div id="view-page">
        <NavBar></NavBar>
        <div class="wrapper" ref="wrapper">
            <div class="content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
  import NavBar from './NavBar';
  import BScroll from 'better-scroll'

  export default {
    name: "ViewPage",
    components: {
      NavBar
    },
    mounted () {
      let wrapper = this.$refs['wrapper']
      let scroll = new BScroll(wrapper)
    }
  }
</script>

<style scoped lang="scss">
    #view-page {
        height: 100%;
    }

    .wrapper {
        height: calc(100% - 50px);
        overflow-x: hidden;
        overflow-y: auto;
        >.desc {
            padding: 10px;
            margin: 10px 0;
            line-height: 20px;
            font-size: 14px;
        }
        >.content {
            margin: 10px;
        }
    }

</style>
