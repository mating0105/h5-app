<template>
  <ViewPage :loading="loading">
    <template v-slot:head>
      <van-tabs v-model="active">
        <van-tab title="基本信息"></van-tab>
        <van-tab title="征信信息"></van-tab>
        <van-tab title="操作记录"></van-tab>
      </van-tabs>
    </template>
    <template v-if="active === 0 && dataList.id">
      <basicReplyInfo
        :dataList="dataList"
        :edit="true"
        :form="form"
        :perInfoList="perInfoList"
        :buttonId="buttonId"
        :hiddenHandle="true"
        :showTypes="true"
        :thisCreditType="thisCreditType"
        :creditTypeList="creditTypeList"
        :isShowTitle = 'true'
      ></basicReplyInfo>
    </template>
    <template v-else-if="active === 1">
      <!-- 百融 -->
      <creditQueryInfo
        v-if="thisCreditType === '6'"
        @lookDocs="lookDocs"
        title="大数据征信查询信息"
        :credit100Result="dataList.credit100Result"
        :dataList="dataList.surDtlList"
        type="bigDataResult"
      ></creditQueryInfo>
      <div v-else-if="thisCreditType != '6' && creditHistoryList.length >0">
        <collapsBox label="大数据征信查询信息" :creditList="creditHistoryList" :changeitem="changeitem">
          <template>
            <basicReplyInfo
              :dataList="dataList"
              :edit="false"
              :form="form"
              :perInfoList="perInfoList"
              :buttonId="buttonId"
              :hiddenHandle="true"
              :showTypes="false"
              :thisCreditType="thisCreditType"
              :creditTypeList="creditTypeList"
              :isShowTitle = 'false'
            ></basicReplyInfo>
          </template>
        </collapsBox>
      </div>
      <div v-else>
        <van-divider>暂无征信记录</van-divider>
      </div>
    </template>
    <template v-else-if="active === 2">
      <approvalRecord :requestParams="recordParams"></approvalRecord>
    </template>
  </ViewPage>
</template>

<script>
import ViewPage from "@/layout/components/ViewPage";
import Card from "@/components/card";
import NewCard from "@/components/card/newCard";
import creditInfoTable from "../viewCompoents/creditInfoTable";
import creditQueryInfo from "../viewCompoents/creditQueryInfo";
import relatedDocs from "@/views/relatedDocs/relatedDocs";
import approvalRecord from "@/views/basicInfo/approvalRecord";
import formValidator from "@/mixins/formValidator";
import imageList from "@/components/imageList";
import { getValue, setValue, removeValue } from "@/utils/session";
import { getDocumentByType } from "@/api/document";
import basicReplyInfo from "../bigDataQuery/rbBasicReply";
import { format } from "@/utils/format";
import radio from "@/components/radio";
import radioItem from "@/components/radio/radioItem";
import collapsBox from "@/components/collapseBox/index";
import Vue from "vue";
import {
  getCreditDetail,
  setBookObj,
  getByServer,
  saveCreditInfo,
  createTask,
  getUsers,
  submitCredit,
  creditQueryOf100,
  getCreditHistory
} from "@/api/credit";
import Bus from "@/utils/bus";
import {
  Cell,
  CellGroup,
  Field,
  Icon,
  Button,
  Picker,
  Popup,
  Toast,
  Notify,
  SwipeCell,
  Dialog,
  Tab,
  Tabs,
  ActionSheet,
  Collapse,
  CollapseItem,
  Divider
} from "vant";

const Components = [
  Cell,
  CellGroup,
  Field,
  Icon,
  Button,
  Picker,
  Popup,
  Toast,
  Notify,
  SwipeCell,
  Dialog,
  Tab,
  Tabs,
  ActionSheet,
  Collapse,
  CollapseItem,
  Divider
];
Components.forEach(item => {
  Vue.use(item);
});

