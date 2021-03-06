<template>
  <ViewPage>
    <div class="xh-page-body">
      <van-row class="xh-card-box xh-radius">
        <section>
          <van-cell
            name="carModel"
            :required="isView"
            :is-link="isView"
            title="车辆品牌型号："
            :value="formData.carModel"
            @click="isView?getBrand():false"
            label-class="labelClass"
            @blur.prevent="ruleMessge"
            :label="errorMsg.carModel"
          />
        </section>
        <section>
          <van-field
            name="vim"
            v-model="formData.vim"
            :disabled="!isView"
            label="车架号："
            input-align="right"
            :placeholder="isView?'请填写或扫描':''"
            :right-icon="isView?'scan':''"
            @click-right-icon="OCRScan"
            class="xh-right-icon"
          />
        </section>
        <section>
          <van-cell name="carNumber" :required="isView" title="车牌号:" :border="false" @blur.prevent="ruleMessge">
            <licensePlateNum
              v-model="formData.carNumber"
              @licensePlateNumChange="licensePlateNumChange"
              type="carNumber"
              :isEdit="isView"
            ></licensePlateNum>
            <div class="van-cell__label" style="color: #ee0a24;">{{ errorMsg.carNumber }}</div>
          </van-cell>
        </section>

        <section>
          <van-field
            name="carAge"
            v-model="formData.carAge"
            :disabled="!isView"
            label="车龄："
            input-align="right"
            :placeholder="isView?'请填写':''"
          >
            <div slot="button" v-if="formData.carAge">年</div>
          </van-field>
        </section>

        <section>
          <van-cell
            name="buyType"
            title="购买方式："
            :required="isView"
            :is-link="isView"
            :value="formData.buyTypeDesc"
            @click.native="isView?loadList():false"
            label-class="labelClass"
            @blur.prevent="ruleMessge"
            :label="errorMsg.buyType"
          />
        </section>

        <section>
          <van-field
            name="carValue"
            type="number"
            :required="isView"
            label-width="120px"
            v-model="formData.carValue"
            :disabled="!isView"
            label="车辆价值："
            input-align="right"
            :placeholder="isView?'请填写':''"
            @blur.prevent="priceFloat(formData, 'carValue');ruleMessge($event)"
            :error-message="errorMsg.carValue"
            error-message-align="right"
          >
            <div slot="button" v-if="formData.carValue">元</div>
          </van-field>
        </section>

        <!-- 下拉选择器 -->
        <van-action-sheet v-model="selectShow" class="xh-list">
          <van-picker
            show-toolbar
            title="购买方式"
            :columns="columns"
            :value-key="'label'"
            @cancel="onCancel"
            @confirm="onConfirm"
          />
        </van-action-sheet>

        <!-- 弹出省市区 -->
        <transition name="page-move">
          <brand :visible.sync="showBrand" v-if="showBrand" @change="changeBrand"></brand>
        </transition>
      </van-row>
      <!-- 保 存按钮 -->
      <div class="xh-submit">
        <van-button
          size="large"
          class="xh-bg-main"
          :loading="dLoading"
          :disabled="dLoading"
          @click.native="custSubmit"
          v-if="isView"
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
import brand from "@/components/carBrand/brand";
import LicensePlateNum from "@/components/LicensePlateNum/index";
import { setCarsfo, editCarsInfo } from "@/api/client";
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
    brand,
    LicensePlateNum
  },
  data() {
    return {
      isView: false, // 是否查看
      showBrand: false,
      formData: {
        carModel: "",
        customerNum: "", //客户编号
        customerId: "", //客户ID
        carId: "", //车辆型号
        carNumber: "", //车牌号
        carAge: "", //车龄(年)
        buyType: "", //购买方式
        carValue: "", //车辆价值(万元)
        vim: ""
      },
      columns: [], //待选择列表
      errorMsg: {
        carAge: "",
        carNumber: "",
        carId: "",
        buyType: "",
        carValue: '',
        // vim: ''
      },

      params: {},

      selectShow: false, //下拉选择器显示
      pickerTitle: "", //下拉列表title
      addressShow: false, // 城市下拉选择器显示

      dLoading: false //提交loading
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
          this.formData.buyTypeDesc = this.returnText(
            "Purchase_method",
            this.formData.buyType
          );
        }
      });
    },
    loadList() {
      this.selectShow = true;
      this.columns = this.wordbook.Purchase_method;
    },
    onConfirm(rows) {
      this.formData.buyType = rows.value;
      this.formData.buyTypeDesc = rows.label;
      this.errorMsg.buyType = '';
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
      if (this.params.id) {
        editCarsInfo(this.formData)
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
      } else {
        setCarsfo(this.formData)
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
    // 车辆品牌型号
    getBrand() {
      this.showBrand = true;
    },
    // 车辆品牌型号返回参数
    changeBrand(carBrand) {
      this.formData.carModel = carBrand.model.fullname;
      let code =
        carBrand.brand.id + "/" + carBrand.series.id + "/" + carBrand.model.id;
      this.formData.carId = code;
      this.errorMsg.carModel = '';
    },
    // 返回车牌号
    licensePlateNumChange({ value, type }) {
      this.errorMsg[type] = this.returnMsg(type, this.formData[type]);
    },
    // OCR识别车架号
    OCRScan() {
      this.$bridge.callHandler("vinOCR", "", res => {
        this.$set(this.formData, "vim", res.VIN || "");
      });
    }
  },
  mounted() {
    this.params = this.$route.query;
    this.isView = this.params.isView == 0;
    if (this.params.id) {
      this.formData = this.params;
      this.formData.carValue = this.numFilter(this.formData.carValue)
    }
    this.rulesForm("cs/cuPersonalCar");
  }
};
</script>

<style lang="scss">
.xh-scan {
  display: flex;
  justify-content: flex-end;
  .xh-scan-text {
    width: 25px;
    height: 25px;
    text-align: center;
    line-height: 25px;
    margin: 0 2px;
    border: 1px solid #807c7c;
  }
  .xh-scan-text:last-child {
    border: 1px dashed #807c7c;
  }
}
.xh-value-none {
  display: none;
}
</style>
