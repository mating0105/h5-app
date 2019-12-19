// 审批记录
<template>
  <div>
    <Card v-for="item in recordList" style="margin-top:10px;">
      <van-row>
        <van-col span="10" class="xh-approval-name">
          <span>{{item.name}}</span>
          {{item.processedRole}}
        </van-col>
        <van-col span="8" offset="6" class="xh-approval-time">{{item.createDate}}</van-col>
      </van-row>
      <van-cell-group :border="false">
        <van-cell title="流程类型:" :value="item.businessType" />
      </van-cell-group>
      <van-cell-group :border="false">
        <van-cell title="意见描述:" :value="item.commentsDesc" />
      </van-cell-group>
    </Card>
  </div>
</template>
<script>
import Vue from "vue";
import { Row, Col, Cell, CellGroup } from "vant";
import Card from "@/components/card/index";
import { approvalRecord } from "@/api/payment";
const Components = [Row, Col, Cell, CellGroup];
Components.forEach(item => {
  Vue.use(item);
});
export default {
  components: {
    Card
  },
  props: {
    recordList: {
      type: Array
    }
  },
  data() {
    return {};
  },
  methods: {
    loadRecord() {

    }
  },
  mounted() {
    this.loadRecord(); //加载审批记录
  }
};
</script>
<style>
.xh-approval-name {
  padding: 0 14px;
  color: #ee0a24;
  margin: 5px 0;
}
.xh-approval-name span {
  font-size: 20px;
}
.xh-approval-time {
  margin-top: 7px;
  margin-bottom: 5px;
  color: #7d7e80;
}
</style>