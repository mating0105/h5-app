<template>
  <ViewPage :loading="loading">
    <Card>
      <van-cell
        label-class="labelClass"
        :label="errorMsg.carType"
        :required="isdetail == 0?true:false"
        :border="false"
        :is-link="isdetail == 0?true:false"
        title="车辆类别："
        :value="returnText(carFrom.carType, 'car_type') + ' ' + returnText(carFrom.carType2, 'car_type2')"
        @click="loadList(9, '车辆类别', carFrom.carType)"
      />
      <van-cell
        label-class="labelClass"
        :label="errorMsg.carNature"
        title="车辆性质："
        :border="false"
        required
      >
        <radio v-model="carFrom.carNature" @change="changeNature">
          <radio-item
            :label="item.value"
            v-for="(item,index) in getTypeList('car_nature')"
            :key="index"
          >{{item.label}}</radio-item>
        </radio>
      </van-cell>
      <van-cell
        label-class="labelClass"
        :label="errorMsg.carSource"
        title="车辆来源："
        :border="false"
        required
      >
        <radio v-model="carFrom.carSource">
          <radio-item
            :label="item.value"
            v-for="(item,index) in getTypeList('CAR_SOURCE')"
            :key="index"
          >{{item.label}}</radio-item>
        </radio>
      </van-cell>
      <van-cell
        label-class="labelClass"
        :label="errorMsg.carSpecifications"
        :required="isdetail == 0?true:false"
        :border="false"
        :is-link="isdetail == 0?true:false"
        title="车辆规格："
        :value="returnText(carFrom.carSpecifications, 'vehicle_specifications')"
        @click="loadList(12, '车辆规格', carFrom.carSpecifications)"
      />
      <van-field
        v-if="carFrom.carNature === 'old_car'"
        :border="false"
        v-model="carFrom.chassisNumber"
        required
        clearable
        input-align="right"
        label="车架号："
        right-icon="scan"
        name="chassisNumber"
        @blur.prevent="ruleMessge"
        :error-message="errorMsg.chassisNumber"
        placeholder="请输入"
        @click-right-icon="discern"
      />
      <van-cell
        label-class="labelClass"
        :label="errorMsg.brndNm"
        title="车辆品牌型号："
        @click="selectBrand"
        :border="false"
        required
        is-link
        :value="nameToString(carFrom.brndNm, carFrom.carSeries, carFrom.carModel)"
      />
      <van-field
        :border="false"
        v-if="carFrom.carNature === 'new_car'"
        v-model="carFrom.salePrice"
        required
        clearable
        input-align="right"
        label="销售价："
        name="salePrice"
        @blur.prevent="priceFloat(carFrom, 'salePrice');ruleMessge($event)"
        :error-message="errorMsg.salePrice"
        placeholder="请输入"
      >
        <div slot="button">元</div>
      </van-field>
      <template v-else-if="carFrom.carNature === 'old_car'">
        <van-cell
          title="车牌所在地："
          :border="false"
          @click="show2 = true"
          is-link
          :value="carFrom.carLicenseLocation"
        />
        <van-cell
          title=" 首次上牌日："
          :border="false"
          is-link
          :value="carFrom.plateDate"
          @click="showDateFn"
        />
        <van-field
          v-model="carFrom.roadHaul"
          :border="false"
          clearable
          input-align="right"
          label="行驶里程："
          :error-message="errorMsg.roadHaul"
          name="roadHaul"
          @blur.prevent="ruleMessge"
          placeholder="请输入"
        >
          <div slot="button">公里</div>
        </van-field>
        <van-field
          v-model="carFrom.engineNum"
          :border="false"
          clearable
          input-align="right"
          label="发动机号："
          :error-message="errorMsg.engineNum"
          @blur.prevent="ruleMessge"
          name="engineNum"
          placeholder="请输入"
        />
      </template>
      <van-field
        v-model="carFrom.remark"
        :border="false"
        clearable
        input-align="right"
        label="备注："
        placeholder="请输入"
      />
    </Card>
    <Card style="margin-top: 1rem;" v-if="carFrom.carNature === 'old_car'">
      <template v-slot:header>车辆照片</template>
      <imageList :dataList="dataList"></imageList>
    </Card>
    <!-- 提交按钮 -->
    <div class="xh-submit-box">
      <van-button size="large" @click="saveCar" class="xh-btn">保存</van-button>
    </div>
    <transition name="page-move">
      <brand :visible.sync="showBrand" v-if="showBrand" @change="changeBrand"></brand>
    </transition>
    <!-- 弹出选项 -->
    <van-action-sheet v-model="show3" :title="selectName" class="zh-list">
      <div class="zh-list-body">
        <van-button
          size="large"
          v-for="i in actions"
          :key="i.key"
          class="zh-list-index"
          :class="isVal == i.key?'zh-main':''"
          @click="onSelect(i)"
        >{{ i.name }}</van-button>
      </div>
    </van-action-sheet>
    <!-- 地图弹框 -->
    <MapSheet :showMap.sync="show2" @getProvince="getProvince"></MapSheet>
    <van-popup v-model="showDate" position="bottom" get-container="#app">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        @change="changeDate"
        @confirm="confirm"
        @cancel="carFrom.plateDate = ''; showDate = false"
      />
    </van-popup>
  </ViewPage>
