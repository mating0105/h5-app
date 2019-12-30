<template>
  <ViewPage :loading="loading">
    <div class="xh-page-body">
      <div class="xh-card-box xh-radius">
        <van-row>
          <van-col :span="24">
            <section>
              <van-cell
                title="担保人："
                :required="isView"
                :is-link="isView"
                :value="form.cuGuaranteeName"
                @click.native="!isView?'':loadList('担保人', '1')"
                label-class="labelClass"
                @blur.prevent="ruleMessge"
                :label="errorMsg.cuGuaranteeName"
              />
            </section>
            <section>
              <van-cell
                title="收入人："
                :required="isView"
                :is-link="isView"
                :value="form.incomePeopleDesc"
                @click.native="!isView?'':loadList('收入人', 'income_person')"
                label-class="labelClass"
                @blur.prevent="ruleMessge"
                :label="errorMsg.incomePeople"
              />
            </section>
            <section>
              <van-cell
                title="职业状况："
                :required="isView"
                :is-link="isView"
                :value="form.occupationalStatusDesc"
                label-class="labelClass"
                @blur.prevent="ruleMessge"
                :label="errorMsg.occupationalStatus"
                @click.native="!isView?'':loadList('职业状况','OccupationalStatus')"
              />
            </section>
            <div v-if="form.occupationalStatus != 6">
              <section>
                <van-cell
                  title="单位性质："
                  :required="isView"
                  :is-link="isView"
                  :value="form.unitCharDesc"
                  label-class="labelClass"
                  @blur.prevent="ruleMessge"
                  :label="errorMsg.unitChar"
                  @click.native="!isView?'':loadList('单位性质','unit_Property')"
                />
              </section>
              <section>
                <van-cell
                  title="行业领域："
                  :required="isView"
                  :is-link="isView"
                  :value="form.idyDmnDesc"
                  label-class="labelClass"
                  @blur.prevent="ruleMessge"
                  :label="errorMsg.idyDmn"
                  @click.native="!isView?'':loadList('行业领域','belong_industry')"
                />
              </section>
              <section>
                <van-field
                  name="companyName"
                  v-model="form.companyName"
                  clearable
                  :required="isView"
                  :disabled="!isView"
                  label="单位名称："
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
                  v-model="form.companyTel"
                  clearable
                  :disabled="!isView"
                  label="单位电话："
                  input-align="right"
                  :placeholder="isView?'请填写':''"
                  @blur.prevent="ruleMessge"
                  :error-message="errorMsg.companyTel"
                  error-message-align="right"
                />
              </section>
              <section>
                <van-cell
                  title="单位地址："
                  :is-link="isView"
                  :value="form.provCityZon"
                  @click.native="isView?addressShow = true:''"
                  label-class="labelClass"
                  @blur.prevent="ruleMessge"
                  :label="errorMsg.provCityZon"
                />
              </section>
              <section>
                <van-field
                  name="detailAddress"
                  v-model="form.detailAddress"
                  clearable
                  :disabled="!isView"
                  label="详细地址："
                  input-align="right"
                  :placeholder="isView?'请填写':''"
                  @blur.prevent="ruleMessge"
                  :error-message="errorMsg.detailAddress"
                  error-message-align="right"
                />
              </section>
              <section>
                <van-field
                  name="workingYears"
                  v-model="form.workingYears"
                  type="number"
                  clearable
                  :disabled="!isView"
                  :required="isView"
                  label="从业年限："
                  input-align="right"
                  :placeholder="isView?'请填写':''"
                  @blur.prevent="ruleMessge"
                  :error-message="errorMsg.workingYears"
                  error-message-align="right"
                />
              </section>
              <section>
                <van-field
                  name="personalIncome"
                  v-model="form.personalIncome"
                  type="number"
                  clearable
                  :disabled="!isView"
                  label="月固定收入(元)："
                  input-align="right"
                  :placeholder="isView?'请填写':''"
                  @blur.prevent="ruleMessge"
                  :error-message="errorMsg.personalIncome"
                  error-message-align="right"
                />
              </section>
              <section>
                <van-cell
                  title="月固定收入状况："
                  :is-link="isView"
                  :value="form.personalIncomeStatusDesc"
                  @click.native="!isView?'':loadList('月固定收入状况','IncomeStatus')"
                  label-class="labelClass"
                  @blur.prevent="ruleMessge"
                  :label="errorMsg.personalIncomeStatus"
                />
              </section>
              <section>
                <van-cell
                  title="收入佐证："
                  :is-link="isView"
                  :value="form.incomeEvidenceDesc"
                  @click.native="!isView?'':loadList('收入佐证','income_prove')"
                  label-class="labelClass"
                  @blur.prevent="ruleMessge"
                  :label="errorMsg.incomeEvidence"
                />
              </section>
              <section>
                <van-field
                  v-model="form.remark"
                  clearable
                  rows="1"
                  autosize
                  :disabled="!isView"
                  type="textarea"
                  label="备注"
                  input-align="right"
                  :placeholder="isView?'请填写备注':''"
                />
              </section>
            </div>
            <!-- 下拉选择器 -->
            <van-action-sheet v-model="selectShow" class="xh-list">
              <van-picker
                show-toolbar
                :title="pickerTitle"
                :columns="columns"
                :value-key="'label'"
                @cancel="selectShow = false"
                @confirm="onConfirm"
              />
            </van-action-sheet>

            <!-- 弹出省市区 -->
            <Provinces :showMap.sync="addressShow" @getProvince="addressOnConfirm"></Provinces>
          </van-col>
        </van-row>
      </div>
      <!-- 保 存按钮 -->
      <div class="xh-submit">
        <van-button
          size="large"
          class="xh-bg-main"
          :loading="dLoading"
          :disabled="dLoading"
          v-if="isView"
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
  Picker
} from "vant";
import {
  getGuaranteeIncome,
  setGuaranteeIncome,
  editGuaranteeIncome
} from "@/api/client";
import { toUserCard } from "@/utils/validate";
import ViewPage from "@/layout/components/ViewPage";
import Provinces from "@/components/provinces/index";
// 校验
import formValidator from "@/mixins/formValidator";
import { mapState } from "vuex";
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
  Picker
];

