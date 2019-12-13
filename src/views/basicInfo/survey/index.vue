<template>
  <div>
    <ViewPage>
      <van-row class="xh-card-box xh-radius">
        <van-col :span="24">
          <van-cell-group :border="false">
            <van-cell
              title="首付款是否为自有资金："
              required
              is-link
              :value="firstFunds"
              :border="false"
              @click.native="loadList('首付款是否为自有资金')"
            />
            <van-cell
              title="是否清楚车价："
              required
              is-link
              :border="false"
              :value="clearCarPrice"
              @click.native="loadList('是否清楚车价')"
            />
            <van-cell
              title="是否有驾驶证："
              required
              is-link
              :border="false"
              :value="drivingLicense"
              @click.native="loadList('是否有驾驶证')"
            />
            <van-cell
              title="调查中是否有陪同："
              required
              is-link
              :border="false"
              :value="accompany"
              @click.native="loadList('调查中是否有陪同')"
            />
            <van-cell
              title="是否人车匹配："
              required
              is-link
              :value="match"
              :border="false"
              @click.native="loadList('是否人车匹配')"
            />
            <van-cell
              title="是否涉及消费返利："
              required
              is-link
              :border="false"
              :value="rebate"
              @click.native="loadList('是否涉及消费返利')"
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
                v-model="realEstateReport"
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
                v-model="debtReport"
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
                v-model="incomeReport"
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
              v-model="surveyOpinion"
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
              v-model="dataDetailed"
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
              v-model="investAddress"
              :border="false"
              @click="popaddress('investAddress')"
            />
            <van-cell
              title="购车用途："
              is-link
              :value="carUse"
              :border="false"
              @click.native="loadList('购车用途')"
            />
            <van-cell
              title="上户地："
              required
              is-link
              v-model="homeLand"
              :border="false"
              @click="popaddress('homeLand')"
            />
            <van-cell
              title="提供人："
              :required="bankWaterFlag"
              is-link
              :value="providerDesc"
              :border="false"
              @click.native="loadList('提供人')"
            />
            <van-cell
              title="姓名："
              :required="bankWaterFlag"
              is-link
              :value="providerName"
              :border="false"
              @click.native="loadList('姓名')"
              :disabled="providerNameable"
            />
            <van-field
              v-model="providerPhone"
              :required="bankWaterFlag"
              label="手机号："
              input-align="right"
              :disabled="true"
              :border="false"
            />
            <van-field
              v-model="providerIdCard"
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
              v-model="jrnlDateStart"
              @click="showPopupTime('jrnlDateStart')"
            />
            <van-cell
              title="流水截止日期："
              :required="bankWaterFlag"
              is-link
              :border="false"
              v-model="jrnlDateEnd"
              @click="showPopupTime('jrnlDateEnd')"
            />
            <van-field
              v-model="cardNumber"
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
      <!-- 下拉选择器 -->
      <van-action-sheet v-model="selectShow" class="xh-list">
        <van-picker
          show-toolbar
          :title="pickerTitle"
          :columns="columns"
          @cancel="onCancel"
          @confirm="onConfirm"
        />
      </van-action-sheet>
      <!-- 弹出省市区 -->
      <van-action-sheet v-model="popupShow2" title class="xh-list">
        <div class="xh-list-body">
          <van-area :area-list="areaList" @confirm="confirmSelect" @cancel="cancelSelect" />
        </div>
      </van-action-sheet>
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
  </div>
</template>

