<template>
    <ViewPage class="xh-page" :backFn="backFn" title="全部照片">
        <Card>
            <template v-slot:header>
                照片
            </template>
            <imageItem :data="item" :key="index" v-for="(item, index) in dataList"></imageItem>
        </Card>
    </ViewPage>
</template>

<script>
  import ViewPage from '@/layout/components/ViewPage';
  import Card from '@/components/card'
  import imageItem from './item'

  export default {
    name: "imageUpload",
    components: {
      ViewPage,
      Card,
      imageItem
    },
    props: {
      visible: {},
      dataList: Array
    },
    methods: {
      backFn () {
        this.$emit('update:visible', false)
      },
    }
  }
</script>

<style scoped>

    .xh-page {
        position: fixed;
        z-index: 10;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: #f7f8fa;
    }

</style>
