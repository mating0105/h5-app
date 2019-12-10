<template>
    <ViewPage>
        <van-button type="default">默认按钮</van-button>
        <van-button type="primary">主要按钮</van-button>
        <van-button type="info">信息按钮</van-button>
        <van-button type="warning">警告按钮</van-button>
        <van-button type="danger">危险按钮</van-button>
        <van-checkbox v-model="check">复选框</van-checkbox>
        <van-cell-group>
            <van-field v-model="value" placeholder="请输入用户名"/>
        </van-cell-group>
        <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="getList"
        >
            <van-cell
                    v-for="item in dataList"
                    :key="item.id"
                    :title="item.display_time"
            />
        </van-list>
    </ViewPage>

</template>

<script>
  import { mapGetters } from 'vuex'
  import ViewPage from '@/layout/components/ViewPage';
  import Vue from 'vue'
  import { Button, Checkbox, Field, Cell, CellGroup, List } from 'vant';
  import { getList } from '@/api/table'

  const Components = [Button, Checkbox, Field, Cell, CellGroup, List]

  Components.forEach(item => {
    Vue.use(item)
  })

  export default {
    name: 'Dashboard',
    components: {
      ViewPage
      // van-button
      // NavBar
    },
    computed: {
      ...mapGetters([
        'name'
      ])
    },
    data () {
      return {
        check: true,
        value: '',
        dataList: [],
        loading: false,
        finished: false
      }
    },
    methods: {
      async getList () {
        const response = await getList()
        this.dataList = response.data.items
        this.finished = true
      }
    },
    mounted () {
      // this.getList()
    }
  }
</script>

<style lang="scss" scoped>
    /*.dashboard {*/
    /*    &-container {*/
    /*        margin: 30px;*/
    /*    }*/

    /*    &-text {*/
    /*        font-size: 30px;*/
    /*        line-height: 46px;*/
    /*    }*/
    /*}*/
</style>