<script>
import Vue from "vue";
// 自定义组件
import ViewPage from "@/layout/components/ViewPage";
import Card from "@/components/card/index";
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
    ViewPage
  },
  data() {
    return {
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
      ruleData: {}
    };
  },
  methods: {
    OCRScan() {
      bridge.callhandler("OCRScan", "0", data => {
        this.$set(this, "cardNumber", data.BANK_NUM);
      });
    },
    loadData() {
      requestUrl
        .getList("/carloan/projProjectInfo/getProjConclusion", {
          projectId: this.projectId,
          customerId: this.customerId
        })
        .then(res => {
          if (res.data.code == "SYS.200") {
            let { data } = res.data;
            this.id = data.id;
            this.firstFunds = this.changeCode(data.paymentOwnCapital, false); // 首付款是否为自有资金
            this.clearCarPrice = this.changeCode(data.clearCarPrice, false); // //是否清楚车价
            this.drivingLicense = this.changeCode(data.driveLicence, false); // 是否有驾驶证
            this.accompany = this.changeCode(data.accompany, false); // 是否有陪同
            this.match = this.changeCode(data.selfUsecar, false); // 是否人车匹配
            this.rebate = this.changeCode(data.involveConsumeRebate, false); // 是否涉及消费返利
            this.realEstateReport = data.houseReport; // 借款人信息及房产报告
            this.debtReport = data.responseReport; // 借款人收入负债报告
            this.incomeReport = data.gnrHsptyAndIncmRpt; // 担保人房产及收入报告
            this.surveyOpinion = data.inveInfo; // 调查意见情况
            this.dataDetailed = data.infoDetail; // 差资料明细
            this.investAddress = data.actSurvyAdr; // 实际调查地址
            this.actSurvyAdrCode = data.actSurvyAdrCode;
            this.upAccLndCode = data.upAccLndCode;
            this.cardNumber = data.jrnlCardno; // 流水卡号
            this.homeLand = data.upAccLnd; // 上户地
            this.flowDate = data.jrnlDate; // 流水日期起止
            this.jrnlDateStart = data.jrnlDateStart; //开始时间
            this.jrnlDateEnd = data.jrnlDateEnd; //结束时间
            this.provider = data.provider; //提供人表示
            this.providerDesc = subParame("credit_object_type", this.provider); //提供人
            this.providerName = data.providerName;
            this.providerIdCard = data.providerIdCard;
            this.providerPhone = data.providerPhone;
            (this.carUse = this.carDes(data.carUse, false)), // 购车用途code
              (this.isQuickadjust = data.isQuickadjust); //是否快提快调
            //是否快提快调
            if (data.isQuickadjust == 1) {
              this.isquick = false;
            } else {
              this.isquick = true;
            }
            //流水是否必填
            if (data.bankWaterFlag == 1) {
              this.bankWaterFlag = true;
            } else {
              this.bankWaterFlag = false;
            }
          } else {
            this.$toast({
              position: "top",
              message: "数据获取失败，" + res.data.message
            });
          }
        })
        .catch(function(error) {});
      //提供人信息
      requestUrl
        .postList("/carloan/projProjectInfo/searchProvider", {
          projectId: this.projectId
        })
        .then(res => {
          if (res.code == "SYS.200") {
            console.log("providerObj", res.data);
            this.providerObj = res.data;
          } else {
          }
        })
        .catch(function(error) {});
    },

    loadList(val) {
      switch (val) {
        case "首付款是否为自有资金":
          this.columns = this.whetherList;
          this.pickerTitle = "首付款是否为自有资金";
          break;
        case "是否清楚车价":
          this.columns = this.whetherList;
          this.pickerTitle = "是否清楚车价";
          break;
        case "是否有驾驶证":
          this.columns = this.whetherList;
          this.pickerTitle = "是否有驾驶证";
          break;
        case "调查中是否有陪同":
          this.columns = this.whetherList;
          this.pickerTitle = "调查中是否有陪同";
          break;
        case "是否人车匹配":
          this.columns = this.whetherList;
          this.pickerTitle = "是否人车匹配";
          break;
        case "是否涉及消费返利":
          this.columns = this.whetherList;
          this.pickerTitle = "是否涉及消费返利";
          break;
        case "购车用途":
          this.columns = this.carUseList;
          this.pickerTitle = "购车用途";
          break;
        case "提供人":
          this.columns = this.providerList;
          this.pickerTitle = "提供人";
          break;
        case "姓名":
          // if (this.providerNameable == true) {
          //   return
          // } else {
          var namelist = [];
          if (
            this.provider == "borrower" &&
            this.providerObj.borrower != null
          ) {
            namelist.push({
              text: this.providerObj.borrower.customerName,
              key: "borrower"
            });
          } else if (
            this.provider == "borrowerSpouse" &&
            this.providerObj.borrowerSpouse != null
          ) {
            namelist.push({
              text: this.providerObj.borrowerSpouse.customerName,
              key: "borrowerSpouse"
            });
          } else if (this.provider == "security") {
            this.providerObj.security.forEach(e => {
              namelist.push({ text: e.customerName, key: "security" });
            });
          } else if (this.provider == "securitySpouse") {
            this.providerObj.securitySpouse.forEach(e => {
              namelist.push({ text: e.customerName, key: "securitySpouse" });
            });
          }
          this.columns = namelist;
          this.pickerTitle = "姓名";
          // }

          break;
      }
      this.selectShow = true;
    },
    onConfirm(value, index) {
      this.selectShow = false;
      switch (this.pickerTitle) {
        case "首付款是否为自有资金":
          this.firstFunds = value;
          break;
        case "是否清楚车价":
          this.clearCarPrice = value;
          break;
        case "是否有驾驶证":
          this.drivingLicense = value;
          break;
        case "调查中是否有陪同":
          this.accompany = value;
          break;
        case "是否人车匹配":
          this.match = value;
          break;
        case "是否涉及消费返利":
          this.rebate = value;
          break;
        case "购车用途":
          this.carUse = value;
          break;
        case "提供人":
          this.provider = value.key;
          this.providerDesc = value.text;
          this.providerName = "";
          this.providerIdCard = "";
          this.providerPhone = "";
          if (value.key == "borrower") {
            this.providerNameable = true;
            this.providerName = this.providerObj.borrower.customerName;
            this.providerIdCard = this.providerObj.borrower.certificateNum;
            this.providerPhone = this.providerObj.borrower.contactPhone;
          } else if (value.key == "borrowerSpouse") {
            this.providerNameable = true;
            this.providerName = this.providerObj.borrowerSpouse.customerName;
            this.providerIdCard = this.providerObj.borrowerSpouse.certificateNum;
            this.providerPhone = this.providerObj.borrowerSpouse.contactPhone;
          } else if (
            value.key == "security" &&
            this.providerObj.security.length == 1
          ) {
            this.providerNameable = false;
            this.providerName = this.providerObj.security[0].customerName;
            this.providerIdCard = this.providerObj.security[0].certificateNum;
            this.providerPhone = this.providerObj.security[0].contactPhone;
          } else if (
            value.key == "securitySpouse" &&
            this.providerObj.securitySpouse.length == 1
          ) {
            this.providerNameable = false;
            this.providerName = this.providerObj.securitySpouse[0].customerName;
            this.providerIdCard = this.providerObj.securitySpouse[0].certificateNum;
            this.providerPhone = this.providerObj.securitySpouse[0].contactPhone;
          }
          break;
        case "姓名":
          this.providerName = value.text;
          if (value.key == "security") {
            this.providerIdCard = this.providerObj.security[
              index
            ].certificateNum;
            this.providerPhone = this.providerObj.security[index].contactPhone;
          } else if (value.key == "securitySpouse") {
            this.providerIdCard = this.providerObj.securitySpouse[
              index
            ].certificateNum;
            this.providerPhone = this.providerObj.securitySpouse[
              index
            ].contactPhone;
          }
          break;
      }
    },
    onCancel() {
      this.selectShow = false;
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
    // 省市区选择
    addressList() {
      this.areaList.province_list = province;
      this.areaList.city_list = city;
      this.areaList.county_list = area;
    },
    confirmSelect(list) {
      let name = [];
      let addId = [];
      let a1, a2, a3;
      list.forEach(e => {
        if (e != undefined) {
          name.push(e.name);
          addId.push(e.code);
        }
      });
      if (addId.length > 2 || addId.length === 2) {
        a2 = realCity(name[1]);
      }
      a1 = addId[0];
      a3 = addId[2];
      switch (this.addressType) {
        case "investAddress":
          this.actSurvyAdrCode =
            a1 + (a2 ? "-" + a2 : "") + (a3 ? "-" + a3 : "");
          this.investAddress = name.join("-");
          break;
        case "homeLand":
          this.upAccLndCode = a1 + (a2 ? "-" + a2 : "") + (a3 ? "-" + a3 : "");
          this.homeLand = name.join("-");
          break;
        default:
      }
      this.popupShow2 = false;
    },
    popaddress(des) {
      this.popupShow2 = true;
      this.addressType = des;
    },
    cancelSelect() {
      this.popupShow2 = false;
    },
    scbgComit() {
      // 生成调查报告
      this.scbgLoading = true;
      this.scbgDisabled = true;
      setTimeout(() => {
        this.scbgLoading = false;
        this.scbgDisabled = false;
      }, 1000);
      requestUrl
        .getList("/carloan/projProjectInfo/createCheckReportMob", {
          projectId: this.projectId
        })
        .then(res => {
          if (res.data.code === "SYS.200") {
            let { data } = res.data;
            this.realEstateReport = data.houseReport; //借款人信息及房产报告
            this.debtReport = data.responseReport; //借款人收入负债报告
            this.incomeReport = data.gnrHsptyAndIncmRpt; //担保人房产及收入报告
          } else {
            this.$toast(res.data.message);
          }
        });
    },
    changeCode(str, flag = true) {
      // 改变是否的编码
      if (flag) {
        return str === "是" ? 1 : 0;
      }
      return str * 1 === 1 ? "是" : "否";
    },
    changePeopleCode(str, flag = true) {
      // 改变提供人的code
      if (flag) {
        // return str === '本人' ? 'oneself' : 'spouse'
        return str ? (str === "本人" ? "oneself" : "spouse") : "";
      }
      return str === "oneself" ? "本人" : str === "spouse" ? "配偶" : "";
    },
    carDes(val, flag = true) {
      if (flag == false) {
        switch (val) {
          case "01":
            return "自用";
            break;
          case "02":
            return "营运";
            break;
          case "03":
            return "抵债";
            break;
          case "04":
            return "外省用车";
            break;
          case "05":
            return "二手车套现";
            break;
        }
      }
      switch (val) {
        case "自用":
          return "01";
          break;
        case "营运":
          return "02";
          break;
        case "抵债":
          return "03";
          break;
        case "外省用车":
          return "04";
          break;
        case "二手车套现":
          return "05";
          break;
      }
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
    }
  },
  mounted() {
    // let params = commonFun.urlParam(location.search);
    // this.projectId = params.projectId;
    // this.customerId = params.customerId;
    // token = params.token;
    // publicData();
    // this.loadData(); // 初始化数据
    // this.rulesForm();
    // this.addressList();
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

