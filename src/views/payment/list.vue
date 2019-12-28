<template>
  <ViewPage
    :goPage="rightFn"
    iconClass="filter-o"
    :rightMenuList="cuCreditStatus"
    :backFn="closeNativeWebView"
  >
    <template v-slot:head>
      <van-search v-model="params.searchKey" placeholder="请输入客户名称" show-action @search="onSearch" />
    </template>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" >
      <van-list
        style="min-height: 80vh"
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
            <van-row @click="showDetail(item)">
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
    </van-pull-refresh>
  </ViewPage>
</template>

<script>
import Vue from "vue";
import ViewPage from "@/layout/components/ViewPage";
import Card from "@/components/card/index";
import { paymentList } from "@/api/payment";
import { mapState } from "vuex";
// 其他组件
import {
  Row,
  Col,
  Icon,
  Cell,
  Button,
  List,
  Search,
  PullRefresh,
  Toast
} from "vant";
const Components = [
  Row,
  Col,
  Icon,
  Cell,
  Button,
  List,
  Search,
  PullRefresh,
  Toast
];

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
      },
      isLoading: false
    };
  },
  computed: {
    ...mapState({
      wordbook: state => state.user.wordbook
    }),
    cuCreditStatus() {
      return (
        [{ label: "全部", value: "" }, ...this.wordbook.apply_status] || []
      );
    }
  },
  methods: {
    onSearch() {
      this.list = [];
      this.finished = false;
      this.params.pageIndex = 1;
      this.onLoad();
    },
    onLoad() {
      this.loading = !this.isLoading;
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
            this.isLoading = false;
          }, 500);
        } else {
          this.$notify({ type: "danger", message: msg });
          this.loading = false;
        }
      });
    },
    // 发起走款
    applyPay(rows) {
      this.$router.push({
        path: "/applyPayment",
        query: {
          info: JSON.stringify(rows),
          dealState: "1"
        }
      });
    },
    //查看详情
    showDetail(rows) {
      this.$router.push({
        path: "/paymentSure",
        query: {
          info: JSON.stringify(rows),
          dealState: "3"
        }
      });
    },
    rightFn(item) {
      this.list = [];
      this.params.pageIndex = 1;
      this.params.status = item.value;
      this.onLoad();
    },
    //下拉刷新
    onRefresh() {
      this.list = [];
      this.params.pageIndex = 1;
      if (this.finished) {
        this.finished = false;
      } else {
        this.onLoad();
      }
      setTimeout(() => {
        Toast.success("刷新成功");
      }, 500);
    }
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
