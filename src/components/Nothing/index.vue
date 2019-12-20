<!--
 * @Description: 通用暂无数据
 * @Author: shenah
 * @Date: 2019-12-20 17:33:37
 * @LastEditors  : shenah
 * @LastEditTime : 2019-12-20 17:47:01
 -->

<template>
  <div class="nothing">
    <div class="no">
      <img
        :src="loadingImg(`${type}.png`)"
        class="bc-img"
      />
      <div
        @click="again"
        class="text"
      >{{words}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Nothing",
  components: {},
  data() {
    return {};
  },
  props: {
    type: {
      type: String,
      default: "nothing"
    },
    words: {
      type: String,
      default: "暂无数据,点击重新加载"
    }
  },
  mounted() {},
  methods: {
    again() {
      this.$emit("nothingChange");
    }
  }
};
</script>
<style lang='scss' scoped>
.nothing {
  width: 100%;
  height: 100%;
  .no {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .bc-img {
      width: 254px;
      height: 254px;
    }
    .text {
      font-size: 14px;
      color: red;
      text-align: center;
      margin-top: 16px;
    }
  }
}
</style>