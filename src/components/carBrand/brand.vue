<template>
    <ViewPage class="xh-brand" :loading="loading" title="选择车牌品牌" :scroll="false" :backFn="backFn" :margin="false" v-if="visible">
        <template v-slot:head>
            <van-search
                    v-model="searchValue"
                    placeholder="请输入搜索关键词"
                    show-action
                    @input="searchFn"
            />
        </template>
        <van-index-bar style="margin-top: 10px">
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
        <transition name="page-move">
            <carSeries :visible.sync="showCarSeries" v-if="showCarSeries" :brandId="brandId" @change="changeCarSeries"></carSeries>
        </transition>
        <transition name="page-move">
            <carModel :visible.sync="showCarModel" v-if="showCarModel" :carSeriesId="carSeriesId" @change="changeCarModel"></carModel>
        </transition>
    </ViewPage>
</template>

<script>
  import ViewPage from '@/layout/components/ViewPage';
  import carSeries from '@/components/carBrand/carSeries'
  import carModel from '@/components/carBrand/carModel'
  import Vue from 'vue';
  import { IndexBar, IndexAnchor, Cell, Lazyload, Search } from 'vant';
  import { getBrand } from '@/api/car'
  import _ from 'lodash'

  Vue.use(IndexBar).use(IndexAnchor).use(Cell).use(Lazyload).use(Search);
  export default {
    name: "brand",
    components: {
      ViewPage,
      carSeries,
      carModel
    },
    props: {
      visible: Boolean
    },
    data () {
      return {
        brandData: [],
        dataList: [],
        searchValue: '',
        showCarSeries: false,
        showCarModel: false,
        brandId: '',
        carSeriesId: '',
        carForm: {},
        loading: false
      }
    },
    methods: {
      backFn () {
        this.$emit('update:visible', false)
      },
      selectItem (item) {
        this.brandId = item.id
        this.showCarSeries = true
        this.carForm.brand = item
      },
      changeCarSeries (item) {
        this.carForm.series = item
        this.carSeriesId = item.id
        this.showCarModel = true
      },
      /**
       *  change事件
       */
      changeCarModel (item) {
        this.carForm.model = item
        this.$emit('update:visible', false)
        this.$emit('change', this.carForm)
        this.initData()
      },
      initData () {
        this.brandData = []
        this.dataList = []
        this.searchValue = ''
        this.showCarSeries = false
        this.showCarModel = false
        this.brandId = ''
        this.carSeriesId = ''
        this.carForm = {}
      },
      /**
       * 获取车品牌列表
       */
      async get () {
        try {
          this.loading = true
          const params = {
            brandName: this.searchValue
          }
          let {data} = await getBrand(params)
          this.dataList = data
          this.init(data)
          this.loading = false
        } catch (e) {
          this.loading = false
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
    watch: {
      visible (value) {
        if (value) {
          this.get()
        }
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

    .xh-brand {
        position: fixed;
        z-index: 10;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: #f7f8fa;
    }
</style>
