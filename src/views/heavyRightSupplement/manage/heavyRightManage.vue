<!--
 * @Description: 重权管理
 * @Author: shenah
 * @Date: 2019-12-18 15:36:08
 * @LastEditors  : shenah
 * @LastEditTime : 2019-12-18 15:39:25
 -->

<template>
  <ViewPage class="heavy-right-manage">
    <van-tabs v-model="active">
      <van-tab
        to="basic"
        name="basic"
        title="基本信息"
        replace
      ></van-tab>
      <van-tab
        to="a"
        name="doc"
        title="相关文档"
        replace
      ></van-tab>
      <van-tab
        to="b"
        name="record"
        title="审批记录"
        replace
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
import { log } from 'util';
export default {
  name: "heavyRightManage",
  components: {
    ViewPage
  },
  data() {
    return {
      // 基本信息basic 相关文档doc 审批记录record
      active: "basic"
    };
  },
  props: {},
  mounted() {
  },
  methods: {}
};
</script>
<style lang='scss' scoped>
.heavy-right-manage {
  .heavy-right-manage-wrap {

  }
}
</style>