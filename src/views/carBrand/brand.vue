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
            <van-index-bar :sticky-offset-top="40" style="margin-top: 4.5rem;">
                <div v-for="(item, index) in brandData" :key="index">
                    <van-index-anchor :index="item.name"/>
                    <div v-for="(it, i) in item.items" :key="i" style="display: flex" @click="selectItem(it)">
                        <div class="car-img">
                            <img v-lazy="it.logo">
                        </div>
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
  import { IndexBar, IndexAnchor, Cell, Lazyload, Search } from 'vant';
  import { getBrand } from '@/api/car'
  import _ from 'lodash'

  Vue.use(IndexBar).use(IndexAnchor).use(Cell).use(Lazyload).use(Search);
  export default {
    name: "brand",
    components: {
      ViewPage
    },
    data () {
      return {
        brandData: [],
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
      async get () {
        try {
          const params = {
            brandName: this.searchValue
          }
          let {data} = await getBrand(params)
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
        this.brandData = _.chain(data).groupBy(item => {
          return item.alphabetCode
        }).map((values, key) => {
          const valueBean = values.map(item => {
            return {
              name: item.brandName,
              value: item.id,
              ...item
            }
          })
          return {name: key, items: valueBean}
        }).value()
      },
      /**
       * 搜索过滤
       */
      searchFn () {
        const list = this.dataList.filter(item => {
          return item.brandName.includes(this.searchValue)
        })
        this.init(list)
      }
    },
    mounted () {
      this.get()
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
