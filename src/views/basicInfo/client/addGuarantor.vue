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
                :required="isView"
                :disabled="!isView"
                label="担保人姓名："
                input-align="right"
                label-width="100px"
              :placeholder="isView?'请填写':''"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.customerName"
                error-message-align="right"
                :right-icon="isView?'photograph':''"
                @click-right-icon="OCRScan(1)"
                class="xh-right-icon"
              />
            </section>
            <section>
              <van-field
                name="certificateNum"
                v-model="formData.certificateNum"
                clearable
                :required="isView"
                :disabled="!isView"
                label="证件号码："
                input-align="right"
              :placeholder="isView?'请填写':''"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.certificateNum"
                error-message-align="right"
              />
            </section>
            <section>
              <van-cell
                title="是否共债人："
                :required="isView"
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
                :required="isView"
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
                :required="isView"
                :disabled="!isView"
                label="联系电话："
                input-align="right"
              :placeholder="isView?'请填写':''"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.contactPhone"
                error-message-align="right"
              />
            </section>
            <section>
              <van-cell
                title="文化程度："
                :required="isView"
                :is-link="isView"
                :value="formData.levelEducationDesc"
                label-class="labelClass"
                @blur.prevent="ruleMessge"
                :label="errorMsg.levelEducation"
                @click.native="!isView?'':loadList('文化程度')"
              />
            </section>
            <section>
              <van-cell
                title="单位性质："
                :required="isView"
                label-class="labelClass"
                @blur.prevent="ruleMessge"
                :label="errorMsg.unitChar"
                :is-link="isView"
                :value="formData.unitCharDesc"
                @click.native="!isView?'':loadList('单位性质')"
              />
            </section>
            <section>
              <van-field
                v-model="formData.primarySchool"
                clearable
                :disabled="!isView"
                label="曾就读小学："
                input-align="right"
              :placeholder="isView?'请填写':''"
              />
            </section>
            <section>
              <van-cell
                title="户籍地址："
                :required="isView"
                label-class="labelClass"
                @blur.prevent="ruleMessge"
                :label="errorMsg.pProvCityZonId"
                :is-link="isView"
                :value="formData.pProvCityZon"
                @click.native="!isView?'':loadList('户籍地址')"
              />
            </section>
            <section>
              <van-cell
                title="居住地："
                :required="isView"
                label-class="labelClass"
                @blur.prevent="ruleMessge"
                :label="errorMsg.rProvCityZonId"
                :is-link="isView"
                :value="formData.rProvCityZon"
                @click.native="!isView?'':loadList('居住地')"
              />
            </section>
            <section>
              <van-field
                v-model="formData.spsRsdncDtlAdr"
                :required="isView"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.spsRsdncDtlAdr"
                error-message-align="right"
                clearable
                rows="1"
                autosize
                type="textarea"
                :disabled="!isView"
                label="居住地详细地址："
                label-width="130px"
                input-align="right"
              :placeholder="isView?'请填写':''"
              />
            </section>
            <section>
              <van-cell
                title="子女情况："
                :required="isView"
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
                :required="isView"
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
                :required="isView"
                :disabled="!isView"
                label="本地居住年限："
                label-width="120px"
                input-align="right"
                :placeholder="isView?'请填写':''"
              >
                <div slot="button" v-if="formData.localResidence">年</div>
              </van-field>
            </section>
            <section>
              <van-cell
                title="婚姻状况："
                :required="isView"
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
              :required="isView"
              :disabled="!isView"
              label="配偶姓名："
              input-align="right"
              :placeholder="isView?'请填写':''"
              @blur.prevent="ruleMessge"
              :error-message="errorMsg.spsNm"
              error-message-align="right"
              :right-icon="isView?'photograph':''"
              @click-right-icon="OCRScan(2)"
              class="xh-right-icon"
            />
          </section>
          <section>
            <van-field
              name="spsCrdtNo"
              v-model="formData.spsCrdtNo"
              clearable
              :required="isView"
              :disabled="!isView"
              label="配偶证件号码："
              input-align="right"
              :placeholder="isView?'请填写':''"
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
              :required="isView"
              :disabled="!isView"
              label="配偶联系电话："
              input-align="right"
              :placeholder="isView?'请填写':''"
              @blur.prevent="ruleMessge"
              :error-message="errorMsg.spsCtcTel"
              error-message-align="right"
            />
          </section>
          <section>
            <van-cell
              title="配偶文化程度："
              :required="isView"
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
              :required="isView"
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
      <div class="xh-submit" v-if="isView">
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
      <!-- 图片选择方式 -->
      <van-action-sheet :close-on-click-overlay="false" cancel-text="取消"
  @cancel="show3 = false" v-model="show3" :actions="actions" @select="onSelect" />

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
      show3: false,
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
        spsRsdncDtlAdr: "", //居住地详细地址
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
      ruleData: {},
      actions: [
        { name: "相机扫描识别", value: "scan" },
        { name: "相册导入识别", value: "album" }
      ],
      ocrType: ''
    };
  },
  watch: {
    'formData.marriage'(val) {
      if(val == 2 || val == 4) {
        this.errorMsg = {
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
          unitChar: "",
          rProvCityZonId: "",
          pProvCityZonId: ""
        }
      } else {
        this.errorMsg = {
          spsRsdncDtlAdr: "", //居住地详细地址
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
          rProvCityZonId: "",
          pProvCityZonId: ""
        }
      }
    },
    'formData.childrenSituation'(val) {
      if(val == 0) {
        Vue.delete(this.errorMsg, "schoolSituation");
      } else {
        this.$set(this.errorMsg, "schoolSituation", "");
      }
      console.log(this.errorMsg);
    }
  },
  methods: {
    onSelect(rows) {
      this.$bridge.callHandler('idCardOCR', rows.value, (res) => {
        if(this.ocrType == 1) {
          this.formData.customerName = res.ID_NAME || '';
          this.formData.certificateNum = res.ID_NUM || '';
        } else {
          this.formData.spsNm = res.ID_NAME || '';
          this.formData.spsCrdtNo = res.ID_NUM || '';
        }
        this.show3 = false;
      })
    },
    OCRScan(type) {
      this.ocrType = type;
      this.show3 = true;
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
        case "单位性质":
          this.columns = this.wordbook.unit_Property;
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
        case "配偶文化程度":
          this.columns = this.wordbook.DegreeOfEducation;
          this.selectShow = true;
          break;
        case "配偶单位性质":
          this.columns = this.wordbook.unit_Property;
          this.selectShow = true;
          break;
      }
    },
    onConfirm(rows) {
      switch (this.pickerTitle) {
        case "是否供债人":
          this.formData.isBondsDesc = rows.label;
          this.formData.isBonds = rows.value;
          this.errorMsg.isBonds = '';
          break;
        case "与客户关系":
          this.formData.relationCusDesc = rows.label;
          this.formData.relationCus = rows.value;
          this.errorMsg.relationCus = '';
          break;
        case "文化程度":
          this.formData.levelEducationDesc = rows.label;
          this.formData.levelEducation = rows.value;
          this.errorMsg.levelEducation = '';
          break;
        case "子女情况":
          this.formData.childrenSituationDesc = rows.label;
          this.formData.childrenSituation = rows.value;
          if(rows.value == 0) {
            this.errorMsg.schoolSituation = '';
          } else {
            this.errorMsg.childrenSituation = '';
          }
          break;
        case "子女上学情况":
          this.formData.schoolSituationDesc = rows.label;
          this.formData.schoolSituation = rows.value;
          this.errorMsg.schoolSituation = '';
          break;
        case "婚姻状况":
          this.formData.marriageDesc = rows.label;
          this.formData.marriage = rows.value;
          this.errorMsg.marriage = '';
          break;
        case "单位性质":
          this.formData.unitCharDesc = rows.label;
          this.formData.unitChar = rows.value;
          this.errorMsg.unitChar = '';
          break;
        case "配偶文化程度":
          this.formData.spsCltrDgrDesc = rows.label;
          this.formData.spsCltrDgr = rows.value;
          this.errorMsg.spsCltrDgr = '';
          break;
        case "配偶单位性质":
          this.formData.spsUnitCharDesc = rows.label;
          this.formData.spsUnitChar = rows.value;
          this.errorMsg.spsUnitChar = '';
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
          this.errorMsg.pProvCityZonId = '';
          break;
        case "居住地":
          this.formData.rProvCityZon = name;
          this.formData.rProvCityZonId = code;
          this.formData.rProvCityZonCode = code;
          this.errorMsg.rProvCityZonId = '';
          break;
        default:
          break;
      }
      this.addressShow = false;
    },
    subMit() {
      this.subLoading = true;
      // 居住年限不能小于年龄
      if(this.formData.localResidence > this.subData.age) {
        this.$notify({ type: 'danger', message: '居住年限不能大于年龄' });
        return
      }
      setGuaranteeInfo(this.subData).then(res => {
        this.$notify({
          type: "success",
          message: res.msg
        });
        this.subLoading = false;
        this.$router.go(-1);
      }).catch(()=>{
        this.subLoading = false;
      });
    },

    // 保存
    custSubmit() {
      let num = 0;
      console.log(this.errorMsg);
      for (let item in this.errorMsg) {
        this.errorMsg[item] = this.returnMsg(item, this.formData[item]);
        if (this.errorMsg[item]) {
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
        const { data } = res;
        try {
          this.formData = data;
          this.formData.isBondsDesc = this.returnText(
            "yes_no",
            data.isBonds
          );
          this.formData.relationCusDesc = this.returnText(
            "relation_Cus",
            data.relationCus
          );
          this.formData.marriageDesc = this.returnText(
            "marriage_type",
            data.marriage
          );
          this.formData.levelEducationDesc = this.returnText(
            "DegreeOfEducation",
            data.levelEducation
          );
          this.formData.childrenSituationDesc = this.returnText(
            "children",
            data.childrenSituation
          );
          this.formData.schoolSituationDesc = this.returnText(
            "school_Situation",
            data.schoolSituation
          );
          this.formData.spsCltrDgrDesc = this.returnText(
            "DegreeOfEducation",
            data.spsCltrDgr
          );
          this.formData.unitCharDesc = this.returnText(
            "unit_Property",
            data.unitChar
          );
          this.formData.spsUnitCharDesc = this.returnText(
            "unit_Property",
            data.spsUnitChar
          );

          this.formData.spsCltrDgrDesc = this.returnText(
            "DegreeOfEducation",
            data.spsCltrDgr
          );
          this.formData.spsUnitCharDesc = this.returnText(
            "unit_Property",
            data.spsUnitChar
          );
          this.formData.unitCharDesc = this.returnText(
            "unit_Property",
            data.unitChar
          );
          this.formData.pProvCityZonId = data.pProvCityZonCode;
          this.formData.rProvCityZonId = data.rProvCityZonCode;
          this.loading = false;
        } catch {
          this.loading = false;
        }
      });
    }
  },
  created() {
    this.params = this.$route.query;
    this.isView = this.params.isView == 0;
    if (this.params.id) {
      this.loadClient();
    }
    this.rulesForm("order/cuGuarantee");
  }
};
</script>

<style lang="scss">
</style>
