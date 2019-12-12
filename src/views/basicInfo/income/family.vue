<template>
  <ViewPage>
    <Card>
      <template v-slot:header>
        <section class="xh-plus">
          <van-cell title="家庭收入">
            <van-icon
              slot="right-icon"
              name="plus"
              style="line-height: inherit;"
            />
          </van-cell>
        </section>
      </template>
      <van-row class="xh-row">
        <van-col span="24" class="xh-row-col xh-top-10" v-for="(i,index) in homelist" :key="index" @click.native="pushUrl(i)">
          <van-col span="24">
            <van-col span="12">
              <span class="xh-main xh-title">收入人：</span>
              <span class="xh-black">{{ i.incomePeopleDesc}}</span>
            </van-col>
            <van-col span="12" class="xh-text-right">
              <span class="xh-main">{{ i.occupationalStatusDesc }}</span>
            </van-col>
          </van-col>
          <van-col span="24" class="xh-top-10">
            <span class="xh-main xh-title">单位名称：</span>
            <span class="xh-black">{{ i.companyName }}</span>
          </van-col>
        </van-col>
      </van-row>
    </Card>
  </ViewPage>
</template>

<script>
import Vue from "vue";
// 自定义组件
import Card from "@/components/card/index";
import ViewPage from "@/layout/components/ViewPage";
// 其他组件
import {
  Row,
  Col,
  Icon,
  Cell
} from "vant";
const Components = [
  Row,
  Col,
  Icon,
  Cell
];

Components.forEach(item => {
  Vue.use(item);
});
export default {
  components: {
    Card,
    ViewPage
  },
  data() {
    return {
      homelist: [
        { incomePeopleDesc:'hhh', occupationalStatusDesc: '67868', companyName: '7568768768' },
        // { incomePeopleDesc:'hhh', occupationalStatusDesc: '67868', companyName: '7568768768' }
      ],
    }
  },
  methods: {
    loadData(params) {
      let dataList = {
        projectId: params.projectId,
        customerId: params.customerId
      };
      requestUrl.getList('/carloan/projProjectInfo/findIncome', dataList).then( (res) => {
        if(res.data.code == 'SYS.200'){
          this.homelist = res.data.data.list;
        } else {
          this.$toast({
            position: 'top',
            message: '数据获取失败',
          });
        }
      }).catch(function (error) {
        console.log(error);
      });
    },
    pushUrl(i){
      console.log(i.id)
      urls = 'zhgjApp/page/projectDeclaration/infoIncome.html?id='+ i.id;
      // location.href = urls;
      bridge.loadurlwithmobile({"url":urls})
    }
  },
  mounted() {
    // var params = commonFun.urlParam(location.search);
    // token = params.token;
    // this.loadData(params);
  },
}
</script>

<style lang="scss">
.xh-row {
  .xh-title {
    font-size: 1.2rem;
    font-weight: 700;
  }
  .xh-main {
    color: rgb(196, 37, 42);
  }
}
.xh-text-right {
  text-align: right;
}
</style>