Components.forEach(item => {
  Vue.use(item);
});
export default {
  mixins: [formValidator],
  data() {
    return {
      isView: false,
      loading: false,
      form: {
        guaranteeId: "",
        houseArea: "",
        houseType: "",
        houseZon: "",
        ishashouse: "",
        ownerProperty: "",
        propertyHolderNum: "",
        propertyOwneratio: "",
        propertyValue: "",
        provCityZonId: "",
        specificAddress: ""
      },
      errorMsg: {
        guaranteeId: "",
        houseArea: "",
        houseType: "",
        houseZon: "",
        ishashouse: "",
        ownerProperty: "",
        propertyHolderNum: "",
        propertyOwneratio: "",
        propertyValue: "",
        provCityZonId: "",
        specificAddress: ""
      },
      selectShow: false, //下拉选择器显示
      selectLoading: true, //下拉选择 loading
      pickerTitle: "", //下拉列表title
      addressShow: false, // 城市下拉选择器显示
      columns: [], //待选择列表
      // 下拉菜单 List
      guaranteeList: [], //担保人
      loading: false, // loading
      dLoading: false, //按钮禁用状态
      projectId: "", //项目id
      ruleData: {}
    };
  },
  components: {
    ViewPage,
    Provinces
  },
  computed: {
    // 所有字典
    ...mapState({
      wordbook: state => state.user.wordbook
    })
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
    loadList(key, name) {
      this.pickerTitle = key;
      this.selectShow = true;
      if (name == "1") {
        this.columns = this.guaranteeList;
      } else {
        this.columns = this.wordbook[name];
      }
    },
    loadData(id) {
      var dataList = {
        projectId: this.params.projectId
      };
      if (id) {
        dataList.id = id;
      }
      this.loading = true;
      getGuaranteeIncome(dataList).then(res => {
        try {
          let { data } = res;
          data.listCuGuarantee.forEach(e => {
            this.guaranteeList.push({
              label: e.customerName,
              value: e.id
            });
          });
          if (id) {
            this.form = data;
            this.form.incomePeopleDesc = this.returnText(
              "income_person",
              this.form.incomePeople
            );
            this.form.occupationalStatusDesc = this.returnText(
              "OccupationalStatus",
              this.form.occupationalStatus
            );
            this.form.unitCharDesc = this.returnText(
              "unit_Property",
              this.form.unitChar
            );
            this.form.idyDmnDesc = this.returnText(
              "belong_industry",
              this.form.idyDmn
            );
            this.form.personalIncomeStatusDesc = this.returnText(
              "IncomeStatus",
              this.form.personalIncomeStatus
            );
            this.form.incomeEvidenceDesc = this.returnText(
              "income_prove",
              this.form.incomeEvidence
            );
          }
          this.loading = false;
        } catch {
          this.loading = false;
        }
      });
    },
    onConfirm(rows) {
      switch (this.pickerTitle) {
        case "担保人":
          this.form.cuGuaranteeName = rows.label;
          this.form.guaranteeId = rows.value;
          break;
        case "收入人":
          this.form.incomePeopleDesc = rows.label;
          this.form.incomePeople = rows.value;
          break;
        case "职业状况":
          this.form.occupationalStatusDesc = rows.label;
          this.form.occupationalStatus = rows.value;
          break;
        case "单位性质":
          this.form.unitCharDesc = rows.label;
          this.form.unitChar = rows.value;
          break;
        case "行业领域":
          this.form.idyDmnDesc = rows.label;
          this.form.idyDmn = rows.value;
          break;
        case "月固定收入状况":
          this.form.personalIncomeStatusDesc = rows.label;
          this.form.personalIncomeStatus = rows.value;
          break;
        case "收入佐证":
          this.form.incomeEvidenceDesc = rows.label;
          this.form.incomeEvidence = rows.value;
          break;
      }
      this.selectShow = false;
    },

    // 省市区选择
    addressOnConfirm(code, name) {
      this.form.provCityZon = name;
      this.form.provCityZonCode = code;
      this.addressShow = false;
    },
    // 保存
    custSubmit() {
      let num = 0;
      for (let item in this.errorMsg) {
        this.errorMsg[item] = this.returnMsg(item, this.form[item]);
        if (this.errorMsg[item]) {
          num++;
        }
      }
      if (num !== 0) {
        return;
      }
      this.dLoading = true;
      if (!this.form.id) {
        setGuaranteeIncome(this.form).then(res => {
          try {
            this.$notify({
              type: "success",
              message: res.msg
            });
            this.$router.go(-1);
            this.dLoading = false;
          } catch {
            this.dLoading = false;
          }
        });
      } else {
        editGuaranteeIncome(this.form).then(res => {
          try {
            this.$notify({
              type: "success",
              message: res.msg
            });
            this.$router.go(-1);
            this.dLoading = false;
          } catch {
            this.dLoading = false;
          }
        });
      }
    }
  },
  mounted() {
    this.params = this.$route.query;
    this.isView = this.params.isView == 0;
    if (this.params.id) {
      this.loadData(this.params.id);
    } else {
      this.loadData();
    }
    this.rulesForm = "order/savePersonalIncomeInfo";
  }
};
</script>
