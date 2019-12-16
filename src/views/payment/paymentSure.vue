// 走款确认
<template>
  <ViewPage>
    <van-tabs v-model="activeName">
      <van-tab title="项目信息" name="project">
        <div class="xh-paysure-card">
          <redCard label="客户基本信息">
            <template slot="cardBody">
              <div>
                <van-row>
                  <van-col
                    span="12"
                    class="xh-top-10 xh-ellipsis"
                  >{{ params.customerName?"客户姓名：" + params.customerName:""}}</van-col>
                  <van-col
                    span="12"
                    class="xh-top-10 xh-text-right"
                  >{{ params.contactPhone?"联系电话：" + params.contactPhone:"" }}</van-col>
                </van-row>
                <van-row>
                  <van-col
                    span="24"
                    class="xh-top-10 xh-ellipsis"
                  >{{ params.certificateNum?"证件号码：" + params.certificateNum+" | 身份证":"" }}</van-col>
                </van-row>
              </div>
            </template>
          </redCard>
          <van-row class="xh-page-body">
              <van-col
                span="6"
                class="xh-meun"
                v-for="i in meunRow"
                :key="i.id"
                @click="meunList(i)"
              >
                <div class="xh-icon">
                  <img :src="require('./../../assets/old_images/'+i.icon)" alt />
                </div>
                <div class="xh-ellipsis xh-top-10" style="font-size:14px;">{{ i.name }}</div>
                <!-- 徽章 -->
                <xh-badge toTop="15" toRight="30"></xh-badge>
              </van-col>
            </van-row>
        </div>
      </van-tab>
      <van-tab title="审批记录" name="approval">
        <div class="xh-paysure-card">
          <Approval :recordList="recordList"></Approval>
        </div>
      </van-tab>
    </van-tabs>
  </ViewPage>
</template>
<script>
import Vue from "vue";
import { Button, Row, Col, Tab, Tabs, Cell, CellGroup } from "vant";
import redCard from "@/components/redCard/index";
import card from "@/components/card/index";
import ViewPage from "@/layout/components/ViewPage";
import Approval from "@/views/basicInfo/approvalRecord/index";
const Components = [Button, Row, Col, Tab, Tabs, Cell, CellGroup];
Components.forEach(item => {
  Vue.use(item);
});
export default {
  components: {
    redCard,
    ViewPage,
    card,
    Approval
  },
  data() {
    return {
      activeName: "project",
      recordList: [
        {
          name: "张三",
          processedRole: "驻行内勤",
          createDate: "2019-01-01",
          businessType: 1,
          commentsDesc: "11111"
        }
      ],
      params: {
        customerName: "大范甘迪", //客户姓名
        contactPhone: "444", //客户身份证
        certificateNum: "33333" //客户手机号码
      },
      meunRow:[
        {
          name: "项目基本信息",
          key: 1,
          icon: "icon-project.png",
          url: "/projectInfo"
        },
        {
          name: "费用信息",
          key: 2,
          icon: "icon-pay.png",
          url: "/clientIndex"
        },
        {
          name: "走款信息",
          key: 3,
          icon: "icon-payment.png",
          url: "/contactPerson"
        },
        {
          name: "相关文档",
          key: 4,
          icon: "icon-document.png",
          url: "/houseUser"
        },
        {
          name: "风控措施",
          key: 5,
          icon: "icon-control.png",
          url: "/incomeFamily"
        },
        {
          name: "GPS安装信息",
          key: 6,
          icon: "icon-gps.png",
          url: "/vehicleList"
        },
      ]
    };
  },
  methods: {}
};
</script>
<style >
.xh-paysure-card{
  padding:10px;
}
.xh-meun {
  text-align: center;
  padding: 30px 0;
  position: relative;
  vertical-align: middle;
  display: inline-block;
}
.xh-icon {
  width: 100%;
  height: 30px;
}
.xh-icon img {
  margin: auto;
  display: block;
  object-fit: contain;
  width: 100%;
  height: 100%;
}
.xh-card .van-field .van-cell__title {
  max-width: 110px;
}
</style>
