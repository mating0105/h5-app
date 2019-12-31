// 风控措施
<template>
  <ViewPage>
    <div>
      <card>
        <template slot="header">风控措施</template>
        <van-row>
          <van-cell-group :border="false">
              <van-cell title="手动评级" :value="gradeManual" />
          </van-cell-group>
          <van-cell title="是否加入关注名单" :border="false" required>
            <radio v-model="data.projProjectInfo.riskMeasure.isFoucusList" :disabled="params.dealState != '1'">
              <radio-item label="1">是</radio-item>
              <radio-item label="0">否</radio-item>
            </radio>
          </van-cell>
          <van-cell-group :border="false">
              <van-cell title="风控条件" :value="riskCondition" />
          </van-cell-group>
          <van-cell title="业务员上门调查" :border="false" required>
            <radio v-model="data.projProjectInfo.wthrDtd" :disabled="params.dealState != '1'">
              <radio-item label="1">是</radio-item>
              <radio-item label="0">否</radio-item>
            </radio>
          </van-cell>
          <van-cell-group :border="false" required>
              <van-cell title="GPS数量(台)" :value="data.projProjectInfo.riskMeasure.gpsNum" />
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
      data: {
        projProjectInfo:{
          customer:{
          },
          riskMeasure:{

          }
        }
      },
      show: false,
      selectName: "",
      fieldName: "",
      options: [],
      valueKey: "label",
      params:{
        info:{}
      },
      gradeManual: '',
      riskCondition: ''
    };
  },
  methods: {
    loadData() {
      let info = this.params.info;
      getPaymentDetail({ projectId: info.projectId,businesskey: info.businesskey }).then(res => {
        let { data } = res;
        this.data = data;
        this.gradeManual = this.returnText('GradeManual',data.projProjectInfo && data.projProjectInfo.customer.gradeManual);
        this.riskCondition = this.returnText('risk_condition',data.projProjectInfo.riskMeasure.riskCondition);
        
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