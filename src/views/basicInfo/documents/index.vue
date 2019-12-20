<template>
  <ViewPage>
    <imageList :dataList="dataList"></imageList>
  </ViewPage>
</template>

<script>
import Vue from "vue";
// 自定义组件
import ViewPage from "@/layout/components/ViewPage";
import Card from "@/components/card/index";
import imageList from "@/components/imageList";

export default {
  components: {
    imageList,
    ViewPage,
    Card
  },
  data() {
    return {
      dataList: [
        {
          declare: "二手车资料",//图片描述
          isRequire: true,//*是否必须
          deletable: true,//是否可以操作-上传和删除
          documentType: "0306",
          customerNum: this.$route.query.customerNum,
          customerId: this.$route.query.customerId,
          kind: '1',
          fileList: []
        }
      ]
    }
  },
  mounted() {

  }
}
</script>

<style lang="scss">
  
</style>
