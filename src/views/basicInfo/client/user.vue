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
                :required="isView"
                :disabled="!isView"
                clearable
                label="客户姓名："
                input-align="right"
                placeholder="请输入客户姓名"
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
                :required="isView"
                clearable
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
              <van-field
                name="contactPhone"
                v-model="formData.contactPhone"
                clearable
                :required="isView"
                :disabled="!isView"
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
                :required="isView"
                :is-link="isView"
                :value="formData.marriageDesc"
                label-class="labelClass"
                @blur.prevent="ruleMessge"
                :label="errorMsg.marriage"
                @click.native="!isView?'':loadList('婚姻状况')"
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
                :is-link="isView"
                :value="formData.unitCharDesc"
                label-class="labelClass"
                @blur.prevent="ruleMessge"
                :label="errorMsg.unitChar"
                @click.native="!isView?'':loadList('单位性质')"
              />
            </section>
            <section>
              <van-field
                name="primarySchool"
                v-model="formData.primarySchool"
                clearable
                :required="isView"
                :disabled="!isView"
                label="曾就读小学："
                input-align="right"
                placeholder="请输入曾就读小学"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.primarySchool"
                error-message-align="right"
              />
            </section>
            <section>
              <van-cell
                title="户籍地址："
                :required="isView"
                :is-link="isView"
                :value="formData.pProvCityZon"
                label-class="labelClass"
                @blur.prevent="ruleMessge"
                :label="errorMsg.pProvCityZonId"
                @click.native="!isView?'':loadList('户籍地址')"
              />
            </section>
            <section>
              <van-cell
                title="居住地："
                :required="isView"
                :is-link="isView"
                :value="formData.rProvCityZon"
                label-class="labelClass"
                @blur.prevent="ruleMessge"
                :label="errorMsg.rProvCityZonId"
                @click.native="!isView?'':loadList('居住地')"
              />
            </section>
            <section>
              <van-field
                name="spsRsdncDtlAdr"
                v-model="formData.spsRsdncDtlAdr"
                :required="isView"
                clearable
                :disabled="!isView"
                label="居住地详细地址："
                input-align="right"
                placeholder="请输入详细地址"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.spsRsdncDtlAdr"
                error-message-align="right"
              />
            </section>
            <section>
              <van-cell
                title="子女情况："
                :required="isView"
                :is-link="isView"
                :value="formData.childrenSituationDesc"
                label-class="labelClass"
                @blur.prevent="ruleMessge"
                :label="errorMsg.childrenSituation"
                @click.native="!isView?'':loadList('子女情况')"
              />
            </section>
            <section v-if="formData.childrenSituationDesc != '无' ">
              <van-cell
                title="子女上学情况："
                :required="isView"
                :is-link="isView"
                :value="formData.schoolSituationDesc"
                label-class="labelClass"
                @blur.prevent="ruleMessge"
                :label="errorMsg.schoolSituation"
                @click.native="!isView?'':loadList('子女上学情况')"
              />
            </section>
            <section>
              <van-field
                name="localResidence"
                v-model="formData.localResidence"
                clearable
                :required="isView"
                :disabled="!isView"
                type="number"
                label="本地居住年限(年)："
                input-align="right"
                placeholder="请输入居住年限"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.localResidence"
                error-message-align="right"
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
              placeholder="请输入配偶姓名"
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
              :required="isView"
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
              :required="isView"
              :is-link="isView"
              :value="formData.spsCltrDgrDesc"
              label-class="labelClass"
              @blur.prevent="ruleMessge"
              :label="errorMsg.spsCltrDgr"
              @click.native="!isView?'':loadList('配偶文化程度')"
            />
          </section>
          <section>
            <van-cell
              title="配偶单位性质："
              :required="isView"
              :is-link="isView"
              label-class="labelClass"
              @blur.prevent="ruleMessge"
              :label="errorMsg.spsUnitChar"
              :value="formData.spsUnitCharDesc"
              @click.native="!isView?'':loadList('配偶单位性质')"
            />
          </section>
        </van-row>
        <section>
          <van-field
            name="remark"
            v-model="formData.remark"
            type="textarea"
            placeholder="请输入备注"
            rows="1"
            autosize
            :disabled="!isView"
          />
        </section>
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
      <van-action-sheet v-model="show3" :actions="actions" @select="onSelect" />

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
// 校验
import formValidator from '@/mixins/formValidator'

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
  watch:{
    "formData.marriage"(newValue,oldValue){
      var arr=['spsCltrDgr','spsUnitChar','spsNm','spsCtcTel','spsCrdtNo'];
      if(newValue=='2' || newValue == "4"){
        arr.forEach((item,index)=>{
          this.$set(this.errorMsg,item,'');
        })
      }else{
        arr.forEach((item,index)=>{
          Vue.delete(this.errorMsg,item);
        })
      }
    },
    "formData.childrenSituation"(newValue,oldValue) {
      if(newValue=='1'){
        this.$set(this.errorMsg,'schoolSituation','');
      }else{
        Vue.delete(this.errorMsg,'schoolSituation');
      }
    }
  },
  data() {
    return {
      isView: false,
      loading: false,
      show3: false,
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
      errorMsg: {
        rProvCityZonId: '',
        pProvCityZonId: '',
        customerName: '',
        marriage: '',
        childrenSituation: '',
        localResidence: '',
        primarySchool: '',
        levelEducation: '',
        unitChar: '',
        contactPhone: '',
        certificateNum: '',
        spsRsdncDtlAdr: '',
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
      actions: [
        { name: "相机扫描识别", value: "scan" },
        { name: "相册导入识别", value: "album" }
      ],
      ocrType: ''
    };
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
          this.errorMsg.marriage='';
          break;
        case "文化程度":
          this.formData.levelEducation = rows.value;
          this.formData.levelEducationDesc = rows.label;
          this.errorMsg.levelEducation='';
          break;
        case "子女情况":
          this.formData.childrenSituation = rows.value;
          this.formData.childrenSituationDesc = rows.label;
          this.errorMsg.childrenSituation='';
          break;
        case "子女上学情况":
          this.formData.schoolSituation = rows.value;
          this.formData.schoolSituationDesc = rows.label;
          this.errorMsg.schoolSituation='';
          break;
        case "配偶文化程度":
          this.formData.spsCltrDgr = rows.value;
          this.formData.spsCltrDgrDesc = rows.label;
          this.errorMsg.spsCltrDgr='';
          break;
        case "单位性质":
          this.formData.unitChar = rows.value;
          this.formData.unitCharDesc = rows.label;
          this.errorMsg.unitChar='';
          break;
        case "配偶单位性质":
          this.formData.spsUnitChar = rows.value;
          this.formData.spsUnitCharDesc = rows.label;
          this.errorMsg.spsUnitChar='';
          break;
      }
      this.selectShow = false;
    },

    // 省市区选择
    addressOnConfirm(code, name) {
      switch (this.pickerTitle) {
        case '户籍地址':
          this.formData.pProvCityZon = name;
          this.formData.pprovCityZon = name;
          this.formData.pProvCityZonId = code;
          this.formData.pProvCityZonCode = code;
          this.errorMsg.pProvCityZonId='';
          break;
        case '居住地':
          this.formData.rProvCityZon = name;
          this.formData.rprovCityZon = name;
          this.formData.rProvCityZonId = code;
          this.formData.rProvCityZonCode = code;
          this.errorMsg.rProvCityZonId='';
          break;
        default:
          break;
      }
      this.addressShow = false;
    },
    subMit() {
      let num = 0;
      for (let item in this.errorMsg) {
        this.errorMsg[item]= this.returnMsg(item, this.formData[item]);
        if (this.errorMsg[item]) {
          num++;
        }
      }
      if (num !== 0) {
        return;
      }
      this.subLoading = true;
      setClientSave(this.subData)
        .then(res => {
          this.$notify({
            type: "success",
            message: res.msg
          });
          this.subLoading = false;
          this.$router.go(-1);
        }).catch(()=> {
          this.subLoading = false;
        });
    },

    // submit
    custSubmit() {
     
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
        this.formData.birthday = toUserCard(data.certificateNum,1);
        this.formData.marriageDesc = this.returnText('marriage_type', data.marriage);
        this.formData.levelEducationDesc = this.returnText('DegreeOfEducation', data.levelEducation);
        this.formData.childrenSituationDesc = this.returnText('children', data.childrenSituation);
        this.formData.schoolSituationDesc = this.returnText('school_Situation', data.schoolSituation);
        this.formData.spsCltrDgrDesc = this.returnText('DegreeOfEducation', data.spsCltrDgr);
        this.formData.unitCharDesc = this.returnText('unit_Property', data.unitChar);
        this.formData.spsUnitCharDesc = this.returnText('unit_Property', data.spsUnitChar); 
        this.formData.pProvCityZonId = data.pProvCityZonCode;
        this.formData.rProvCityZonId = data.rProvCityZonCode;
        this.loading = false;
      }).catch(()=>{
        this.loading = false;
      });
    }
  },
  created() {
    this.params = this.$route.query;
    this.isView = this.params.isView == 0?true:false;
    this.loadClient();
    this.rulesForm("order/viceProj");
  }
};
</script>

<style lang="scss">
</style>
