<template>
    <ViewPage>
        <van-tabs v-model="active">
            <van-tab title="做单基本信息" class="tabBox">
                <Card>
                    <template v-slot:header>
                        项目信息
                    </template>
                    <div>
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
                                class="xh-top-10 xh-ellipsis"
                            >业务员：</van-col>
                            <van-col
                                span="12"
                                class="xh-top-10 xh-ellipsis"
                            >张三</van-col>
                        </van-row>
                    </div>
                </Card>
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
  import Card from '@/components/card/index'
  import { Tab, Tabs, Row, Col  } from 'vant';

  const Components = [Tab, Tabs, Row, Col ]

  Components.forEach(item => {
    Vue.use(item)
  })

  export default {
    name: 'lendProcess',
    components: {
      ViewPage,
      Card
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
