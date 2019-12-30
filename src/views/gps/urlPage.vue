<template>
    <ViewPage>
        <div :style="{height: heightPage + 'px'}" class="xh-iframe-container">
            <iframe
                    id="iframepage"
                    :src="url"
                    frameborder="0"
                    scrolling="auto"
            ></iframe>
        </div>
    </ViewPage>
</template>
<script>
  import Vue from "vue";
  import ViewPage from "@/layout/components/ViewPage";
  import { Toast } from "vant";

  Vue.use(Toast);

  export default {
    components: {
      ViewPage
    },
    data () {
      return {
        url: "",
        heightPage: ""
      };
    },
    mounted () {
      this.url = this.$store.state.user.gpsUrl;
      this.heightPage = document.body.clientHeight - 45;
      window.addEventListener("message", e => {
        console.log(e.data);
        this.$router.go(-2);
      }, false);
    }
  };
</script>

<style lang="scss">
    .xh-iframe-container {
        -webkit-overflow-scrolling: touch;
        overflow-y: scroll;
    }

    #iframepage {
        width: 100%;
        height: 100%;
    }
</style>
