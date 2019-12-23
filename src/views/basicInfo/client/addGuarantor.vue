<template>
  <!-- 新增担保人信息 -->
  <ViewPage :loading="loading">
    <div class="xh-page-body">
      <div class="xh-card-box xh-radius">
        <van-row>
          <van-col :span="24">
            <section>
              <van-field
                name="customerName"
                v-model="formData.customerName"
                clearable
                required
                :disabled="!isView"
                label="担保人姓名："
                input-align="right"
                label-width="100px"
                placeholder="请输入担保人姓名"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.customerName"
                error-message-align="right"
                right-icon="photograph"
                @click-right-icon="OCRScan(1)"
              />
            </section>
            <section>
              <van-field
                name="certificateNum"
                v-model="formData.certificateNum"
                clearable
                required
                :disabled="!isView"
                label="证件号码："
                input-align="right"
                placeholder="请输入证件号码"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.certificateNum"
                error-message-align="right"
              />
            </section>
            <section>
              <van-cell
                title="是否共债人："
                required
                :is-link="isView"
                :value="formData.isBondsDesc"
                label-class="labelClass"
                @blur.prevent="ruleMessge"
                :label="errorMsg.isBonds"
                @click.native="!isView?'':loadList('是否供债人')"
              />
            </section>
            <section>
              <van-cell
                title="与客户关系："
                required
                :is-link="isView"
                :value="formData.relationCusDesc"
                label-class="labelClass"
                @blur.prevent="ruleMessge"
                :label="errorMsg.relationCus"
                @click.native="!isView?'':loadList('与客户关系')"
              />
            </section>
            <section>
              <van-field
                name="contactPhone"
                v-model="formData.contactPhone"
                clearable
                required
                :disabled="!isView"
                label="联系电话："
                input-align="right"
                placeholder="请输入联系电话"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.contactPhone"
                error-message-align="right"
              />
            </section>
            <section>
              <van-cell
                title="文化程度："
                required
                :is-link="isView"
                :value="formData.levelEducationDesc"
                label-class="labelClass"
                @blur.prevent="ruleMessge"
                :label="errorMsg.levelEducation"
                @click.native="!isView?'':loadList('文化程度')"
              />
            </section>
            <section>
              <van-field
                v-model="formData.primarySchool"
                clearable
                :disabled="!isView"
                label="曾就读小学："
                input-align="right"
                placeholder="请输入曾就读小学"
              />
            </section>
            <section>
              <van-cell
                title="户籍地址："
                required
                label-class="labelClass"
                @blur.prevent="ruleMessge"
                :label="errorMsg.pProvCityZon"
                :is-link="isView"
                :value="formData.pProvCityZonId"
                @click.native="!isView?'':loadList('户籍地址')"
              />
            </section>
            <section>
              <van-cell
                title="居住地："
                required
                label-class="labelClass"
                @blur.prevent="ruleMessge"
                :label="errorMsg.rProvCityZon"
                :is-link="isView"
                :value="formData.rProvCityZonId"
                @click.native="!isView?'':loadList('居住地')"
              />
            </section>
            <section>
              <van-field
                v-model="formData.spsRsdncDtlAdr"
                required
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.spsRsdncDtlAdr"
                error-message-align="right"
                clearable
                :disabled="!isView"
                label="居住地详细地址："
                label-width="130px"
                input-align="right"
                placeholder="请输入详细地址"
              />
            </section>
            <section>
              <van-cell
                title="子女情况："
                required
                label-class="labelClass"
                @blur.prevent="ruleMessge"
                :label="errorMsg.childrenSituation"
                :is-link="isView"
                :value="formData.childrenSituationDesc"
                @click.native="!isView?'':loadList('子女情况')"
              />
            </section>
            <section v-if="formData.childrenSituation != '0'">
              <van-cell
                title="子女上学情况："
                required
                label-class="labelClass"
                @blur.prevent="ruleMessge"
                :label="errorMsg.schoolSituation"
                :is-link="isView"
                :value="formData.schoolSituationDesc"
                @click.native="!isView?'':loadList('子女上学情况')"
              />
            </section>
            <section>
              <van-field
                v-model="formData.localResidence"
                clearable
                type="number"
                :disabled="!isView"
                label="本地居住年限(年)："
                input-align="right"
                placeholder="请输入居住年限"
              />
            </section>
            <section>
              <van-cell
                title="婚姻状况："
                required
                label-class="labelClass"
                @blur.prevent="ruleMessge"
                :label="errorMsg.marriage"
                :is-link="isView"
                :value="formData.marriageDesc"
                @click.native="!isView?'':loadList('婚姻状况')"
              />
            </section>
          </van-col>
        </van-row>
        <van-row style="background: white;" v-if="formData.marriage == 2 || formData.marriage == 4">
          <section>
            <van-field
              name="spsNm"
              v-model="formData.spsNm"
              clearable
              required
              :disabled="!isView"
              label="配偶姓名："
              input-align="right"
              placeholder="请输入配偶姓名"
              @blur.prevent="ruleMessge"
              :error-message="errorMsg.spsNm"
              error-message-align="right"
              right-icon="photograph"
              @click-right-icon="OCRScan(2)"
            />
          </section>
          <section>
            <van-field
              name="spsCrdtNo"
              v-model="formData.spsCrdtNo"
              clearable
              required
              :disabled="!isView"
              label="配偶证件号码："
              input-align="right"
              placeholder="请输入配偶证件号码"
              @blur.prevent="ruleMessge"
              :error-message="errorMsg.spsCrdtNo"
              error-message-align="right"
            />
          </section>
          <section>
            <van-field
              name="spsCtcTel"
              v-model="formData.spsCtcTel"
              clearable
              required
              :disabled="!isView"
              label="配偶联系电话："
              input-align="right"
              placeholder="请输入配偶联系电话"
              @blur.prevent="ruleMessge"
              :error-message="errorMsg.spsCtcTel"
              error-message-align="right"
            />
          </section>
          <section>
            <van-cell
              title="配偶文化程度："
              required
              label-class="labelClass"
              @blur.prevent="ruleMessge"
              :label="errorMsg.spsCltrDgr"
              :is-link="isView"
              :value="formData.spsCltrDgrDesc"
              @click.native="!isView?'':loadList('配偶文化程度')"
            />
          </section>
          <section>
            <van-cell
              title="配偶单位性质："
              required
              label-class="labelClass"
              @blur.prevent="ruleMessge"
              :label="errorMsg.spsUnitChar"
              :is-link="isView"
              :value="formData.spsUnitCharDesc"
              @click.native="!isView?'':loadList('配偶单位性质')"
            />
          </section>
          </van-col>
        </van-row>
      </div>
      <!-- 保 存按钮 -->
      <div class="xh-submit">
        <van-button
          size="large"
          class="xh-bg-main"
          :loading="subLoading"
          :disabled="subLoading"
          @click.native="custSubmit"
        >保 存</van-button>
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
import { getGuaranteeInfo, setGuaranteeInfo } from "@/api/client";
import { toUserCard } from "@/utils/validate";
import ViewPage from "@/layout/components/ViewPage";
import Provinces from "@/components/provinces/index";
// 校验
import formValidator from '@/mixins/formValidator'
import request from '@/utils/request';
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
  data() {
    return {
      isView: false, // 是否查看
      loading: false,
      formData: {
        certificateNum: "",
        childrenSituation: "",
        contactPhone: "",
        customerName: "",
        isBonds: "",
        levelEducation: "",
        localResidence: "",
        marriage: "",
        pProvCityZonId: "",
        primarySchool: "",
        rProvCityZonId: "",
        relationCus: "",
        schoolSituation: "",
        spsCltrDgr: "",
        spsCrdtNo: "",
        spsCtcTel: "",
        spsFamilyAddress: "",
        spsNm: "",
        unitChar: ""
      },
      searchData: {
        projectId: "", //项目Id
        id: ""
      },
      subData: {},
      params: {}, // 传过来的参数集合
      rules: {}, //验证 方法
      // cpCertificateNum: cpCertificateNum,//身份证验证
      errorMsg: {
        localResidence: "", //本地居住年限(年)
        spsRsdncDtlAdr: "", //居住地详细地址
        spsNm: "", //配偶姓名
        spsCrdtNo: "", //配偶证件号码
        spsCtcTel: "", //配偶联系电话
        contactPhone: "", //联系电话
        primarySchool: "", //曾就读小学

        certificateNum: "",
        childrenSituation: "",
        customerName: "",
        emgrCtcpsnNm: "",
        isBonds: "",
        levelEducation: "",
        marriage: "",
        relationCus: "",
        schoolSituation: "",
        unitChar: "",
        rProvCityZonId: "",
        pProvCityZonId: ""
      },
      selectShow: false, //下拉选择器显示
      selectLoading: true, //下拉选择 loading
      pickerTitle: "", //下拉列表title
      addressShow: false, // 城市下拉选择器显示
      columns: [], //待选择列表
      subLoading: false, //提交loading
      customerName: "", // 客户名字
      contactPhone: "", // 客户电话
      certificateNum: "", // 客户证件号码
      spsNm: "", // 客户配偶名字
      spsCtcTel: "", // 客户配偶电话
      spsCrdtNo: "", // 客户配偶证件号码
      ruleData: {}
    };
  },
  methods: {
    OCRScan(type) {
      this.$bridge.callHandler('idCardOCR', '', (res) => {
        if(type == 1) {
          this.formData.customerName = res.ID_NAME || '';
          this.formData.certificateNum = res.ID_NUM || '';
        } else {
          this.formData.spsNm = res.ID_NAME || '';
          this.formData.spsCrdtNo = res.ID_NUM || '';
        }
      })
    },
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
    loadList(val) {
      this.pickerTitle = val;
      switch (val) {
        case "是否供债人":
          this.columns = this.wordbook.yes_no;
          this.selectShow = true;
          break;
        case "与客户关系":
          this.columns = this.wordbook.relation_Cus;
          this.selectShow = true;
          break;
        case "文化程度":
          this.columns = this.wordbook.DegreeOfEducation;
          this.selectShow = true;
          break;
        case "户籍地址":
          this.addressShow = true;
          break;
        case "居住地":
          this.addressShow = true;
          break;
        case "子女情况":
          this.columns = this.wordbook.children;
          this.selectShow = true;
          break;
        case "子女上学情况":
          this.columns = this.wordbook.school_Situation;
          this.selectShow = true;
          break;
        case "婚姻状况":
          this.columns = this.wordbook.marriage_type;
          this.selectShow = true;
          break;
      }
    },
    onConfirm(rows) {
      switch (this.pickerTitle) {
        case "是否供债人":
          this.formData.isBondsDesc = rows.label;
          this.formData.isBonds = rows.value;
          break;
        case "与客户关系":
          this.formData.relationCusDesc = rows.label;
          this.formData.relationCus = rows.value;
          break;
        case "文化程度":
          this.formData.levelEducationDesc = rows.label;
          this.formData.levelEducation = rows.value;
          break;
        case "子女情况":
          this.formData.childrenSituationDesc = rows.label;
          this.formData.childrenSituation = rows.value;
          break;
        case "子女上学情况":
          this.formData.schoolSituationDesc = rows.label;
          this.formData.schoolSituation = rows.value;
          break;
        case "婚姻状况":
          this.formData.marriageDesc = rows.label;
          this.formData.marriage = rows.value;
          break;
      }
      this.selectShow = false;
    },

    // 省市区选择
    addressOnConfirm(code, name) {
      switch (this.pickerTitle) {
        case "户籍地址":
          this.formData.pProvCityZon = name;
          this.formData.pProvCityZonId = code;
          this.formData.pProvCityZonCode = code;
          break;
        case "居住地":
          this.formData.rProvCityZon = name;
          this.formData.rProvCityZonId = code;
          this.formData.rProvCityZonCode = code;
          break;
        default:
          break;
      }
      this.addressShow = false;
    },
    subMit() {
      this.subLoading = true;
      setGuaranteeInfo(this.subData).then(res => {
        try {
          this.$notify({
            type: "success",
            message: res.msg
          });
          this.subLoading = false;
          this.$router.go(-1);
        } catch {
          this.subLoading = false;
        }
      });
    },

    // 保存
    custSubmit() {
      let num = 0;
      for (let item in this.errorMsg) {
        this.errorMsg[item] = this.returnMsg(item, this.formData[item]);
        if (this.errorMsg[item] !== '') {
          num++;
        }
      }
      if (num !== 0) {
        return;
      }
      this.subData = {
        ...this.formData,
        sex: toUserCard(this.formData.certificateNum, 2),
        age: toUserCard(this.formData.certificateNum, 3),
        spsGnd: this.formData.spsCrdtNo
          ? toUserCard(this.formData.spsCrdtNo, 2)
          : "",
        spsAge: this.formData.spsCrdtNo
          ? toUserCard(this.formData.spsCrdtNo, 3)
          : "",
        projectId: this.params.projectId
      };
      this.subMit();
    },
    // 获取新信息
    loadClient() {
      let obj = {
        id: this.params.id,
      };
      this.loading = true;
      getGuaranteeInfo(obj).then(res => {
        const { code, data, msg } = res;
        try {
          this.formData = res.data;
          // this.formData.birthday = toUserCard(this.formData.certificateNum, 1);
          this.formData.isBondsDesc = this.returnText(
            "yes_no",
            this.formData.isBonds
          );
          this.formData.relationCusDesc = this.returnText(
            "relation_Cus",
            this.formData.relationCus
          );
          this.formData.marriageDesc = this.returnText(
            "marriage_type",
            this.formData.marriage
          );
          this.formData.levelEducationDesc = this.returnText(
            "DegreeOfEducation",
            this.formData.levelEducation
          );
          this.formData.childrenSituationDesc = this.returnText(
            "children",
            this.formData.childrenSituation
          );
          this.formData.schoolSituationDesc = this.returnText(
            "school_Situation",
            this.formData.schoolSituation
          );
          this.formData.spsCltrDgrDesc = this.returnText(
            "DegreeOfEducation",
            this.formData.spsCltrDgr
          );
          this.formData.unitCharDesc = this.returnText(
            "unit_Property",
            this.formData.unitChar
          );
          this.formData.spsUnitCharDesc = this.returnText(
            "unit_Property",
            this.formData.spsUnitChar
          );
          this.loading = false;
        } catch {
          this.loading = false;
        }
      });
    }
  },
  created() {
    this.params = this.$route.query;
    this.isView = this.params.isView == 0?true:false;
    if (this.params.isView == 1) {
      this.loadClient();
    } else {
      this.rulesForm("order/cuGuarantee");
    }
  }
};
</script>

<style lang="scss">
</style>
