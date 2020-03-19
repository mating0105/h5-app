<template>
  <div>
    <NewCard
      label="大数据征信查询信息"
      :showSign="showSign"
      :showTime="showTime"
      :sign="returnText(sign,'standard_credit_status')"
      :signColor="returnColor(sign)"
      :time="time"
    >
      <div class="waitInfoBox" v-show="sign == '01'">
        <van-row type="flex" justify="space-between" class="waitInfo">
          <van-col span="20">大数据征信结果查询中，请耐心等待</van-col>
          <van-col span="2" style="padding-top:3px;" @click="refreshStatus">
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
        <van-cell
          title="征信查询方式:"
          label-class="labelClass"
          :label="errorMsg.creditSearchType"
          :disabled="!edit"
          :border="false"
          required
          :is-link="edit"
          :value="dataList.creditSearchTypeDesc"
          @click="showPickerFn('creditSearchType')"
        />
        <van-cell
          title="征信授权电子签:"
          label-class="labelClass"
          :disabled="!edit"
          :border="false"
          required
          is-link
          :value="form.electronicSignResult ? form.electronicSignResult: '待签约'"
          v-if="isElectronic"
          @click="electronicFn(data.electronicSignResult)"
        />
        <van-cell title="相关文档:" required :border="false" />
        <imageList :dataList="mainImg"></imageList>
      </div>
      <div v-if="perInfoList.length > 0">
        <van-swipe-cell :disabled="!edit" v-for="(item, index) in perInfoList" :key="index">
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
            :disabled="!edit"
            :border="false"
            required
            is-link
            :value="item.electronicSignResult ? form.electronicSignResult: '待签约'"
            v-if="isElectronic"
            @click="electronicFn(item.electronicSignResult)"
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
        <div class="card-icon" @click="addPer" v-if="edit">
          <van-icon name="add-o" size="2rem" />
        </div>
      </div>
      <div class="card-title">备注说明</div>
      <van-field v-model="remarks" rows="1" autosize type="textarea" placeholder="请输入" />
    </NewCard>
    <div class="xh-submit-box" v-if="TYPE != 'bairong'">
      <van-button size="large" class="xh-btn" @click="submit">提交征信查询</van-button>
    </div>

    <div class="xh-submit-box" v-if="TYPE === 'bairong'">
      <van-button size="large" @click="triggerQuery" class="xh-btn">发起征信查询</van-button>
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
  </div>
</template>

<script>
import ViewPage from "@/layout/components/ViewPage";
import NewCard from "@/components/card/newCard";
import formValidator from "@/mixins/formValidator";
import imageList from "@/components/imageList";
import { getValue, setValue, removeValue } from "@/utils/session";
import { getDocumentByType } from "@/api/document";
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
  name: "bigDataBasicInfo",
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
    TYPE: {
      default: "",
      type: String
    }
  },
  mixins: [formValidator],
  components: {
    ViewPage,
    NewCard,
    imageList,
    radio,
    radioItem
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
      showSign: false,
      showTime: false,
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
      obj: {
        joiDebtorSpouse: ["0113", "0114", "2004", "6604"], //共债人配偶
        borrowerSpouse: ["0105", "0106", "2002", "6691"], //借款人配偶
        security: ["0120", "0117", "2005", "6692"], //担保人
        joiDebtor: ["0109", "0110", "2003", "6693"], //共债人
        borrower: ["0101", "0102", "2001", "6690"] //主借人
      },
      processedBy: "", //提交人id
      taskData: {} //
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
      this.data.surDtlList = [this.form, ...this.perInfoList];
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
        this.dataList.signType = res.data[0].buttonId;
        //是否电子签
        if (res.data[0].buttonName == "电子签") {
          this.isElectronic = true;
          //如果是电子签，则没有大数据征信授权书
          this.obj = {
            joiDebtorSpouse: ["0113", "0114", "2004"], //共债人配偶
            borrowerSpouse: ["0105", "0106", "2002"], //借款人配偶
            security: ["0120", "0117", "2005"], //担保人
            joiDebtor: ["0109", "0110", "2003"], //共债人
            borrower: ["0101", "0102", "2001"] //主借人
          };
          this.dataList.surDtlList.forEach(e => {
            const arr = this.obj[e.creditObjectType];
            arr.forEach(i => {
              this.getDocumentByType(i, e);
            });
          });
        } else {
          this.isElectronic = false;
          this.obj = {
            joiDebtorSpouse: ["0113", "0114", "2004", "6604"], //共债人配偶
            borrowerSpouse: ["0105", "0106", "2002", "6691"], //借款人配偶
            security: ["0120", "0117", "2005", "6692"], //担保人
            joiDebtor: ["0109", "0110", "2003", "6693"], //共债人
            borrower: ["0101", "0102", "2001", "6690"] //主借人
          };
          this.dataList.surDtlList.forEach(e => {
            const arr = this.obj[e.creditObjectType];
            arr.forEach(i => {
              this.getDocumentByType(i, e);
            });
          });
        }
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
    //点击授权电子签
    electronicFn(val) {
      console.log(val, 9999);
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
    //提交征信查询
    async submit() {
      if (!this.verifyForm()) {
        return;
      }
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
        loadingType: "spinner",
        overlay:true
      });
      this.dataList.creditType = this.buttonId;
      const { data } = await saveCreditInfo(this.dataList);
      removeValue("credit");
      try {
        const params = {
          businessKey: data.creditRegisterId,
          businessType: "07",
          commentsDesc: "同意",
          conclusionCode: "01",
          processDefineKey: "WF_CU_CREDIT_001"
        };
        const subData = await createTask(params);
        this.taskData = subData.data;
        const userParams = {
          businessKey: this.dataList.id,
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
      if (isRegister) {
        Toast("已查询的用户请30天后重新查询");
        return;
      }

      Bus.$emit("creditSave", this.TYPE);
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
        const imgdata = {
          declare: declare, //图片描述
          isRequire: true, //*是否必须
          deletable: true, //是否可以操作-上传和删除
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
