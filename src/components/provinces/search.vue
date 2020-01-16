<template>
  <div class="xh-address-search">
    <van-field
      v-model="searchVal"
      :required="isView"
      clearable
      name="addressDetail"
      :disabled="!isView"
      :label="label"
      input-align="right"
      :placeholder="isView?'请填写':''"
      @blur.prevent="ruleMessge"
      :error-message="errorMsg"
      error-message-align="right"
    />
    <div class="xh-address-result">
      <div class="xh-address-row" v-for="u in 10">{{ u }}</div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
// 其他组件
import {
  Row,
  Col,
  Field
} from "vant";
const Components = [
  Row,
  Col,
  Field
];

Components.forEach(item => {
  Vue.use(item);
});
export default {
  props: {
    label: {
      type: String,
      default: '详细地址：'
    },
    searchVal: {
      type: String
    },
    errorMsg: {
      type: String,
      default: ''
    },
    isView: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  methods: {
    ruleMessge() {

    }
  }
}
</script>

<style lang="scss">
.xh-address-search {
  position: relative;
  .xh-address-result {
    position: absolute;
    top: 40.38px;
    left: 0;
    background-color: #f2f2f2;
    width: 100%;
    height: 150px;
    z-index: 10;
    border-radius: 0 0 6px 6px;
    overflow-y: auto;
    overflow-x: hidden;
    .xh-address-row {
      padding: 10px;
    }
  }
}
</style>
