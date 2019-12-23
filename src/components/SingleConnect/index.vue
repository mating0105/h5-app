<!--
 * @Description: 用于单选样式的选择
 * @Author: shenah
 * @Date: 2019-12-19 10:46:55
 * @LastEditors  : shenah
 * @LastEditTime : 2019-12-23 16:04:05
 -->

<template>
  <div class="single">
    <div
      :class="getActive(item)"
      :key="item.value"
      @click="select(item)"
      class="single-item"
      v-for="(item) in list"
    >{{item.label}}</div>
  </div>
</template>

<script>
export default {
  name: "singleConnect",
  components: {},
  data() {
    return {
      nowActiveValue: "" // 当前激活的是哪个
    };
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    defaultActiveValue: {
      type: [String, Number],
      default: ""
    },
    type: {
      type: String
    }
  },
  watch: {
    defaultActiveValue(val) {
      this.nowActiveValue = this.defaultActiveValue;
    }
  },
  mounted() {
    this.nowActiveValue = this.defaultActiveValue;
  },
  methods: {
    getActive(item) {
      let itemClass = "";
      if (item.disable) {
        itemClass = "single-disable";
      }
      return this.nowActiveValue === item.value ? "single-active" : itemClass;
    },
    select(item) {
      if (item.disable) {
        return;
      }
      this.nowActiveValue = item.value;
      this.$emit("singleChange", { type: this.type, item });
    }
  }
};
</script>
<style lang='scss' scoped>
.single {
  position: relative;
  width: 100%;
  height: 28px;
  line-height: 28px;
  font-size: 12px;
  color: #333;
  display: flex;
  justify-content: flex-end;
  .single-item {
    width: 65px;
    text-align: center;
    display: inline-block;
    border-top: 1px solid #cccccc;
    border-bottom: 1px solid #cccccc;
    border-right: 1px solid #cccccc;
    &:first-child {
      border-left: 1px solid #cccccc;
      border-top: 1px solid #cccccc;
      border-bottom: 1px solid #cccccc;
      border-radius: 5px 0 0 5px;
    }
    &:last-child {
      border: 1px solid #cccccc;
      border-radius: 0 5px 5px 0;
      border-left: none;
    }
  }
  .single-active {
    color: #fff !important;
    background-color: #c4252a !important;
  }
  .single-disable {
    background-color: #f5f5f5 !important;
    color: #ccc !important;
  }
}
</style>