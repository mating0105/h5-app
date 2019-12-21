<template>
  <!-- 客户及配偶 -->
  <ViewPage :loading="loading">
    <div class="xh-page-body">
      <div class="xh-card-box xh-radius">
        <van-row>
          <van-col :span="24">
            <section>
              <van-field
                name="customerName"
                v-model="formData.customerName"
                required
                clearable
                label="客户姓名："
                input-align="right"
                placeholder="请输入客户姓名"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.customerName"
              />
            </section>
            <section>
              <van-field
                name="certificateNum"
                v-model="formData.certificateNum"
                required
                clearable
                label="证件号码："
                input-align="right"
                placeholder="请输入证件号码"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.certificateNum"
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
                title="婚姻状况："
                required
                :is-link="isView == 0"
                :value="formData.marriageDesc"
                @click.native="isView == 1?'':loadList('婚姻状况')"
              />
            </section>
            <section>
              <van-cell
                title="文化程度："
                required
                :is-link="isView == 0"
                :value="formData.levelEducationDesc"
                @click.native="isView == 1?'':loadList('文化程度')"
              />
            </section>
            <section>
              <van-cell
                title="单位性质："
                required
                :is-link="isView == 0"
                :value="formData.unitCharDesc"
                @click.native="isView == 1?'':loadList('单位性质')"
              />
            </section>
            <section>
              <van-field
                name="primarySchool"
                v-model="formData.primarySchool"
                clearable
                required
                label="曾就读小学："
                input-align="right"
                placeholder="请输入曾就读小学"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.primarySchool"
              />
            </section>
            <section>
              <van-cell
                title="户籍地址："
                required
                :is-link="isView == 0"
                :value="formData.pProvCityZon"
                @click.native="isView == 1?'':loadList('户籍地址')"
              />
            </section>
            <section>
              <van-cell
                title="居住地："
                required
                :is-link="isView == 0"
                :value="formData.rProvCityZon"
                @click.native="isView == 1?'':loadList('居住地')"
              />
            </section>
            <section>
              <van-field
                name="spsRsdncDtlAdr"
                v-model="formData.spsRsdncDtlAdr"
                required
                clearable
                label="居住地详细地址："
                input-align="right"
                placeholder="请输入详细地址"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.spsRsdncDtlAdr"
              />
            </section>
            <section>
              <van-cell
                title="子女情况："
                required
                :is-link="isView == 0"
                :value="formData.childrenSituationDesc"
                @click.native="isView == 1?'':loadList('子女情况')"
              />
            </section>
            <section v-if="formData.childrenSituationDesc != '无' ">
              <van-cell
                title="子女上学情况："
                required
                :is-link="isView == 0"
                :value="formData.schoolSituationDesc"
                @click.native="isView == 1?'':loadList('子女上学情况')"
              />
            </section>
            <section>
              <van-field
                name="localResidence"
                v-model="formData.localResidence"
                clearable
                required
                type="number"
                label="本地居住年限(年)："
                input-align="right"
                placeholder="请输入居住年限"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.localResidence"
              />
            </section>
            <section>
              <van-field
                name="remark"
                v-model="formData.remark"
                type="textarea"
                placeholder="请输入备注"
                rows="1"
                autosize
              />
            </section>
          </van-col>
        </van-row>
        <van-row style="background: white;" v-if="spouseShow">
          <van-col :span="21">
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
              />
            </section>
          </van-col>
          <van-col :span="3">
            <div style="height: 35.38px;background: white;text-align: center;" @click="OCRScan">
              <!-- <img src="../../../icon/icon-ocr.png" style="height: 15px;padding: 8px 5px;"> -->
            </div>
          </van-col>
          <van-col :span="24">
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
                :is-link="isView == 0"
                :value="formData.spsCltrDgrDesc"
                @click.native="isView == 1?'':loadList('配偶文化程度')"
              />
            </section>
            <section>
              <van-cell
                title="配偶单位性质："
                required
                :is-link="isView == 0"
                :value="formData.spsUnitCharDesc"
                @click.native="isView == 1?'':loadList('配偶单位性质')"
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
          @cancel="onCancel"
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
import {
  getClientInfo,
  setClientSave
} from "@/api/client";
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
      isView: 1,
      loading: false,
      formData: {
        // 额外提交(上页传递)
        projectId: "", //项目Id
        customerId: "", //客户id
        customerNum: "", //客户编号
        certificateType: "1", //证件类型
        id: "", // 查询接口返回
        // 额外提交
        customerName: "", //客户姓名
        certificateNum: "", //证件号码
        contactPhone: "", //联系电话
        marriage: "", //婚姻状况
        marriageDesc: "",
        unitChar: "", //单位性质
        unitCharDesc: "",
        levelEducation: "", //文化程度
        levelEducationDesc: "",
        primarySchool: "", //曾就读小学
        pProvCityZon: "", //户籍地址
        rProvCityZon: "", //居住地
        spsRsdncDtlAdr: "", //居住地详细地址
        childrenSituation: "", //子女情况
        childrenSituationDesc: "",
        schoolSituation: "", //子女上学情况
        schoolSituationDesc: "",
        localResidence: "", //本地居住年限(年)
        remark: "", //备注
        spsNm: "", //配偶姓名
        spsCrdtTp: "", //配偶证件类型
        spsCrdtNo: "", //配偶证件号码
        spsCtcTel: "", //配偶联系电话
        spsCltrDgr: "", //配偶文化程度
        spsCltrDgrDesc: "",
        spsUnitChar: "", //配偶单位性质
        spsUnitCharDesc: ""
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
      spouseShow: false, //显示配偶
      selectShow: false, //下拉选择器显示
      selectLoading: true, //下拉选择 loading
      pickerTitle: "", //下拉列表title
      addressShow: false, // 城市下拉选择器显示
      areaList: {
        province_list: [],
        city_list: [],
        county_list: []
      }, //城市列表 init
      columns: [], //待选择列表
      pProvCityZonList: [], //户籍地址
      rProvCityZonList: [], //居住地
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
        case "婚姻状况":
          this.selectShow = true;
          this.columns = this.wordbook.marriage_type;
          break;
        case "文化程度":
          this.selectShow = true;
          this.columns = this.wordbook.DegreeOfEducation;
          break;
        case "户籍地址":
          this.addressShow = true;
          break;
        case "居住地":
          this.addressShow = true;
          break;
        case "子女情况":
          this.selectShow = true;
          this.columns = this.wordbook.children;
          break;
        case "子女上学情况":
          this.selectShow = true;
          this.columns = this.wordbook.school_Situation;
          break;
        case "配偶文化程度":
          this.selectShow = true;
          this.columns = this.wordbook.DegreeOfEducation;
          break;
        case "单位性质":
          this.selectShow = true;
          this.columns = this.wordbook.unit_Property;
          break;
        case "配偶单位性质":
          this.selectShow = true;
          this.columns = this.wordbook.unit_Property;
          break;
      }
    },
    onConfirm(rows, index) {
      switch (this.pickerTitle) {
        case "婚姻状况":
          this.formData.marriage = rows.value;
          this.formData.marriageDesc = rows.label;
          break;
        case "文化程度":
          this.formData.levelEducation = rows.value;
          this.formData.levelEducationDesc = rows.label;
          break;
        case "子女情况":
          this.formData.childrenSituation = rows.value;
          this.formData.childrenSituationDesc = rows.label;
          break;
        case "子女上学情况":
          this.formData.schoolSituation = rows.value;
          this.formData.schoolSituationDesc = rows.label;
          break;
        case "配偶文化程度":
          this.formData.spsCltrDgr = rows.value;
          this.formData.spsCltrDgrDesc = rows.label;
          break;
        case "单位性质":
          this.formData.unitChar = rows.value;
          this.formData.unitCharDesc = rows.label;
          break;
        case "配偶单位性质":
          this.formData.spsUnitChar = rows.value;
          this.formData.spsUnitCharDesc = rows.label;
          break;
      }

      if (
        this.formData.marriageDesc == "已婚" ||
        this.formData.marriageDesc == "事实婚姻"
      ) {
        this.spouseShow = true;
      } else {
        this.spouseShow = false;
      }
      this.selectShow = false;
    },
    onCancel() {
      this.selectShow = false;
      this.selectLoading = true;
    },

    // 省市区选择
    addressOnConfirm(code, name) {
      switch (this.pickerTitle) {
        case '户籍地址':
          this.formData.pProvCityZon = name;
          this.formData.pprovCityZon = name;
          this.formData.pProvCityZonCode = code;
          break;
        case '居住地':
          this.formData.rProvCityZon = name;
          this.formData.rprovCityZon = name;
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
      setClientSave(this.subData)
        .then(res => {
          this.subLoading = false;
          this.subDisabled = false;
          if(res.code == 200) {
            this.$notify({
              type: "success",
              message: res.msg
            });
            this.$router.go(-1);
          } else {
            this.$notify({
              type: "danger",
              message: res.msg
            });
          }
        })
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
        : ""
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
        id: this.params.customerId,
        projectId: this.params.projectId
      }
      this.loading = true;
      getClientInfo(obj).then(res => {
        const { data } = res;
        this.formData = data;
        this.formData.birthday = toUserCard(this.formData.certificateNum,1);
        this.formData.marriageDesc = this.returnText('marriage_type', this.formData.marriage);
        this.formData.levelEducationDesc = this.returnText('DegreeOfEducation', this.formData.levelEducation);
        this.formData.childrenSituationDesc = this.returnText('children', this.formData.childrenSituation);
        this.formData.schoolSituationDesc = this.returnText('school_Situation', this.formData.schoolSituation);
        this.formData.spsCltrDgrDesc = this.returnText('DegreeOfEducation', this.formData.spsCltrDgr);
        this.formData.unitCharDesc = this.returnText('unit_Property', this.formData.unitChar);
        this.formData.spsUnitCharDesc = this.returnText('unit_Property', this.formData.spsUnitChar); 
        this.loading = false;
      }).catch(()=>{
        this.loading = false;
      });
    }
  },
  created() {
    this.params = this.$route.query;
    this.isView = this.params.type;
    if (this.params.type == 1) {
      this.loadClient();
    }
  }
};
</script>

<style lang="scss">
</style>
