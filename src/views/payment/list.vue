<template>
  <ViewPage>
    <template v-slot:head>
      <van-search v-model="params.searchKey" placeholder="请输入客户名称" show-action @search="onSearch" />
    </template>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="onLoad"
    >
      <div v-for="(item,index) in list" :key="index" :title="item" class="van-clearfix">
        <Card class="xh-top-10" :bodyPadding="true">
          <template v-slot:header>
            <section class="xh-plus">
              <van-cell :title="item.projectNo" :value="item.processStateDesc" icon="notes-o"></van-cell>
            </section>
          </template>
          <van-row>
            <van-col span="24">客户名称：{{item.customerName}}</van-col>
            <van-col span="24" class="xh-top-10">身份证：{{item.certiNum}}</van-col>
            <van-col span="24" class="xh-top-10">手机号码：{{item.telephone}}</van-col>
          </van-row>
          <template v-slot:footer v-if="item.processStateDesc == '未提交'">
            <div style="text-align:right;">
              <van-button
                plain
                type="danger"
                class="xh-radius"
                style="border-radius: 6px;"
                @click="applyPay(item)"
              >申请走款</van-button>
            </div>
          </template>
        </Card>
      </div>
    </van-list>
  </ViewPage>
</template>

<script>
import Vue from "vue";
import ViewPage from "@/layout/components/ViewPage";
import Card from "@/components/card/index";
import { paymentList } from "@/api/payment";
// 其他组件
import { Row, Col, Icon, Cell, Button, List,Search } from "vant";
const Components = [Row, Col, Icon, Cell, Button, List,Search];

Components.forEach(item => {
  Vue.use(item);
});
export default {
  components: {
    ViewPage,
    Card
  },
  data() {
    return {
      list: [],
      loading: false,
      error: false,
      finished: false,
      params: {
        pageIndex: 1,
        pageSize: 10
      }
    };
  },
  methods: {
    onSearch() {
      this.list = [];
      this.finished = false;
      this.params.pageIndex = 1;
      this.onLoad();
    },
    onLoad() {
      this.loading = true;
      paymentList(this.params).then(res => {
        if (res.code == 200) {
          setTimeout(() => {
            res.data.result.forEach(t => {
              this.list.push(t);
            });
            // 加载状态结束
            this.loading = false;
            this.params.pageIndex++;
            // 数据全部加载完成
            if (this.list.length == res.data.totalCount) {
              this.finished = true;
            } else {
              this.finished = false;
            }
          }, 500);
        } else {
          this.$notify({ type: "danger", message: msg });
          this.loading = false;
        }
      });
    },
    // 发起走款
    applyPay(rows) {
      // console.log({projectId:rows.projectId,customerNum:rows.customerNum,customerId:rows.customerId})
      this.$router.push({
        path: "/applyPayment",
        query: {
          projectId: rows.projectId,
          customerNum: rows.customerNum,
          customerId: rows.customerId
        }
      });
    },
    loadData() {}
  },
  mounted() {
    this.onLoad();
  }
};
</script>

<style lang="scss">
.xh-plus {
  span {
    color: rgb(196, 37, 42);
  }
}
.xh-fixed-submit {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 99;
  .van-button {
    border-radius: 0;
  }
}
</style>
