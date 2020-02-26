// 费用信息
<template>
  <ViewPage :loading="loading">
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
            <van-cell title="产品性质" :value="productProperty" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="贷款金额" :value="numFilter(payDetail.projProjectInfo.loanAmt)" >
              <div slot="right-icon" class="xh-cell-right">元</div>
            </van-cell>
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell
              title="贷款期数"
              :value="payDetail.projProjectInfo.proPat ? payDetail.projProjectInfo.proPat.loanCount : ''"
            />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="放款平台" :value="payDetail.projProjectInfo.dsbrPltfrmNm" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="公司利率" :value="numFilter(payDetail.projProjectInfo.bankNewRate)" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="客户利率" :value="numFilter(payDetail.projProjectInfo.customerRate)" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="担保费率" :value="numFilter(payDetail.projProjectInfo.guaranteeRate)" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell
              title="担保费(元)"
              :value="payDetail.projBudgetList.warrantCharges?numFilter(payDetail.projBudgetList.warrantCharges):'0.00'"
            >
            <div slot="right-icon" class="xh-cell-right">元</div>
            </van-cell>
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="评估费" :value="numFilter(payDetail.projBudgetList.estimateCharges)" >
              <div slot="right-icon" class="xh-cell-right">元</div>
            </van-cell>
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="调查费" :value="numFilter(payDetail.projBudgetList.investigateCharges)" >
              <div slot="right-icon" class="xh-cell-right">元</div>
            </van-cell>
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="GPS费" :value="numFilter(payDetail.projBudgetList.gpsCharges)" >
              <div slot="right-icon" class="xh-cell-right">元</div>
            </van-cell>
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="综合服务费" :value="numFilter(payDetail.projBudgetList.colligateCharges)" >
              <div slot="right-icon" class="xh-cell-right">元</div>
            </van-cell>
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="公证费" :value="numFilter(payDetail.projBudgetList.notarialFees)" >
              <div slot="right-icon" class="xh-cell-right">元</div>
            </van-cell>
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="异地上户费" :value="numFilter(payDetail.projBudgetList.allopatryCharges)" >
              <div slot="right-icon" class="xh-cell-right">元</div>
            </van-cell>
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="上户保证金" :value="numFilter(payDetail.projBudgetList.doolBail)" >
              <div slot="right-icon" class="xh-cell-right">元</div>
            </van-cell>
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="履约保证金" :value="numFilter(payDetail.projBudgetList.agreeBail)" >
              <div slot="right-icon" class="xh-cell-right">元</div>
            </van-cell>
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="实收车商" :value="numFilter(payDetail.projBudgetList.collectCarDealer)" >
              <div slot="right-icon" class="xh-cell-right">元</div>
            </van-cell>
          </van-cell-group>
        </van-row>
      </card>
      <card style="margin-top:10px;">
        <template slot="header">缴费明细</template>
        <van-row>
          <van-cell-group :border="false">
            <van-cell title="费用合计" :value="numFilter(payDetail.projBudgetList.totalCharges)" >
              <div slot="right-icon" class="xh-cell-right">元</div>
            </van-cell>
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="打折金额" :value="numFilter(payDetail.projBudgetList.dcnAmt)" >
              <div slot="right-icon" class="xh-cell-right">元</div>
            </van-cell>
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="实收金额" :value="numFilter(payDetail.projBudgetList.actincmAmt)" >
              <div slot="right-icon" class="xh-cell-right">元</div>
            </van-cell>
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="缴费时间" :value="payDetail.projBudgetList.pyfDt" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="缴费方式" :value="payMethod" />
          </van-cell-group>
        </van-row>
      </card>
      <card>
        <template slot="header">走款信息</template>
        <van-row>
          <van-cell-group :border="false">
            <van-cell title="银行贷款金额" :value="numFilter(payDetail.projProjectInfo.loanAmt)" >
              <div slot="right-icon" class="xh-cell-right">元</div>
            </van-cell>
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="送审金额" :value="numFilter(payDetail.projProjectInfo.sendLoanAmt)" >
              <div slot="right-icon" class="xh-cell-right">元</div>
            </van-cell>
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="应走款金额" :value="numFilter(payDetail.projProjectInfo.loanAmt)" >
            <div slot="right-icon" class="xh-cell-right">元</div>
            </van-cell>
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="走款模式" :value="payType" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="走款时间" :value="payDetail.projPayInfo.payTime" />
          </van-cell-group>
          <div v-show="payDetail.projPayInfo.payType == '2'">
            <van-cell-group :border="false">
              <van-cell title="银行账号" :value="payDetail.projPayInfo.payeeAccount" />
            </van-cell-group>
            <van-cell-group :border="false">
              <van-cell title="开户银行" :value="bankTypeJry" />
            </van-cell-group>
            <van-cell-group :border="false">
              <van-cell title="开户支行" :value="payDetail.projPayInfo.payeeSubBank" />
            </van-cell-group>
            <van-cell-group :border="false">
              <van-cell title="账户名" :value="payDetail.projPayInfo.payeeFullName" />
            </van-cell-group>
          </div>
          <!-- <div>
            {{payDetail.projPayInfo}}
          </div>-->
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
import { format } from "@/utils/format";
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
        projProjectInfo: {},
        projBudgetList: {},
        projPayInfo: {}
      },
      productProperty: "",
      payMethod: "",
      payType: "",
      bankTypeJry: "",
      params: {},
      loading:false
    };
  },
  methods: {
    loadData() {
      this.loading = true;
      getPaymentDetail({
        projectId: this.params.info && this.params.info.projectId,
        businesskey: this.params.info.businesskey
      })
        .then(res => {
          this.payDetail = res.data;
          this.payDetail.projPayInfo.payTime = format(new Date(this.payDetail.projPayInfo.payTime),'yyyy-MM-dd hh:mm');
          this.payDetail.projBudgetList.pyfDt = format(new Date(this.payDetail.projBudgetList.pyfDt),'yyyy-MM-dd hh:mm')

          this.productProperty = this.returnText(
            "product_property",
            res.data.projProjectInfo.productProperty
          );
          this.payMethod = this.returnText(
            "pay_method",
            res.data.projBudgetList.pyfMod
          );
          this.payType = this.returnText(
            "payType",
            res.data.projPayInfo.payType
          );
          this.bankTypeJry = this.returnText(
            "BANK_TYPE_JYR",
            res.data.projPayInfo.payeeBank
          );
          this.loading = false;
        })
        .catch(err => {
          setTimeout(() => {
              this.loading = false;
          }, 1000);
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
  created() {
    this.params = {
      info: this.getStringToObj(this.$route.query.info),
      dealState: this.$route.query.dealState
    };
    console.log("businesskey:", this.params.info);

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