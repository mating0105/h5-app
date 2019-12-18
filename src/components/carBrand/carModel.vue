<template>
    <ViewPage class="xh-car-model" :loading="loading" title="选择车型" :scroll="false" :backFn="backFn" :margin="false" v-if="visible">
        <template v-slot:head>
            <van-search
                    v-model="searchValue"
                    placeholder="请输入搜索关键词"
                    show-action
                    @input="searchFn"
            />
        </template>
        <van-index-bar style="margin-top: 10px" :index-list="[]">
            <div v-for="(item, index) in modelList" :key="index">
                <van-index-anchor :index="item.name"/>
                <div v-for="(it, i) in item.items" :key="i" style="display: flex" @click="selectItem(it)">
                    <van-cell :title="it.name"/>
                </div>
            </div>
        </van-index-bar>
    </ViewPage>
</template>

<script>
  import ViewPage from '@/layout/components/ViewPage';
  import Vue from 'vue';
  import { IndexBar, IndexAnchor, Cell, Search } from 'vant';
  import { getCardModel } from '@/api/car'

  Vue.use(IndexBar).use(IndexAnchor).use(Cell).use(Search);
  export default {
    name: "carModel",
    components: {
      ViewPage
    },
    props: {
      visible: Boolean,
      carSeriesId: {}
    },
    data () {
      return {
        modelList: [],
        dataList: [],
        searchValue: '',
        loading: false
      }
    },
    methods: {
      backFn () {
        this.$emit('update:visible', false)
      },
      selectItem (item) {
        this.$emit('change', item)
      },
      /**
       * 获取车品牌列表
       */
      async get (carSeriesId) {
        try {
          this.loading = true
          const params = {
            serialId: carSeriesId
          }
          const {data} = await getCardModel(params);
          this.dataList = data
          this.init(data)
          this.loading = false
        } catch (e) {
          console.log(e)
          this.loading = false
        }
      },
      /**
       * 初始化数据
       */
      init (data) {
        const arr = data.map(item => {
          return {
            ...item,
            name: item.name
          }
        })
        this.modelList = [{
          name: '所有车型',
          items: arr
        }]
      },
      /**
       * 搜索过滤
       */
      searchFn () {
        const list = this.dataList.filter(item => {
          return item.name.includes(this.searchValue)
        })
        this.init(list)
      }
    },
    watch: {
      visible (value) {
        if (value) {
          this.get(this.carSeriesId)
        }
      }
    },
    mounted () {
      this.get(this.carSeriesId)
    }
  }
</script>

<style scoped lang="scss">

    .xh-car-model {
        position: fixed;
        z-index: 11;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: #f7f8fa;
    }

</style>
