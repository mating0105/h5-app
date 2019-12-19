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
                label="担保人姓名："
                input-align="right"
                placeholder="请输入担保人姓名"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.loanPersonName"
                right-icon="photograph"
                @click-right-icon="OCRScan"
              />
            </section>
            <section>
              <van-field
                name="certificateNum"
                v-model="formData.certificateNum"
                clearable
                required
                label="证件号码："
                input-align="right"
                placeholder="请输入证件号码"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.certificateNum"
              />
            </section>
            <section>
              <van-cell
                title="是否共债人："
                required
                is-link
                :value="formData.isBondsDesc"
                @click.native="loadList('是否供债人')"
              />
            </section>
            <section>
              <van-cell
                title="与客户关系："
                required
                is-link
                :value="formData.relationCusDesc"
                @click.native="loadList('与客户关系')"
              />
            </section>
            <section>
              <van-field
                name="contactPhone"
                v-model="formData.contactPhone"
                clearable
                required
                label="联系电话："
                input-align="right"
                placeholder="请输入联系电话"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.contactPhone"
              />
            </section>
            <section>
              <van-cell
                title="文化程度："
                required
                is-link
                :value="formData.levelEducationDesc"
                @click.native="loadList('文化程度')"
              />
            </section>
            <section>
              <van-field
                v-model="formData.primarySchool"
                clearable
                label="曾就读小学："
                input-align="right"
                placeholder="请输入曾就读小学"
              />
            </section>
            <section>
              <van-cell
                title="户籍地址："
                required
                is-link
                :value="formData.pProvCityZon"
                @click.native="loadList('户籍地址')"
              />
            </section>
            <section>
              <van-cell
                title="居住地："
                required
                is-link
                :value="formData.rProvCityZon"
                @click.native="loadList('居住地')"
              />
            </section>
            <section>
              <van-field
                v-model="formData.spsRsdncDtlAdr"
                required
                clearable
                label="居住地详细地址："
                input-align="right"
                placeholder="请输入详细地址"
              />
            </section>
            <section>
              <van-cell
                title="子女情况："
                required
                is-link
                :value="formData.childrenSituationDesc"
                @click.native="loadList('子女情况')"
              />
            </section>
            <section v-if="formData.childrenSituation != '0'">
              <van-cell
                title="子女上学情况："
                required
                is-link
                :value="formData.schoolSituationDesc"
                @click.native="loadList('子女上学情况')"
              />
            </section>
            <section>
              <van-field
                v-model="formData.localResidence"
                clearable
                label="本地居住年限(年)："
                input-align="right"
                placeholder="请输入居住年限"
              />
            </section>
            <section>
              <van-cell
                title="婚姻状况："
                required
                is-link
                :value="formData.marriageDesc"
                @click.native="loadList('婚姻状况')"
              />
            </section>
          </van-col>
        </van-row>
        <van-row style="background: white;" v-if="formData.marriage == 2 || formData.marriage == 4">
          <section>
            <van-field
              name="spsNm"
              v-model="spsNm"
              clearable
              required
              label="配偶姓名："
              input-align="right"
              placeholder="请输入配偶姓名"
              @blur.prevent="ruleMessge"
              :error-message="errorMsg.spsNm"
              right-icon="photograph"
              @click-right-icon="OCRScan"
            />
          </section>
          <section>
            <van-field
              name="spsCrdtNo"
              v-model="spsCrdtNo"
              clearable
              required
              label="配偶证件号码："
              input-align="right"
              placeholder="请输入配偶证件号码"
              @blur.prevent="ruleMessge"
              :error-message="errorMsg.spsCrdtNo"
            />
          </section>
          <section>
            <van-field
              name="spsCtcTel"
              v-model="spsCtcTel"
              clearable
              required
              label="配偶联系电话："
              input-align="right"
              placeholder="请输入配偶联系电话"
              @blur.prevent="ruleMessge"
              :error-message="errorMsg.spsCtcTel"
            />
          </section>
          <section>
            <van-cell
              title="配偶文化程度："
              required
              is-link
              :value="formData.spsCltrDgrDesc"
              @click.native="loadList('配偶文化程度')"
            />
          </section>
          <section>
            <van-cell
              title="配偶单位性质："
              required
              is-link
              :value="formData.spsUnitCharDesc"
              @click.native="loadList('配偶单位性质')"
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
          :class="[subDisabled ? 'buttonNoColor' : 'buttonColor']"
          :loading="subLoading"
          :disabled="subDisabled"
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
      isView: 0, // 是否查看
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
        pProvCityZonId: "",
        rProvCityZonId: "",
        relationCus: "",
        schoolSituation: "",
        unitChar: ""
      },
      selectShow: false, //下拉选择器显示
      selectLoading: true, //下拉选择 loading
      pickerTitle: "", //下拉列表title
      addressShow: false, // 城市下拉选择器显示
      columns: [], //待选择列表
      subLoading: false, //提交loading
      subDisabled: false, //按钮禁用状态
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
    OCRScan() {
      bridge.callhandler("OCRScan", "1", data => {
        this.$set(this, "spsNm", data.ID_NAME);
        this.$set(this, "spsCrdtNo", data.ID_NUM);
      });
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
      this.subDisabled = true;
      setGuaranteeInfo(this.subData).then(res => {
        try {
          this.$notify({
            type: "success",
            message: res.msg
          });
          this.$router.go(-1);
        } catch(t) {
          console.log(t);
        }
        
        this.subLoading = false;
        this.subDisabled = false;
      });
    },

    // submit
    custSubmit() {
      let sub1 = false,
        sub2 = false,
        errNum = 0;
      for (let item in this.errorMsg) {
        this.errorMsg[item] ? errNum++ : "";
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
    // 有接口验证的时候
    urlRules(urls, rows) {
      let param = rows.params.split(",");
      let obj = {};
      param.forEach(t => {
        obj[t] = this.formData[t];
      });
      requestUrl.getList(urls, obj, "soa").then(res => {
        if (res.data.code === 200) {
          let { message } = res.data.data;
          this.errorMsg[rows.field] = message;
        } else {
          this.$toast(res.data.msg);
        }
      });
    },
    // 验证值
    returnMsg(name, value) {
      if (this.ruleData[name]) {
        let infoObj = this.ruleData[name];
        let error = ""; // 错误信息
        if (infoObj.mustFill) {
          if (value == "" || value === undefined || value === null) {
            error = "必填项，不能为空";
          }
        } else {
          if (value == "" || value === undefined || value === null) {
            error = "";
          }
        }
        if (infoObj.regular.length > 0) {
          for (let i = 0; i < infoObj.regular.length; i += 1) {
            const { rule, message } = infoObj.regular[i];
            const reg = new RegExp(rule);
            if (!reg.test(value)) {
              error = message;
            } else {
              if (infoObj.urlSuffix) {
                this.urlRules(infoObj.urlSuffix, infoObj);
              }
            }
          }
        }
        return error;
      }
    },
    ruleMessge(e) {
      let name = e.target.name;
      let val = e.target.value;
      this.errorMsg[name] = this.returnMsg(name, val);
    },
    // 获取验证信息
    rulesForm() {
      requestUrl
        .getList(
          "/manage/regularConfig/getRegularByServer",
          { serverName: "order/viceProj" },
          "soa"
        )
        .then(res => {
          if (res.data.code === 200) {
            this.ruleData = res.data.data;
          } else {
            this.$toast(res.data.message);
          }
        });
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
    if (this.params.type == 1) {
      this.isView = this.params.type;
      this.loadClient();
    }
  }
};
</script>

<style lang="scss">
</style>
