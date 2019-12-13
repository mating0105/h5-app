<template>
<!--    <ViewPage>-->
        <van-index-bar>
            <div v-for="(item, index) in brandData" :key="index">
                <van-index-anchor :index="item.name" />
                <div v-for="(it, i) in item.items" :key="i" style="display: flex">
                    <div class="car-img">
                        <img v-lazy="it.logo" >
                    </div>
                    <van-cell  :title="it.name" />
                </div>
            </div>
        </van-index-bar>
<!--    </ViewPage>-->
</template>

<script>
  import ViewPage from '@/layout/components/ViewPage';
  import Vue from 'vue';
  import { IndexBar, IndexAnchor, Cell, Lazyload  } from 'vant';
  import { getBrand } from '@/api/car'
  import _ from 'lodash'

  Vue.use(IndexBar).use(IndexAnchor).use(Cell).use(Lazyload);
  export default {
    name: "brand",
    components: {
      ViewPage
    },
    data () {
      return {
        brandData: []
      }
    },
    methods: {
      selectItem (item) {
        this.$router.push({name: 'carSeries', query: {brandId: item.id}})
      },
      async get () {
        try {
          let {data} = await getBrand()
          this.init(data)
        } catch (e) {
          console.log(e)
        }
      },
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
        console.log(this.brandData)
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
</style>
