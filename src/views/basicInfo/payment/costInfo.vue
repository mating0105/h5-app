// 费用信息
<template>
  <ViewPage>
    <div class="xh-cost-content">
      <redCard label="客户基本信息" style="margin:0 10px;">
        <template slot="cardBody">
          <div>
            <div
              class="xh-pay-div"
            >客户姓名及编号：{{payDetail.projProjectInfo.customerName}} {{payDetail.projProjectInfo.customerNum}}</div>
            <div class="xh-pay-div">证件号码：{{payDetail.projProjectInfo.certificateNum}}</div>
            <div class="xh-pay-div">电话：{{payDetail.projProjectInfo.contactPhone}}</div>
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
            <van-cell
              title="产品性质"
              :value="returnText('product_property',payDetail.projProjectInfo.productProperty)"
            />
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
      <card style="margin-top:10px;">
        <template slot="header">缴费明细</template>
        <van-row>
          <van-cell-group :border="false">
            <van-cell title="费用合计" :value="payDetail.projBudgetList.totalCharges" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="打折金额(元)" :value="payDetail.projBudgetList.dcnAmt" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="实收金额(元)" :value="payDetail.projBudgetList.actincmAmt" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="缴费时间" :value="payDetail.projBudgetList.pyfDt" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="缴费方式" :value="returnText('pay_method',payDetail.projBudgetList.pyfMod)" />
          </van-cell-group>
        </van-row>
      </card>
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
            <van-cell title="走款模式" :value="returnText('payType',payDetail.projPayInfo.payType)" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="走款时间" :value="payDetail.projPayInfo.payTime" />
          </van-cell-group>
          <div v-show="payDetail.projPayInfo.payType == '2'">
            <van-cell-group :border="false">
              <van-cell title="银行账号" :value="payDetail.projPayInfo.payeeAccount" />
            </van-cell-group>
            <van-cell-group :border="false">
              <van-cell title="开户银行" :value="payDetail.projPayInfo.payeeBank" />
            </van-cell-group>
            <van-cell-group :border="false">
              <van-cell
                title="开户银行"
                :value="returnText('BANK_TYPE_JYR',payDetail.projPayInfo.payeeSubBank)"
              />
            </van-cell-group>
            <van-cell-group :border="false">
              <van-cell title="账户名" :value="payDetail.projPayInfo.payeeFull" />
            </van-cell-group>
          </div>
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
import { getPaymentDetail, getDic } from "@/api/payment";
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
      payDetail: {
        projProjectInfo:{},
        projBudgetList:{},
        projPayInfo:{}
      },
      params: {}
    };
  },
  methods: {
    loadData() {
      getPaymentDetail({ projectId: this.params.info.projectId,businesskey: this.params.info.businesskey }).then(res => {
        this.payDetail = res.data;
      });
    },
    // 获取其他字典接口
    getDict() {
      let arr = [
        "product_property", //产品性质
        "pay_method", //缴费方式
        "payType", //走款模式
        "BANK_TYPE_JYR" //银行
      ];
      getDic(arr).then(res => {
        if (res.code == 200) {
          this.dicList = res.data;
        }
      });
    },
    returnText(type, val) {
      let name;
      this.dicList[type].forEach(e => {
        if (e.value == val) {
          name = e.label;
        }
      });
      return name;
    }
  },
  mounted() {
    this.params = {
      info: this.getStringToObj(this.$route.query.info),
      dealState: this.$route.query.dealState
    };
    this.loadData();
    this.getDict();
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