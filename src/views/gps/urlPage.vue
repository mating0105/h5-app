
<template>
  <ViewPage>
    <iframe
      id="iframepage"
      :src="url.url"
      frameborder="0"
      scrolling="auto"
      width="100%"
      :height="heightPage"
    ></iframe>
  </ViewPage>
</template>
<script>
import Vue from "vue";
import ViewPage from "@/layout/components/ViewPage";

export default {
  components: {
    ViewPage
  },
  data() {
    return {
      url: "",
      heightPage: ""
    };
  },
  mounted() {
    this.url = this.$route.query;
    this.heightPage = document.body.clientHeight - 45;
  }
};
</script>