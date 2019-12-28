
<template>
  <ViewPage>
    <iframe
      id="iframepage"
      :src="url"
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
import {Toast} from 'vant'
Vue.use(Toast)

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
    this.url = this.$store.state.user.gpsUrl;
    // Toast(this.url);
    // console.log(this.$store.state.user.gpsUrl,22222)
    this.heightPage = document.body.clientHeight - 45;
  }
};
</script>