</template>

<script>
import ViewPage from "@/layout/components/ViewPage";
import Card from "@/components/card";
import radio from "@/components/radio";
import imageList from "@/components/imageList";
import radioItem from "@/components/radio/radioItem";
import brand from "@/components/carBrand/brand";
import Vue from "vue";
import { getDocumentByType } from "@/api/document";
import {
  Cell,
  CellGroup,
  Field,
  Icon,
  Button,
  Picker,
  Popup,
  Toast,
  Notify,
  ActionSheet,
  DatetimePicker
} from "vant";
import MapSheet from "@/components/provinces/index";
import dayjs from "dayjs";
import _ from "lodash";
import formValidator from "@/mixins/formValidator";
import { addCar } from "@/api/project";

const Components = [
  Cell,
  CellGroup,
  Field,
  Icon,
  Button,
  Picker,
  Popup,
  Toast,
  Notify,
  ActionSheet,
  DatetimePicker
];
Components.forEach(item => {
  Vue.use(item);
});
export default {
  name: "vehicle",
  mixins: [formValidator],
  components: {
    ViewPage,
    Card,
    radio,
    radioItem,
    brand,
    imageList,
    MapSheet
  },
  data() {
    return {
      carFrom: {
        id: "",
        carBrandId: "",
        brndNm: "",
        carSeriesId: "",
        carSeries: "",
        carModelId: "",
        carModel: "",
        carType: "",
        carTypeDesc: "",
        carType2: "",
        carType2Desc: "",
        carNature: "new_car", // new_car 新车 ----- old_car 二手车
        carSource: "03",
        salePrice: "",//销售价
        remark: "",
        carSpecifications: "", //车辆规格
        chassisNumber: "", // 车架号
        carLicenseLocation: "", //车牌所在地
        areaCode: "", //地区号-- AREA_CODE
        engineNum: "", //发动机号--
        evaluatingPriceDot: "", //评估价
        roadHaul: "", //行驶里程
        plateDate: "" //首次上牌日
      },
      params: {},
      showBrand: false,
      loading: false,
      dataList: [],
      show3: false,
      show2: false,
      actions: [],
      selectName: "",
      isdetail: 0,
      isSelected: false,
      showDate: false,
      isNum: "",
      isVal: "",
      currentDate: new Date(),
      errorMsg: {
        carType: "", //车辆类别
        carType2: "", //车辆类别子项
        carNature: "", //车辆性质未选
        chassisNumber: "", //车辆车架号
        carSource: "", //车辆来源
        carSpecifications: "", //车辆规格
        brndNm: "", //车辆品牌
        salePrice: "", //车辆价格
        engineNum: "", //发动机号
        roadHaul: "" //行驶里程
      }
    };
  },
  computed: {
    wordbook() {
      return this.$store.state.user.wordbook;
    },
    documentType() {
      let obj = {};
      if (this.wordbook.document_type && this.wordbook.document_type.length) {
        this.wordbook.document_type.forEach(item => {
          obj[item.value] = item;
        });
      }
      return obj;
    }
  },
  methods: {
    // 字典转换
    returnText(val, key) {
      let name = "";
      if (this.wordbook[key]) {
        this.wordbook[key].forEach(e => {
          if (e.value === val) {
            name = e.label;
          }
        });
      }
      return name;
    },
    getTypeList(key) {
      return this.$store.state.user.wordbook[key] || [];
    },
    selectBrand() {
      this.showBrand = true;
    },
    changeBrand(carBrand) {
      this.carFrom.carBrandId = carBrand.brand.id;
      this.carFrom.brndNm = carBrand.brand.name;
      this.carFrom.carSeriesId = carBrand.series.id;
      this.carFrom.carSeries = carBrand.series.name;
      this.carFrom.carModelId = carBrand.model.id;
      this.carFrom.carModel = carBrand.model.name;
      this.errorMsg.brndNm = "";
    },
    async getDocumentByType(documentType) {
      try {
        const params = {
          customerNum: this.$route.query.customerNum,
          documentType: documentType
        };
        const { data } = await getDocumentByType(params);
        const declare = this.documentType[documentType]
          ? this.documentType[documentType].label
          : "图片描述";
        data.forEach(item => {
          item.declare = declare;
        });
        this.dataList.push({
          declare: declare, //图片描述
          isRequire: true, //*是否必须
          deletable: true, //是否可以操作-上传和删除
          documentType: documentType,
          customerNum: this.$route.query.customerNum,
          customerId: this.$route.query.customerId,
          kind: "1",
          fileList: data
        });
      } catch (e) {
        console.log(e);
      }
    },
    async initImage() {
      try {
        await this.getDocumentByType("VICEVA027"); //发动机细节
        this.getDocumentByType("VICEVA028"); //车辆内饰
        this.getDocumentByType("VICEVA029"); //车辆外观
      } catch (e) {
        console.log(e);
      }
    },
    onConfirm(value) {
      this.showPicker = false;
    },
    getDicTypes(key) {
      this.show3 = true;
      this.actions = [];
      for (let i = 0; i < this.wordbook[key].length; i++) {
        let obj = {};
        obj.name = this.wordbook[key][i].label;
        obj.key = this.wordbook[key][i].value;
        this.actions.push(obj);
      }
    },
    loadList(num, name, id) {
      this.isNum = num;
      this.isVal = id;
      this.selectName = name;
      if (!this.isSelected) {
        switch (this.isNum) {
          case 9:
            this.getDicTypes("car_type");
            break;
          case 12:
            this.getDicTypes("vehicle_specifications");
            break;
          case 13:
            this.getDicTypes("car_type2");
            break;
          default:
            return;
        }
        this.show3 = true;
      }
    },
    onSelect(item) {
      this.isVal = item.key;
      switch (this.isNum) {
        case 9:
          this.carFrom.carType = item.key;
          this.errorMsg.carType = "";
          break;
        case 12:
          this.carFrom.carSpecifications = item.key;
          this.errorMsg.carSpecifications = "";
          break;
        case 13:
          this.carFrom.carType2 = item.key;
          this.errorMsg.carType2 = "";
          break;
        default:
          return;
      }
      this.show3 = false;
      if (this.isNum == 9) {
        this.loadList(13, "车辆类别", this.carFrom.carType2);
      }
    },
    getProvince(code, name) {
      this.show2 = false;
      this.carFrom.carLicenseLocation = name;
      this.carFrom.areaCode = code;
    },
    changeDate(value) {
      this.carFrom.plateDate = dayjs(this.currentDate).format("YYYY-MM-DD");
    },
    confirm(value) {
      this.showDate = false;
      this.changeDate(value);
    },
    showDateFn() {
      this.showDate = true;
      if (this.carFrom.plateDate) {
        this.currentDate = dayjs(this.carFrom.plateDate).toDate();
      } else {
        this.currentDate = new Date();
      }
    },
    nameToString() {
      return [...arguments].map(item => item).join("");
    },
    async verifyForm() {
      let num = 0;
      for (let item in this.errorMsg) {
        if (this.errorMsg.hasOwnProperty(item)) {
          this.errorMsg[item] = this.returnMsg(item, this.carFrom[item]);
        }
      }
      return new Promise(resolve => {
        setTimeout(() => {
          for (let item in this.errorMsg) {
            if (this.errorMsg.hasOwnProperty(item)) {
              if (this.errorMsg[item]) {
                num++;
              }
            }
          }
          resolve(num === 0);
        }, 500);
      });
    },
    //验证字段
    async verifyForm () {
        let num = 0;
        for (let item in this.errorMsg) {
          if (this.errorMsg.hasOwnProperty(item)) {
            this.errorMsg[item] = this.returnMsg(item, this.carFrom[item]);
          }
        }
        return new Promise((resolve) => {
          setTimeout(() => {
            for (let item in this.errorMsg) {
              if (this.errorMsg.hasOwnProperty(item)) {
                if (this.errorMsg[item]) {
                  num++;
                }
              }
            }
            resolve(num === 0)
          }, 500)
        })
      },
    /**
     * 保存车辆
     */
    saveCar() {
       this.verifyForm().then(async (res) => {
         if(res){
            this.loading = true;
            this.carFrom.projectId = this.params.projectId?this.params.projectId:this.params.businesskey;
            addCar(this.carFrom).then(res => {
              this.loading = false;
              let prolist = JSON.parse(sessionStorage.getItem('proInfo'));
              prolist.cars = res.data;
              sessionStorage.setItem('proInfo',JSON.stringify(prolist));
              this.$notify({
                type: "success",
                message: res.msg
              });
              this.$nextTick(() => {
                this.$router.go(-1);
              });
            }).catch(()=>{
              this.loading = false;
            });
          }
       })
       
    },
    verifyImage() {
      let len = this.dataList.length;
      return (
        len ===
        this.dataList.filter(item => item.fileList && item.fileList.length > 0)
          .length
      );
    },
    /**
     * 初始化数据
     **/
    initData() {
      for (let key in this.carFrom) {
        if (this.carFrom.hasOwnProperty(key)) {
          this.carFrom[key] = this.$route.query[key] || this.carFrom[key];
        }
      }
      this.changeNature(this.carFrom.carNature);
    },
    /**
     * 识别
     */
    discern() {
      this.$bridge.callHandler("vinOCR", "", res => {
        this.carFrom.chassisNumber = res.VIN || "";
        this.ruleMessge({
          target: {
            name: "chassisNumber",
            value: this.carFrom.chassisNumber
          }
        });
      });
    },
    changeNature(val) {
      console.log(val);
      if (val === "new_car") {
        this.rulesForm("order-credit-car-xh");
        delete this.errorMsg.chassisNumber;
      } else {
        this.$router.push({
          path: "/priceEvaluationChoose",
          query: {
            type:2,
            projectId:this.params.projectId
          }
        });
      }
    }
  },
  mounted() {
    this.initImage();
    this.params = this.$route.query;
    if (this.$route.query) {
      this.initData();
    }
    // this.rulesForm("order-credit-car-xh");//新车
    // this.loading = true
  }
};
</script>

<style scoped>
/* 字体边框背景颜色 */
.zh-main {
  color: rgb(196, 37, 42);
}

.labelClass {
  left: calc(100% + 1.33333rem);
}
</style>
