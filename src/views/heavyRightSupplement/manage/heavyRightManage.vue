<!--
 * @Description: 重权管理
 * @Author: shenah
 * @Date: 2019-12-18 15:36:08
 * @LastEditors  : shenah
 * @LastEditTime : 2019-12-19 19:17:03
 -->

<template>
  <ViewPage
    :loading="loading"
    class="heavy-right-manage"
  >
    <van-tabs v-model="active">
      <van-tab
        name="basic"
        replace
        title="基本信息"
        to="basic"
      ></van-tab>
      <van-tab
        name="doc"
        replace
        title="相关文档"
        to="a"
      ></van-tab>
      <van-tab
        name="record"
        replace
        title="审批记录"
        to="b"
      ></van-tab>
    </van-tabs>
    <div class="heavy-right-manage-wrap">
      <router-view></router-view>
    </div>
  </ViewPage>
</template>

<script>
import Vue from "vue";
import { queryRightSuppleList } from "@/api/heavyRightSupplement";
// 自定义组件
import ViewPage from "@/layout/components/ViewPage";
import Card from "@/components/card/index";
// 其他组件
import { Tab, Tabs, Row, Col, Icon, Cell, Button, List } from "vant";
const Components = [Row, Col, Icon, Cell, Button, List, Tab, Tabs];

Components.forEach(item => {
  Vue.use(item);
});
import { mapState } from "vuex";
import { log } from "util";
export default {
  name: "heavyRightManage",
  components: {
    ViewPage
  },
  data() {
    return {
      // 基本信息basic 相关文档doc 审批记录record
      active: "basic",
      loading: false
    };
  },
  props: {},
  mounted() {},
  methods: {}
};
</script>
<style lang='scss' scoped>
.heavy-right-manage {
  .heavy-right-manage-wrap {
  }
}
</style>