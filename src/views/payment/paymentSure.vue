// 走款确认
<template>
  <ViewPage>
    <van-tabs v-model="activeName">
      <van-tab title="项目信息" name="project">
        
      </van-tab>
      <van-tab title="审批记录" name="approval">
        <Approval :recordList="recordList"></Approval>
      </van-tab>
    </van-tabs>
  </ViewPage>
</template>
<script>
import Vue from "vue";
import { Button, Row, Col, Tab, Tabs, Cell, CellGroup } from "vant";
import redCard from "@/components/redCard/index";
import card from "@/components/card/index";
import ViewPage from "@/layout/components/ViewPage";
import Approval from "@/views/basicInfo/approvalRecord/index";
const Components = [Button, Row, Col, Tab, Tabs, Cell, CellGroup];
Components.forEach(item => {
  Vue.use(item);
});
export default {
  components: {
    redCard,
    ViewPage,
    card,
    Approval
  },
  data() {
    return {
      activeName: "project",
      recordList: [
        {
          name: "张三",
          processedRole: "驻行内勤",
          createDate: "2019-01-01",
          businessType:1,
          commentsDesc:'11111'
        }
      ]
    };
  },
  methods: {}
};
</script>
