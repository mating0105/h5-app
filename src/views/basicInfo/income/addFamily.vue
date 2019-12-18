<template>
  <ViewPage>
    <div class="xh-page-body">
      <van-row class="xh-card-box xh-radius">
        <section>
          <van-cell
            title="收入人："
            required
            is-link
            :value="formData.incomePeopleDesc"
            @click.native="loadList('收入人')"
          />
        </section>
        <section>
          <van-cell
            title="职业状况："
            required
            is-link
            :value="formData.occupationalStatusDesc"
            @click.native="loadList('职业状况')"
          />
        </section>

        <div v-if="formData.occupationalStatusDesc != '待业' ">
          <section>
            <van-cell
              title="单位性质："
              required
              is-link
              :value="formData.unitCharDesc"
              @click.native="loadList('单位性质')"
            />
          </section>
          <section>
            <van-cell
              title="行业领域："
              required
              is-link
              :value="formData.idyDmnDesc"
              @click.native="loadList('行业领域')"
            />
          </section>

          <section>
            <van-field
              name="companyName"
              v-model="formData.companyName"
              required
              :disabled="isView == '1' "
              label="单位名称："
              clearable
              input-align="right"
              placeholder="请输入单位名称"
              @blur.prevent="ruleMessge"
              :error-message="errorMsg.companyName"
            />
          </section>
          <section>
            <van-field
              name="companyTel"
              v-model="formData.companyTel"
              :disabled="isView == '1' "
              label="单位电话："
              input-align="right"
              placeholder="请输入单位电话"
              type="tel"
              clearable
              @blur.prevent="ruleMessge"
              :error-message="errorMsg.companyTel"
            />
          </section>
          <section>
            <van-cell
              name="provCityZon"
              title="单位地址："
              is-link
              :value="formData.provCityZon"
              @click.native="loadList('单位地址')"
            />
          </section>
          <section>
            <van-field
              v-model="formData.detailAddress"
              :disabled="isView == '1' "
              label="详细地址："
              input-align="right"
              placeholder="请输入详细地址"
            />
          </section>
          <section>
            <van-field
              name="workingYears"
              v-model="formData.workingYears"
              :disabled="isView == '1' "
              required
              type="number"
              clearable
              label="从业年限(年)："
              input-align="right"
              placeholder="请输入从业年限"
              @blur.prevent="ruleMessge"
              :error-message="errorMsg.workingYears"
            />
          </section>

          <div
            v-if="formData.occupationalStatusDesc != '承包方' && formData.occupationalStatusDesc != '私营业主' && formData.occupationalStatusDesc != '企业实际掌控者' && formData.occupationalStatusDesc != '股东' "
          >
            <section>
              <van-field
                name="personalIncome"
                v-model="formData.personalIncome"
                :disabled="isView == '1' "
                label="月固定收入(元)："
                input-align="right"
                clearable
                placeholder="请输入月固定收入"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.personalIncome"
              />
            </section>
            <section>
              <van-cell
                title="月固定收入状况："
                required
                is-link
                :value="formData.personalIncomeStatusDesc"
                @click.native="loadList('月固定收入状况')"
              />
            </section>
          </div>
        </div>

        <section v-if="formData.occupationalStatusDesc != '待业' ">
          <van-cell
            title="收入佐证："
            required
            is-link
            :value="formData.incomeEvidenceDesc"
            @click.native="loadList('收入佐证')"
          />
        </section>

        <section>
          <van-field
            :disabled="isView == '1' "
            v-model="formData.remark"
            rows="3"
            autosize
            clearable
            type="textarea"
            :maxlength="200"
            placeholder="请输入备注"
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
      <div class="xh-submit">
        <van-button
          size="large"
          class="xh-bg-main"
          :class="[subDisabled ? 'buttonNoColor' : 'buttonColor']"
          :loading="subLoading"
          :disabled="subDisabled"
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
import { getHouseInfo, setIncomeInfo } from "@/api/client";
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
  Picker,
  Popup
];

