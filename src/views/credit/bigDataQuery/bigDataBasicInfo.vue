/*
 * @Author: wuyueqi 
 * @Date: 2020-05-11 11:28:33 
 * @Last Modified by: wuyueqi
 * @Last Modified time: 2020-05-18 11:29:00
 */
<template>
  <div>
    <NewCard
      label="大数据征信查询信息"
      :showSign="dataList.standardCreditStatus && !dataList.reRegister?true:false"
      :showTime="dataList.standardCreditStatus && !dataList.reRegister?true:false"
      :sign="returnText(dataList.standardCreditStatus,'standard_credit_status')"
      :signColor="returnColor(dataList.standardCreditStatus)"
      :time="dataList.registerDate"
      :isShowTitle="isShowTitle"
    >
      <div class="waitInfoBox" v-show="dataList.standardCreditStatus == '01'">
        <van-row type="flex" justify="space-between" class="waitInfo">
          <van-col span="20">大数据征信结果查询中，请耐心等待</van-col>
          <van-col span="2" style="padding-top:3px;" @click="refreshStatus">
            <van-icon name="replay" size="1.8rem" />
          </van-col>
        </van-row>
      </div>
      <div class="waitInfoBox" v-show="dataList.standardCreditStatus == '02'">
        <van-row type="flex" justify="space-between" class="waitInfo">
          <van-col span="24">退回原因：{{dataList.remarks}}</van-col>
        </van-row>
      </div>
      <div>
        <div class="card-title">主借人信息</div>
        <van-cell title="客户名称:" required :border="false" :value="form.creditPersonName" />
        <van-cell title="证件号码:" required :border="false" :value="form.cpCertificateNum" />
        <van-cell title="手机号码:" required :border="false" :value="form.telephone" />
        <van-field
          name="bankCardNum"
          :disabled="!edit && dataList.standardCreditStatus != null"
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
        <van-cell
          title="征信查询方式:"
          label-class="labelClass"
          :label="errorMsg.creditSearchType"
          :disabled="!edit && dataList.standardCreditStatus != null"
          :border="false"
          required
          :is-link="edit"
          :value="dataList.creditSearchTypeDesc"
          @click="showPickerFn('creditSearchType')"
        />
        <van-cell
          title="征信签约方式:"
          label-class="labelClass"
          :label="errorMsg.signMode"
          :disabled="!edit && dataList.standardCreditStatus != null"
          :border="false"
          required
          :is-link="edit"
          :value="dataList.signMode"
          @click="showPickerFn('signMode')"
          v-if="isElectronic"
        />
        <van-cell
          title="征信授权电子签:"
          label-class="labelClass"
          :disabled="!edit && dataList.standardCreditStatus != null"
          :border="false"
          required
          is-link
          :value="form.electronicSignResult ? form.electronicSignResult: '待签约'"
          v-if="isElectronic"
          @click="electronicFn(data.electronicSignResult,'borrower')"
        />
        <van-cell title="相关文档:" required :border="false" />
        <imageList :dataList="mainImg"></imageList>
      </div>
      <div v-if="perInfoList.length > 0">
        <van-swipe-cell :disabled="!edit && dataList.standardCreditStatus != null" v-for="(item, index) in perInfoList" :key="index">
          <div class="card-title">{{returnText(item.creditObjectType, 'credit_object_type')}}信息</div>
          <van-cell title="姓名:" required :border="false" :value="item.creditPersonName" />
          <van-cell title="证件号码:" required :border="false" :value="item.cpCertificateNum" />
          <van-cell title="手机号码:" required :border="false" :value="item.telephone" />
          <van-cell title="银行卡号:" :border="false" :value="item.bankCardNum" />
          <!-- <van-cell
              title="征信对象关系:"
              required
              :border="false"
              :value="returnText(item.creditObjectType, 'credit_object_type')"
          />-->
          <van-cell
            title="征信类型关系:"
            required
            :border="false"
            :value="returnText(item.creditObjectRelation, 'CREDIT_OBJECT_RELATION')"
          />
          <van-cell
            title="是否查询征信:"
            required
            :border="false"
            :value="item.isSearchCredit?(item.isSearchCredit == '1'?'是':'否'):''"
          />
          <van-cell
            title="征信授权电子签:"
            label-class="labelClass"
            :disabled="!edit && dataList.standardCreditStatus != null"
            :border="false"
            required
            is-link
            :value="item.electronicSignResult ? form.electronicSignResult: '待签约'"
            v-if="isElectronic"
            @click="electronicFn(item.electronicSignResult,item.creditObjectType)"
          />
          <van-cell title="相关文档" required :border="false" />
          <imageList :dataList="item.dataList"></imageList>
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
        <div class="card-icon" @click="addPer" v-if="edit && !dataList.standardCreditStatus">
          <van-icon name="add-o" size="2rem" />
        </div>
      </div>
      <div class="card-title">备注说明</div>
      <van-field v-model="remarks" rows="1" autosize type="textarea" placeholder="请输入" :disabled="!edit && dataList.standardCreditStatus != null"/>
    </NewCard>
    <div v-if="dataList.standardCreditStatus == '01'">
      <div class="xh-submit-box">
        <van-button size="large" @click="endTask">终止查询</van-button>
      </div>
    </div>
    <div v-else-if="dataList.standardCreditStatus == '02'">
      <van-row gutter="20" class="xh-submit-box">
        <van-col :span="8">
          <van-button size="large" class="xh-btn xh-primary" @click="endTask">终止查询</van-button>
        </van-col>
        <van-col :span="16">
          <van-button size="large" class="xh-btn" @click="submit">提交征信查询</van-button>
        </van-col>
      </van-row>
    </div>
    <div v-else>
      <div class="xh-submit-box" v-if="creditTYPE != 'bairong'">
        <van-button size="large" class="xh-btn" @click="submit">提交征信查询</van-button>
      </div>

      <div class="xh-submit-box" v-if="creditTYPE === 'bairong'">
        <van-button size="large" @click="triggerQuery" class="xh-btn">发起征信查询1</van-button>
      </div>
    </div>

    <!-- 身份证识别/银行卡识别 -->
    <van-action-sheet v-model="showScan" :actions="scanActions" @select="discern" />
    <!-- 弹出框 -->
    <van-popup v-model="showPicker" position="bottom" get-container="#app">
      <div class="xh-list-body">
        <van-picker
          :columns="columns"
          show-toolbar
          :value-key="valueKey"
          title="征信查询方式"
          @confirm="confirm"
          @cancel="showPicker = false"
        />
      </div>
    </van-popup>
    <!-- 确认弹框 -->
    <dialogBox
      class="dialogBox"
      :title="'确认终止查询吗？'"
      :showDialog="showDialog"
      :onConfirm="confirmFn"
      :onCancel="cancelFn"
    >
      <template>
        <van-cell title="原因：" title-style="color:red;">
          <van-field
            slot="label"
            v-model="cause"
            placeholder="请输入"
            type="textarea"
            :autosize="autosize"
            maxlength="100"
            show-word-limit
          />
        </van-cell>
      </template>
    </dialogBox>
  </div>
