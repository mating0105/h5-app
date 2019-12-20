<template>
  <ViewPage :loading="loading">
    <div class="xh-page-body">
      <van-row class="xh-card-box xh-radius">
        <van-col :span="24">
          <van-cell-group :border="false">
            <van-cell
              title="首付款是否为自有资金："
              required
              is-link
              :value="ruleForm.firstFundsDesc"
              :border="false"
              @click.native="loadList('首付款是否为自有资金','yes_no')"
            />
            <van-cell
              title="是否清楚车价："
              required
              is-link
              :border="false"
              :value="ruleForm.clearCarPriceDesc"
              @click.native="loadList('是否清楚车价','yes_no')"
            />
            <van-cell
              title="是否有驾驶证："
              required
              is-link
              :border="false"
              :value="ruleForm.drivingLicenseDesc"
              @click.native="loadList('是否有驾驶证','yes_no')"
            />
            <van-cell
              title="调查中是否有陪同："
              required
              is-link
              :border="false"
              :value="ruleForm.accompanyDesc"
              @click.native="loadList('调查中是否有陪同','yes_no')"
            />
            <van-cell
              title="是否人车匹配："
              required
              is-link
              :value="ruleForm.matchDesc"
              :border="false"
              @click.native="loadList('是否人车匹配','yes_no')"
            />
            <van-cell
              title="是否涉及消费返利："
              required
              is-link
              :border="false"
              :value="ruleForm.rebateDesc"
              @click.native="loadList('是否涉及消费返利','yes_no')"
            />
            <div v-show="isquick">
              <van-row>
                <van-col
                  :span="24"
                  class="xh-submit xh-text-right"
                  style="margin-top: 0;padding:10px;"
                >
                  <van-button
                    type="danger"
                    size="small"
                    :loading="scbgLoading"
                    :disabled="scbgDisabled"
                    @click.native="scbgComit"
                  >生成调查报告</van-button>
                </van-col>
              </van-row>
              <van-field
                v-model="ruleForm.houseReport"
                class="xh-text-right"
                required
                label="借款人信息及房产报告:"
                placeholder="自动生成,无需填写"
                type="textarea"
                input-align="right"
                rows="1"
                :border="false"
                autosize
              />
              <van-field
                v-model="ruleForm.responseReport"
                class="xh-text-right"
                required
                label="借款人收入负债报告:"
                placeholder="自动生成,无需填写"
                type="textarea"
                rows="1"
                :border="false"
                input-align="right"
                autosize
              />
              <van-field
                v-model="ruleForm.gnrHsptyAndIncmRpt"
                class="xh-text-right"
                required
                label="担保人房产及收入报告:"
                placeholder="自动生成,无需填写"
                type="textarea"
                rows="1"
                :border="false"
                input-align="right"
                autosize
              />
            </div>
            <van-field
              v-model="ruleForm.surveyOpinion"
              class="xh-text-right"
              required
              label="调查意见情况:"
              placeholder="请输入意见情况"
              type="textarea"
              rows="1"
              autosize
              :border="false"
              input-align="right"
              @blur.prevent="()=>{ return errorMsg.surveyOpinion = rules('',$event,this)}"
              :error-message="errorMsg.surveyOpinion"
            />
            <van-field
              v-model="ruleForm.dataDetailed"
              class="xh-text-right"
              required
              label="差资料明细:"
              placeholder="请输入差资料明细"
              type="textarea"
              rows="1"
              :border="false"
              input-align="right"
              autosize
              @blur.prevent="()=>{ return errorMsg.dataDetailed = rules('',$event,this)}"
              :error-message="errorMsg.dataDetailed"
            />
            <van-cell
              title="实际调查地址："
              required
              is-link
              v-model="ruleForm.actSurvyAdrId"
              :border="false"
              @click="popaddress('实际调查地址')"
            />
            <van-cell
              title="购车用途："
              is-link
              :value="ruleForm.carUseDesc"
              :border="false"
              @click.native="loadList('购车用途','car_use')"
            />
            <van-cell
              title="上户地："
              required
              is-link
              v-model="ruleForm.upAccLndId"
              :border="false"
              @click="popaddress('上户地')"
            />
            <van-cell
              title="提供人："
              :required="bankWaterFlag"
              is-link
              :value="ruleForm.providerDesc"
              :border="false"
              @click.native="loadList('提供人','provider_type')"
            />
            <van-cell
              title="姓名："
              :required="bankWaterFlag"
              is-link
              :value="ruleForm.providerName"
              :border="false"
              @click.native="loadList('姓名','1')"
              :disabled="providerNameable"
            />
            <van-field
              v-model="ruleForm.providerPhone"
              :required="bankWaterFlag"
              label="手机号："
              input-align="right"
              :disabled="true"
              :border="false"
            />
            <van-field
              v-model="ruleForm.providerIdCard"
              :required="bankWaterFlag"
              label="身份证号："
              input-align="right"
              :disabled="true"
              :border="false"
            />
            <van-cell
              title="流水开始日期："
              :required="bankWaterFlag"
              is-link
              :border="false"
              v-model="ruleForm.jrnlDateStart"
              @click="showPopupTime('jrnlDateStart')"
            />
            <van-cell
              title="流水截止日期："
              :required="bankWaterFlag"
              is-link
              :border="false"
              v-model="ruleForm.jrnlDateEnd"
              @click="showPopupTime('jrnlDateEnd')"
            />
            <van-field
              v-model="ruleForm.cardNumber"
              clearable
              :required="bankWaterFlag"
              input-align="right"
              label="银行卡号："
              right-icon="photograph"
              placeholder="请输入卡号"
              class="xh-right-icon"
              @click-right-icon="OCRScan"
            />
          </van-cell-group>
        </van-col>
      </van-row>
      <!-- 保 存按钮 -->
      <div class="xh-submit">
        <van-button
          size="large"
          class="xh-bg-main"
          :class="[subDisabled ? 'buttonNoColor' : 'buttonColor']"
          :loading="subLoading"
          :disabled="subDisabled"
          @click.native="custSubmit"
        >保 存</van-button>
      </div>
    </div>

    <!-- 下拉选择器 -->
    <van-action-sheet v-model="selectShow" class="xh-list">
      <van-picker
        show-toolbar
        :title="pickerTitle"
        :columns="columns"
        :value-key="'label'"
        @cancel="selectShow = false"
        @confirm="onConfirm"
      />
    </van-action-sheet>

    <!-- 弹出省市区 -->
    <Provinces :showMap.sync="addressShow" @getProvince="addressOnConfirm"></Provinces>
    <!-- 时间选择器 -->
    <van-popup position="bottom" :overlay="true" v-model="popupShow3">
      <van-datetime-picker
        :title="title2"
        type="date"
        :formatter="formatter"
        v-model="currentDate"
        @confirm="confirmTime"
        @cancel="cancelTime"
      />
    </van-popup>
  </ViewPage>
