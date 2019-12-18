<template>
  <ViewPage>
    <van-tabs v-model="activeName">
      <van-tab title="费用信息" name="cost">
        <div class="xh-pay-content">
          <redCard label="客户基本信息">
            <template slot="cardBody">
              <div>
                <div
                  class="xh-pay-div"
                >客户姓名及编号：{{paymentDetail.customerName}} {{paymentDetail.customerNum}}</div>
                <div class="xh-pay-div">证件号码：{{paymentDetail.certificateNum}}</div>
                <div class="xh-pay-div">电话：{{paymentDetail.contactPhone}}</div>
              </div>
            </template>
          </redCard>
          <!-- 步骤条 -->
          <div class="xh-steps xh-steps-horizontal xh-step-center">
            <div
              class="xh-step is-horizontal"
              v-for="i in list"
              :key="i.key"
              @click="stepVhange(i.key)"
            >
              <div class="xh-step-head">
                <div class="xh-step-line">
                  <i class="xh-step-line-inner xh-border-gray"></i>
                </div>
                <div
                  class="xh-step-icon is-text"
                  :class="stepVal == i.key?'xh-bg-active':'xh-bg-gray'"
                >
                  <div class="xh-step-icon-inner xh-is-status"></div>
                </div>
              </div>
              <div class="xh-step-main">
                <div
                  class="xh-step-title"
                  :class="stepVal == i.key?'xh-step-active':'xh-step-gray'"
                >{{ i.name }}</div>
                <div class="xh-step-description"></div>
              </div>
            </div>
          </div>
          <div v-show="stepVal ==1">
            <card>
              <template slot="header">产品费用</template>
              <van-row>
                <van-cell-group :border="false">
                  <van-cell title="产品名称" :value="paymentDetail.projProjectInfo.productName" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="产品性质" :value="paymentDetail.projProjectInfo.productProperty" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="贷款金额(元)" :value="paymentDetail.projProjectInfo.loanAmt" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="贷款期数" :value="paymentDetail.projProjectInfo.proPat.loanCount" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="放款平台" :value="paymentDetail.projProjectInfo.dsbrPltfrmNm" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="公司利率" :value="paymentDetail.projProjectInfo.bankNewRate" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="客户利率" :value="paymentDetail.projProjectInfo.customerRate" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="担保费率" :value="paymentDetail.projProjectInfo.guaranteeRate" />
                </van-cell-group>
              </van-row>
            </card>
            <card style="margin-top:10px;">
              <template slot="header">其他费用</template>
              <van-row>
                <van-cell-group :border="false">
                  <van-cell title="担保费(元)" :value="paymentDetail.projBudgetList.warrantCharges?paymentDetail.projBudgetList.warrantCharges:'0'" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-field
                    v-model="paymentDetail.projBudgetList.estimateCharges"
                    required
                    clearable
                    label="评估费(元)"
                    input-align="right"
                    placeholder="请输入"
                    @blur.prevent="()=>{ }"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-field
                    v-model="paymentDetail.projBudgetList.investigateCharges"
                    required
                    clearable
                    label="调查费(元)"
                    input-align="right"
                    placeholder="请输入"
                    @blur.prevent="()=>{ }"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-field
                    v-model="paymentDetail.projBudgetList.gpsCharges"
                    required
                    clearable
                    label="GPS费(元)"
                    input-align="right"
                    placeholder="请输入"
                    @blur.prevent="()=>{ }"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-field
                    v-model="paymentDetail.projBudgetList.colligateCharges"
                    required
                    clearable
                    label="综合服务费(元)"
                    input-align="right"
                    placeholder="请输入"
                    @blur.prevent="()=>{ }"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-field
                    v-model="paymentDetail.projBudgetList.notarialFees"
                    required
                    clearable
                    label="公证费(元)"
                    input-align="right"
                    placeholder="请输入"
                    @blur.prevent="()=>{ }"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-field
                    v-model="paymentDetail.projBudgetList.allopatryCharges"
                    required
                    clearable
                    label="异地上户费(元)"
                    input-align="right"
                    placeholder="请输入"
                    @blur.prevent="()=>{ }"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-field
                    v-model="paymentDetail.projBudgetList.doolBail"
                    required
                    clearable
                    label="上户保证金(元)"
                    input-align="right"
                    placeholder="请输入"
                    @blur.prevent="()=>{ }"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-field
                    v-model="paymentDetail.projBudgetList.agreeBail"
                    required
                    clearable
                    label="履约保证金(元)"
                    input-align="right"
                    placeholder="请输入"
                    @blur.prevent="()=>{ }"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-field
                    v-model="paymentDetail.projBudgetList.collectCarDealer"
                    required
                    clearable
                    label="实收车商(元)"
                    input-align="right"
                    placeholder="请输入"
                    @blur.prevent="()=>{ }"
                  />
                </van-cell-group>
              </van-row>
            </card>
            <card style="margin-top:10px;">
              <template slot="header">缴费明细</template>
              <van-row>
                <van-cell-group :border="false">
                  <van-field
                    v-model="paymentDetail.projBudgetList.totalCharges"
                    required
                    clearable
                    label="费用合计"
                    input-align="right"
                    placeholder="请输入"
                    @blur.prevent="()=>{ }"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-field
                    v-model="paymentDetail.projBudgetList.dcnAmt"
                    required
                    clearable
                    label="打折金额(元)"
                    input-align="right"
                    placeholder="请输入"
                    @blur.prevent="()=>{ }"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-field
                    v-model="paymentDetail.projBudgetList.actincmAmt"
                    required
                    clearable
                    label="实收金额(元)"
                    input-align="right"
                    placeholder="请输入"
                    @blur.prevent="()=>{ }"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell
                    title="缴费时间"
                    required
                    is-link
                    v-model="paymentDetail.projBudgetList.pyfDt"
                    @click="showPopupTime('pyfDt')"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell
                    title="缴费方式"
                    required
                    is-link
                    :value="paymentDetail.projBudgetList.pyfModName"
                    @click="loadType('缴费方式', 'pyfMod')"
                  />
                </van-cell-group>
              </van-row>
            </card>
          </div>
          <div v-show="stepVal ==2">
            <card>
              <template slot="header">走款信息</template>
              <van-row>
                <van-cell-group :border="false">
                  <van-field
                    v-model="paymentDetail.projProjectInfo.loanAmt"
                    required
                    clearable
                    label="银行贷款金额(元)"
                    input-align="right"
                    placeholder="请输入"
                    @blur.prevent="()=>{ }"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-field
                    v-model="paymentDetail.projProjectInfo.sendLoanAmt"
                    required
                    clearable
                    label="送审金额(元)"
                    input-align="right"
                    placeholder="请输入"
                    @blur.prevent="()=>{ }"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-field
                    v-model="paymentDetail.projProjectInfo.loanAmt"
                    required
                    clearable
                    label="应走款金额(元)"
                    input-align="right"
                    placeholder="请输入"
                    @blur.prevent="()=>{ }"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell
                    title="走款模式"
                    required
                    is-link
                    :value="paymentDetail.projPayInfo.payTypeName"
                    @click="loadType('走款模式', 'payType')"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell
                    title="走款时间"
                    required
                    is-link
                    :value="paymentDetail.projPayInfo.payTime"
                    @click="showPopupTime('payTime')"
                  />
                </van-cell-group>
                <div v-show="paymentDetail.projPayInfo.payTypeName == '转账'">
                  <van-cell-group :border="false">
                    <van-field
                      v-model="paymentDetail.projPayInfo.payeeAccount"
                      required
                      clearable
                      label="银行账号"
                      input-align="right"
                      placeholder="请输入"
                      @blur.prevent="()=>{ }"
                    />
                  </van-cell-group>
                  <van-cell-group :border="false">
                    <van-cell
                      title="开户银行"
                      required
                      is-link
                      :value="paymentDetail.projPayInfo.payeeBank"
                    />
                  </van-cell-group>
                  <van-cell-group :border="false">
                    <van-field
                      v-model="paymentDetail.projPayInfo.payeeFullName"
                      required
                      clearable
                      label="账户名"
                      input-align="right"
                      placeholder="请输入"
                      @blur.prevent="()=>{ }"
                    />
                  </van-cell-group>
                </div>
              </van-row>
            </card>
          </div>
          <div v-show="stepVal ==3">
            <card>
              <template slot="header">走款资料</template>
              <imageList :dataList="dataList"></imageList>
            </card>
          </div>
        </div>
        <div class="xh-submit">
          <van-button size="large" class="xh-bg-main" @click="submit" :loading="loading">保 存</van-button>
        </div>
      </van-tab>
      <van-tab title="项目信息" name="project">
        <ProjectInfo></ProjectInfo>
      </van-tab>
    </van-tabs>

    <van-action-sheet get-container="#app" v-model="show2" class="xh-list">
      <div class="xh-list-body">
        <van-datetime-picker
          :title="timetitle"
          type="datetime"
          :formatter="formatter"
          v-model="currentDate"
          @confirm="confirmTime"
          @cancel="cancelTime"
        />
      </div>
    </van-action-sheet>
    <!-- 弹出选项 -->
    <van-action-sheet get-container="#app" v-model="show3" class="xh-list">
      <div class="xh-list-body">
        <van-picker
          :columns="options"
          show-toolbar
          :value-key="valueKey"
          :title="selectName"
          @confirm="confirm"
          @cancel="cancel"
        />
      </div>
    </van-action-sheet>
  </ViewPage>
