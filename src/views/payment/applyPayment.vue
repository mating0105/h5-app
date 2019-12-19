<template>
  <ViewPage :loading="loading">
    <van-tabs v-model="activeName">
      <van-tab title="费用信息" name="cost">
        <div class="xh-pay-content">
          <redCard label="客户基本信息">
            <template slot="cardBody">
              <div>
                <div
                  class="xh-pay-div"
                >客户姓名及编号：{{paymentDetail.customerName}} {{paymentDetail.customerNum}}</div>
                <div class="xh-pay-div">证件号码：{{paymentDetail.certificateNum}}</div>
                <div class="xh-pay-div">电话：{{paymentDetail.contactPhone}}</div>
              </div>
            </template>
          </redCard>
          <!-- 步骤条 -->
          <div class="xh-steps xh-steps-horizontal xh-step-center">
            <div
              class="xh-step is-horizontal"
              v-for="i in list"
              :key="i.key"
              @click="stepVhange(i.key)"
            >
              <div class="xh-step-head">
                <div class="xh-step-line">
                  <i class="xh-step-line-inner xh-border-gray"></i>
                </div>
                <div
                  class="xh-step-icon is-text"
                  :class="stepVal == i.key?'xh-bg-active':'xh-bg-gray'"
                >
                  <div class="xh-step-icon-inner xh-is-status"></div>
                </div>
              </div>
              <div class="xh-step-main">
                <div
                  class="xh-step-title"
                  :class="stepVal == i.key?'xh-step-active':'xh-step-gray'"
                >{{ i.name }}</div>
                <div class="xh-step-description"></div>
              </div>
            </div>
          </div>
          <div v-show="stepVal ==1">
            <card>
              <template slot="header">产品费用</template>
              <van-row>
                <van-cell-group :border="false">
                  <van-cell title="产品名称" :value="paymentDetail.projProjectInfo.productName" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="产品性质" :value="paymentDetail.projProjectInfo.productProperty" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="贷款金额(元)" :value="paymentDetail.projProjectInfo.loanAmt" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="贷款期数" :value="paymentDetail.projProjectInfo.proPat.loanCount" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="放款平台" :value="paymentDetail.projProjectInfo.dsbrPltfrmNm" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="公司利率" :value="paymentDetail.projProjectInfo.bankNewRate" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="客户利率" :value="paymentDetail.projProjectInfo.customerRate" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="担保费率" :value="paymentDetail.projProjectInfo.guaranteeRate" />
                </van-cell-group>
              </van-row>
            </card>
            <card style="margin-top:10px;">
              <template slot="header">其他费用</template>
              <van-row>
                <van-cell-group :border="false">
                  <van-cell
                    title="担保费(元)"
                    :value="paymentDetail.projBudgetList.warrantCharges?paymentDetail.projBudgetList.warrantCharges:'0'"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-field
                    v-model="paymentDetail.projBudgetList.estimateCharges"
                    required
                    clearable
                    label="评估费(元)"
                    input-align="right"
                    placeholder="请输入"
                    @blur.prevent="()=>{ }"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-field
                    v-model="paymentDetail.projBudgetList.investigateCharges"
                    required
                    clearable
                    label="调查费(元)"
                    input-align="right"
                    placeholder="请输入"
                    @blur.prevent="()=>{ }"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-field
                    v-model="paymentDetail.projBudgetList.gpsCharges"
                    required
                    clearable
                    label="GPS费(元)"
                    input-align="right"
                    placeholder="请输入"
                    @blur.prevent="()=>{ }"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-field
                    v-model="paymentDetail.projBudgetList.colligateCharges"
                    required
                    clearable
                    label="综合服务费(元)"
                    input-align="right"
                    placeholder="请输入"
                    @blur.prevent="()=>{ }"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-field
                    v-model="paymentDetail.projBudgetList.notarialFees"
                    required
                    clearable
                    label="公证费(元)"
                    input-align="right"
                    placeholder="请输入"
                    @blur.prevent="()=>{ }"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-field
                    v-model="paymentDetail.projBudgetList.allopatryCharges"
                    required
                    clearable
                    label="异地上户费(元)"
                    input-align="right"
                    placeholder="请输入"
                    @blur.prevent="()=>{ }"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-field
                    v-model="paymentDetail.projBudgetList.doolBail"
                    required
                    clearable
                    label="上户保证金(元)"
                    input-align="right"
                    placeholder="请输入"
                    @blur.prevent="()=>{ }"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-field
                    v-model="paymentDetail.projBudgetList.agreeBail"
                    required
                    clearable
                    label="履约保证金(元)"
                    input-align="right"
                    placeholder="请输入"
                    @blur.prevent="()=>{ }"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-field
                    v-model="paymentDetail.projBudgetList.collectCarDealer"
                    required
                    clearable
                    label="实收车商(元)"
                    input-align="right"
                    placeholder="请输入"
                    @blur.prevent="()=>{ }"
                  />
                </van-cell-group>
              </van-row>
            </card>
            <card style="margin-top:10px;">
              <template slot="header">缴费明细</template>
              <van-row>
                <van-cell-group :border="false">
                  <van-field
                    v-model="totalCharges"
                    required
                    clearable
                    label="费用合计"
                    input-align="right"
                    placeholder="请输入"
                    @blur.prevent="()=>{ }"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-field
                    v-model="paymentDetail.projBudgetList.dcnAmt"
                    required
                    clearable
                    label="打折金额(元)"
                    input-align="right"
                    placeholder="请输入"
                    @blur.prevent="()=>{ }"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-field
                    v-model="paymentDetail.projBudgetList.actincmAmt"
                    required
                    clearable
                    label="实收金额(元)"
                    input-align="right"
                    placeholder="请输入"
                    @blur.prevent="()=>{ }"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell
                    title="缴费时间"
                    required
                    is-link
                    v-model="paymentDetail.projBudgetList.pyfDt"
                    @click="showPopupTime('pyfDt')"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell
                    title="缴费方式"
                    required
                    is-link
                    :value="returnText('pyfMod',paymentDetail.projBudgetList.pyfMod)"
                    @click="loadType('缴费方式', 'pyfMod')"
                  />
                </van-cell-group>
              </van-row>
            </card>
          </div>
          <div v-show="stepVal ==2">
            <card>
              <template slot="header">走款信息</template>
              <van-row>
                <van-cell-group :border="false">
                  <van-field
                    v-model="paymentDetail.projProjectInfo.loanAmt"
                    required
                    clearable
                    label="银行贷款金额(元)"
                    input-align="right"
                    placeholder="请输入"
                    @blur.prevent="()=>{ }"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-field
                    v-model="paymentDetail.projProjectInfo.sendLoanAmt"
                    required
                    clearable
                    label="送审金额(元)"
                    input-align="right"
                    placeholder="请输入"
                    @blur.prevent="()=>{ }"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-field
                    v-model="paymentDetail.projProjectInfo.loanAmt"
                    required
                    clearable
                    label="应走款金额(元)"
                    input-align="right"
                    placeholder="请输入"
                    @blur.prevent="()=>{ }"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell
                    title="走款模式"
                    required
                    is-link
                    :value="returnText('payType',paymentDetail.projPayInfo.payType)"
                    @click="loadType('走款模式', 'payType')"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell
                    title="走款时间"
                    required
                    is-link
                    :value="paymentDetail.projPayInfo.payTime"
                    @click="showPopupTime('payTime')"
                  />
                </van-cell-group>
                <div v-show="paymentDetail.projPayInfo.payType == '2'">
                  <van-cell-group :border="false">
                    <van-field
                      v-model="paymentDetail.projPayInfo.payeeAccount"
                      required
                      clearable
                      label="银行账号"
                      input-align="right"
                      placeholder="请输入"
                      @blur.prevent="()=>{ }"
                    />
                  </van-cell-group>
                  <van-cell-group :border="false">
                    <van-cell
                      title="开户银行"
                      required
                      is-link
                      :value="returnText('payeeBank',paymentDetail.projPayInfo.payeeBank)"
                      @click="loadType('开户银行', 'payeeBank')"
                    />
                  </van-cell-group>
                  <van-cell-group :border="false">
                    <van-field
                      v-model="paymentDetail.projPayInfo.payeeSubBank"
                      required
                      clearable
                      label="开户支行"
                      input-align="right"
                      placeholder="请输入"
                      @blur.prevent="()=>{ }"
                    />
                  </van-cell-group>
                  <van-cell-group :border="false">
                    <van-field
                      v-model="paymentDetail.projPayInfo.payeeFullName"
                      required
                      clearable
                      label="账户名"
                      input-align="right"
                      placeholder="请输入"
                      @blur.prevent="()=>{ }"
                    />
                  </van-cell-group>
                </div>
              </van-row>
            </card>
          </div>
          <div v-show="stepVal ==3">
            <card>
              <template slot="header">走款资料</template>
              <imageList :dataList="dataList"></imageList>
            </card>
            <card>
              <template v-slot:header>意见描述</template>
              <section>
                <van-cell-group :border="false">
                  <van-field
                    v-model="message"
                    rows="2"
                    autosize
                    label-width="0"
                    :border="false"
                    type="textarea"
                    maxlength="200"
                    placeholder="请输入"
                    show-word-limit
                  />
                </van-cell-group>
              </section>
            </card>
            <div class="xh-submit">
              <van-button size="large" class="xh-bg-main" @click="submit">提交</van-button>
            </div>
          </div>
        </div>
        <div class="xh-submit" v-show="stepVal !=3">
          <van-button size="large" class="xh-bg-main" @click="save">保 存</van-button>
        </div>
      </van-tab>
      <van-tab title="项目信息" name="project">
        <ProjectInfo></ProjectInfo>
      </van-tab>
    </van-tabs>

    <van-action-sheet get-container="#app" v-model="show2" class="xh-list">
      <div class="xh-list-body">
        <van-datetime-picker
          :title="timetitle"
          type="datetime"
          :formatter="formatter"
          v-model="currentDate"
          @confirm="confirmTime"
          @cancel="cancelTime"
        />
      </div>
    </van-action-sheet>
    <!-- 弹出选项 -->
    <van-action-sheet get-container="#app" v-model="show3" class="xh-list">
      <div class="xh-list-body">
        <van-picker
          :columns="options"
          show-toolbar
          :value-key="valueKey"
          :title="selectName"
          @confirm="confirm"
          @cancel="cancel"
        />
      </div>
    </van-action-sheet>
  </ViewPage>