</template>

<script>
import Vue from "vue";
// 自定义组件
import ViewPage from "@/layout/components/ViewPage";
import Card from "@/components/card/index";
import Provinces from "@/components/provinces/index";
import { getSurveyInfo, getProvider, getProviderSecurity, getCheckReport } from "@/api/client";
import { mapState } from "vuex";
// 其他组件
import {
  Row,
  Col,
  Icon,
  Cell,
  Button,
  Popup,
  Field,
  ActionSheet,
  DatetimePicker,
  CellGroup,
  Picker
} from "vant";
import { isArray } from 'util';
const Components = [
  Row,
  Col,
  Icon,
  Cell,
  Button,
  Popup,
  Field,
  ActionSheet,
  DatetimePicker,
  CellGroup,
  Picker
];

Components.forEach(item => {
  Vue.use(item);
});
export default {
  components: {
    Card,
    ViewPage,
    Provinces
  },
  computed: {
    // 所有字典
    ...mapState({
      wordbook: state => state.user.wordbook
    })
  },
  data() {
    return {
      loading: false, // loading
      id: "",
      projectId: "", // 项目的id
      customerId: "", // 客户id
      firstFunds: "", //首付款是否为自有资金
      clearCarPrice: "", //是否清楚车价
      drivingLicense: "", //是否有驾驶证
      accompany: "", //调查中是否有陪同
      match: "", //是否人车匹配
      rebate: "", //是否涉及消费返利
      realEstateReport: "", //借款人信息及房产报告
      debtReport: "", //借款人收入负债报告
      incomeReport: "", //担保人房产及收入报告
      surveyOpinion: "", //调查意见情况
      dataDetailed: "", //差资料明细
      investAddress: "", //实际调查地址
      cardNumber: "", //流水卡号
      homeLand: "", //上户地
      flowDate: "", //流水日期起止
      jrnlDateStart: "", //流水起始日期
      jrnlDateEnd: "", //流水截止日期
      carUse: "", //购车用途code
      provider: "", //提供人
      providerDesc: "", //提供人
      providerName: "", //提供人手机号
      providerNameable: true, //提供人姓名是否可选
      providerIdCard: "", //提供人身份证
      providerPhone: "", //提供人电话
      isQuickadjust: "", //是否快提快调
      title2: "",
      actSurvyAdrCode: "",
      upAccLndCode: "",
      // rules: rules, //验证 方法
      columns: [], //待选择列表
      errorMsg: {
        surveyOpinion: "", //调查意见情况
        dataDetailed: "" //差资料明细
      },

      bankWaterFlag: false, // 流水是否必填
      selectShow: false, //下拉选择器显示
      pickerTitle: "", //下拉列表title

      scbgLoading: false, //生成报告loading
      scbgDisabled: false, //按钮禁用状态

      subLoading: false, //提交loading
      subDisabled: false, //按钮禁用状态

      currentDate: new Date(),
      popupShow3: false, //时间选择器
      popTimeType: "", //时间类型

      // 下拉菜单 List
      whetherList: ["是", "否"], //公用是否
      providerList: [
        { text: "借款人", key: "borrower" },
        { text: "借款人配偶", key: "borrowerSpouse" },
        { text: "担保人", key: "security" },
        { text: "担保人配偶", key: "securitySpouse" }
      ],
      providerObj: {},
      carUseList: ["二手车套现", "外省用车", "抵债", "营运", "自用"],
      isquick: true, //生成报告是否显示
      popupShow2: false,
      addressType: "",
      areaList: {
        province_list: {},
        city_list: {},
        county_list: {}
      },
      formList: {
        accompany: "",
        actSurvyAdr: "",
        carUse: "",
        clearCarPrice: "",
        driveLicence: "",
        gnrHsptyAndIncmRpt: "",
        houseReport: "",
        infoDetail: "",
        inveInfo: "",
        involveConsumeRebate: "",
        jrnlCardno: "",
        jrnlDateEnd: "",
        jrnlDateStart: "",
        match: "",
        paymentOwnCapital: "",
        provider: "",
        providerIdCard: "",
        providerName: "",
        providerPhone: "",
        responseReport: "",
        upAccLnd: ""
      },
      ruleData: {},


      ruleForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
        actSurvyAdrId: '',
        time: [],
        customerName: "",
        certificateNum: "",
        contactPhone: "",
        upAccLndId: ""
      },
      addressShow: false,
      providerList: [], // 提供人
    };
  },
  methods: {
    OCRScan() {
      bridge.callhandler("OCRScan", "0", data => {
        this.$set(this, "cardNumber", data.BANK_NUM);
      });
    },
    loadData() {
      getSurveyInfo({
        projectId: this.params.projectId,
        customerId: this.params.customerId
      })
      .then(res => {
        const { projConclusion } = res.data;
        this.isQuickadjust = projConclusion.isQuickadjust;
        this.ruleForm = {
          ...projConclusion,
          actSurvyAdrId: [],
          time: []
        };
        if (this.ruleForm.jrnlDateStart) {
          this.ruleForm.time = [
            this.ruleForm.jrnlDateStart,
            this.ruleForm.jrnlDateEnd
          ];
        }
        })
        .catch(function(error) {});
    },

    loadList(val,name) {
      this.pickerTitle = val;
      if(name == '1') {
        console.log(this.providerList);
        if(this.providerList.length == 0) return
        this.selectShow = true;
        this.columns = this.providerList;
      } else {
        this.selectShow = true;
        this.columns = this.wordbook[name];
      }
    },
    onConfirm(rows) {
      switch (this.pickerTitle) {
        case "首付款是否为自有资金":
          this.ruleForm.firstFunds = rows.value;
          this.ruleForm.firstFundsDesc = rows.label;
          break;
        case "是否清楚车价":
          this.ruleForm.clearCarPrice = rows.value;
          this.ruleForm.clearCarPriceDesc = rows.label;
          break;
        case "是否有驾驶证":
          this.ruleForm.drivingLicense = rows.value;
          this.ruleForm.drivingLicenseDesc = rows.label;
          break;
        case "调查中是否有陪同":
          this.ruleForm.accompany = rows.value;
          this.ruleForm.accompanyDesc = rows.label;
          break;
        case "是否人车匹配":
          this.ruleForm.match = rows.value;
          this.ruleForm.matchDesc = rows.label;
          break;
        case "是否涉及消费返利":
          this.ruleForm.rebate = rows.value;
          this.ruleForm.rebateDesc = rows.label;
          break;
        case "购车用途":
          this.ruleForm.carUse = rows.value;
          this.ruleForm.carUseDesc = rows.label;
          break;
        case "提供人":
          this.ruleForm.provider = rows.value;
          this.ruleForm.providerDesc = rows.label;
          if(rows.value == 'borrower' || rows.value == 'borrowerSpouse') {
            this.getProviderList(rows.value);
          } else {
            this.getProviderSecurityList(rows.value);
          }
          break;
        case "姓名":
          this.ruleForm.provider = rows.value;
          this.ruleForm.providerName = rows.label;
          break;
      }
      this.selectShow = false;
    },
    // 省市区选择
    popaddress(des) {
      this.pickerTitle = des;
      this.addressShow = true;
    },
    // 省市区选择确定
    addressOnConfirm(code, name) {
      switch (this.pickerTitle) {
        case '实际调查地址':
          this.ruleForm.actSurvyAdrId = code;
          break;
        case '上户地':
          this.ruleForm.upAccLndId = code;
          break;
      
        default:
          break;
      }
      this.addressShow = false;
    },
    //显示时间弹框
    showPopupTime(type) {
      this.popTimeType = type;
      this.popupShow3 = true;
      switch (type) {
        case "jrnlDateStart":
          this.title2 = "请选择流水开始时间";
          break;
        case "jrnlDateEnd":
          this.title2 = "请选择流水截止时间";
          break;
      }
    },
    formatter(type, value) {
      // console.log(type,value)
      if (type == "year") {
        return `${value}年`;
      } else if (type == "month") {
        return `${value}月`;
      } else if (type == "day") {
        return `${value}日`;
      }
    },
    confirmTime(value) {
      var time = commonFun.format(value, "yyyy-MM-dd");
      switch (this.popTimeType) {
        case "jrnlDateStart":
          this.jrnlDateStart = time;
          break;
        case "jrnlDateEnd":
          this.jrnlDateEnd = time;
          break;
      }
      this.popupShow3 = false;
    },
    cancelTime() {
      this.popupShow3 = false;
    },
    cancelSelect() {
      this.popupShow2 = false;
    },
    // 生成调查报告
    scbgComit() {
      getCheckReport({
        projectId: this.params.projectId,
        customerId: this.params.customerId
      }).then(res => {
        let { data } = res;
        this.ruleForm.houseReport = data.houseReport;  //借款人信息及房产报告
        this.ruleForm.responseReport = data.responseReport;  //借款人收入负债报告
        this.ruleForm.gnrHsptyAndIncmRpt = data.gnrHsptyAndIncmRpt; //担保人房产及收入报告
      });
    },
    // submit
    submitWay() {
      this.subLoading = true;
      this.subDisabled = true;
      setTimeout(() => {
        this.subLoading = false;
        this.subDisabled = false;
      }, 1000);
      requestUrl
        .postList("/carloan/projProjectInfo/saveProjConclusion", {
          id: this.id,
          proj: {
            id: this.projectId
          },
          customer: {
            id: this.customerId
          },
          paymentOwnCapital: this.changeCode(this.firstFunds), // 首付款是否为自有资金
          clearCarPrice: this.changeCode(this.clearCarPrice),
          driveLicence: this.changeCode(this.drivingLicense), // 是否有驾驶证
          accompany: this.changeCode(this.accompany), // 是否有陪同
          selfUsecar: this.changeCode(this.match), // 是否人车匹配
          involveConsumeRebate: this.changeCode(this.rebate), // 是否涉及消费返利
          houseReport: this.realEstateReport, // 借款人信息及房产报告
          responseReport: this.debtReport, // 借款人收入负债报告
          gnrHsptyAndIncmRpt: this.incomeReport, // 担保人房产及收入报告
          inveInfo: this.surveyOpinion, // 调查意见情况
          infoDetail: this.dataDetailed, // 差资料明细
          actSurvyAdr: this.investAddress, // 实际调查地址
          actSurvyAdrCode: this.actSurvyAdrCode,
          upAccLndCode: this.upAccLndCode,
          jrnlCardno: this.cardNumber, // 流水卡号
          upAccLnd: this.homeLand, // 上户地
          jrnlDateStart: this.jrnlDateStart, //开始时间
          jrnlDateEnd: this.jrnlDateEnd, //结束时间
          // 'jrnlDate': this.flowDate, // 流水日期起止
          carUse: this.carDes(this.carUse), //购车用途
          provider: this.provider, // 提供人
          providerDesc: this.providerDesc,
          providerName: this.providerName,
          providerIdCard: this.providerIdCard,
          providerPhone: this.providerPhone
        })
        .then(res => {
          if (res.code === "SYS.200") {
            this.$toast.success("保存成功");
            setTimeout(() => {
              bridge.ReturnVC(1, false);
            }, 1000);
          } else {
            this.$toast(res.message);
          }
        });
    },
    custSubmit() {
      if (this.isQuickadjust == 0) {
        if (this.realEstateReport && this.debtReport && this.incomeReport) {
          if (
            this.firstFunds &&
            this.drivingLicense &&
            this.accompany &&
            this.match &&
            this.rebate &&
            this.surveyOpinion &&
            this.dataDetailed &&
            this.investAddress
          ) {
            if (this.bankWaterFlag == true) {
              if (
                this.provider &&
                this.providerName &&
                this.providerIdCard &&
                this.providerPhone &&
                this.cardNumber &&
                this.jrnlDateStart &&
                this.jrnlDateEnd
              ) {
                this.submitWay();
              } else {
                this.$toast({
                  position: "top",
                  message: "带 * 必须填写完整, 且填写无误"
                });
              }
            } else {
              this.submitWay();
            }
          } else {
            this.$toast({
              position: "top",
              message: "带 * 必须填写完整, 且填写无误"
            });
          }
        } else {
          this.$toast({
            position: "top",
            message: "您还未生成报告"
          });
        }
      } else {
        if (
          this.firstFunds &&
          this.drivingLicense &&
          this.accompany &&
          this.match &&
          this.rebate &&
          this.surveyOpinion &&
          this.dataDetailed &&
          this.investAddress
        ) {
          if (this.bankWaterFlag == true) {
            if (
              this.provider &&
              this.providerName &&
              this.providerIdCard &&
              this.providerPhone &&
              this.cardNumber &&
              this.jrnlDateStart &&
              this.jrnlDateEnd
            ) {
              this.submitWay();
            } else {
              this.$toast({
                position: "top",
                message: "带 * 必须填写完整, 且填写无误"
              });
            }
          } else {
            this.submitWay();
          }
        } else {
          this.$toast({
            position: "top",
            message: "带 * 必须填写完整, 且填写无误"
          });
        }
      }
    },
    // 有接口验证的时候
    urlRules(urls, rows, msg) {
      let param = rows.params.split(",");
      let obj = {};
      param.forEach(t => {
        obj[t] = this.form[t];
      });
      requestUrl.getList(urls, obj, "soa").then(res => {
        if (res.data.code === 200) {
          let { message } = res.data.data;
          this.errorMsg[msg] = message;
        } else {
          this.$toast(res.data.msg);
        }
      });
    },
    // 验证值
    returnMsg(name, value) {
      let infoObj = this.ruleData[name];
      let error = ""; // 错误信息
      if (infoObj.mustFill) {
        if (value == "" || value === undefined || value === null) {
          error = "必填项，不能为空";
        }
      } else {
        if (value == "" || value === undefined || value === null) {
          error = "";
        }
      }
      if (infoObj.regular.length > 0) {
        for (let i = 0; i < infoObj.regular.length; i += 1) {
          const { rule, message } = infoObj.regular[i];
          const reg = new RegExp(rule);
          if (!reg.test(value)) {
            error = message;
          } else {
            if (infoObj.urlSuffix) {
              this.urlRules(infoObj.urlSuffix, infoObj, name);
            }
          }
        }
      }
      return error;
    },
    ruleMessge(e) {
      let name = e.target.name;
      let val = e.target.value;
      this.errorMsg[name] = this.returnMsg(name, val);
    },
    // 获取验证信息
    rulesForm() {
      requestUrl
        .getList(
          "/manage/regularConfig/getRegularByServer",
          { serverName: "order/projConclusion" },
          "soa"
        )
        .then(res => {
          if (res.data.code === 200) {
            this.ruleData = res.data.data;
          } else {
            this.$toast(res.data.message);
          }
        });
    },

    // 获取主借人和配偶的姓名
    getProviderList(val) {
      getProvider({
        provider: val,
        projectId: this.params.projectId
      }).then(res => {
        let arr = [];
        if(res.data) {
          let list = Array.isArray(res.data)?res.data:[res.data];
          list.forEach(t => {
            arr.push({
              label: t.customerName,
              value: t.customerName,
            });
          });
        }
        this.providerList = arr;
      });
    },
    // 获取担保人和配偶的姓名
    getProviderSecurityList(val) {
      getProviderSecurity({
        provider: val,
        projectId: this.params.projectId
      }).then(res => {
        let arr = [];
        if(res.data) {
          let list = Array.isArray(res.data)?res.data:[res.data];
          list.forEach(t => {
            arr.push({
              label: t.customerName,
              value: t.customerName,
            });
          });
        }
        this.providerList = arr;
      });
    }

  },
  mounted() {
    this.params = this.$route.query;
    // this.loadData();
  }
};
</script>

<style lang="scss">
.xh-right-icon {
  .van-icon {
    color: rgb(196, 37, 42);
  }
}
</style>