export default {
  mixins: [formValidator],
  components: {
    ViewPage,
    Card,
    NewCard,
    creditInfoTable,
    creditQueryInfo,
    relatedDocs,
    approvalRecord,
    imageList,
    radio,
    radioItem,
    basicReplyInfo,
    collapsBox
  },
  data() {
    return {
      active: 0,
      dataList: {
        investigateBank: "",
        investigateBankName: "",
        isInternetCredit: "",
        surDtlList: [],
        creditSearchType: "",
        creditSearchTypeDesc: ""
      },
      creditSearchTypeDesc: "",
      creditSearchType: "",
      loading: false,
      edit: false,
      form: {},
      perInfoList: [],
      recordParams: {
        businesskey: "",
        businessType: "07"
      },
      buttonId: "",
      thisCreditType: "", //征信查询方式  5人工 6百融
      creditTypeList: [], //征信查询数组
      showCreditTime: true, //卡片（显示时间）
      showCreditSign: true, //卡片（显示标签）
      creditSign: "通过",
      creditHistoryList: []
    };
  },
  computed: {
    // 所有字典
    wordbook() {
      return this.$store.state.user.wordbook;
    }
  },
  methods: {
    //加载数据
    async loadData() {
      this.loading = true;
      let data, res;
      let datalist = {
        buttonId: 3,
        lpCertificateNum: this.params.info.certificateNum
      };
      if (this.thisCreditType == "6") {
        res = await creditQueryOf100(datalist);
      } else {
        res = await getCreditDetail(datalist);
      }
      data = res.data;
      this.thisCreditType = data.creditSearchType;
      this.sign = data.standardCreditStatus;
      this.time = data.registerDate;
      data.surDtlList.forEach(e => {
        e.dataList = [];
        if (e.creditObjectType === "borrower") {
          this.form = e;
          this.form.investigateDate = format(new Date(), "yyyy-MM-dd hh:mm");
        } else {
          e.investigateDate = format(new Date(), "yyyy-MM-dd hh:mm");
          e.creditList = [];
          this.perInfoList.push(e);
        }
      });
      this.dataList = data;
      this.dataList.creditSearchTypeDesc = this.creditSearchTypeDesc;
      this.dataList.creditSearchType = this.creditSearchType;
      this.recordParams.businesskey = this.dataList.id;
      console.log(this.dataList.id,8888)
      this.initCustomerData();
      this.loading = false;
    },
    //加载历史数据
    async loadHistory() {
      let datalist = {
        creditType: this.params.info.creditType,
        lpCertificateNum: this.params.info.certificateNum
      };
      let res = await getCreditHistory(datalist);
      let arr = [];
      arr = res.data;
      arr.forEach(e => {
        e.label = "大数据征信查询信息";
        e.showSign = true;
        e.showTime = true;
        if (
          e.status == "02" ||
          e.status == "03" ||
          e.status == "05" ||
          e.status == "06"
        ) {
          e.signColor = "#E60000";
        } else if (e.status == "04") {
          e.signColor = "#00C67C";
        } else if (e.status == "01") {
          e.signColor = "#999";
        }
      });
      this.creditHistoryList = arr;
    },
    initCustomerData() {
      let customerData = this.$store.state.credit.customerData;
      if (customerData) {
        const index = this.$store.state.credit.index;
        customerData = this.enFormatter(customerData);
        if (index === -1) {
          this.perInfoList.push(customerData);
          this.data.surDtlList.push(customerData);
        } else {
          const perInfo = this.perInfoList[index];
          if (perInfo) {
            for (let key in customerData) {
              if (customerData.hasOwnProperty(key)) {
                perInfo[key] = customerData[key] || perInfo[key];
              }
            }
          }
        }
        this.$store.dispatch("credit/removeCustomerData");
      }
    },
    enFormatter(beanData) {
      return {
        sex: beanData.sex, //性别
        creditPersonName: beanData.customerName, //客户姓名
        cpCertificateNum: beanData.certificateNum, //身份证号码
        age: beanData.age, //年龄
        creditObjectType: beanData.creditObjectType, //征信对象类型
        creditObjectRelation: beanData.creditObjectRelation, //征信对象类型
        perInfo: {
          nationName: beanData.nationName, //民族
          nation: beanData.nation, //民族
          birthday: beanData.birthday, //出生日期
          signOrg: beanData.signOrg //身份证签发机关
        },
        familyAddress: beanData.familyAddress, //身份证住址
        startDate: beanData.startDate, //起始日
        endDate: beanData.endDate, //截止日
        telephone: beanData.contactPhone, //手机号码
        bankCardNum: beanData.bankCardNum, //银行卡号
        dataList: [],
        canDel: true,
        isSearchCredit: beanData.isSearchCredit
      };
    },
    changeitem() {}
  },
  mounted() {
    this.params = {
      info: this.getStringToObj(this.$route.query.info),
      dealState: this.$route.query.dealState
    };
    this.edit = false;
    this.loadData();
    this.loadHistory();
  }
};
</script>

<style>
.card-title {
  color: #ec191f;
  margin: 1rem;
  font-weight: bold;
}
.waitInfoBox {
  padding: 1rem;
}
.waitInfo {
  background-color: rgba(236, 25, 31, 0.1);
  color: #ec191f;
  height: 4rem;
  line-height: 4rem;
  padding: 0 1rem;
  border: 1px solid #ec191f;
}
</style>
