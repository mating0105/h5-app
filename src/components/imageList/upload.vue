<template>
    <ViewPage class="xh-page" :backFn="backFn" title="全部照片" :loading="loading">
        <template v-if="isGroup">
            <Card v-for="(arr, key) in list" :key="key">
                <template v-slot:header>
                    {{key}}
                </template>
                <div style="padding: 10px;">
                    <imageItem :data="item" :loading.sync="loading" :key="index" v-for="(item, index) in arr"></imageItem>
                </div>
            </Card>
        </template>
        <Card v-else>
            <template v-slot:header>
                照片
            </template>
            <div style="padding: 10px;">
                <imageItem :data="item" :loading.sync="loading" :key="index" v-for="(item, index) in dataList"></imageItem>
            </div>
        </Card>
    </ViewPage>
</template>

<script>
  import ViewPage from '@/layout/components/ViewPage';
  import Card from '@/components/card'
  import imageItem from './item'
  import _ from 'lodash'

  export default {
    name: "imageUpload",
    components: {
      ViewPage,
      Card,
      imageItem
    },
    data() {
      return {
        loading: false,
        list: []
      }
    },
    props: {
      visible: {},
      dataList: Array,
      isGroup: Boolean,
    },
    methods: {
      backFn () {
        this.$emit('update:visible', false)
      },
    },
    mounted () {
      if(this.isGroup) {
        this.list = _.groupBy(this.dataList, item => {
          return item.title
        })
      }
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
