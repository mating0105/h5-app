// 风控措施
<template>
  <ViewPage>
    <div class="xh-cost-content">
      <card>
        <template slot="header">风控措施</template>
        <van-row>
          <van-cell-group :border="false">
            <van-cell title="手动评级" :value="payDetail.projProjectInfo.loanAmt" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="是否加入关注名单" :value="payDetail.projProjectInfo.sendLoanAmt" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="风控条件" :value="payDetail.projProjectInfo.loanAmt" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="是否上门" :value="payDetail.projPayInfo.payTypeName" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="GPS数量(台)" :value="payDetail.projPayInfo.payTime" />
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