</template>
<script>
import Vue from "vue";
import {
  Button,
  Row,
  Col,
  Tab,
  Tabs,
  Cell,
  CellGroup,
  DatetimePicker
} from "vant";
import redCard from "@/components/redCard/index";
import card from "@/components/card/index";
import ViewPage from "@/layout/components/ViewPage";
import imageList from '@/components/imageList'
import ProjectInfo from "@/views/basicInfo/projectInfo/info";
import { paymentDetail, getDic,submitPay } from "@/api/payment";
import { format } from "@/utils/format";
const Components = [
  Button,
  Row,
  Col,
  Tab,
  Tabs,
  Cell,
  CellGroup,
  DatetimePicker
];
Components.forEach(item => {
  Vue.use(item);
});
export default {
  components: {
    redCard,
    ViewPage,
    card,
    ProjectInfo,
    imageList
  },
  data() {
    return {
      activeName: "cost",
      list: [
        { name: "费用信息", key: 1 },
        { name: "走款信息", key: 2 },
        { name: "上传图片", key: 3 }
      ],
      stepVal: 1,
      paymentDetail: {}, //基本信息
      params: {}, //上个页面传过来的参数
      loading: false,
      selectName: "",
      payMethods: [], //缴费方式数组
      payTypes: [], //走款方式数组
      valueKey: "label",
      fieldName: "",
      show2: false,
      show3: false,
      options: [],
      timeType: "",
      timetitle: "",
      currentDate: new Date(),
      dataList:[],//图片上传
    };
  },
  methods: {
    stepVhange(val) {
      this.stepVal = val;
    },
    loadData() {
      paymentDetail({ projectId: this.params.projectId }).then(res => {
        if (res.code == 200) {
          this.paymentDetail = res.data;
        } else {
          this.$notify({ type: "danger", message: msg });
        }
      });
    },
    //保存数据
    submit() {
      console.log(this.paymentDetail);
      submitPay(this.paymentDetail).then(res =>{
          this.$notify({ type: "success", message: '保存成功' });
      })
    },
    loadType(title, field) {
      this.selectName = title;
      this.isWordbook = false;
      this.fieldName = field;
      switch (title) {
        case "缴费方式":
          this.options = this.payMethods;
          this.show3 = true;
          break;
        case "走款模式":
          this.options = this.payTypes;
          this.show3 = true;
          break;
        default:
          break;
      }
    },
    // 获取其他字典接口
    getDict() {
      let arr = [
        "pay_method", //缴费方式
        "payType" //走款模式
      ];
      getDic(arr).then(res => {
        if (res.code == 200) {
          this.payMethods = res.data.pay_method;
          this.payTypes = res.data.payType;
        }
      });
    },
    // 字典选择确认
    confirm(row) {
      switch (this.fieldName) {
        case "pyfMod":
          this.paymentDetail.projBudgetList[this.fieldName] = row.value;
          this.paymentDetail.projBudgetList[this.fieldName + "Name"] =
            row.label;
          break;
        case "payType":
          this.paymentDetail.projPayInfo[this.fieldName] = row.value;
          this.paymentDetail.projPayInfo[this.fieldName + "Name"] =
            row.label;
          break;
      }
      this.show3 = false;
    },
    cancel() {
      this.show3 = false;
    },
    //时间选择
    showPopupTime(type) {
      this.timeType = type;
      this.show2 = true;
      switch (type) {
        case "pyfDt":
          this.timetitle = "请选择缴费时间";
          break;
        case "payTime":
          this.timetitle = "请选择走款时间";
          break;
      }
    },
    formatter(type, value) {
      if (type == "minute") {
        return `0`;
      } else if (type == "year") {
        return `${value}年`;
      } else if (type == "month") {
        return `${value}月`;
      } else if (type == "day") {
        return `${value}日`;
      } else if (type == "hour") {
        return `${value}时`;
      }
    },
    confirmTime(value) {
      var time = format(value, "yyyyMMdd hh");
      switch (this.timeType) {
        case "pyfDt":
          this.paymentDetail.projBudgetList.pyfDt = time;
          break;
        case "payTime":
          this.paymentDetail.projPayInfo.payTime = time;
          break;
      }
      this.show2 = false;
    },
    cancelTime() {
      this.show2 = false;
    }
  },
  mounted() {
    this.params = this.$route.query;
    this.loadData();
    this.getDict();
  }
};
</script>
<style>
.xh-pay-content {
  padding: 10px;
}
.xh-pay-div {
  margin: 10px 0;
}
.xh-steps {
  display: flex;
  margin-top: 10px;
}
.xh-steps-horizontal {
  white-space: nowrap;
}
.xh-step.xh-horizontal {
  display: inline-block;
}
.xh-step {
  position: relative;
  flex-shrink: 1;
  flex-basis: 20%;
}
.xh-step.is-horizontal .xh-step-line {
  height: 2px;
  top: 13px;
  left: -50%;
  right: 50%;
}
.xh-step.is-horizontal:first-child .xh-step-line {
  left: 50%;
}
.xh-step-head {
  position: relative;
  width: 100%;
  text-align: center;
}
.xh-step-line {
  position: absolute;
  border-color: inherit;
  background-color: #c0c4cc;
  margin-right: 0px;
}
.xh-step-line-inner {
  display: block;
  border-width: 1px;
  border-style: solid;
  transition: 0.15s ease-out;
  box-sizing: border-box;
  height: 0;
  transition-delay: 0ms;
  width: 100%;
  color: #c0c4cc;
}
.xh-step-icon {
  position: relative;
  z-index: 1;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1.5rem;
  box-sizing: border-box;
  transition: 0.15s ease-out;
  color: #fff;
}
.xh-step-icon.is-text {
  border-radius: 50%;
}
.xh-step-icon-inner {
  display: inline-block;
  user-select: none;
  text-align: center;
  line-height: 1;
  color: inherit;
}
.xh-step-main {
  white-space: normal;
  text-align: center;
}
.xh-step-title {
  font-size: 12px;
  line-height: 38px;
}
.xh-step-center {
  justify-content: center;
}
.xh-step-active {
  color: rgb(196, 37, 42);
}
.xh-step-gray {
  color: rgb(204, 204, 204);
}
.xh-bg-active {
  background: rgb(196, 37, 42);
}
.xh-bg-gray {
  color: rgb(204, 204, 204);
}
.xh-submit {
  padding: 0 10px 20px 10px;
}
</style>
