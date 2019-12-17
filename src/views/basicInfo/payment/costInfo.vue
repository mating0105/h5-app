// 费用信息
<template>
  <ViewPage>
    <div class="xh-cost-content">
      <redCard label="客户基本信息">
        <template slot="cardBody">
          <div>
            <div class="xh-pay-div">客户姓名及编号：{{payDetail.customerName}} {{payDetail.customerNum}}</div>
            <div class="xh-pay-div">证件号码：{{payDetail.certificateNum}}</div>
            <div class="xh-pay-div">电话：{{payDetail.contactPhone}}</div>
          </div>
        </template>
      </redCard>
      <card style="margin-top:10px;">
        <template slot="header">费用信息</template>
        <van-row>
          <van-cell-group :border="false">
            <van-cell title="产品名称" :value="payDetail.projProjectInfo.productName" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="产品性质" :value="payDetail.projProjectInfo.productProperty" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="贷款金额(元)" :value="payDetail.projProjectInfo.loanAmt" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="贷款期数" :value="payDetail.projProjectInfo.proPat.loanCount" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="放款平台" :value="payDetail.projProjectInfo.dsbrPltfrmNm" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="公司利率" :value="payDetail.projProjectInfo.bankNewRate" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="客户利率" :value="payDetail.projProjectInfo.customerRate" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="担保费率" :value="payDetail.projProjectInfo.guaranteeRate" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell
              title="担保费(元)"
              :value="payDetail.projBudgetList.warrantCharges?payDetail.projBudgetList.warrantCharges:'0'"
            />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="评估费(元)" :value="payDetail.projBudgetList.estimateCharges" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="调查费(元)" :value="payDetail.projBudgetList.investigateCharges" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="GPS费(元)" :value="payDetail.projBudgetList.gpsCharges" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="综合服务费(元)" :value="payDetail.projBudgetList.colligateCharges" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="公证费(元)" :value="payDetail.projBudgetList.notarialFees" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="异地上户费(元)" :value="payDetail.projBudgetList.allopatryCharges" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="上户保证金(元)" :value="payDetail.projBudgetList.doolBail" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="履约保证金(元)" :value="payDetail.projBudgetList.agreeBail" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="实收车商(元)" :value="payDetail.projBudgetList.collectCarDealer" />
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
import {
  Row,
  Col,
  Tab,
  Tabs,
  Cell,
  CellGroup,
} from "vant";
import { paymentDetail } from "@/api/payment";
const Components = [
  Row,
  Col,
  Tab,
  Tabs,
  Cell,
  CellGroup,
];
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
          console.log(this.payDetail);
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
.xh-pay-div{
    margin:5px 0;
}
</style>