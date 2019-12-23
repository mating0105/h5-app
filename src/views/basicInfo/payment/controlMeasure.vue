// 风控措施
<template>
  <ViewPage>
    <div>
      <card>
        <template slot="header">风控措施</template>
        <van-row>
          <van-cell-group :border="false">
              <van-cell title="手动评级" :value="returnText('GradeManual',data.projProjectInfo.customer.gradeManual)" />
          </van-cell-group>
          <van-cell title="是否加入关注名单" :border="false" required>
            <radio v-model="data.projProjectInfo.riskMeasure.isFoucusList" :disabled="params.dealState != '1'">
              <radio-item label="1">是</radio-item>
              <radio-item label="0">否</radio-item>
            </radio>
          </van-cell>
          <van-cell-group :border="false">
              <van-cell title="风控条件" :value="returnText('risk_condition',data.projProjectInfo.riskMeasure.riskCondition)" />
          </van-cell-group>
          <van-cell title="是否上门" :border="false" required>
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
      valueKey: "label"
    };
  },
  methods: {
    loadData() {
      getPaymentDetail({ projectId: this.params.info.projectId,businesskey: this.params.info.businesskey }).then(res => {
        if (res.code == 200) {
          this.data = res.data;
        } else {
          this.$notify({ type: "danger", message: msg });
        }
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
  mounted() {
    this.params = {
      info: this.getStringToObj(this.$route.query.info),
      dealState: this.$route.query.dealState
    };
    this.loadData();
    this.getDict();
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