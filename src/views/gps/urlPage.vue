
<template>
  <ViewPage>
    <div style="padding:0 10px;word-wrap: break-word;">{{url}}</div>
    <iframe
      id="iframepage"
      src="http://dev.wwvas.com:10001/#/installOrderList?loanAmount=100000.00&prodqty=undefined&insurance=undefined&ownername=林顺辉&idcard=511021197206082828&mobile=13158585858&contactname=向召&contactmobile=null&vehiclecategory=2&vehicletype=乘用车&model=1&price=200000.00&showTitle=false&externalid=XM201912271820&externalcustnum=undefined&externalvehicleid=201912271923&username=18349309486"
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
    // this.url = this.$store.state.user.gpsUrl;
    // Toast(this.url);
    // console.log(this.$store.state.user.gpsUrl,22222)
    this.heightPage = document.body.clientHeight - 45;
  }
};
</script>