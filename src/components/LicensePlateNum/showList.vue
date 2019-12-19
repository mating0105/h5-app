<!--
 * @Description: 显示车牌号的列表
 * @Author: shenah
 * @Date: 2019-12-19 15:14:37
 * @LastEditors  : shenah
 * @LastEditTime : 2019-12-19 15:14:51
 -->

<template>
  <div class="show-only-list-wrap">
    <div
      @click="show"
      class="show-list"
    >
      <li>{{first}}</li>
      <li>{{arr[0]}}</li>
      <li>{{arr[1]}}</li>
      <li>{{arr[2]}}</li>
      <li>{{arr[3]}}</li>
      <li>{{arr[4]}}</li>
      <li>{{arr[5]}}</li>
      <li>{{arr[6]}}</li>
    </div>
    <van-icon
      @click.stop="orcScan"
      name="scan"
      size="22px"
      v-if="isScan"
    />
  </div>
</template>

<script>
import Vue from "vue";
import { Icon } from "vant";
const Components = [Icon];

Components.forEach(item => {
  Vue.use(item);
});
export default {
  name: "showList",
  components: {},
  props: {
    first: {
      type: String
    },
    arr: {
      type: Array,
      default: () => []
    },
    isScan: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },

  mounted() {},
  methods: {
    orcScan() {
      this.$emit("scanChange");
    },
    show() {
      this.$emit("click");
    }
  }
};
</script>
<style lang='scss' scoped>
// 车牌号 & 虚拟键盘
.show-only-list-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0;
  .show-list {
    margin-right: 4px;
    width: 100%;
    height: 2rem;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 6px 8px 0px rgba(96, 100, 112, 0.1);
    border-radius: 0.4rem;
    border: 1px solid rgba(206, 208, 210, 1);
    display: flex;
    justify-content: center;
    li {
      flex: 1;
      border-right: 1px solid rgba(206, 208, 210, 1);
      box-sizing: border-box;
      margin-left: -1px;
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #323233;
    }
    li:last-child {
      border: none;
    }
  }
}
</style>