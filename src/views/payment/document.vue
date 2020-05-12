// 相关文档
<template>
    <ViewPage>
        <Document :requestParams="params"></Document>
    </ViewPage>
</template>
<script>
  import Vue from "vue";
  import Document from "@/views/relatedDocs/relatedDocs";
  import ViewPage from '@/layout/components/ViewPage';

  export default {
    components: {
      Document,
      ViewPage
    },
    data(){
      return{
        params: {}
      }
    },
    mounted(){
      let obj = JSON.parse(this.$route.query.info);
      obj.dealState = this.$route.query.dealState;
      this.params = obj;
    }
  }
</script>