</template>

<script>
import ViewPage from "@/layout/components/ViewPage";
import NewCard from "@/components/card/newCard";
import formValidator from "@/mixins/formValidator";
import imageList from "@/components/imageList";
import { getValue, setValue, removeValue } from "@/utils/session";
import { getDocumentByType } from "@/api/document";
import dialogBox from "@/components/dialogBox/index";
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
  submitCredit,
  stopTask,
  creditSaveOf100,
  signContract
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
  Col,
  Row
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
  Col,
  Row
];
Components.forEach(item => {
  Vue.use(item);
});

export default {
  name: "bigDataBasicInfo",
  mixins: [formValidator],
  components: {
    ViewPage,
    NewCard,
    imageList,
    radio,
    radioItem,
    dialogBox
  },
  props: {
    dataList: Object,
    form: Object,
    perInfoList: Array, //客户下面的其他客户数据
    edit: Boolean,
    hiddenHandle: {
      default: false,
      type: Boolean
    },
    buttonId: String,
    creditTypeList: Array, //征信查询方式
    creditTYPE: {
      default: "",
      type: String
    },
    showTypes: {
      default: true,
      type: Boolean
    },
    standardStatus: String
  },

  data() {
    return {
      sign: "", //征信查询状态
      data: {},
      active: 0,
      errorMsg: {
        bankCardNum: "",
        creditSearchType: "",
        creditObjectRelation: ""
      },
      isShowTitle: true,
      scanActions: [
        { name: "相机扫描识别", value: "scan" },
        { name: "相册导入识别", value: "album" }
      ],
      showScan: false,
      mainImg: [], //主借人相关文档
      recordParams: {
        businesskey: "",
        businesstype: "07"
      },
      params: {}, //上个页面获取的参数
      showPicker: false,
      pickerSign: "", //弹框标识
      columns: [],
      valueKey: "",
      isElectronic: false, //是否征信电子签
      time: "",
      remarks: "", //备注说明
      obj: {//包括大数据授权书
        joiDebtorSpouse: ["CUIDA04", "CUIDB04", "CUCARD04", "CRDBIGA04"], //共债人配偶
        borrowerSpouse: ["CUIDA02", "CUIDB02", "CUCARD02", "CRDBIGA02"], //借款人配偶
        security: ["CUIDB05", "CUIDA05", "CUCARD05", "CRDBIGA05"], //担保人
        joiDebtor: ["CUIDA03", "CUIDB03", "CUCARD03", "CRDBIGA03"], //共债人
        borrower: ["CUIDA01", "CUIDB01", "CUCARD01","CRDBIGA01"] //主借人
      },
      objun: {//没有大数据授权书
        joiDebtorSpouse: ["CUIDA04", "CUIDB04", "CUCARD04"], //共债人配偶
        borrowerSpouse: ["CUIDA02", "CUIDB02", "CUCARD02"], //借款人配偶
        security: ["CUIDB05", "CUIDA05", "CUCARD05"], //担保人
        joiDebtor: ["CUIDA03", "CUIDB03", "CUCARD03"], //共债人
        borrower: ["CUIDA01", "CUIDB01", "CUCARD01"] //主借人
      },
      processedBy: "", //提交人id
      taskData: {}, //
      electronicList: [],
      showDialog: false,
      cause: "",
      autosize: {
        maxHeight: 100,
        minHeight: 20
      }
    };
  },
  computed: {
    // 所有字典
    wordbook() {
      return this.$store.state.user.wordbook;
    },
    documentType() {
      let obj = {};
      if (this.wordbook.document_type && this.wordbook.document_type.length) {
        this.wordbook.document_type.forEach(item => {
          obj[item.value] = item;
        });
      }
      return obj;
    }
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
    //保存数据到本地
    save() {
      this.dataList.surDtlList = [this.form, ...this.perInfoList];
      setValue("credit", JSON.stringify(this.dataList));
    },
    //新增关联人信息
    addPer() {
      const query = {
        customerId: this.data.customerId,
        customerNum: this.data.perInfo ? this.data.perInfo.customerNum : "",
        credit: true
      };
      this.$router.push({
        path: "/creatCustomer",
        query
      });
    },
    async getAnyServer(serverName, type) {
      let serverNameType = {
        serverName: serverName
      };
      let res = await getByServer(serverNameType);
      if (type == "electronic") {
        if (res.data.length > 1) {
          this.electronicList = res.data;
        } else {
          this.electronicList = res.data;
          this.dataList.signType = res.data[0].buttonId;
          this.judge(res.data[0].buttonName);
        }
      }
    },
    //判断是否是电子签 加载图片
    async judge(list) {
      let arr = [];
      this.dataList.signMode = list;
      //是否电子签
      if (list == "电子签") {
        this.isElectronic = true;
        this.dataList.surDtlList.forEach(e => {
          arr = this.objun[e.creditObjectType];
          arr.forEach(i => {
            this.getDocumentByType(i, e);
          });
        });
      } else {
        this.isElectronic = false;
        this.dataList.surDtlList.forEach(e => {
          if(e.isSearchCredit == 1 || e.creditObjectType == 'borrower'){//查询征信
           arr = this.obj[e.creditObjectType];
          }else{//不查询征信
           arr = this.objun[e.creditObjectType];
          }
          arr.forEach(i => {
            this.getDocumentByType(i, e);
          });
        });
      }
    },
    unFormatter(beanData) {
      const perInfo = beanData.perInfo || {};
      return {
        sex: beanData.sex, //性别
        birthday: perInfo.birthday, //出生日期
        customerName: beanData.creditPersonName, //客户姓名
        certificateNum: beanData.cpCertificateNum, //身份证号码
        age: beanData.age, //年龄
        creditObjectType: beanData.creditObjectType, //征信对象类型
        creditObjectRelation: beanData.creditObjectRelation, //征信对象类型
        nationName: perInfo.nationName, //民族
        nation: perInfo.nation, //
        familyAddress: beanData.familyAddress, //身份证住址
        signOrg: perInfo.signOrg, //身份证签发机关
        startDate: beanData.startDate, //起始日
        endDate: beanData.endDate, //截止日
        contactPhone: beanData.telephone, //手机号码
        bankCardNum: beanData.bankCardNum, //银行卡号
        isSearchCredit: beanData.isSearchCredit //是否查询征信
      };
    },
    //显示弹框
    showPickerFn(type) {
      if (!this.edit) {
        return;
      }
      this.showPicker = true;
      this.pickerSign = type;
      switch (type) {
        case "creditSearchType":
          this.valueKey = "buttonName";
          this.columns = this.creditTypeList;
          break;
        case "signMode":
          this.valueKey = "buttonName";
          this.columns = this.electronicList;
          break;
        case "user":
          if (this.changeUserList.length == 0) {
            return;
          }
          this.valueKey = "label";
          this.columns = this.changeUserList;
          break;
        default:
          break;
      }
    },
    confirm(value) {
      switch (this.pickerSign) {
        case "creditSearchType":
          this.data.creditSearchType = value.id;
          this.data.creditSearchTypeDesc = value.buttonName;
          break;
        case "user":
          this.processedBy = value.id;
          this.postProcess();
          break;
        default:
          break;
      }
      this.showPicker = false;
    },
    //标签转变颜色
    returnColor(status) {
      let color;
      switch (status) {
        case "01":
          color = "#999";
          break;
        case "02":
          color = "#E60000";
          break;
        case "03":
          color = "#E60000";
          break;
        case "04":
          color = "#00C67C";
          break;
        case "05":
          color = "#E60000";
          break;
        case "06":
          color = "#E60000";
          break;
      }
      return color;
    },
    //点击授权电子签
    async electronicFn(val,creditObjectType) {
      console.log(val,creditObjectType, 9999);
      if(val){//已签约

      }else{
        this.dataList.creditType = this.buttonId;
        this.dataList.remarks = this.remarks;
        this.dataList.surDtlList.forEach(e =>{
          if(e.creditObjectType == creditObjectType){
            e.currentElectronicSign = 1;
          }
        })
        let res = await signContract(this.dataList);
      }
      console.log(this.dataList)
      
    },
    // 字典转换
    returnText(val, key) {
      let name = "";
      if (this.wordbook[key]) {
        this.wordbook[key].forEach(e => {
          if (e.value === val) {
            name = e.label;
          }
        });
      }
      return name;
    },
    //刷新征信查询状态
    refreshStatus() {},
    //编辑人
    editPer(per, index) {
      const query = {
        customerId: this.dataList.customerId,
        customerNum: this.dataList.customerNum ,
        index: index,
        credit: true,
        ...this.unFormatter(per)
      };
      this.$router.push({
        path: "/creatCustomer",
        query
      });
    },
    //删除人
    removePer(index, item) {
      Dialog.confirm({
        title: "删除",
        message: "确定删除该客户"
      })
        .then(() => {
          this.perInfoList.splice(index, 1);
          this.save();
        })
        .catch(() => {});
    },
    //验证字段
    verifyForm() {
      let num = 0;
      for (let item in this.errorMsg) {
        this.errorMsg[item] = this.returnMsg(item, this.data[item]);
        if (this.errorMsg[item]) {
          num++;
        }
      }
      return num === 0;
    },
    //验证征信授权书图片
    verifyImg(){
      let borrowerImg = false,otherImg = false;
      for(let i = 0;i<this.mainImg.length;i++){
        if(this.mainImg[i].documentType== 'CRDBIGA01'){
          if(this.mainImg[i].fileList.length<1){
            Toast("请上传主借人大数据征信授权书");
            break;
          }else{
            borrowerImg = true;
          }
        }
      }
      let imgArr = [];
      this.dataList.surDtlList.forEach(e =>{
        if(e.isSearchCredit == 1){
          e.dataList.forEach(i =>{
            if(i.documentType == 'CRDBIGA01' || i.documentType == 'CRDBIGA02' || i.documentType == 'CRDBIGA05' || i.documentType =='CRDBIGA03'||i.documentType == 'CRDBIGA04'){
              if(i.fileList.length<1){
                console.log(e.creditObjectType);
                imgArr.push(this.returnText(e.creditObjectType,'credit_object_type'));
              }
            }
          })
        }
      })
      if(imgArr.length>0){
        let nameString = imgArr.join('、');
        Toast(`请上传${nameString}大数据征信授权书`);
        return;
      }else{
        otherImg = true;
      }
      console.log(borrowerImg,otherImg)
      return borrowerImg && otherImg;
    },
    //提交征信查询
    async submit() {
      if (!this.verifyForm() || !this.verifyImg()) {
        return;
      }
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
        loadingType: "spinner",
        overlay: true
      });
      this.dataList.creditType = this.buttonId;
      this.dataList.remarks = this.remarks;
      const { data } = await saveCreditInfo(this.dataList);
      removeValue("credit");
      try {
        const params = {
          businessKey: data.creditRegisterId,
          businessType: "07",
          commentsDesc: "同意",
          conclusionCode: "01",
          processDefineKey: "WF_CU_CREDIT_001",
          remarks: this.remarks
        };
        const subData = await createTask(params);
        this.taskData = subData.data;
        const userParams = {
          businessKey: data.creditRegisterId,
          commentsDesc: this.remarks ? this.remarks : "同意",
          conclusionCode: "01"
        };
        const res = await getUsers(userParams);
        let objArr = [];
        res.data.list.forEach(t => {
          objArr.push({
            ...t,
            label: t.companyName + "-" + t.name
          });
        });
        this.changeUserList = objArr;
        Toast.clear();
        this.showPickerFn("user");
      } catch (e) {
        Toast.clear();
      }
    },
    //提交百融征信查询
    async triggerQuery() {
      let nowDate = new Date();
      // 当前时间与查询时间+30天对比
      let isRegister = this.dataList.surDtlList.some(element => {
        let dateItem = element.credit100StrategyQuerydate
          ? new Date(element.credit100StrategyQuerydate)
          : "";
        return dateItem
          ? new Date(dateItem.setDate(dateItem.getDate() + 30)) >= nowDate
          : false;
      });
      console.log(isRegister);
      if (isRegister) {
        Toast("已查询的用户请30天后重新查询");
        return;
      }
      //验证大数据征信授权书图片是否上传 主借人必传
      let imgtost = false;
      for(let i = 0;i<this.mainImg.length;i++){
        if(this.mainImg[i].documentType== 'CRDBIGA01'){
          if(this.mainImg[i].fileList.length<1){
            Toast("请上传主借人大数据征信授权书");
            break;
          }else{
            imgtost = true;
          }
        }
      }
      if(!imgtost){
        return;
      }
      let imgArr = [];
      this.dataList.surDtlList.forEach(e =>{
        e.dataList.forEach(i =>{
          if(i.documentType == 'CRDBIGA01' || i.documentType == 'CRDBIGA02' || i.documentType == 'CRDBIGA05' || i.documentType =='CRDBIGA03'||i.documentType == 'CRDBIGA04'){
            if(i.fileList.length<1){
              console.log(e.creditObjectType);
              imgArr.push(this.returnText(e.creditObjectType,'credit_object_type'));
            }
          }
        })
      })
      //提示是否有人没有上传征信查询授权书
      if(imgArr.length>0){
        let nameString = imgArr.join('、');
        Dialog.confirm({
          title: '',
          message: `${nameString}没有上传征信查询授权书，无法查询征信，确定吗？`
        }).then(() => {
          
        }).catch(() => {
          // on cancel
        });
      }else{
        this.bigDataTipOfBr();
      }
    },
    //提交流程
    async postProcess() {
      const params = {
        ids: this.processedBy,
        taskBean: this.taskData.taskBean,
        wfBizComments: this.taskData.wfBizComments
      };
      await submitCredit(params);
      this.loading = false;
      this.$nextTick(() => {
        Toast.success("提交成功");
      });
      if (this.creditTYPE == "bairong") {
        this.$router.go(-1);
      } else {
        this.$emit("reLoad");
        console.log("更新状态", this.dataList.standardCreditStatus);
      }
    },
    // 百融大数据征信授权书提示
    async bigDataTipOfBr() {
      try {
        if (!this.verifyForm()) {
          return;
        }
        Toast.loading({
          message: "加载中...",
          forbidClick: true,
          loadingType: "spinner",
          overlay: true
        });
        this.dataList.creditTypeFlag = 1;
        this.dataList.creditType = this.buttonId;
        await creditSaveOf100(this.dataList);
        removeValue("credit");
        const params = {
          businessKey: data.creditRegisterId,
          businessType: "07",
          commentsDesc: "同意",
          conclusionCode: "01",
          processDefineKey: "WF_CU_CREDIT_001",
          remarks: this.remarks
        };
        const subData = await createTask(params);
        this.taskData = subData.data;
        const userParams = {
          businessKey: data.creditRegisterId,
          commentsDesc: this.remarks ? this.remarks : "同意",
          conclusionCode: "01"
        };
        const res = await getUsers(userParams);
        let objArr = [];
        res.data.list.forEach(t => {
          objArr.push({
            ...t,
            label: t.companyName + "-" + t.name
          });
        });
        this.changeUserList = objArr;
        Toast.clear();
        this.showPickerFn("user");
      } catch {
        Toast.clear();
      }
    },
    async getDocumentByType(documentType, obj) {
      try {
        const params = {
          customerNum: this.dataList.perInfo.customerNum,
          documentType: documentType
        };
        const declare = this.documentType[documentType]
          ? this.documentType[documentType].label
          : "图片描述";
        const isRequire = Boolean(this.edit);
        const imgdata = {
          declare: declare, //图片描述
          isRequire: isRequire, //*是否必须
          deletable: isRequire, //是否可以操作-上传和删除
          documentType: documentType,
          customerNum: this.dataList.perInfo.customerNum,
          customerId: this.dataList.perInfo.id,
          kind: "1",
          fileList: []
        };
        if (obj.creditObjectType == "borrower") {
          this.mainImg.push(imgdata);
        }
        obj.dataList.push(imgdata);
        const { data } = await getDocumentByType(params);
        data.forEach(item => {
          item.declare = declare;
        });
        imgdata.fileList = data;
      } catch (e) {}
    },
    //终止查询
    endTask() {
      this.showDialog = true;
    },
    async confirmFn() {
      if (!this.cause) {
        this.showDialog = false;
        Toast("请输入终止原因");
        return;
      }
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
        loadingType: "spinner",
        overlay: true
      });
      let recordParams = {
        businessKey: this.dataList.id,
        businessType: "07"
      };
      await stopTask(recordParams);
      Toast.clear();
      this.$nextTick(() => {
        Toast.success("终止成功");
      });
      this.$router.go(-1);
    },
    cancelFn() {
      this.showDialog = false;
    }
  },
  mounted() {
    this.getAnyServer("electronic-visa-model", "electronic");

  },
  destroyed() {
    this.save();
  }
};
</script>

<style lang="scss">
.labelClass {
  left: 1.33333rem;
}

.xh-credit-picker {
  .column1 {
    flex: none;
    min-width: 25%;
  }

  .column2 {
    text-align: left;
  }
}
</style>
