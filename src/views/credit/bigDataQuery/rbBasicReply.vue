<template>
  <div>
    <NewCard
      label="人保征信查询信息"
      :showSign="showSign"
      :showTime="showTime"
      :sign="sign"
      :signColor="signColor"
      :time="time"
      :isShowTitle="isShowTitle"
    >
      <div>
        <div class="card-title">主借人信息</div>
        <van-cell title="客户名称:" :border="false" :value="form.creditPersonName" />
        <van-cell title="证件号码:" :border="false" :value="form.cpCertificateNum" />
        <van-cell title="手机号码:" :border="false" :value="form.telephone" />
        <van-field
          name="bankCardNum"
          disabled
          label="银行卡号："
          :placeholder="!edit?'':'请输入'"
          label-width="110"
          input-align="right"
          clearable
          :border="false"
          v-model="form.bankCardNum"
        />
        <van-cell
          label-class="labelClass"
          :label="errorMsg.creditResult"
          @blur.prevent="ruleMessge"
          title="征信结果:"
          :border="false"
          required
        >
          <radio v-model="form.creditResult" :disabled="!edit">
            <radio-item label="pass">通过</radio-item>
            <radio-item label="not_pass">拒绝</radio-item>
          </radio>
        </van-cell>
        <van-cell
          title="征信结果时间:"
          required
          :is-link="edit?true:false"
          :border="false"
          :value="form.investigateDate"
          @click="edit?showPopupTime('borrower'):''"
          label-class="labelClass"
        />
        <van-cell title="相关文档:" :border="false" />
        <imageList :dataList="mainImg"></imageList>
        <div>
          <van-cell title="征信报告:" required :border="false" />
          <imageList :dataList="mainCreditImg"></imageList>
        </div>
      </div>
      <div v-if="perInfoList.length > 0">
        <van-swipe-cell :disabled="!edit" v-for="(item, index) in perInfoList" :key="index" v-if="item.isSearchCredit == 1">
          <div class="card-title">{{returnText(item.creditObjectType, 'credit_object_type')}}信息</div>
          <van-cell title="姓名:" required :border="false" :value="item.creditPersonName" />
          <van-cell title="证件号码:" required :border="false" :value="item.cpCertificateNum" />
          <van-cell title="手机号码:" required :border="false" :value="item.telephone" />
          <van-cell title="银行卡号:" :border="false" :value="item.bankCardNum" />
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
            label-class="labelClass"
            :label="errorMsg.creditResult"
            title="征信结果:"
            :border="false"
            required
          >
            <radio v-model="item.creditResult" @change="changeThis" :disabled="!edit">
              <radio-item label="pass">通过</radio-item>
              <radio-item label="not_pass">拒绝</radio-item>
            </radio>
          </van-cell>
          <van-cell
            title="征信结果时间:"
            required
            :is-link="edit?true:false"
            :border="false"
            :disabled="!edit"
            :value="item.investigateDate"
            @click="edit?showPopupTime(item.creditObjectType,index):''"
            label-class="labelClass"
            @blur.prevent="ruleMessge"
            :label="errorMsg.investigateDate"
          />

          <van-cell title="相关文档" :border="false" />
          <imageList :dataList="item.dataList"></imageList>
          <div>
            <van-cell title="征信报告" required :border="false" />
            <imageList :dataList="item.creditList"></imageList>
          </div>
        </van-swipe-cell>
      </div>
      <div class="card-title">备注说明</div>
      <van-field v-model="remarks" rows="1" autosize type="textarea" placeholder="请输入" />
    </NewCard>
    <div class="xh-submit-box" v-if="thisCreditType != '6'">
      <van-button size="large" class="xh-btn xh-primary" @click="back">退回</van-button>
      <van-button size="large" class="xh-btn" @click="showResult">提前告知征信结果</van-button>
      <van-button size="large" class="xh-btn" @click="submit">提交</van-button>
    </div>

    <van-action-sheet get-container="#app" v-model="showTimePicker" class="xh-list">
      <div class="xh-list-body">
        <van-datetime-picker
          title="征信结果时间"
          type="datetime"
          v-model="currentDate"
          :max-date="maxDate"
          @confirm="confirmTime"
          @cancel="showTimePicker = false"
        />
      </div>
    </van-action-sheet>

    <!-- 确认弹框 -->
    <dialogBox
      class="dialogBox"
      :title="'确认提交吗？'"
      :showDialog="showDialog"
      :onConfirm="confirmFn"
      :onCancel="cancelFn"
    ></dialogBox>
  </div>
