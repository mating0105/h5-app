<template>
  <ViewPage :loading="loading">
    <div class="xh-page-body">
      <van-row class="xh-card-box xh-radius">
        <section>
          <van-cell
            title="收入人："
            :required="isView"
            :is-link="isView"
            :value="formData.incomePeopleDesc"
            label-class="labelClass"
            @blur.prevent="ruleMessge"
            :label="errorMsg.incomePeople"
            @click.native="!isView?'':loadList('收入人')"
          />
        </section>
        <section>
          <van-cell
            title="职业状况："
            :required="isView"
            :is-link="isView"
            label-class="labelClass"
            @blur.prevent="ruleMessge"
            :label="errorMsg.occupationalStatus"
            :value="formData.occupationalStatusDesc"
            @click.native="!isView?'':loadList('职业状况')"
          />
        </section>

        <div v-if="formData.occupationalStatusDesc != '待业' ">
          <section>
            <van-cell
              title="单位性质："
              :is-link="isView"
              :value="formData.unitCharDesc"
              label-class="labelClass"
              @blur.prevent="ruleMessge"
              :label="errorMsg.unitChar"
              @click.native="!isView?'':loadList('单位性质')"
            />
          </section>
          <section>
            <van-cell
              title="行业领域："
              :is-link="isView"
              :value="formData.idyDmnDesc"
              label-class="labelClass"
              @blur.prevent="ruleMessge"
              :label="errorMsg.idyDmn"
              @click.native="!isView?'':loadList('行业领域')"
            />
          </section>

          <section>
            <van-field
              name="companyName"
              v-model="formData.companyName"
              :required="isView"
              :disabled="!isView"
              label="单位名称："
              clearable
              input-align="right"
              :placeholder="isView?'请填写':''"
              @blur.prevent="ruleMessge"
              :error-message="errorMsg.companyName"
              error-message-align="right"
            />
          </section>
          <section>
            <van-field
              name="companyTel"
              v-model="formData.companyTel"
              :disabled="!isView"
              label="单位电话："
              :required="isView"
              input-align="right"
              :placeholder="isView?'请填写':''"
              type="tel"
              clearable
              @blur.prevent="ruleMessge"
              :error-message="errorMsg.companyTel"
              error-message-align="right"
            />
          </section>
          <section>
            <van-cell
              name="provCityZon"
              title="单位地址："
              :required="isView"
              :is-link="isView"
              :value="formData.provCityZon"
              label-class="labelClass"
              @blur.prevent="ruleMessge"
              :label="errorMsg.provCityZon"
              @click.native="!isView?'':loadList('单位地址')"
            />
          </section>
          <section>
            <van-field
              v-model="formData.detailAddress"
              :disabled="!isView"
              label="详细地址："
              input-align="right"
              :placeholder="isView?'请填写':''"
            />
          </section>
          <section>
            <van-field
              name="workingYears"
              v-model="formData.workingYears"
              :disabled="!isView"
              type="number"
              clearable
              label="从业年限："
              input-align="right"
              :placeholder="isView?'请填写':''"
              @blur.prevent="ruleMessge"
              :error-message="errorMsg.workingYears"
              error-message-align="right"
            >
              <div slot="button" v-if="formData.workingYears">年</div>
            </van-field>
          </section>
          <div
            v-if="formData.occupationalStatus == 1 || formData.occupationalStatus == 2 || formData.occupationalStatus == 3 || formData.occupationalStatus == 4"
          >
            <section>
              <van-field
                name="employeesNumber"
                type="number"
                v-model="formData.employeesNumber"
                :disabled="!isView"
                label="员工人数："
                input-align="right"
                clearable
                :placeholder="isView?'请填写':''"
              >
                <div slot="button" v-if="formData.employeesNumber">个</div>
              </van-field>
            </section>
            <section>
              <van-field
                name="turnover"
                type="number"
                v-model="formData.turnover"
                :disabled="!isView"
                label="年营业额："
                input-align="right"
                clearable
                @blur.prevent="priceFloat(formData, 'turnover')"
                :placeholder="isView?'请填写':''"
              >
                <div slot="button" v-if="formData.turnover">元</div>
              </van-field>
            </section>
            <section>
              <van-cell
                title="场地性质："
                :is-link="isView"
                :value="formData.fieldNatureDesc"
                label-class="labelClass"
                @click.native="!isView?'':loadList('场地性质')"
              />
            </section>
            <section>
              <van-field
                name="profit"
                v-model="formData.profit"
                :disabled="!isView"
                label="利润比："
                input-align="right"
                clearable
                type="number"
                @blur.prevent="priceFloat(formData, 'profit')"
                :placeholder="isView?'请填写':''"
              >
                <div slot="button" v-if="formData.profit">%</div>
              </van-field>
            </section>
          </div>
          <div v-if="formData.occupationalStatus == 3 || formData.occupationalStatus == 4">
            <section>
              <van-cell
                title="股份构成："
                :is-link="isView"
                :value="formData.sharesConstituteDesc"
                label-class="labelClass"
                @click.native="!isView?'':loadList('股份构成')"
              />
            </section>
            <section>
              <van-field
                name="registerCapital"
                v-model="formData.registerCapital"
                :disabled="!isView"
                label="注册资金："
                input-align="right"
                clearable
                :placeholder="isView?'请填写':''"
                @blur.prevent="priceFloat(formData, 'registerCapital');ruleMessge($event)"
                :error-message="errorMsg.registerCapital"
                error-message-align="right"
              >
                <div slot="button" v-if="formData.registerCapital">元</div>
              </van-field>
            </section>
            <section>
              <van-field
                name="totalShares"
                v-model="formData.totalShares"
                :disabled="!isView"
                label="占股比例："
                type="number"
                input-align="right"
                clearable
                :placeholder="isView?'请填写':''"
                @blur.prevent="priceFloat(formData, 'totalShares');ruleMessge($event)"
                :error-message="errorMsg.totalShares"
                error-message-align="right"
              >
                <div slot="button" v-if="formData.totalShares">%</div>
              </van-field>
            </section>
          </div>

          <div
            v-if="formData.occupationalStatus != 1 && formData.occupationalStatus != 2 && formData.occupationalStatus != 3 && formData.occupationalStatus != 4"
          >
            <section>
              <van-field
                name="personalIncome"
                v-model="formData.personalIncome"
                :disabled="!isView"
                label="月固定收入："
                input-align="right"
                label-width="100px"
                type="number"
                clearable
                :required="isView"
                :placeholder="isView?'请填写':''"
                @blur.prevent="priceFloat(formData, 'personalIncome');ruleMessge($event)"
                :error-message="errorMsg.personalIncome"
                error-message-align="right"
              >
                <div slot="button" v-if="formData.personalIncome">元</div>
              </van-field>
            </section>
            <section>
              <van-cell
                title="月固定收入状况："
                :is-link="isView"
                label-class="labelClass"
                @blur.prevent="ruleMessge"
                :label="errorMsg.personalIncomeStatus"
                :value="formData.personalIncomeStatusDesc"
                @click.native="!isView?'':loadList('月固定收入状况')"
              />
            </section>
          </div>
        </div>

        <section v-if="formData.occupationalStatusDesc != '待业' ">
          <van-cell
            title="收入佐证："
            :is-link="isView"
            :value="formData.incomeEvidenceDesc"
            label-class="labelClass"
            @blur.prevent="ruleMessge"
            :label="errorMsg.incomeEvidence"
            @click.native="!isView?'':loadList('收入佐证')"
          />
        </section>

        <section>
          <van-field
            :disabled="!isView"
            v-model="formData.remark"
            rows="3"
            autosize
            clearable
            type="textarea"
            :maxlength="200"
            :placeholder="isView?'请填写备注':''"
            show-word-limit
          />
        </section>

        <!-- 下拉选择器 -->
        <van-action-sheet v-model="selectShow" class="xh-list">
          <van-picker
            show-toolbar
            :title="pickerTitle"
            :columns="columns"
            :value-key="'label'"
            @cancel="onCancel"
            @confirm="onConfirm"
          />
        </van-action-sheet>

        <!-- 弹出省市区 -->
        <Provinces :showMap.sync="addressShow" @getProvince="addressOnConfirm"></Provinces>
      </van-row>
      <!-- 保 存按钮 -->
      <div class="xh-submit" v-if="isView">
        <van-button
          size="large"
          class="xh-bg-main"
          :loading="dLoading"
          :disabled="dLoading"
          @click.native="custSubmit"
        >保 存</van-button>
      </div>
    </div>
  </ViewPage>
