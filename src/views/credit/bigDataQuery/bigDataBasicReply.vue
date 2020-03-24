<template>
  <div>
    <NewCard
      label="大数据征信查询信息"
      :showSign="showSign"
      :showTime="showTime"
      :sign="sign"
      :signColor="signColor"
      :time="time"
      :isShowTitle="isShowTitle"
    >
      <div>
        <div class="card-title">主借人信息{{edit}}</div>
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
        <van-cell
          label-class="labelClass"
          :label="errorMsg.creditResult"
          title="征信结果:"
          is-link
          :border="false"
          required
          v-if="thisCreditType == '5'"
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
          @blur.prevent="ruleMessge"
          :label="errorMsg.investigateDate"
          v-if="thisCreditType == '5'"
        />
        <van-cell title="相关文档:" :border="false" />
        <imageList :dataList="mainImg"></imageList>
        <div v-if="thisCreditType == '5'">
          <van-cell title="征信报告:" required :border="false" />
          <imageList :dataList="mainCreditImg"></imageList>
        </div>
        <div v-if="thisCreditType == '6'">
          <van-row class="br-box">
            <van-col :span="18">
              <div>
                <span class="br-title">贷前信息验证结果：</span>
                <span class="br-result">通过</span>
              </div>
              <div class="br-time">
                结果查询时间：2020-01-01 11:30:59
              </div>
            </van-col>
            <van-col :span="6">
              <van-button size="small">查看报告</van-button>
            </van-col>
          </van-row>
          <van-row class="br-box">
            <van-col :span="18">
              <div>
                <span class="br-title">贷前风险策略结果：</span>
                <span class="br-result">通过</span>
              </div>
              <div class="br-time">
                结果查询时间：2020-01-01 11:30:59
              </div>
            </van-col>
            <van-col :span="6">
              <van-button size="small">查看报告</van-button>
            </van-col>
          </van-row>
        </div>
      </div>
      <div v-if="perInfoList.length > 0">
        <van-swipe-cell :disabled="!edit" v-for="(item, index) in perInfoList" :key="index">
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
            :label="errorMsg.isSearchCredit"
            title="征信结果:"
            :border="false"
            required
            :disabled="!edit"
            v-if="thisCreditType == '5'"
          >
            <radio v-model="item.creditResult" :disabled="!edit">
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
            @click="edit?showPopupTime(''):''"
            label-class="labelClass"
            @blur.prevent="ruleMessge"
            :label="errorMsg.investigateDate"
            v-if="thisCreditType == '5'"
          />

          <van-cell title="相关文档" :border="false" />
          <imageList :dataList="item.dataList"></imageList>
          <div v-if="thisCreditType == '5'">
            <van-cell title="征信报告" required :border="false" />
            <imageList :dataList="item.creditList"></imageList>
          </div>
          <div v-if="thisCreditType == '6'"></div>
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
      <div class="card-title" style="margin:2rem 1rem;" v-if="edit">
        新增关联人信息
        <div class="card-icon" @click="addPer">
          <van-icon name="add-o" size="2rem" />
        </div>
      </div>
      <div class="card-title">备注说明</div>
      <van-field v-model="remarks" rows="1" autosize type="textarea" placeholder="请输入" />
    </NewCard>
    <div class="xh-submit-box" v-if="thisCreditType != '6'">
      <van-button size="large" class="xh-btn xh-primary" @click="back">退回</van-button>
      <van-button size="large" class="xh-btn" @click="showResult">提前告知征信结果</van-button>
      <van-button size="large" class="xh-btn" @click="submit">提交</van-button>
    </div>

    <div class="xh-submit-box" v-if="thisCreditType === '6'">
      <van-button size="large" @click="triggerQuery" class="xh-btn">提交</van-button>
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
    thisCreditType: String,
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
      sign: "", //征信查询状态
      data: {},
      active: 0,
      errorMsg: {
        bankCardNum: "",
        creditSearchType: "",
        creditObjectRelation: ""
      },
      showSign: true,
      showTime: true,
      sign: "查询中",
      signColor: "#999",
      showTimePicker: false,
      scanActions: [
        { name: "相机扫描识别", value: "scan" },
        { name: "相册导入识别", value: "album" }
      ],
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
        joiDebtorSpouse: ["0113", "0114", "2004", "6604"], //共债人配偶
        borrowerSpouse: ["0105", "0106", "2002", "6691"], //借款人配偶
        security: ["0120", "0117", "2005", "6692"], //担保人
        joiDebtor: ["0109", "0110", "2003", "6693"], //共债人
        borrower: ["0101", "0102", "2001", "6690"] //主借人
      },
      bigData: {
        joiDebtorSpouse: ["0210"], //共债人配偶
        borrowerSpouse: ["0208"], //借款人配偶
        security: ["0211"], //担保人
        borrower: ["0207"], //借款人
        joiDebtor: ["0209"] //共债人
      },
      whiteList: ["0207", "0208", "0209", "0210", "0211"],
      maxDate: new Date(),
      currentDate: new Date(), //当前时间
      peopleTime: "",
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
        customerId: this.data.customerId,
        customerNum: this.data.perInfo ? this.data.perInfo.customerNum : "",
        credit: true
      };
      this.$router.push({
        path: "/creatCustomer",
        query
      });
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
    //编辑人
    editPer(per, index) {
      const query = {
        customerId: this.data.customerId,
        customerNum: this.data.perInfo ? this.data.perInfo.customerNum : "",
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
    //验证
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
    //提交
    async submit() {
      if (!this.verifyForm()) {
        return;
      }
      if (!this.remarks) {
        Toast.fail("请在备注说明里填写退回原因");
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
      if (!this.form.creditResult) {
        Toast.fail("请选择征信结果");
        return;
      }
      this.perInfoList.forEach(e => {
        if (!e.creditResult) {
          Toast.fail("请选择征信结果");
          return;
        }
      });
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
        // if(bigData.creditObjectType == 'borrower'){
        //   this.mainCreditImg.push(imgdata);
        // } else {
        //   bigData.creditList.push(imgdata);
        // }
        const { data } = await getDocumentByType(params);
        data.forEach(item => {
          item.declare = declare;
        });
        imgdata.fileList = data;
      } catch (e) {}
    },
    //时间选择
    showPopupTime(people) {
      this.showTimePicker = true;
      this.peopleTime = people;
    },
    confirmTime(value) {
      this.showTimePicker = false;
      if (this.peopleTime == "borrower") {
        this.form.investigateDate = format(value, "yyyy-MM-dd hh:mm");
      } else {
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
    }
  },
  mounted() {
    this.time = this.dataList.registerDate;
    console.log(this.dataList, 234444);
    console.log(this.thisCreditType);
    this.obj = {
      joiDebtorSpouse: ["0113", "0114", "2004"], //共债人配偶
      borrowerSpouse: ["0105", "0106", "2002"], //借款人配偶
      security: ["0120", "0117", "2005"], //担保人
      joiDebtor: ["0109", "0110", "2003"], //共债人
      borrower: ["0101", "0102", "2001"] //主借人
    };
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
      console.log("arr2", arr2);
      arr2.forEach(i => {
        console.log(i, e);
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