</template>
<script>
import Vue from "vue";
import {
  Button,
  Row,
  Col,
  Tab,
  Tabs,
  Cell,
  CellGroup,
  DatetimePicker
} from "vant";
import redCard from "@/components/redCard/index";
import card from "@/components/card/index";
import ViewPage from "@/layout/components/ViewPage";
import imageList from "@/components/imageList";
import ProjectInfo from "@/views/basicInfo/projectInfo/info";
import {
  paymentDetail,
  getDic,
  submitPay,
  savePay,
  submitProcess
} from "@/api/payment";
import { getDocumentByType } from "@/api/document";
import { format } from "@/utils/format";
const Components = [
  Button,
  Row,
  Col,
  Tab,
  Tabs,
  Cell,
  CellGroup,
  DatetimePicker
];
Components.forEach(item => {
  Vue.use(item);
});
export default {
  components: {
    redCard,
    ViewPage,
    card,
    ProjectInfo,
    imageList
  },
  data() {
    return {
      activeName: "cost",
      list: [
        { name: "费用信息", key: 1 },
        { name: "走款信息", key: 2 },
        { name: "上传图片", key: 3 }
      ],
      stepVal: 1,
      paymentDetail: {}, //基本信息
      params: {}, //上个页面传过来的参数
      loading: false,
      selectName: "",
      dicList: [], //字典获取
      valueKey: "label",
      fieldName: "",
      show2: false,
      show3: false,
      options: [],
      timeType: "",
      timetitle: "",
      currentDate: new Date(),
      dataList: [], //图片上传
      message: "", //意见描述
      peopleList: [], //下一节点人数组
      // totalCharges:'',//费用合计
    };
  },
  computed: {
    // 费用合计=实收车商+上户保证金+履约保证金+异地上户费+公证费+综合服务费+调查费+评估费+GPS费用
    totalCharges(){
      let estimateCharges =
        parseFloat(this.paymentDetail.projBudgetList.estimateCharges) || 0; // 评估费
      let investigateCharges =
        parseFloat(this.paymentDetail.projBudgetList.investigateCharges) || 0; //调查费
      let gpsCharges =
        parseFloat(this.paymentDetail.projBudgetList.gpsCharges) || 0; //GPS费用
      let agreeBail =
        parseFloat(this.paymentDetail.projBudgetList.agreeBail) || 0; //履约保证金
      let collectCarDealer =
        parseFloat(this.paymentDetail.projBudgetList.collectCarDealer) || 0; //实收车商
      let notarialFees =
        parseFloat(this.paymentDetail.projBudgetList.notarialFees) || 0; //公证费
      let allopatryCharges =
        parseFloat(this.paymentDetail.projBudgetList.allopatryCharges) || 0; //异地上户费
      let colligateCharges =
        parseFloat(this.paymentDetail.projBudgetList.colligateCharges) || 0; //综合服务费
      let doolBail =
        parseFloat(this.paymentDetail.projBudgetList.doolBail) || 0; //上户保证金
      console.log(
        estimateCharges +
          investigateCharges +
          agreeBail +
          collectCarDealer +
          notarialFees +
          allopatryCharges +
          colligateCharges +
          doolBail +
          gpsCharges
      );
      return (
        estimateCharges +
        investigateCharges +
        agreeBail +
        collectCarDealer +
        notarialFees +
        allopatryCharges +
        colligateCharges +
        doolBail +
        gpsCharges
      );
    },
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
    stepVhange(val) {
      this.stepVal = val;
    },
    loadData() {
      paymentDetail({ projectId: this.params.projectId }).then(res => {
        try {
          this.loading = false;
          this.paymentDetail = res.data;
        } catch (e) {
          this.loading = false;
        }
      });
    },
    //保存数据
    save() {
      this.paymentDetail.projBudgetList.totalCharges = this.totalCharges;
      console.log(this.paymentDetail);
      this.loading = true;
      savePay(this.paymentDetail).then(res => {
        try {
          this.loading = false;
          this.$notify({ type: "success", message: "保存成功" });
        } catch (e) {
          this.loading = false;
        }
      });
    },
    //提交流程
    submit() {
      this.loading = true;
      this.paymentDetail.projBudgetList.totalCharges = this.totalCharges;
      submitPay(this.paymentDetail).then(res => {
        try {
          this.loading = false;
          let data = res.data.users;
          let people = [];
          data.forEach(t => {
            people.push({
              ...t,
              label: t.companyName + "-" + t.name
            });
          });
          this.peopleList = people;
          this.loadType("下一节点审批人", "people");
        } catch (e) {
          this.loading = false;
        }
      });
    },
    //上拉菜单选择
    loadType(title, field) {
      this.selectName = title;
      this.isWordbook = false;
      this.fieldName = field;
      switch (title) {
        case "缴费方式":
          this.options = this.dicList.pay_method;
          this.show3 = true;
          break;
        case "走款模式":
          this.options = this.dicList.payType;
          this.show3 = true;
          break;
        case "开户银行":
          this.options = this.dicList.BANK_TYPE_JYR;
          this.show3 = true;
          break;
        case "下一节点审批人":
          this.options = this.peopleList;
          this.show3 = true;
          break;
        default:
          break;
      }
    },
    // 获取其他字典接口
    getDict() {
      let arr = [
        "pay_method", //缴费方式
        "payType", //走款模式
        "BANK_TYPE_JYR" //银行
      ];
      getDic(arr).then(res => {
        if (res.code == 200) {
          this.dicList = res.data;
        }
      });
    },
    returnText(type, val) {
      let name;
      switch (type) {
        case "pyfMod":
          this.dicList.pay_method.forEach(e => {
            if (e.value == val) {
              name = e.label;
            }
          });
          break;
        case "payType":
          this.dicList.payType.forEach(e => {
            if (e.value == val) {
              name = e.label;
            }
          });
          break;
        case "payeeBank":
          this.dicList.BANK_TYPE_JYR.forEach(e => {
            if (e.value == val) {
              name = e.label;
            }
          });
          break;
      }
      return name;
    },
    // 字典选择确认
    confirm(row) {
      console.log(row);
      switch (this.fieldName) {
        case "pyfMod":
          this.paymentDetail.projBudgetList[this.fieldName] = row.value;
          this.paymentDetail.projBudgetList[this.fieldName + "Name"] =
            row.label;
          break;
        case "payType":
          this.paymentDetail.projPayInfo[this.fieldName] = row.value;
          this.paymentDetail.projPayInfo[this.fieldName + "Name"] = row.label;
          break;
        case "payeeBank":
          this.paymentDetail.projPayInfo[this.fieldName] = row.value;
          this.paymentDetail.projPayInfo[this.fieldName + "Name"] = row.label;
          break;
        case "people":
          this.loading = true;
          if (this.message == "") {
            this.message = "同意";
          }
          let data = {
            businessKey: this.paymentDetail.projPayInfo.id,
            conclusionCode: "01",
            commentsDesc: this.message,
            nextUser: row.id
          };
          submitProcess(data).then(res => {
            try {
              this.loading = false;
              this.$notify({ type: "success", message: "流程提交成功" });
            } catch (e) {
              this.loading = false;
            }
          });
          break;
      }
      this.show3 = false;
    },
    cancel() {
      this.show3 = false;
    },
    //时间选择
    showPopupTime(type) {
      this.timeType = type;
      this.show2 = true;
      switch (type) {
        case "pyfDt":
          this.timetitle = "请选择缴费时间";
          break;
        case "payTime":
          this.timetitle = "请选择走款时间";
          break;
      }
    },
    formatter(type, value) {
      if (type == "minute") {
        return `0`;
      } else if (type == "year") {
        return `${value}年`;
      } else if (type == "month") {
        return `${value}月`;
      } else if (type == "day") {
        return `${value}日`;
      } else if (type == "hour") {
        return `${value}时`;
      }
    },
    confirmTime(value) {
      var time = format(value, "yyyyMMdd hh");
      switch (this.timeType) {
        case "pyfDt":
          this.paymentDetail.projBudgetList.pyfDt = time;
          break;
        case "payTime":
          this.paymentDetail.projPayInfo.payTime = time;
          break;
      }
      this.show2 = false;
    },
    cancelTime() {
      this.show2 = false;
    },
    //加载走款图片
    loadImg() {
      this.getDocumentByType("0620");
    },
    async getDocumentByType(documentType) {
      try {
        const params = {
          customerNum: this.params.customerNum,
          documentType: documentType
        };
        const { data } = await getDocumentByType(params);
        const declare = this.documentType[documentType]
          ? this.documentType[documentType].label
          : "图片描述";
        data.forEach(item => {
          item.declare = declare;
        });
        this.dataList.push({
          declare: declare, //图片描述
          isRequire: true, //*是否必须
          deletable: true, //是否可以操作-上传和删除
          documentType: documentType,
          customerNum: this.params.customerNum,
          customerId: this.params.customerId,
          kind: "1",
          fileList: data
        });
      } catch (e) {
        console.log(e);
      }
    }
  },
  mounted() {
    this.params = this.$route.query;
    this.loadData();
    this.getDict();
    this.loadImg();
  }
};
</script>
<style>
.xh-pay-content {
  padding: 10px;
}
.xh-pay-div {
  margin: 10px 0;
}
.xh-steps {
  display: flex;
  margin-top: 10px;
}
.xh-steps-horizontal {
  white-space: nowrap;
}
.xh-step.xh-horizontal {
  display: inline-block;
}
.xh-step {
  position: relative;
  flex-shrink: 1;
  flex-basis: 20%;
}
.xh-step.is-horizontal .xh-step-line {
  height: 2px;
  top: 13px;
  left: -50%;
  right: 50%;
}
.xh-step.is-horizontal:first-child .xh-step-line {
  left: 50%;
}
.xh-step-head {
  position: relative;
  width: 100%;
  text-align: center;
}
.xh-step-line {
  position: absolute;
  border-color: inherit;
  background-color: #c0c4cc;
  margin-right: 0px;
}
.xh-step-line-inner {
  display: block;
  border-width: 1px;
  border-style: solid;
  transition: 0.15s ease-out;
  box-sizing: border-box;
  height: 0;
  transition-delay: 0ms;
  width: 100%;
  color: #c0c4cc;
}
.xh-step-icon {
  position: relative;
  z-index: 1;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1.5rem;
  box-sizing: border-box;
  transition: 0.15s ease-out;
  color: #fff;
}
.xh-step-icon.is-text {
  border-radius: 50%;
}
.xh-step-icon-inner {
  display: inline-block;
  user-select: none;
  text-align: center;
  line-height: 1;
  color: inherit;
}
.xh-step-main {
  white-space: normal;
  text-align: center;
}
.xh-step-title {
  font-size: 12px;
  line-height: 38px;
}
.xh-step-center {
  justify-content: center;
}
.xh-step-active {
  color: rgb(196, 37, 42);
}
.xh-step-gray {
  color: rgb(204, 204, 204);
}
.xh-bg-active {
  background: rgb(196, 37, 42);
}
.xh-bg-gray {
  color: rgb(204, 204, 204);
}
.xh-submit {
  padding: 0 10px 20px 10px;
}
</style>
