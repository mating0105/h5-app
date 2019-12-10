<template>
    <div id="view-page">
        <NavBar></NavBar>
        <div class="wrapper">
            <slot></slot>
        </div>
    </div>
</template>

<script>
  import NavBar from './NavBar';

  export default {
    name: "ViewPage",
    components: {
      NavBar
    },
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
        .desc {
            padding: 10px;
            margin: 10px 0;
            line-height: 20px;
            font-size: 14px;
        }
        .content {
            margin: 10px
        }
    }

</style>
