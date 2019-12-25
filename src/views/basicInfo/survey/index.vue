<template>
  <ViewPage :loading="loading">
    <div class="xh-page-body">
      <van-row class="xh-card-box xh-radius">
        <van-col :span="24">
          <van-cell-group :border="false">
            <van-cell
              title="首付款是否为自有资金："
              required
              :is-link="isView"
              label-class="labelClass"
              @blur.prevent="ruleMessge"
              :label="errorMsg.paymentOwnCapital"
              :value="ruleForm.paymentOwnCapitalDesc"
              :border="false"
              @click.native="!isView?'':loadList('首付款是否为自有资金','yes_no')"
            />
            <van-cell
              title="是否清楚车价："
              required
              :is-link="isView"
              :border="false"
              label-class="labelClass"
              @blur.prevent="ruleMessge"
              :label="errorMsg.clearCarPrice"
              :value="ruleForm.clearCarPriceDesc"
              @click.native="!isView?'':loadList('是否清楚车价','yes_no')"
            />
            <van-cell
              title="是否有驾驶证："
              required
              :is-link="isView"
              :border="false"
              label-class="labelClass"
              @blur.prevent="ruleMessge"
              :label="errorMsg.driveLicence"
              :value="ruleForm.driveLicenceDesc"
              @click.native="!isView?'':loadList('是否有驾驶证','yes_no')"
            />
            <van-cell
              title="调查中是否有陪同："
              required
              :is-link="isView"
              :border="false"
              label-class="labelClass"
              @blur.prevent="ruleMessge"
              :label="errorMsg.accompany"
              :value="ruleForm.accompanyDesc"
              @click.native="!isView?'':loadList('调查中是否有陪同','yes_no')"
            />
            <van-cell
              title="是否人车匹配："
              required
              :is-link="isView"
              label-class="labelClass"
              @blur.prevent="ruleMessge"
              :label="errorMsg.match"
              :value="ruleForm.matchDesc"
              :border="false"
              @click.native="!isView?'':loadList('是否人车匹配','yes_no')"
            />
            <van-cell
              title="是否涉及消费返利："
              required
              :is-link="isView"
              label-class="labelClass"
              @blur.prevent="ruleMessge"
              :label="errorMsg.involveConsumeRebate"
              :border="false"
              :value="ruleForm.involveConsumeRebateDesc"
              @click.native="!isView?'':loadList('是否涉及消费返利','yes_no')"
            />
            <div v-show="isquick">
              <van-row v-if="isView">
                <van-col
                  :span="24"
                  class="xh-submit xh-text-right"
                  style="margin-top: 0;padding:10px;"
                >
                  <van-button
                    type="danger"
                    size="small"
                    :disabled="scbgDisabled"
                    @click.native="scbgComit"
                  >生成调查报告</van-button>
                </van-col>
              </van-row>
              <van-field
                v-model="ruleForm.houseReport"
                required
                label="借款人信息及房产报告："
                placeholder="自动生成,无需填写"
                label-width="100px"
                type="textarea"
                rows="1"
                :border="false"
                :disabled="!isView"
                disabled
                autosize
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.houseReport"
                error-message-align="right"
              />
              <van-field
                v-model="ruleForm.responseReport"
                required
                label="借款人收入负债报告："
                placeholder="自动生成,无需填写"
                label-width="100px"
                type="textarea"
                rows="1"
                :border="false"
                :disabled="!isView"
                disabled
                autosize
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.responseReport"
                error-message-align="right"
              />
              <van-field
                v-model="ruleForm.gnrHsptyAndIncmRpt"
                required
                label="担保人房产及收入报告："
                placeholder="自动生成,无需填写"
                label-width="100px"
                type="textarea"
                rows="1"
                :border="false"
                :disabled="!isView"
                autosize
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.gnrHsptyAndIncmRpt"
                error-message-align="right"
              />
            </div>
            <van-field
              v-model="ruleForm.inveInfo"
              required
              label="调查意见情况："
              placeholder="请输入意见情况"
              type="textarea"
              rows="1"
              autosize
              :border="false"
              :disabled="!isView"
              input-align="right"
              label-width="100px"
              @blur.prevent="ruleMessge"
              :error-message="errorMsg.inveInfo"
              error-message-align="right"
            />
            <van-field
              v-model="ruleForm.infoDetail"
              required
              label="差资料明细："
              placeholder="请输入差资料明细"
              type="textarea"
              rows="1"
              :border="false"
              :disabled="!isView"
              input-align="right"
              label-width="100px"
              autosize
              @blur.prevent="ruleMessge"
              :error-message="errorMsg.infoDetail"
              error-message-align="right"
            />
            <van-cell
              title="实际调查地址："
              required
              :is-link="isView"
              v-model="ruleForm.actSurvyAdr"
              :border="false"
              @click="!isView?'':popaddress('实际调查地址')"
              label-class="labelClass"
              @blur.prevent="ruleMessge"
              :label="errorMsg.actSurvyAdr"
            />
            <van-cell
              title="购车用途："
              :is-link="isView"
              :value="ruleForm.carUseDesc"
              :border="false"
              @click.native="!isView?'':loadList('购车用途','car_use')"
            />
            <van-cell
              title="上户地："
              required
              :is-link="isView"
              v-model="ruleForm.upAccLnd"
              :border="false"
              @click="!isView?'':popaddress('上户地')"
              label-class="labelClass"
              @blur.prevent="ruleMessge"
              :label="errorMsg.upAccLnd"
            />
            <van-cell
              title="提供人："
              :required="bankWaterFlag"
              :is-link="isView"
              :value="ruleForm.providerDesc"
              :border="false"
              :disabled="!isView"
              @click.native="!isView?'':loadList('提供人','provider_type')"
            />
            <van-cell
              title="姓名："
              :required="bankWaterFlag"
              :is-link="isView"
              :value="ruleForm.providerName"
              :border="false"
              @click.native="!isView?'':loadList('姓名','1')"
              :disabled="!isView"
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
              :is-link="isView"
              :border="false"
              :disabled="!isView"
              v-model="ruleForm.jrnlDateStart"
              @click="!isView?'':showPopupTime('流水开始日期','jrnlDateStart')"
              label-class="labelClass"
              @blur.prevent="ruleMessge"
              :label="errorMsg.jrnlDateStart"
            />
            <van-cell
              title="流水截止日期："
              :required="bankWaterFlag"
              :is-link="isView"
              :border="false"
              :disabled="!isView"
              v-model="ruleForm.jrnlDateEnd"
              @click="!isView?'':showPopupTime('流水截止日期','jrnlDateEnd')"
              label-class="labelClass"
              @blur.prevent="ruleMessge"
              :label="errorMsg.jrnlDateEnd"
            />
            <van-field
              v-model="ruleForm.cardNumber"
              clearable
              :required="bankWaterFlag"
              input-align="right"
              label="银行卡号："
              :disabled="!isView"
              :right-icon="!isView?'':'photograph'"
              placeholder="请输入卡号"
              class="xh-right-icon"
              @click-right-icon="OCRScan"
            />
          </van-cell-group>
        </van-col>
      </van-row>
      <!-- 保 存按钮 -->
      <div class="xh-submit" v-if="isView">
        <van-button
          size="large"
          class="xh-bg-main"
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
    <!-- 图片选择方式 -->
    <van-action-sheet v-model="show3" :actions="actions" @select="onSelect" />

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
import { format } from "@/utils/format";
// 校验
import formValidator from "@/mixins/formValidator";
import {
  getSurveyInfo,
  getProvider,
  getProviderSecurity,
  getCheckReport,
  setSurvey
} from "@/api/client";
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
import { isArray } from "util";
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
  mixins: [formValidator],
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
      isView: false,
      loading: false, // loading
      isQuickadjust: "", //是否快提快调
      title2: "",
      actSurvyAdrCode: "",
      upAccLndCode: "",
      // rules: rules, //验证 方法
      columns: [], //待选择列表
      errorMsg: {
        paymentOwnCapital: "",
        clearCarPrice: "",
        driveLicence: "",
        accompany: "",
        match: "",
        involveConsumeRebate: "",
        houseReport: "",
        responseReport: "",
        gnrHsptyAndIncmRpt: "",
        inveInfo: "",
        infoDetail: "",
        actSurvyAdr: "",
        upAccLnd: ""
        // jrnlCardno: '',
        // providerPhone: '',
        // debitCardAccountName: '',
        // provider: '',
        // providerName: '',
        // upAccLndId: '',
        // providerIdCard: '',
        // carUse: '',
        // debitCardAccount: '',
        // jrnlDateEnd: '',
        // debitCardCertificateNo: '',
        // debitCardBoundPhone: '',
        // actSurvyAdrId: '',
        // jrnlDateStart: '',
        // debitCardBank: ''
      },

      bankWaterFlag: false, // 流水是否必填
      selectShow: false, //下拉选择器显示
      pickerTitle: "", //下拉列表title

      scbgDisabled: false, //按钮禁用状态

      subDisabled: false, //按钮禁用状态

      currentDate: new Date(),
      popupShow3: false, //时间选择器
      popTimeType: "", //时间类型
      isquick: true, //生成报告是否显示
      ruleData: {},

      ruleForm: {
        accompany: "",
        actSurvyAdr: "",
        carUse: "",
        clearCarPrice: "",
        paymentOwnCapital: "",
        gnrHsptyAndIncmRpt: "",
        houseReport: "",
        infoDetail: "",
        inveInfo: "",
        involveConsumeinvolveConsumeRebate: "",
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
      addressShow: false,
      providerList: [], // 提供人
      show3: false,
      actions: [
        { name: "相机扫描识别", value: "scan" },
        { name: "相册导入识别", value: "album" }
      ]
    };
  },
  methods: {
    OCRScan() {
      this.show3 = true;
    },
    onSelect(rows) {
      this.$bridge.callHandler("bankCodeOCR", rows.value, res => {
        this.$set(this.ruleForm, "cardNumber", data.BANK_NUM);
      });
    },
    // 字典转换
    returnText(n, val) {
      let name;
      this.wordbook[n].forEach(e => {
        if (e.value == val) {
          name = e.label;
        }
      });
      return name;
    },
    loadData() {
      this.loading = true;
      getSurveyInfo({
        projectId: this.params.projectId,
        customerId: this.params.customerId
      })
        .then(res => {
          const { projConclusion } = res.data;
          this.isQuickadjust = projConclusion.isQuickadjust;
          this.ruleForm = projConclusion;
          this.ruleForm.paymentOwnCapitalDesc = this.returnText(
            "yes_no",
            projConclusion.paymentOwnCapital
          );
          this.ruleForm.clearCarPriceDesc = this.returnText(
            "yes_no",
            projConclusion.clearCarPrice
          );
          this.ruleForm.driveLicenceDesc = this.returnText(
            "yes_no",
            projConclusion.driveLicence
          );
          this.ruleForm.accompanyDesc = this.returnText(
            "yes_no",
            projConclusion.accompany
          );
          this.ruleForm.matchDesc = this.returnText(
            "yes_no",
            projConclusion.match
          );
          this.ruleForm.involveConsumeRebateDesc = this.returnText(
            "yes_no",
            projConclusion.involveConsumeRebate
          );
          this.ruleForm.carUseDesc = this.returnText(
            "car_use",
            projConclusion.carUse
          );
          this.ruleForm.providerDesc = this.returnText(
            "provider_type",
            projConclusion.provider
          );
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    loadList(val, name) {
      this.pickerTitle = val;
      if (name == "1") {
        if (this.providerList.length == 0) return;
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
          this.ruleForm.paymentOwnCapital = rows.value;
          this.ruleForm.paymentOwnCapitalDesc = rows.label;
          break;
        case "是否清楚车价":
          this.ruleForm.clearCarPrice = rows.value;
          this.ruleForm.clearCarPriceDesc = rows.label;
          break;
        case "是否有驾驶证":
          this.ruleForm.driveLicence = rows.value;
          this.ruleForm.driveLicenceDesc = rows.label;
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
          this.ruleForm.involveConsumeRebate = rows.value;
          this.ruleForm.involveConsumeRebateDesc = rows.label;
          break;
        case "购车用途":
          this.ruleForm.carUse = rows.value;
          this.ruleForm.carUseDesc = rows.label;
          break;
        case "提供人":
          this.ruleForm.provider = rows.value;
          this.ruleForm.providerDesc = rows.label;
          if (rows.value == "borrower" || rows.value == "borrowerSpouse") {
            this.getProviderList(rows.value);
          } else {
            this.getProviderSecurityList(rows.value);
          }
          break;
        case "姓名":
          this.ruleForm.providerName = rows.label;
          this.ruleForm.providerIdCard = rows.certificateNum;
          this.ruleForm.providerPhone = rows.contactPhone;
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
        case "实际调查地址":
          this.ruleForm.actSurvyAdr = name;
          this.ruleForm.actSurvyAdrCode = code;
          break;
        case "上户地":
          this.ruleForm.upAccLnd = name;
          this.ruleForm.upAccLndCode = code;
          break;

        default:
          break;
      }
      this.addressShow = false;
    },
    //显示时间弹框
    showPopupTime(title, type) {
      this.title2 = title;
      this.popTimeType = type;
      this.popupShow3 = true;
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
      var time = format(new Date(value));
      this.ruleForm[this.popTimeType] = time;
      this.popupShow3 = false;
    },
    cancelTime() {
      this.popupShow3 = false;
    },
    // 生成调查报告
    scbgComit() {
      this.scbgDisabled = true;
      getCheckReport({
        projectId: this.params.projectId,
        customerId: this.params.customerId
      })
        .then(res => {
          let { data } = res;
          this.ruleForm.houseReport = data.houseReport; //借款人信息及房产报告
          this.ruleForm.responseReport = data.responseReport; //借款人收入负债报告
          this.ruleForm.gnrHsptyAndIncmRpt = data.gnrHsptyAndIncmRpt; //担保人房产及收入报告
          this.scbgDisabled = false;
        })
        .catch(() => {
          this.scbgDisabled = false;
        });
    },
    // 保存调查报告
    submitWay() {
      let num = 0;
      for (let item in this.errorMsg) {
        this.errorMsg[item] = this.returnMsg(item, this.ruleForm[item]);
        if (this.errorMsg[item]) {
          num++;
        }
      }
      if (num !== 0) {
        return;
      }
      setSurvey(this.ruleForm)
        .then(res => {
          this.$notify({
            type: "success",
            message: res.msg
          });
          this.subDisabled = false;
          this.loadData();
        })
        .catch(() => {
          this.subDisabled = false;
        });
    },
    custSubmit() {
      this.subDisabled = true;
      this.submitWay();
    },

    // 获取主借人和配偶的姓名
    getProviderList(val) {
      getProvider({
        provider: val,
        projectId: this.params.projectId
      }).then(res => {
        let arr = [];
        if (res.data) {
          let list = Array.isArray(res.data) ? res.data : [res.data];
          list.forEach(t => {
            arr.push({
              label: t.customerName,
              value: t.customerName,
              certificateNum: t.certificateNum,
              contactPhone: t.contactPhone
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
        if (res.data) {
          let list = Array.isArray(res.data) ? res.data : [res.data];
          list.forEach(t => {
            arr.push({
              label: t.customerName,
              value: t.customerName,
              certificateNum: t.certificateNum,
              contactPhone: t.contactPhone
            });
          });
        }
        this.providerList = arr;
      });
    }
  },
  mounted() {
    this.params = this.$route.query;
    this.isView = this.params.isView == 0;
    this.loadData();
    this.rulesForm("order/projConclusion");
  }
};
</script>

