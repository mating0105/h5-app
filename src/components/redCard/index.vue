<template>
  <div>
    <div class="xh-card xh-card-bg">
      <div class="xh-card-container">
        <div class="xh-card-head">{{ label }}</div>
        <div class="xh-card-body">
          <slot name="cardBody"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Row, Col } from "vant";
Vue.use(Row).use(Col);

export default {
  props: {
    dataObj: {
      type: Object,
      default: function() {
        return {};
      }
    },
    label: {
      type: String,
      default: '我是标题'
    }
  }
};
</script>

<style lang="scss">
/* 红色渐变卡片 */
.xh-card-bg {
  background: -webkit-linear-gradient(left, rgb(253,86,92), rgb(196,37,42)); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(left, rgb(253,86,92), rgb(196,37,42)); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(left, rgb(253,86,92), rgb(196,37,42)); /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, rgb(253,86,92), rgb(196,37,42)); /* 标准的语法（必须放在最后） */
  color: #fff;
}
.xh-card {
  border-radius: 8px;
  font-size: 12px;
  border: 0;
  .xh-card-container {
    padding-left: 10px;
    .xh-card-head {
      padding: 10px 0;
      border-bottom: 1px solid #fff;
      position: relative;
    }
    .xh-card-body {
      padding: 0 10px 10px 0;
      overflow: hidden;
    }
  }
}
</style>
