// 走款信息
<template>
  <ViewPage>
    <div class="xh-cost-content">
      <card>
        <template slot="header">走款信息</template>
        <van-row>
          <van-cell-group :border="false">
            <van-cell title="银行贷款金额(元)" :value="payDetail.projProjectInfo.loanAmt" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="送审金额(元)" :value="payDetail.projProjectInfo.sendLoanAmt" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="应走款金额(元)" :value="payDetail.projProjectInfo.loanAmt" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="走款模式" :value="payDetail.projPayInfo.payTypeName" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="走款时间" :value="payDetail.projPayInfo.payTime" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="银行账号" :value="payDetail.projPayInfo.payeeAccount" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="开户银行" :value="payDetail.projPayInfo.payeeBank" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="账户名" :value="payDetail.projPayInfo.payeeFullName" />
          </van-cell-group>
        </van-row>
      </card>
    </div>
  </ViewPage>
</template>
<script>
import Vue from "vue";
import ViewPage from "@/layout/components/ViewPage";
import redCard from "@/components/redCard/index";
import card from "@/components/card/index";
import { Row, Col, Tab, Tabs, Cell, CellGroup } from "vant";
import { paymentDetail } from "@/api/payment";
const Components = [Row, Col, Tab, Tabs, Cell, CellGroup];
Components.forEach(item => {
  Vue.use(item);
});
export default {
  components: {
    redCard,
    ViewPage,
    card
  },
  data() {
    return {
      payDetail: {}
    };
  },
  methods: {
    loadData() {
      paymentDetail({ projectId: "190909527072" }).then(res => {
        if (res.code == 200) {
          this.payDetail = res.data;
        } else {
          this.$notify({ type: "danger", message: msg });
        }
      });
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>
<style>
.xh-cost-content {
  padding: 10px;
}
.xh-pay-div {
  margin: 5px 0;
}
</style>