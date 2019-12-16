<template>
  <div>
    <ViewPage>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <div v-for="(item,index) in list" :key="index" :title="item">
          <Card class="xh-top-10">
            <template v-slot:header>
              <section class="xh-plus">
                <van-cell title="xh201903884521223" value="审批中" icon="notes-o"></van-cell>
              </section>
            </template>
            <van-row>
              <van-col span="24">客户名称：张三三</van-col>
              <van-col span="24" class="xh-top-10">身份证：101011252252152522</van-col>
              <van-col span="24" class="xh-top-10">手机号码：18985458888</van-col>
            </van-row>
            <template v-slot:footer>
              <div style="text-align:right;">
                <van-button
                  plain
                  type="danger"
                  class="xh-radius"
                  style="border-radius: 6px;"
                  @click="applyPay"
                >申请走款</van-button>
              </div>
            </template>
          </Card>
        </div>
      </van-list>
    </ViewPage>
  </div>
</template>

<script>
import Vue from "vue";
import ViewPage from "@/layout/components/ViewPage";
import Card from "@/components/card/index";
import { paymentList } from "@/api/payment";
// 其他组件
import { Row, Col, Icon, Cell, Button, List } from "vant";
const Components = [Row, Col, Icon, Cell, Button, List];

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
    onLoad() {
      this.loading = true;
      paymentList(this.params).then(res =>{
        console.log(res)
        if(res.code == 200){
          setTimeout(() => {
            res.data.result.forEach(t => {
              this.list.push(t);
            });
            // 加载状态结束
            this.loading = false;
            this.params.pageIndex ++;
            // 数据全部加载完成
            if (this.list.length == res.data.totalCount) {
              this.finished = true;
            } else {
              this.finished = false;
            }
          }, 500);
        }else{
          this.$notify({ type: 'danger', message: msg });
          this.loading = false;
        }
      })
    },
    // 发起走款
    applyPay() {
      this.$router.push("/");
    },
    loadData(){
      
    }
  },
  mounted(){
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
