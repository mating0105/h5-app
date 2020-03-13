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
        <div class="waitInfoBox">
         <van-row type="flex" justify="space-between" class="waitInfo">
            <van-col span="20">大数据征信结果查询中，请耐心等待</van-col>
            <van-col span="2" style="padding-top:3px;">
              <van-icon name="replay" size="1.8rem" />
            </van-col>
          </van-row>
          </div>
        <div>
          <div class="card-title">主借人信息</div>
          <van-cell title="客户名称:" required :border="false" :value="form.creditPersonName" />
          <van-cell title="证件号码:" required :border="false" :value="form.cpCertificateNum" />
          <van-cell title="手机号码:" required :border="false" :value="form.telephone" />
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
          <van-cell title="征信查询方式:" required :border="false" value="百融" />
          <van-cell title="相关文档:" required :border="false" />
          <imageList :dataList="mainImg"></imageList>
        </div>
        <div v-if="form.length >0">
          <van-swipe-cell :disabled="!edit" v-for="(item, index) in form" :key="index">
            <div class="card-title">{{returnText(item.creditObjectType, 'credit_object_type')}}信息</div>
            <van-cell title="姓名:" required :border="false" :value="item.creditPersonName" />
            <van-cell title="证件号码:" required :border="false" :value="item.cpCertificateNum" />
            <van-cell title="手机号码:" required :border="false" :value="item.telephone" />
            <van-cell title="银行卡号:" :border="false" :value="item.bankCardNum" />
            <van-cell
              title="征信对象关系:"
              required
              :value="returnText(item.creditObjectType, 'credit_object_type')"
            />
            <div slot="right" style="height: 100%">
              <van-button
                type="warning"
                style="height:100%;border-radius: 0;"
                @click="editPer(item, index)"
              >修改</van-button>
              <van-button
                type="danger"
                style="height:100%;border-radius: 0;"
                @click="removePer(index, item)"
              >删除</van-button>
            </div>
          </van-swipe-cell>
        </div>
        <div class="card-title" style="margin:2rem 1rem;">
          新增关联人信息
          <div class="card-icon" @click="addPer" v-if="edit">
            <van-icon name="add-o" size="2rem" />
          </div>
        </div>
        <div class="card-title">备注说明</div>
        <van-field v-model="form.message" rows="1" autosize type="textarea" placeholder="请输入" />
      </NewCard>
      <div class="xh-submit-box">
        <van-button size="large" class="xh-btn">提交征信查询</van-button>
      </div>
    </template>
    <template v-else-if="active === 3">
      <approvalRecord :requestParams="recordParams"></approvalRecord>
    </template>

    <!-- 身份证识别/银行卡识别 -->
    <van-action-sheet v-model="showScan" :actions="scanActions" @select="discern" />
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
import imageList from "@/components/imageList";
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
  name: "bigDataQueryDetail",
  components: {
    ViewPage,
    Card,
    NewCard,
    creditInfoTable,
    creditQueryInfo,
    relatedDocs,
    approvalRecord,
    imageList
  },
  data() {
    return {
      form: {},
      active: 0,
      loading: false,
      errorMsg: {
        investigateBankName: "",
        intentionPrice: "",
        bankCardNum: ""
      },
      edit: true,
      scanActions: [
        { name: "相机扫描识别", value: "scan" },
        { name: "相册导入识别", value: "album" }
      ],
      showScan: false,
      mainImg: [], //主借人相关文档
      recordParams: {
        businesskey: '', businesstype: '07'
      },
    };
  },
  methods: {
    //识别银行卡
    IdcardLoading() {
      this.showScan = true;
    },
    //银行卡
    discern(e) {
      this.$bridge.callHandler("bankCodeOCR", e.value, res => {
        this.form.bankCardNum = res.BANK_NUM || "";
      });
      this.showScan = false;
    },
    //新增关联人信息
    addPer() {
      const query = {
        customerId: this.dataList.customerId,
        customerNum: this.dataList.perInfo
          ? this.dataList.perInfo.customerNum
          : "",
        credit: true
      };
      this.$router.push({
        path: "/creatCustomer",
        query
      });
    }
  },
  mounted() {}
};
</script>

<style>
.card-title {
  color: #ec191f;
  margin: 1rem;
  font-weight: bold;
}
.waitInfoBox{
  padding:1rem;
}
.waitInfo{
  background-color:rgba(236, 25, 31, 0.1);
  color:#EC191F;
  height:4rem;
  line-height: 4rem;
  padding:0 1rem;
  border:1px solid #EC191F;
}
</style>