</template>

<script>
import ViewPage from "@/layout/components/ViewPage";
import NewCard from "@/components/card/newCard";
import formValidator from "@/mixins/formValidator";
import imageList from "@/components/imageList";
import { getValue, setValue, removeValue } from "@/utils/session";
import { getDocumentByType } from "@/api/document";
import { format } from "@/utils/format";
import { bankReply, informInAdvanceResult } from "@/api/bigData";
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
  ActionSheet,
  DatetimePicker
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
  DatetimePicker
];
Components.forEach(item => {
  Vue.use(item);
});

export default {
  name: "bigDataBasicReply",
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
    thisCreditType: String,//5 百融 6 人工
    isShowTitle: Boolean
  },
  mixins: [formValidator],
  components: {
    ViewPage,
    NewCard,
    imageList,
    radio,
    radioItem,
    dialogBox
  },
  data() {
    return {
      active: 0,
      errorMsg: {
        creditResult:"",
      },
      showSign: true,
      showTime: true,
      sign: "查询中",
      signColor: "#999",
      showTimePicker: false,
      showScan: false,
      mainImg: [], //主借人相关文档
      mainCreditImg: [], //主借人征信报告
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
      obj: {
        joiDebtorSpouse: ["CUIDA04", "CUIDB04", "CUCARD04", "CRDPICCA04"], //共债人配偶
        borrowerSpouse: ["CUIDA02", "CUIDB02", "CUCARD02", "CRDPICCA02"], //借款人配偶
        security: ["CUIDB05", "CUIDA05", "CUCARD05", "CRDPICCA05"], //担保人
        joiDebtor: ["CUIDA03", "CUIDB03", "CUCARD03", "CRDPICCA03"], //共债人
        borrower: ["CUIDA01", "CUIDB01", "CUCARD01", "CRDPICCA01"] //主借人
      },
      bigData: {
        joiDebtorSpouse: ["CRDPICCB04"], //共债人配偶
        borrowerSpouse: ["CRDPICCB02"], //借款人配偶
        security: ["CRDPICCB05"], //担保人
        borrower: ["CRDPICCB01"], //借款人
        joiDebtor: ["CRDPICCB03"] //共债人
      },
      whiteList: ["CRDPICCB01", "CRDPICCB02", "CRDPICCB03", "CRDPICCB04", "CRDPICCB05"],
      maxDate: new Date(),
      currentDate: new Date(), //当前时间
      peopleTime: "",
      peopleIndex:'',
      showDialog: false
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
    //验证征信结果
    verifyForm() {
      let sign = true;
      if (!this.form.creditResult) {
        Toast.fail("请选择征信结果");
        sign = false;
        return;
      }
      this.perInfoList.forEach(e => {
        if (!e.creditResult && e.isSearchCredit == '1') {
          Toast.fail("请选择征信结果");
          sign = false;
          return;
        }
      });
      return sign;
    },
    //验证征信报告
    verifyFormReport() {
      let sign = true;
      if (this.mainCreditImg[0].fileList.length<1) {
        Toast.fail("请上传主借人征信报告");
        sign = false;
        return;
      }
      for(let i = 0;i<this.perInfoList.length;i++){
         if(this.perInfoList[i].creditList[0].fileList.length<1 && this.perInfoList[i].isSearchCredit == '1'){
            Toast.fail("请上传人保征信报告");
            sign = false;
            break;
         }
       }
      return sign;
    },
    //提交
    submit() {
      if (!this.verifyForm() || !this.verifyFormReport()) {
        return;
      }
      this.showDialog = true;
    },
    //返回
    async back() {
      if (!this.remarks) {
        Toast.fail("请在备注说明里填写退回原因");
      } else {
        this.loading = true;
        this.dataList.remarks = this.remarks;
        const params = {
          wfBizComments: {
            commentsDesc: this.remarks,
            conclusionCode: "02",
            businessKey: this.dataList.id,
            remarks:this.remarks
          },
          cuCreditRegister: this.dataList,
        };
        await bankReply(params);
        this.loading = false;
        this.$nextTick(() => {
          Toast.success("回退成功");
          setTimeout(() => {
            this.$router.push("/lendProcessList");
          }, 1000);
        });
      }
    },
    //提前告知征信结果
    async showResult() {
      if (!this.verifyForm()) {
        return;
      }
      this.loading = true;
      await informInAdvanceResult(this.dataList);
      this.loading = false;
      this.$nextTick(() => {
        Toast.success("告知成功");
        setTimeout(() => {
          this.$router.push("/lendProcessList");
        }, 1000);
      });
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
      if (isRegister) {
        Toast("已查询的用户请30天后重新查询");
        return;
      }

      Bus.$emit("creditSave", this.thisCreditType);
      Bus.$on("queryStart", res => {
        this.disableClick = true;
      });

      Bus.$on("queryFaile", res => {
        this.disableClick = false;
      });
      Bus.$on("querySuccess", res => {
        this.disableClick = false;
        // if(res === 'bairong'){
        //   this.$refs['basicInfo'].initData()
        //   this.load('getBrAgain').then(() => {
        //       this.active = 1
        //       this.$forceUpdate()
        //   }).catch(() => {
        //     this.active = 1
        //   })
        // }
      });
    },
    //提交流程
    async postProcess() {
      this.loading = true;
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
      if (this.$route.query.canTermin) {
        this.$nextTick(() => {
          this.$router.push("/lendProcessList");
        });
      } else {
        this.$nextTick(() => {
          this.$router.push("/creditList");
        });
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
        const isRequire = this.whiteList.includes(documentType) && this.edit;
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
          if (this.whiteList.includes(documentType)) {
            this.mainCreditImg.push(imgdata);
          } else {
            this.mainImg.push(imgdata);
          }
        } else {
          if (this.whiteList.includes(documentType)) {
            obj.creditList.push(imgdata);
          } else {
            obj.dataList.push(imgdata);
          }
        }
        const { data } = await getDocumentByType(params);
        data.forEach(item => {
          item.declare = declare;
        });
        imgdata.fileList = data;
      } catch (e) {}
    },
    //时间选择
    showPopupTime(people,index) {
      this.showTimePicker = true;
      this.peopleTime = people;
      this.peopleIndex = index;
    },
    confirmTime(value) {
      this.showTimePicker = false;
      if (this.peopleTime == "borrower") {
        this.form.investigateDate = format(value, "yyyy-MM-dd hh:mm");
      } else {
        this.perInfoList[this.peopleIndex].investigateDate = format(value, "yyyy-MM-dd hh:mm");
      }
    },
    async confirmFn() {
      try {
        this.showDialog = false;
        Toast.loading({
          message: "加载中...",
          forbidClick: true,
          loadingType: "spinner",
          overlay: true
        });
        const params = {
          wfBizComments: {
            commentsDesc: this.remarks,
            conclusionCode: "01",
            businessKey: this.dataList.id
          },
          cuCreditRegister: this.dataList
        };
        await bankReply(params);
        Toast.clear();
        this.$nextTick(() => {
          Toast.success("提交成功");
          setTimeout(() => {
            this.$router.push("/lendProcessList");
          }, 1000);
        });
      } catch (e) {}
    },
    cancelFn() {
      this.showDialog = false;
    },
    changeThis(val){
      console.log(val,999)
    }
  },
  mounted() {
    this.time = this.dataList.registerDate;
    console.log(this.dataList, 234444);
    this.mainImg = [];
    this.mainCreditImg = [];
    this.dataList.surDtlList.forEach(e => {
      e.dataList = [];
      e.creditList = [];
      const arr = this.obj[e.creditObjectType];
      arr.forEach(i => {
        this.getDocumentByType(i, e); //相关文档
      });
      const arr2 = this.bigData[e.creditObjectType];
      arr2.forEach(i => {
        this.getDocumentByType(i, e); //征信报告
      });
    });
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
//百融征信
.br-box{
  margin:1rem;
  background: #F8F8F8;
  padding:1.3rem 1rem;
  .br-title{
    font-size:1.6rem ;
    font-weight: bold;
    color:#262626;
  }
  .br-result{
    font-size:1.6rem ;
    font-weight: bold;
    color:#00C67C;
  }
  .br-time{
    margin-top:1rem;
    color:#a6a6a6;
    font-size: 1.2rem;
  }
}
</style>
