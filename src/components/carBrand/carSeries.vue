<template>
    <ViewPage class="xh-car-series" :loading="loading" title="选择车系" :scroll="false" :backFn="backFn" :margin="false" v-if="visible">
        <template v-slot:head>
            <van-search
                    v-model="searchValue"
                    placeholder="请输入搜索关键词"
                    show-action
                    @input="searchFn"
            />
        </template>
        <van-index-bar style="margin-top: 10px" :index-list="[]">
            <div v-for="(item, index) in carSeries" :key="index">
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
  import { getCarSeries } from '@/api/car'
  import _ from 'lodash'

  Vue.use(IndexBar).use(IndexAnchor).use(Cell).use(Search);
  export default {
    name: "carSeries",
    components: {
      ViewPage
    },
    props: {
      visible: false,
      brandId: {}
    },
    data () {
      return {
        carSeries: [],
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
      async get (brandId) {
        try {
          this.loading = true
          const params = {
            masterid: brandId,
          }
          const {data} = await getCarSeries(params);
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
        this.carSeries = _.chain(data).groupBy(item => item.brandName).map((values, key) => {
          const valueBean = values.map(item => {
            return {
              name: item.seriesName,
              value: item.id,
              ...item
            }
          })
          return {
            name: key,
            items: valueBean
          }
        }).value()
      },
      /**
       * 搜索过滤
       */
      searchFn () {
        const list = this.dataList.filter(item => {
          return item.seriesName.includes(this.searchValue)
        })
        this.init(list)
      }
    },
    watch: {
      visible (value) {
        if (value) {
          this.get(this.brandId)
        }
      }
    },
    mounted () {
      this.get(this.brandId)
    }
  }
</script>

<style scoped lang="scss">

    .xh-car-series {
        position: fixed;
        z-index: 11;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: #f7f8fa;
    }

</style>
