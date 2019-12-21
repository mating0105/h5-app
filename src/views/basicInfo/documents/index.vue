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
      types: [
        { type: '0306', must: false, dealState: "1", label: '二手车资料' },
        // { type: '0101', must: false, dealState: "2", label: '主借人身份证正面' }
      ]
    };
  }
};
</script>

<style lang="scss">
</style>
