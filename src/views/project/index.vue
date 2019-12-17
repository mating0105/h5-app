<template>
  <!-- 所有基本信息入口 -->
  <ViewPage>
    <van-tabs v-model="activeName">
      <van-tab title="项目信息" name="1">
        <div class="xh-page-body">
          <div class="xh-page-mian xh-card-box">
            <red-card label="客户基本信息">
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
            </red-card>
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
        </div>
        <!-- 提交按钮 -->
        <div class="xh-submit" style="padding: 0 10px;">
          <van-button size="large" class="xh-bg-main" @click="submit" :loading="loading">提 交</van-button>
        </div>
      </van-tab>
      <van-tab title="征信信息" name="2"></van-tab>
      <van-tab title="审批记录" name="3"></van-tab>
    </van-tabs>
    <van-dialog
      v-model="showQRCode"
      :show-confirm-button="false"
      :show-cancel-button="false"
      :close-on-popstate="true"
      :close-on-click-overlay="true"
    >
      <!-- <van-loading /> -->
      <img width="100%" height="100%" :src="qrCodeUrl" />
    </van-dialog>
  </ViewPage>
</template>
<script>
import Vue from "vue";
import { Dialog, Button, Row, Col, Tab, Tabs } from "vant";
import xhBadge from "@/components/Badge/index";
import redCard from "@/components/redCard/index";
import ViewPage from '@/layout/components/ViewPage';
const Components = [Dialog, Button, Row, Col, Tab, Tabs];

Components.forEach(item => {
  Vue.use(item);
});

export default {
  components: {
    xhBadge,
    redCard,
    ViewPage
  },
  data() {
    return {
      activeName: "1",
      selected: 1,
      meunRow: [
        {
          name: "项目基本信息",
          key: 1,
          icon: "icon-project.png",
          url: "/projectInfo"
        },
        {
          name: "客户及配偶",
          key: 2,
          icon: "icon-spouse.png",
          url: "/clientIndex"
        },
        {
          name: "紧急联系人",
          key: 3,
          icon: "icon-contact.png",
          url: "/contactPerson"
        },
        {
          name: "新增房产信息",
          key: 4,
          icon: "icon-house.png",
          url: "/houseUser"
        },
        {
          name: "家庭收入",
          key: 5,
          icon: "icon-income.png",
          url: "/incomeFamily"
        },
        {
          name: "名下车辆",
          key: 6,
          icon: "icon-carinfo.png",
          url: "/vehicleList"
        },
        {
          name: "担保人信息",
          key: 7,
          icon: "icon-guarantor.png",
          url: "guarantorInfo/assureList.html"
        },
        {
          name: "担保人房产",
          key: 8,
          icon: "icon-guarantor.png",
          url: "/houseGuarantor"
        },
        {
          name: "担保人收入信息",
          key: 9,
          icon: "icon-guarantorhouse.png",
          url: "/incomeGuarantor"
        },
        {
          name: "调查结论",
          key: 10,
          icon: "icon-findings.png",
          url: "/survey"
        },
        {
          name: "相关文档",
          key: 11,
          icon: "icon-filed.png",
          url: "/proDocument"
        }
      ],
      params: {},
      certificateNum: "",
      projProjectInfo: {},
      showQRCode: false,
      qrCodeUrl: "",
      loading: false
    };
  },
  methods: {
    handleClose() {
      this.$toast("关闭!");
    },
    loadData(params) {
      let dataList = {
        projectId: params.projectId
      };
      requestUrl
        .getList("/carloan/projectinfo", dataList)
        .then(res => {
          if (res.data.code == "SYS.200") {
            this.projProjectInfo = res.data.data.projectInfo;
            if (this.projProjectInfo.isChangeProj == "1") {
              this.projProjectInfo.isChangeProj = "1";
              this.certificateNum = this.projProjectInfo.customer.certificateNum;
            } else {
              this.projProjectInfo.isChangeProj = "0";
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    submit() {
      // let dataList = {
      //   businessKey: this.params.projectId,
      //   activityId: this.params.activityId
      // };
      // requestUrl.getList('/carloan/projProjectInfo/projectNodeCheck', dataList).then((res) => {
      //   if(res.data.code == 'SYS.200'){
      //     bridge.loadurlwithmobile({"url":"zhgjApp/page/projectDeclaration/approvalEnd.html?projectId="+this.params.projectId+'&activityId='+this.params.activityId+'&taskId='+this.params.taskId+'&businessType='+this.params.businesstype});
      //   } else {
      //     this.$toast(res.data.message);
      //   }
      // }).catch(function (error) {
      //   this.$toast('提交错误');
      // });
      bridge.loadurlwithmobile({
        url:
          "zhgjApp/page/projectDeclaration/approvalEnd.html?projectId=" +
          this.params.projectId +
          "&activityId=" +
          this.params.activityId +
          "&taskId=" +
          this.params.taskId +
          "&businessType=" +
          this.params.businesstype
      });
      // location.href = 'zhgjApp/page/projectDeclaration/approvalEnd.html'
    },
    meunList(row) {
      this.$router.push({ path: row.url, query: this.params });
    },
    getQRCode(custId, projId) {
      requestUrl
        .getList(
          "/order/ws/qrcode",
          {
            customerId: custId,
            projectId: projId
          },
          "soa"
        )
        .then(res => {
          if (res.data.code == 200 && res.data.data.codeImg) {
            this.qrCodeUrl = res.data.data.codeImg;
            // this.qrCodeUrl = "http://192.168.0.81:8080/group2/M00/00/3C/wKgAU11k10uAFTfrAAL1NDR8bIo167.jpg";
          }
        });
    }
  },
  mounted() {
    this.params = this.$route.query;
  }
};
</script>

<style lang="scss">
.xh-page-mian {
  background-color: #fff;
  position: relative;
  border-radius: 6px;
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
/* 相关文档 */
.xh-document-list {
  margin-top: 10px;
  /* padding: 0 10px; */
}
.xh-document-list .van-icon {
  position: absolute;
  top: 50%;
  right: 0;
  width: 1rem;
  height: 1rem;
  margin-top: -0.5rem;
  margin-right: 1rem;
}
.xh-document-list .xh-document-row {
  padding: 10px 14px;
}
.xh-document-list:first-child {
  margin-top: 10px;
}
/* 间距 */
.xh-page-down {
  padding: 10px 10px 0 10px;
}
.xh-page-up {
  padding: 0 10px 10px 10px;
}
.xh-project-border .xh-form {
  padding: 10px 0;
}
/* 上拉菜单选择 */
.xh-list i {
  display: none;
}
.xh-list-body {
  max-height: 300px;
}
.xh-list-body .xh-list-index {
  font-size: 1rem;
  border: 0;
  border-top: 1px solid #e6e6e6;
}
</style>
