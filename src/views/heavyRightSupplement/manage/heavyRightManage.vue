<!--
 * @Description: 重权管理
 * @Author: shenah
 * @Date: 2019-12-18 15:36:08
 * @LastEditors  : shenah
 * @LastEditTime : 2020-01-22 09:57:15
 -->

<template>
  <ViewPage
    :goPage="goPage"
    :loading="loading"
    :rightMenuList="rightBoxList"
    class="heavy-right-manage"
    iconClass="ellipsis"
  >
    <van-tabs v-model="active">
      <van-tab
        name="basic"
        replace
        title="基本信息"
        to="basic"
      ></van-tab>
      <van-tab
        :to="{ name: 'HeavyRelatedDocs', query:{
          info:JSON.stringify({
            customerNum,
            customerId
          }),
          dealState:'3'
        }}"
        name="relatedDocs"
        replace
        title="相关文档"
      ></van-tab>
      <!-- <van-tab
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
      ></van-tab>-->
    </van-tabs>
    <div class="heavy-right-manage-wrap">
      <router-view></router-view>
    </div>
  </ViewPage>
</template>

<script>
import api from "@/api/contractUpload";
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
    id() {
      return this.$route.params.id;
    },
    customerNum() {
      return this.$route.params.customerNum;
    },
    customerId() {
      return this.$route.params.customerId;
    },
    projectNo() {
      return this.$route.query.projectNo;
    }
  },
  data() {
    return {
      // 基本信息basic 相关文档doc 审批记录record
      active: "basic",
      loading: false,
      rightBoxList: [
        {
          title: "项目基本信息",
          path: "/paymentProjectInfo"
        },
        {
          title: "费用信息",
          path: "/costDetail"
        },
        {
          title: "风控措施",
          path: "/controlMeasure"
        },
        {
          title: "GPS 安装信息",
          path: "/gpsurl"
        }
      ],
      projectInfo: {},
      gpsInfo: null,
      accout: '',
      phone: '',
    };
  },
  props: {},
  mounted() {
    this.judgeNow();
    this.getListDetails();
    this.accout = Cookies.get("loginName");
    this.phone = Cookies.get("phone");
  },
  methods: {
    // 获取 userInfo
    getListDetails() {
      this.loading = true;
      api.getListDetails({ id: this.id }).then(res => {
        res.code === 200 ? (this.loading = false) : "";
        this.gpsInfo = res.data.gpsInfo[0];
        this.projectInfo = res.data.projectInfo;
      });
    },
    //----------导航----------------
    goPage(item) {
      if (item.title === "GPS 安装信息") {
        if (!(this.gpsInfo && this.gpsInfo.orderId)) {
          this.$notify({
            type: "danger",
            message: "未安装GPS，请安装后再试!"
          });
          return false;
        } else {
          let url = `${this.$prefixurl}orderDetail?id=${this.gpsInfo.orderId}&showTitle=false&externalid=${this.projectInfo.projectNo}&externalcustnum=${this.projectInfo.customNum}&externalvehicleid=${this.projectInfo.cars[0].id}&username=${this.accout}&xhphonenum=${this.phone}&type=xh_h5`;
          //通知移动端加载gps安装页面
          this.$bridge.callHandler("loadUrl", url, data => {
            this.onLoad();
          });
        }
      } else {
        let json = { projectId: this.projectInfo.projectId, businesskey: "" };
        let params = {
          projectNo: this.projectInfo.projectNo,
          customerId: this.projectInfo.customerId,
          customerNum: this.projectInfo.customerNum,
          projectId: this.projectInfo.projectId,
          isView: "1",
          projectNo: this.projectInfo.projectNo,
          info: JSON.stringify(json),
          dealState: 3
        };
        this.$router.push({ path: item.path, query: params });
      }
    },
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