</template>

<script>
import Vue from "vue";
import {
  Dialog,
  Button,
  Row,
  Col,
  Field,
  Cell,
  CellGroup,
  ActionSheet,
  Area,
  Picker,
  Popup
} from "vant";
import ViewPage from "@/layout/components/ViewPage";
import Provinces from "@/components/provinces/index";
import { getIncomeInfo, setIncomeInfo } from "@/api/client";
import { mapState } from "vuex";
// 校验
import formValidator from "@/mixins/formValidator";
const Components = [
  Dialog,
  Button,
  Row,
  Col,
  Field,
  Cell,
  CellGroup,
  ActionSheet,
  Area,
  Picker,
  Popup
];

Components.forEach(item => {
  Vue.use(item);
});
export default {
  mixins: [formValidator],
  computed: {
    // 所有字典
    ...mapState({
      wordbook: state => state.user.wordbook
    })
  },
  components: {
    ViewPage,
    Provinces
  },
  data() {
    return {
      isView: false, // 是否查看
      formData: {
        customerNum: "", // 客户编号
        customerId: "", // 客户ID
        // 额外提交
        incomePeople: "", //收入人
        occupationalStatus: "", //职业状况
        unitChar: "", //单位性质
        idyDmn: "", //行业领域
        companyName: "", //单位名称
        companyTel: "", //单位电话
        provCityZon: "", //单位地址
        detailAddress: "", //详细地址
        workingYears: "", //从业年限(年)
        personalIncome: "", //月固定收入(元)
        personalIncomeDesc: "",
        personalIncomeStatus: "", //固定收入情况
        personalIncomeStatusDesc: "",
        incomeEvidence: "", //收入佐证
        remark: "" //备注
      },
      columns: [], //待选择列表
      errorMsg: {
        incomePeople: "",
        occupationalStatus: "",
        // unitChar: "",
        // idyDmn: "",
        companyName: "",
        // workingYears: "",
        personalIncome: "",
        // incomeEvidence: "",
        provCityZon: "",
        companyTel: ""
      },
      params: {},
      selectShow: false, //下拉选择器显示
      pickerTitle: "", //下拉列表title
      addressShow: false, // 城市下拉选择器显示
      dLoading: false, //按钮禁用状态
      loading: false
    };
  },
  watch: {
    "formData.occupationalStatus"(val) {
      if (val == 6) {
        this.errorMsg = {
          incomePeople: "",
          occupationalStatus: ""
        };
      } else if (val == 1 || val == 2) {
        this.errorMsg = {
          incomePeople: "",
          occupationalStatus: "",
          // unitChar: "",
          // idyDmn: "",
          companyName: "",
          // workingYears: "",
          // incomeEvidence: "",
          provCityZon: "",
          companyTel: ""
          // employeesNumber:"",
          // turnover:"",
          // profit:""
        };
      } else if (val == 3 || val == 4) {
        this.errorMsg = {
          incomePeople: "",
          occupationalStatus: "",
          // unitChar: "",
          // idyDmn: "",
          companyName: "",
          // workingYears: "",
          // incomeEvidence: "",
          provCityZon: "",
          companyTel: "",
          // employeesNumber:"",
          // turnover:"",
          // profit:"",
          registerCapital: "",
          totalShares: ""
        };
      } else {
        this.errorMsg = {
          incomePeople: "",
          occupationalStatus: "",
          // unitChar: "",
          // idyDmn: "",
          companyName: "",
          // workingYears: "",
          personalIncome: "",
          // incomeEvidence: "",
          provCityZon: "",
          companyTel: ""
        };
      }
    }
  },
  methods: {
    // 字典转换
    returnText(n, val) {
      let name;
      this.wordbook[n].forEach(e => {
        if (e.value == val) {
          name = e.label;
        }
      });
      return name;
    },
    // 获取详情
    loadData() {
      this.loading = true;
      getIncomeInfo({
        projectId: this.params.projectId,
        id: this.params.id
      }).then(res => {
        try {
          this.formData = res.data;
          this.formData.incomePeopleDesc = this.returnText(
            "income_person",
            this.formData.incomePeople
          );
          this.formData.occupationalStatusDesc = this.returnText(
            "OccupationalStatus",
            this.formData.occupationalStatus
          );
          this.formData.unitCharDesc = this.returnText(
            "unit_Property",
            this.formData.unitChar
          );
          this.formData.idyDmnDesc = this.returnText(
            "belong_industry",
            this.formData.idyDmn
          );
          this.formData.personalIncomeStatusDesc = this.returnText(
            "IncomeStatus",
            this.formData.personalIncomeStatus
          );
          this.formData.incomeEvidenceDesc = this.returnText(
            "income_prove",
            this.formData.incomeEvidence
          );
          //  
          this.formData.sharesConstituteDesc = this.returnText(
            "Shares",
            this.formData.sharesConstitute
          );
          this.formData.fieldNatureDesc = this.returnText(
            "site_Properties",
            this.formData.fieldNature
          );
          this.formData.profit = this.numFilter(this.formData.profit);
          this.formData.personalIncome = this.numFilter(this.formData.personalIncome);
          this.formData.turnover = this.numFilter(this.formData.turnover);
          this.formData.registerCapital = this.numFilter(this.formData.registerCapital);
          this.formData.totalShares = this.numFilter(this.formData.totalShares);
          this.loading = false;
        } catch {
          this.loading = false;
        }
      });
    },
    loadList(val) {
      this.pickerTitle = val;
      switch (val) {
        case "收入人":
          this.selectShow = true;
          this.columns = this.wordbook.income_person;
          break;
        case "职业状况":
          this.selectShow = true;
          this.columns = this.wordbook.OccupationalStatus;
          break;
        case "单位地址":
          this.addressShow = true;
          break;
        case "单位性质":
          this.selectShow = true;
          this.columns = this.wordbook.unit_Property;
          break;
        case "行业领域":
          this.selectShow = true;
          this.columns = this.wordbook.belong_industry;
          break;
        case "月固定收入状况":
          this.selectShow = true;
          this.columns = this.wordbook.IncomeStatus;
          break;
        case "收入佐证":
          this.selectShow = true;
          this.columns = this.wordbook.income_prove;
          break;
        case "场地性质":
          this.selectShow = true;
          this.columns = this.wordbook.site_Properties;
          break;
        case "股份构成":
          this.selectShow = true;
          this.columns = this.wordbook.Shares;
          break;
      }
    },
    onConfirm(rows, index) {
      switch (this.pickerTitle) {
        case "收入人":
          this.formData.incomePeople = rows.value;
          this.formData.incomePeopleDesc = rows.label;
          this.errorMsg.incomePeople = '';
          break;
        case "职业状况":
          this.formData.occupationalStatus = rows.value;
          this.formData.occupationalStatusDesc = rows.label;
          this.errorMsg.occupationalStatus = '';
          break;
        case "单位性质":
          this.formData.unitChar = rows.value;
          this.formData.unitCharDesc = rows.label;
          this.errorMsg.unitChar = "";
          break;
        case "行业领域":
          this.formData.idyDmn = rows.value;
          this.formData.idyDmnDesc = rows.label;
          this.errorMsg.idyDmn = '';
          break;
        case "月固定收入状况":
          this.formData.personalIncomeStatus = rows.value;
          this.formData.personalIncomeStatusDesc = rows.label;
          this.errorMsg.personalIncomeStatus = '';
          break;
        case "收入佐证":
          this.formData.incomeEvidence = rows.value;
          this.formData.incomeEvidenceDesc = rows.label;
          this.errorMsg.incomeEvidence = "";
          break;
        case "场地性质":
          this.formData.fieldNature = rows.value;
          this.formData.fieldNatureDesc = rows.label;
          this.errorMsg.fieldNature = '';
          break;
        case "股份构成":
          this.formData.sharesConstitute = rows.value;
          this.formData.sharesConstituteDesc = rows.label;
          this.errorMsg.sharesConstitute = '';
          break;
      }
      this.selectShow = false;
    },
    onCancel() {
      this.selectShow = false;
      this.selectLoading = true;
    },
    // 省市区 ------------------------
    addressOnConfirm(code, name) {
      console.log(code, name);
      this.formData.provCityZon = name;
      this.formData.wbtProvCityZonCode = code;
      this.addressShow = false;
      this.errorMsg.provCityZon = "";
    },
    // 保存
    custSubmit() {
      this.formData.customerId = this.params.customerId;
      this.formData.customerNum = this.params.customerNum;
      let occupationalStatus = this.formData.occupationalStatus;
      if (occupationalStatus == 6) {
        this.formData.idyDmn = "";
        this.formData.unitChar = "";
        this.formData.companyName = "";
        this.formData.companyTel = "";
        this.formData.detailAddress = "";
        this.formData.workingYears = "";
        this.formData.employeesNumber = "";
        this.formData.businessArea = "";
        this.formData.fieldNature = "";
        this.formData.turnover = "";
        this.formData.profit = "";
        this.formData.sharesConstitute = "";
        this.formData.registerCapital = "";
        this.formData.totalShares = "";
        this.formData.personalIncome = "";
        this.formData.personalIncomeStatus = "";
        this.formData.incomeEvidence = "";
        this.formData.remark = "";
        this.formData.provCityZon = "";
        this.formData.wbtProvCityZonCode = "";
      }
      if (
        occupationalStatus === 5 ||
        occupationalStatus === 7 ||
        occupationalStatus === 8 ||
        occupationalStatus === 9 ||
        occupationalStatus === 10 ||
        occupationalStatus === 11 ||
        occupationalStatus === 12 ||
        occupationalStatus === 13
      ) {
        this.formData.employeesNumber = "";
        this.formData.businessArea = "";
        this.formData.fieldNature = "";
        this.formData.turnover = "";
        this.formData.profit = "";
        this.formData.sharesConstitute = "";
        this.formData.registerCapital = "";
        this.formData.totalShares = "";
      }
      if (occupationalStatus === 1 || occupationalStatus === 2) {
        this.formData.sharesConstitute = "";
        this.formData.registerCapital = "";
        this.formData.totalShares = "";
        this.formData.personalIncome = "";
        this.formData.personalIncomeStatus = "";
      }
      if (occupationalStatus === 3 || occupationalStatus === 4) {
        this.formData.personalIncome = "";
        this.formData.personalIncomeStatus = "";
      }
      let num = 0;
      for (let item in this.errorMsg) {
        this.errorMsg[item] = this.returnMsg(item, this.formData[item]);
        if (this.errorMsg[item]) {
          num++;
        }
      }
      if (num !== 0) {
        return;
      }
      this.dLoading = true;
      setIncomeInfo(this.formData)
        .then(res => {
          this.$notify({
            type: "success",
            message: res.msg
          });
          this.$router.go(-1);
          this.dLoading = false;
        })
        .catch(() => {
          this.dLoading = false;
        });
    }
  },
  mounted() {
    this.params = this.$route.query;
    this.isView = this.params.isView == 0;
    if (this.params.id) {
      this.loadData();
    }
    this.rulesForm("order/savePersonalIncomeInfo");
  }
};
</script>
<style>
.labelClass {
  left: 0 !important;
}
</style>
