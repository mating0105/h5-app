// 风控措施
<template>
  <ViewPage>
    <div>
      <card>
        <template slot="header">风控措施</template>
        <van-row>
          <van-cell-group :border="false">
            <van-cell title="手动评级" :border="false" :value="gradeManual" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="是否加入关注名单" :border="false" :value="isFoucusList" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="风控条件" :border="false" :value="riskCondition" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="业务员上门调查" :border="false" :value="wthrDtd" />
          </van-cell-group>
          <van-cell-group :border="false">
            <van-cell title="GPS数量" :border="false" :value="gpsNumDesc" />
          </van-cell-group>
        </van-row>
      </card>
    </div>
  </ViewPage>
</template>
<script>
import Vue from "vue";
import ViewPage from "@/layout/components/ViewPage";
import redCard from "@/components/redCard/index";
import card from "@/components/card/index";
import radio from "@/components/radio";
import radioItem from "@/components/radio/radioItem";
import { getGPSData } from "@/api/project";
import {
  Row,
  Col,
  Tab,
  Tabs,
  Cell,
  CellGroup,
  Picker,
  ActionSheet,
  Button,
  Field
} from "vant";
import { getPaymentDetail, getDic } from "@/api/payment";
const Components = [
  Row,
  Col,
  Tab,
  Tabs,
  Cell,
  CellGroup,
  Picker,
  ActionSheet,
  Button,
  Field
];
Components.forEach(item => {
  Vue.use(item);
});
export default {
  components: {
    redCard,
    ViewPage,
    card,
    radio,
    radioItem
  },
  data() {
    return {
      show: false,
      selectName: "",
      fieldName: "",
      options: [],
      valueKey: "label",
      params:{
        info:{}
      },
      gradeManual: '',
      riskCondition: '',
      gpsNum: '',
      gpsNumDesc: '',
      isFoucusList: '',
      wthrDtd: ''
    };
  },
  methods: {
    loadData() {
      let info = this.params.info;
      getPaymentDetail({ projectId: info.projectId, businesskey: info.businesskey }).then(res => {
        let { data } = res;
        let proj = data.projProjectInfo;

        this.gradeManual = this.returnText('GradeManual',proj.customer.gradeManual);
        this.riskCondition = this.returnText('risk_condition',proj.riskMeasure.riskCondition);
        this.isFoucusList = proj.riskMeasure?(proj.riskMeasure.isFoucusList == '0' ? '否' : '是'):'';
        this.wthrDtd = proj.wthrDtd==0?'否':'是';
        this.gpsNum = proj.riskMeasure.gpsNum;
        this.findGpsData({mobile: proj.clientManager.mobile, thiefRescue: proj.thiefRescue == 2?'N':'Y'});
      }).catch(err => {
        setTimeout(()=>{
          this.$router.go(-1);
        },1000)
      });
    },
    // 获取其他字典接口
    getDict() {
      let arr = [
        "GradeManual", //手动评级
        "risk_condition" //风控条件
      ];
      getDic(arr).then(res => {
        if (res.code == 200) {
          this.dicList = res.data;
        }
      });
    },
    returnText(type, val) {
      let name;
      this.dicList[type].forEach(e => {
        if (e.value == val) {
          name = e.label;
        }
      });
      return name;
    },
    // 获取GPS套餐
    findGpsData(val) {
      getGPSData(val).then(res => {
        let { data } = res;
        let arr = data.records;
        let list = [];
        arr.forEach(t => {
          if(t.cmsPackage.id == this.gpsNum) {
            this.gpsNumDesc = t.cmsPackage.packageprod
          }
        });
      });
    }
  },
  created(){
    this.params = {
      info: this.getStringToObj(this.$route.query.info),
      dealState: this.$route.query.dealState
    };
    this.getDict();
    this.loadData();
  }
};
</script>
<style>
.xh-cost-content {
  padding: 10px;
}
.xh-pay-div {
  margin: 5px 0;
}
</style>
