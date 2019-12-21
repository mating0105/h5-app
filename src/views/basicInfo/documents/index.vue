<template>
  <ViewPage>
    <relatedDocs :insteadQuery="params"></relatedDocs>
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
      params: {}
    };
  },
  mounted() {
    this.params = this.$route.query;
  }
};
</script>

<style lang="scss">
</style>
