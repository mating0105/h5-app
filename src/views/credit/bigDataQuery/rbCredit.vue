<template>
  <ViewPage :loading="loading">
    <template v-slot:head>
      <van-tabs v-model="active">
        <van-tab title="基本信息"></van-tab>
        <van-tab title="操作记录"></van-tab>
      </van-tabs>
    </template>
    <template v-if="active === 0 && dataList.id">
      <basicInfo
        :dataList="dataList"
        :edit="edit"
        :form="form"
        :perInfoList="perInfoList"
        :buttonId="buttonId"
        :hiddenHandle="true"
      ></basicInfo>
    </template>
    <template v-else-if="active === 1">
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
import basicInfo from "../bigDataQuery/bigDataBasicInfo";
import radio from "@/components/radio";
import radioItem from "@/components/radio/radioItem";
import Vue from "vue";
import {
  getCreditDetail,
  setBookObj,
  getByServer,
  saveCreditInfo,
  createTask,
  getUsers,
  submitCredit
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
  ActionSheet
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
  ActionSheet
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
    basicInfo
  },
  data() {
    return {
      active: 0,
      dataList: {
        investigateBank: "",
        investigateBankName: "",
        isInternetCredit: "",
        carInfos: [],
        surDtlList: []
      },
      loading: false,
      edit: false,
      form: {},
      perInfoList: [],
      recordParams: {
        businesskey: "",
        businessType: "07"
      },
      buttonId:'',
    };
  },
  computed: {
    // 所有字典
    wordbook() {
      return this.$store.state.user.wordbook;
    }
  },
  methods: {
    async loadData() {
      this.loading = true;
      let data;
      if (getValue("credit")) {
        data = JSON.parse(getValue("credit"));
      } else {
        let datalist = {
          creditType:this.params.buttonId,
          lpCertificateNum: this.params.lpCertificateNum
        };
        let res = await getCreditDetail(datalist);
        data = res.data.cuCreditRegister;
      }
      this.sign = data.standardCreditStatus;
      this.time = data.registerDate;
      data.surDtlList.forEach(e => {
        e.dataList = [];
        if (e.creditObjectType === "borrower") {
          this.form = e;
        } else {
          this.perInfoList.push(e);
        }
      });
      this.dataList = data;
      this.recordParams.businesskey = this.dataList.id;
      this.initCustomerData();
      this.loading = false;
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
    }
  },
  mounted() {
    this.params = this.$route.query;
    this.edit = this.params.edit;
    this.buttonId = this.params.buttonId;
    this.loadData();
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
