<template>
  <ViewPage :loading="loading">
    <van-tabs v-model="activeName">
      <van-tab title="项目信息" name="projectInfo">
        <ProjectInfo></ProjectInfo>
      </van-tab>
      <van-tab title="征信信息" name="creditReportingInfo">

      </van-tab>
      <van-tab title="审批记录" name="approvalRecord">

      </van-tab>
    </van-tabs>
  </ViewPage>
</template>

<script>
import ViewPage from "@/layout/components/ViewPage";
import ProjectInfo from './projectInfo';
import Vue from 'vue'
import { Tab, Tabs } from "vant";
Vue.use(Tab).use(Tabs);

export default {
  name: "creditNextStep",
  components: {
    ViewPage,
    ProjectInfo
  },
  data() {
    return {
      loading: false,
      activeName: "projectInfo",
    };
  },
};
</script>