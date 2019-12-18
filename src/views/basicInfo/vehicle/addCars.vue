<template>
  <ViewPage>
    <div class="xh-page-body">
      <van-row class="xh-card-box xh-radius">
        <section>
          <van-cell
            name
            required
            is-link
            title="车辆品牌型号："
            :value="formData.carModel"
            @click="getBrand"
          />
        </section>
        <section>
          <van-field
            name="vim"
            v-model="formData.vim"
            :required="ruleData.vim.mustFill"
            :disabled="isView == 1"
            label="车架号："
            input-align="right"
            placeholder="请输入或扫描"
            @blur.prevent="ruleMessge"
            :error-message="errorMsg.carNumber"
            right-icon="scan"
          />
        </section>
        <section>
          <div class="van-cell van-field">
            <div class="van-cell__title van-field__label">
              <span>车牌号：</span>
            </div>
            <div class="van-cell__value">
              <div class="van-field__body">
                <div class="van-field__control van-field__control--right">
                  <div class="xh-scan">
                    <div class="xh-scan-text">1</div>
                    <div class="xh-scan-text">1</div>
                    <div class="xh-scan-text">1</div>
                    <div class="xh-scan-text">1</div>
                    <div class="xh-scan-text">1</div>
                    <div class="xh-scan-text">1</div>
                    <div class="xh-scan-text">1</div>
                    <div class="xh-scan-text">1</div>
                  </div>
                </div>
                <div class="van-field__right-icon">
                  <i class="van-icon van-icon-scan"></i>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <van-field
            name="carAge"
            v-model="formData.carAge"
            :required="ruleData.carAge.mustFill"
            :disabled="isView == 1"
            label="车龄(年)："
            input-align="right"
            placeholder="请输入车龄"
            @blur.prevent="ruleMessge"
            :error-message="errorMsg.carAge"
          />
        </section>

        <section>
          <van-cell
            title="购买方式："
            :required="ruleData.buyType.mustFill"
            is-link
            :value="formData.buyTypeDesc"
            @click.native="loadList"
          />
        </section>

        <section>
          <van-field
            name="carValue"
            label-width="120px"
            v-model="formData.carValue"
            :disabled="isView == 1"
            :required="ruleData.carValue.mustFill"
            label="车辆价值(万元)："
            input-align="right"
            placeholder="请输入车辆价值"
            @blur.prevent="ruleMessge"
            :error-message="errorMsg.carValue"
          />
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
import brand from "@/components/carBrand/brand";
import { setCarsfo, editCarsInfo } from "@/api/client";
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
    brand
  },
  data() {
    return {
      isView: 0, // 是否查看
      showBrand: false,
      formData: {
        carModel: "",
        carId: "",
        customerNum: "", //客户编号
        customerId: "", //客户ID
        carModelId: "", //车辆型号
        carNumber: "", //车牌号
        carAge: "", //车龄(年)
        buyType: "", //购买方式
        carValue: "", //车辆价值(万元)
        vim: "",
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
      ruleData: {
        carNumber: {},
        carAge: {},
        buyType: {},
        carValue: {},
        vim: {}
      }
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
      if(this.isView == 0) {
        setCarsfo(this.formData).then(res => {
          this.$notify({
            type: "success",
            message: res.msg
          });
          this.$router.go(-1);
        });
      } else {
        editCarsInfo(this.formData).then(res => {
          this.$notify({
            type: "success",
            message: res.msg
          });
          this.$router.go(-1);
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
      let code = carBrand.brand.id + '/' + carBrand.series.id + '/' + carBrand.model.id;
      this.formData.carId = code;
    }
  },
  mounted() {
    this.params = this.$route.query;
    if (this.params.type == 1) {
      this.isView = this.params.type;
      this.formData = this.params;
    }
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
</style>
