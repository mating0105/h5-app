<template>
    <ViewPage :scroll="false" :margin="false">
        <div style="overflow: hidden">
            <van-search
                    class="xh-search-input"
                    v-model="searchValue"
                    placeholder="请输入搜索关键词"
                    show-action
                    @input="searchFn"
            />
            <van-index-bar :sticky-offset-top="40" :index-list="[]" style="margin-top: 4.5rem;">
                <div v-for="(item, index) in modelList" :key="index">
                    <van-index-anchor :index="item.name"/>
                    <div v-for="(it, i) in item.items" :key="i" style="display: flex" @click="selectItem(it)">
                        <van-cell :title="it.name"/>
                    </div>
                </div>
            </van-index-bar>
        </div>
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
    data () {
      return {
        modelList: [],
        dataList: [],
        searchValue: ''
      }
    },
    methods: {
      selectItem (item) {
        this.$router.push({name: 'carSeries', query: {brandId: item.id}})
      },
      /**
       * 获取车品牌列表
       */
      async get (carSeriesId) {
        try {
          const params = {
            serialId: carSeriesId
          }
          const {data} = await getCardModel(params);
          this.dataList = data
          this.init(data)
        } catch (e) {
          console.log(e)
        }
      },
      /**
       * 初始化数据
       */
      init (data) {
        const arr = data.map(item => {
          return {
            ...item,
            name: item.fullname
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
    mounted () {
      this.get(this.$route.query.carSeriesId)
    }
  }
</script>

<style scoped lang="scss">
    .car-img {
        background: white;
        width: 50px;

        img {
            width: 100%;
        }
    }

    .xh-search-input {
        position: fixed;
        width: 100%;
        z-index: 2;
        top: 3.8rem;
    }
</style>
