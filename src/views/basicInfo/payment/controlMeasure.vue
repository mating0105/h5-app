// 风控措施
<template>
  <ViewPage>
    <div>
      <card>
        <template slot="header">风控措施</template>
        <van-row>
          <van-cell-group :border="false">
            <van-cell
              title="手动评级"
              required
              is-link
              :value="returnText('GradeManual',data.projProjectInfo.customer.gradeManual)"
              @click="params.dealState != '1' ? '':loadType('手动评级', 'gradeManual')"
            />
          </van-cell-group>
          <van-cell title="是否加入关注名单" :border="false" required>
            <radio v-model="data.projProjectInfo.riskMeasure.isFoucusList" disabled>
              <radio-item label="1">是</radio-item>
              <radio-item label="0">否</radio-item>
            </radio>
          </van-cell>
          <van-cell-group :border="false">
            <van-cell
              title="风控条件"
              required
              is-link
              :value="returnText('risk_condition',data.projProjectInfo.riskMeasure.riskCondition)"
              @click="params.dealState != '1' ? '':loadType('风控条件', 'riskCondition')"
            />
          </van-cell-group>
          <van-cell title="是否上门" :border="false" required>
            <radio v-model="data.projProjectInfo.wthrDtd" disabled>
              <radio-item label="1">是</radio-item>
              <radio-item label="0">否</radio-item>
            </radio>
          </van-cell>
          <van-cell-group :border="false" required>
            <van-field
              v-model="data.projProjectInfo.riskMeasure.gpsNum"
              :disabled="params.dealState != '1'"
              required
              clearable
              label="GPS数量(台)"
              input-align="right"
              placeholder="请输入"
              @blur.prevent="()=>{ }"
            />
          </van-cell-group>
        </van-row>
      </card>
      <div class="xh-submit" v-show="this.params.dealState == '1'">
        <van-button size="large" class="xh-bg-main" @click="submit">保 存</van-button>
      </div>
    </div>
    <!-- 弹出选项 -->
    <van-action-sheet get-container="#app" v-model="show" class="xh-list">
      <div class="xh-list-body">
        <van-picker
          :columns="options"
          show-toolbar
          :value-key="valueKey"
          :title="selectName"
          @confirm="confirm"
          @cancel="cancel"
        />
      </div>
    </van-action-sheet>
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
      data: {},
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
    //上拉菜单选择
    loadType(title, field) {
      this.selectName = title;
      this.fieldName = field;
      switch (field) {
        case "gradeManual":
          this.options = this.dicList.GradeManual;
          break;
        case "riskCondition":
          this.options = this.dicList.risk_condition;
          break;
      }
      this.show = true;
    },
    confirm(row) {
      this.data.projProjectInfo.riskMeasure[this.fieldName] = row.value;
      this.show = false;
    },
    cancel() {
      this.show = false;
    },
    submit() {}
  },
  mounted() {
    this.params = this.$route.query;
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