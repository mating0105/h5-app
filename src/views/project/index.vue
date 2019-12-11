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
          url: "underVehicle/list.html"
        },
        {
          name: "名下车辆",
          key: 6,
          icon: "icon-carinfo.png",
          url: "infoIncome/list.html"
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
          url: "guaranteeIncomeInfo/incomeList.html"
        },
        {
          name: "调查结论",
          key: 10,
          icon: "icon-findings.png",
          url: "survey/index.html"
        },
        {
          name: "相关文档",
          key: 11,
          icon: "icon-filed.png",
          url: "documents/index.html"
        }
      ],
      params: {
        customerName: "大范甘迪", //客户姓名
        contactPhone: "444", //客户身份证
        certificateNum: "33333" //客户手机号码
      },
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
      // var urls, dataList;
      // switch (row.key) {
      //   case 1: //项目基本信息
      //     dataList = "projectId=" + this.params.projectId;
      //     break;
      //   case 2: //客户及配偶
      //     dataList =
      //       "projectId=" +
      //       this.params.projectId +
      //       "&customerId=" +
      //       this.params.customerId +
      //       "&customerNum=" +
      //       this.params.customerNum +
      //       "&id=" +
      //       this.params.customerId +
      //       "&isChangeProj=" +
      //       this.projProjectInfo.isChangeProj;
      //     // dataList = 'projectId='+'180904323373'+'&customerId='+'180904323344'+'&customerNum='+ 'KH180904323344'+'&id='+'180904323344';

      //     break;
      //   case 3: //紧急联系人
      //     dataList = "customerId=" + this.params.customerId;
      //     // dataList = 'customerId='+ '180905324419';
      //     break;
      //   case 4: //新增房产信息
      //     dataList =
      //       "projectId=" +
      //       this.params.projectId +
      //       "&customerId=" +
      //       this.params.customerId +
      //       "&customerNum=" +
      //       this.params.customerNum;
      //     // dataList = 'projectId='+'180905324433'+'&customerId='+'180905324419'+'&customerNum='+ 'KH180905324419';

      //     break;
      //   case 5: //家庭收入
      //     dataList =
      //       "projectId=" +
      //       this.params.projectId +
      //       "&customerId=" +
      //       this.params.customerId +
      //       "&customerNum=" +
      //       this.params.customerNum;
      //     // dataList = 'projectId='+'180905324433'+'&customerId='+'180905324419'+'&customerNum='+ 'KH180905324419';

      //     break;
      //   case 6: //名下车辆
      //     dataList =
      //       "customerId=" +
      //       this.params.customerId +
      //       "&customerNum=" +
      //       this.params.customerNum;
      //     // dataList = 'customerId='+'180905324419'+'&customerNum='+ 'KH180905324419';
      //     break;
      //   case 7: //担保人信息
      //     dataList =
      //       "projectId=" +
      //       this.params.projectId +
      //       "&customerNum=" +
      //       this.params.customerNum;

      //     break;
      //   case 8: //担保人房产
      //     dataList =
      //       "projectId=" +
      //       this.params.projectId +
      //       "&customerNum=" +
      //       this.params.customerNum;
      //     break;
      //   case 9: //担保人收入信息
      //     dataList =
      //       "projectId=" +
      //       this.params.projectId +
      //       "&customerNum=" +
      //       this.params.customerNum; //---
      //     break;
      //   case 10: //调查结论
      //     dataList =
      //       "projectId=" +
      //       this.params.projectId +
      //       "&customerId=" +
      //       this.params.customerId;
      //     break;
      //   case 11: //相关文档
      //     dataList =
      //       "customerNum=" +
      //       this.params.customerNum +
      //       "&bizNum=" +
      //       this.params.projectNo +
      //       "&bizId=" +
      //       this.params.projectId +
      //       "&customerId=" +
      //       this.params.customerId;
      //     break;
      //   case 12: //征信信息
      //     dataList =
      //       "projectId=" +
      //       this.params.projectId +
      //       "&certificateNum=" +
      //       this.certificateNum +
      //       "&customerNum=" +
      //       this.params.customerNum;
      //     break;
      //   case 13: //审批过程
      //     dataList = "businessType=" + this.params.projectId;
      //     break;
      //   // case 14:
      //   //   this.showQRCode = true
      //   //   break;
      //   default:
      //     return;
      // }
      // if (row.key == 12) {
      //   urls = "zhgjApp/page/creditReporting/" + row.url + "?" + dataList;
      // } else if (row.key == 1 || row.key == 13) {
      //   urls = "zhgjApp/page/projectDeclaration/" + row.url + "?" + dataList;
      // } else {
      //   urls = "zhgjApp/page/zy/" + row.url + "?" + dataList;
      // }
      // bridge.loadurlwithmobile({ url: urls });

      this.$router.push(row.url);
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
.xh-text-right {
  text-align: right;
}
/* 灰色提交按钮 */
.xh-submit {
  margin-top: 35px;
}
.xh-submit .van-button {
  border-radius: 8px;
  color: rgb(255, 255, 255);
}
.xh-bg-main {
  background-color: rgb(196, 37, 42);
}
.xh-bg-maingray {
  background-color: rgb(246, 246, 246);
}
.xh-bg-gray {
  background-color: rgb(204, 204, 204);
}
.xh-bg-subgray {
  background-color: rgb(238, 238, 238);
}
</style>
