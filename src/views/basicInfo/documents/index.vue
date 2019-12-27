<template>
  <ViewPage>
    <relatedDocs :requestParams="params" :types="types"></relatedDocs>
  </ViewPage>
</template>

<script>
import Vue from "vue";
// 自定义组件
import ViewPage from "@/layout/components/ViewPage";
import Card from "@/components/card/index";
import imageList from "@/components/imageList";
import RelatedDocs from "@/views/relatedDocs/relatedDocs";

export default {
  components: {
    imageList,
    ViewPage,
    Card,
    RelatedDocs
  },
  data() {
    return {
      params: this.$route.query,
      isView: 1,
      types: [
        { type: '0306', must: false, dealState: "1", label: '二手车资料' },
        { type: '0530', must: false, dealState: "1", label: '基础资料' },
        { type: '0531', must: false, dealState: "1", label: '房产资料' },
        { type: '0532', must: false, dealState: "1", label: '收入资料' },
        { type: '0534', must: false, dealState: "1", label: '担保人资料' },
        { type: '0533', must: false, dealState: "1", label: '调查资料' },
      ]
    };
  },
  mounted() {
    let query = this.$route.query;
    this.isView = query.isView;
    if(query.activityId) {
      switch (query.activityId) {
        case "WF_PROJ_APPR_01_T04":
          if(query.isView == 0) {
            this.types = [];
          }
          break;
        case "WF_PROJ_APPR_01_T52":
          if(query.isView == 0) {
            this.types = [];
          }
          break;
        default:
          break;
      }
    }
    if(query.isView == 1) {
      this.types = [];
    }
  }
};
</script>

<style lang="scss">
</style>
