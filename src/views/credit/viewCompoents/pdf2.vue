<template>
  <div id="app">
    <div id="demo"></div>
  </div>
</template>
<script>
import Pdfh5 from "pdfh5";
import "pdfh5/css/pdfh5.css";
export default {
  name: "pdf",
  data() {
    return {
      pdfh5: null,
      src:'./test.pdf'
    }
  },
  mounted() {
    //实例化
    this.pdfh5 = new Pdfh5("#demo", {
      pdfurl: this.src,
      renderType:"canvas",
      lazy:true
    });
    //监听完成事件
    this.pdfh5.on("complete", function(status, msg, time) {
      console.log(
        "状态：" +
          status +
          "，信息：" +
          msg +
          "，耗时：" +
          time +
          "毫秒，总页数：" +
          this.totalNum
      );
    });
  }
};
</script>

<style>

* {
  padding: 0;
  margin: 0;
}
html,
body,
#app {
  width: 100%;
  height: 100%;
}
</style>