Components.forEach(item => {
  Vue.use(item);
});
export default {
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
      isView: 0, // 是否查看
      formData: {
        customerNum: '',// 客户编号
        customerId: '',// 客户ID
        // 额外提交
        incomePeople: '', //收入人
        occupationalStatus: '', //职业状况
        unitChar: '', //单位性质
        idyDmn: '', //行业领域
        companyName: '', //单位名称
        companyTel: '', //单位电话
        provCityZon: '', //单位地址
        detailAddress: '', //详细地址
        workingYears: '', //从业年限(年)
        personalIncome: '', //月固定收入(元)
        personalIncomeDesc: '',
        personalIncomeStatus: '', //固定收入情况
        personalIncomeStatusDesc: '',
        incomeEvidence: '', //收入佐证
        remark: '', //备注
      },
      columns: [], //待选择列表
      errorMsg: {
        ownerProperty: "", //产权所有人
        specificAddress: "", //详细地址
        houseArea: "", //房产面积(m²)
        isHasHouse: "",
        houseType: "", //房产性质
        houseZon: "", //房产区域
        provCityZon: "" //房产所在地
      },

      searchData: {
        id: ""
      },

      subData: {},

      params: {},

      selectShow: false, //下拉选择器显示
      pickerTitle: "", //下拉列表title
      addressShow: false, // 城市下拉选择器显示
      selectLoading: true, //下拉选择 loading
      addressTitle: "", //城市下拉列表title
      areaList: {}, //城市列表 init

      subLoading: false, //提交loading
      subDisabled: false, //按钮禁用状态
      ruleData: {} // 验证信息
    };
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
      getHouseInfo({
        projectId: this.params.projectId,
        id: this.params.id
      }).then(res => {
        if (res.code == 200) {
          this.formData = res.data;
          this.formData.isHasHouseDesc = this.returnText(
            "yes_no",
            this.formData.isHasHouse
          );
          this.formData.houseZonDesc = this.returnText(
            "Property_area",
            this.formData.houseZon
          );
          this.formData.houseTypeDesc = this.returnText(
            "Property_nature",
            this.formData.houseType
          );
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
          this.columns = this.wordbook.Property_area;
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
      }
    },
    onConfirm(rows, index) {
      switch (this.pickerTitle) {
        case "收入人":
          this.formData.incomePeople = rows.value;
          this.formData.incomePeopleDesc = rows.label;
          break;
        case "职业状况":
          this.formData.occupationalStatus = rows.value;
          this.formData.occupationalStatusDesc = rows.label;
          break;
        case "单位性质":
          this.formData.unitChar = rows.value;
          this.formData.unitCharDesc = rows.label;
          break;
        case "行业领域":
          this.formData.idyDmn = rows.value;
          this.formData.idyDmnDesc = rows.label;
          break;
        case "月固定收入状况":
          this.formData.personalIncomeStatus = rows.value;
          this.formData.personalIncomeStatusDesc = rows.label;
          break;
        case "收入佐证":
          this.formData.incomeEvidence = rows.value;
          this.formData.incomeEvidenceDesc = rows.label;
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
      this.formData.provCityZon = name;
      this.formData.provCityZonCode = code;
      this.addressShow = false;
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
      // if (this.isView == 0) {
        setIncomeInfo(this.formData).then(res => {
          this.$notify({
            type: "success",
            message: res.msg
          });
          this.$router.go(-1);
        });
      // } else {
      //   editIncomeInfo(this.formData).then(res => {
      //     if (res.code == 200) {
      //       this.$notify({
      //         type: "success",
      //         message: res.msg
      //       });
      //       this.$router.go(-1);
      //     } else {
      //       this.$notify({
      //         type: "danger",
      //         message: res.msg
      //       });
      //     }
      //   });
      // }
    }
  },
  mounted() {
    this.params = this.$route.query;
    if (this.params.type == 1) {
      this.isView = this.params.type;
      this.loadData();
    }
  }
};
</script>
