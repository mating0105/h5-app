<!--
 * @Description: 重权管理
 * @Author: shenah
 * @Date: 2019-12-18 15:36:08
 * @LastEditors  : shenah
 * @LastEditTime : 2019-12-20 20:23:37
 -->

<template>
  <ViewPage class="heavy-right-manage">
    <van-tabs v-model="active">
      <van-tab
        name="basic"
        replace
        title="基本信息"
        to="basic"
      ></van-tab>
      <van-tab
        :to="{ name: 'HeavyRelatedDocs', query:JSON.stringify({
          info:{
            customerNum,
            customerId
          },
          dealState:'3'
        })}"
        name="relatedDocs"
        replace
        title="相关文档"
      ></van-tab>
      <van-tab
        :to="{ name: 'HeavyApproval', query:{
          info:JSON.stringify({
            customerNum,
            customerId
          }),
          dealState:'1'
        }}"
        name="record"
        replace
        title="审批记录"
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
  computed: {
    customerNum() {
      return this.$route.params.customerNum;
    },
    customerId() {
      return this.$route.params.customerId;
    }
  },
  data() {
    return {
      // 基本信息basic 相关文档doc 审批记录record
      active: "basic"
    };
  },
  props: {},
  mounted() {
    this.judgeNow();
  },
  methods: {
    judgeNow() {
      let { name } = this.$route;
      if (name === "HeavyRightBasic") {
        this.active = "basic";
      } else if (name === "HeavyRelatedDocs") {
        this.active = "relatedDocs";
      } else {
        this.active = "record";
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.heavy-right-manage {
  .heavy-right-manage-wrap {
  }
}
</style>