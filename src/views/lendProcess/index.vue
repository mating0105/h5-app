<template>
    <ViewPage>
        <van-tabs v-model="active">
            <van-tab title="做单基本信息" class="tabBox">
                <OrdinaryCard :title='title'>
                    <van-row>
                        <van-col
                            span="12"
                            class="xh-top-10 xh-ellipsis"
                        >业务员：</van-col>
                        <van-col
                            span="12"
                            class="xh-top-10 xh-ellipsis"
                        >张三</van-col>
                    </van-row>
                    <van-row>
                        <van-col
                            span="12"
                            class="xh-top-10 xh-text-right"
                        >报单时间：</van-col>
                        <van-col
                            span="12"
                            class="xh-top-10 xh-text-right"
                        >2019-12-03 10:30:30</van-col>
                    </van-row>
                    <van-row>
                        <van-col
                            span="12"
                            class="xh-top-10 xh-ellipsis"
                        >垫款编号：</van-col>
                        <van-col
                            span="12"
                            class="xh-top-10 xh-ellipsis"
                        >XH20191203001</van-col>
                    </van-row>
                    <van-row>
                        <van-col
                            span="12"
                            class="xh-top-10 xh-ellipsis"
                        >制单人员：</van-col>
                        <van-col
                            span="12"
                            class="xh-top-10 xh-ellipsis"
                        >王丹</van-col>
                    </van-row>
                    <van-row>
                        <van-col
                            span="12"
                            class="xh-top-10 xh-ellipsis"
                        >走款模式：</van-col>
                        <van-col
                            span="12"
                            class="xh-top-10 xh-ellipsis"
                        >快垫</van-col>
                    </van-row>
                </OrdinaryCard>
            </van-tab>
            <van-tab title="征信信息">
                
            </van-tab>
            <van-tab title="审批记录">
                
            </van-tab>
        </van-tabs>
    </ViewPage>
</template>

<script>
  import Vue from 'vue';
  import { mapGetters } from 'vuex'
  import ViewPage from '@/layout/components/ViewPage';
  import OrdinaryCard from '@/layout/components/OrdinaryCard';
  import { Tab, Tabs, Row, Col  } from 'vant';

  const Components = [Tab, Tabs, Row, Col ]

  Components.forEach(item => {
    Vue.use(item)
  })

  export default {
    name: 'lendProcess',
    components: {
      ViewPage,
      OrdinaryCard
    },
    computed: {
      ...mapGetters([
        'name'
      ])
    },
    data() {
        return {
            active: 0,
            title:'项目信息'
        };
    },
    methods: {
      
    },
    mounted () {
    }
  }
</script>

<style scoped>
.tabBox{
    padding: 10px 10px;
}
   
</style>
