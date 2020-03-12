<template>
  <ViewPage :loading="loading">
    <template v-slot:head>
      <van-tabs v-model="active">
        <van-tab title="基本信息"></van-tab>
        <van-tab title="操作记录"></van-tab>
      </van-tabs>
    </template>
    <template v-if="active === 0">
      <NewCard label="大数据征信查询信息" :showSign="true" :showTime="true">
        <van-cell title="客户名称:" required :border="false" :value="form.creditPersonName" />
        <van-cell title="证件号码:" required :border="false" :value="form.cpCertificateNum" />
        <van-cell title="电话号码:" required :border="false" :value="form.telephone" />
        <van-cell title="征信对象类型:" required :border="false" value="借款人" />
        <van-cell
          title="银行："
          label-class="labelClass"
          :label="errorMsg.investigateBankName"
          :disabled="!edit"
          :border="false"
          required
          :is-link="edit"
          :value="form.investigateBankName"
          @click="showPickerFn"
        />
        <van-field
          name="bankCardNum"
          :disabled="!edit"
          label="银行卡号："
          :placeholder="!edit?'':'请输入'"
          label-width="110"
          input-align="right"
          clearable
          :border="false"
          required
          v-model="form.bankCardNum"
          @blur.prevent="ruleMessge"
          :error-message="errorMsg.bankCardNum"
          :right-icon="!edit ? '' : 'scan'"
          @click-right-icon="IdcardLoading('bankCodeOCR')"
        />
        <van-field
          class="label_plus"
          name="intentionPrice"
          @blur.prevent="ruleMessge"
          :error-message="errorMsg.intentionPrice"
          :disabled="!edit"
          :border="false"
          v-model="form.intentionPrice"
          type="tel"
          required
          clearable
          @blur="checkPrice"
          input-align="right"
          label="意向贷款金额："
          placeholder="请输入"
        >
          <div slot="button">元</div>
        </van-field>
        <van-field
          v-model="form.remarks"
          :border="false"
          :disabled="!edit"
          type="textarea"
          placeholder="输入说明"
          rows="1"
          :autosize="autosize"
          class="zh-textarea"
        />
      </NewCard>
    </template>
    <template v-else-if="active === 3">
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
import { getValue, setValue, removeValue } from "@/utils/session";
import Vue from "vue";
import {
  getCreditInfo,
  creditQueryOf100,
  getButtonOfCredit
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
  Tabs
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
  Tabs
];
Components.forEach(item => {
  Vue.use(item);
});

export default {
  name: "bigDataQueryDetail",
  components: {
    ViewPage,
    Card,
    NewCard,
    creditInfoTable,
    creditQueryInfo,
    relatedDocs,
    approvalRecord
  },
  data() {
    return {
      form:{},
      active:0,
      loading:false,
      errorMsg:{},
      edit:false
    };
  },
  methods: {
    
  },
  mounted() {
  }
};
</script>

<style>
</style>
