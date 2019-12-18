<template>
  <!-- 所有基本信息入口 -->
  <ViewPage>
    <van-tabs v-model="activeName">
      <van-tab title="项目信息" name="1">
        <div class="xh-page-body">
          <div class="xh-page-mian xh-card-box">
            <red-card label="客户基本信息">
              <template slot="cardBody">
                <div class="xh-card-padding">
                  <van-row class="xh-top-10">
                    <van-col :span="8">客户姓名：</van-col>
                    <van-col :span="16" class="xh-text-right xh-ellipsis">{{ params.customerName?params.customerName:'--' }}</van-col>
                  </van-row>
                  <van-row class="xh-top-10">
                    <van-col :span="8">联系电话：</van-col>
                    <van-col :span="16" class="xh-text-right xh-ellipsis">{{ params.contactPhone?params.contactPhone:'--' }}</van-col>
                  </van-row>
                  <van-row class="xh-top-10">
                    <van-col :span="8">证件号码：</van-col>
                    <van-col :span="16" class="xh-text-right xh-ellipsis">{{ params.certificateNum?params.certificateNum + ' | 身份证':'--' }}</van-col>
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
        <Card>
          <template v-slot:header>意见描述</template>
          <section>
            <van-cell-group :border="false">
              <van-field
                v-model="message"
                rows="2"
                autosize
                label-width="0"
                :border="false"
                type="textarea"
                maxlength="200"
                placeholder="请输入"
                show-word-limit
              />
            </van-cell-group>
          </section>
        </Card>
        <!-- 提交按钮 -->
        <div class="xh-submit" style="padding: 0 10px;">
          <van-button size="large" class="xh-bg-main" @click="submitTask" :loading="loading">提 交</van-button>
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
    <!-- 弹出选项 -->
    <van-action-sheet get-container="#app" v-model="showSheet" class="xh-list">
      <div class="xh-list-body">
        <van-picker
          :columns="peopleList"
          show-toolbar
          value-key="label"
          title="下一节点处理人"
          @confirm="confirm"
          @cancel="cancel"
        />
      </div>
    </van-action-sheet>
  </ViewPage>
</template>
<script>
import Vue from "vue";
import { Dialog, Button, Row, Col, Cell, Tab, Tabs, Field, CellGroup, ActionSheet, Picker } from "vant";
import {
  setProjectTask,
  setProjectProcess
} from "@/api/project";
import xhBadge from "@/components/Badge/index";
import redCard from "@/components/redCard/index";
import Card from "@/components/card/index";
import ViewPage from '@/layout/components/ViewPage';
const Components = [ Dialog, Button, Row, Col, Cell, Tab, Tabs, Field, CellGroup, ActionSheet, Picker ];

Components.forEach(item => {
  Vue.use(item);
});

export default {
  components: {
    xhBadge,
    redCard,
    ViewPage,
    Card
  },
  data() {
    return {
      activeName: "1",
      selected: 1,
      showSheet: false,
      peopleList: [], // 选人
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
      message: '',
      postFrom: {
        processedBy: "",
        businessKey: "",
        commentsDesc: "",
        conclusionCode: "01"
      },

      certificateNum: "",
      showQRCode: false,
      qrCodeUrl: "",
      loading: false
    };
  },
  methods: {
    handleClose() {
      this.$toast("关闭!");
    },
    confirm(row) {
      this.postFrom.processedBy = row.id;
      this.postProcess();
      this.showSheet = false;
    },
    cancel() {
      this.showSheet = false;
    },
    submitTask() {
      if(this.message == '') {
        this.message = "同意";
      }
      let obj = {
        conclusionCode: "01",
        // businessKey: "2019121486",
        businessKey: this.params.id,
        commentsDesc: this.message
      }
      setProjectTask(obj).then(res => {
        if(res.code == 200) {
          let objArr = [];
          let { data } = res;
          this.showSheet = true;
          data.list.forEach(t => {
            objArr.push({
              ...t,
              label: t.companyName+'-'+t.name
            })
          });
          this.peopleList = objArr;
        } else {
          this.$notify({
            type: "danger",
            message: res.msg
          });
        }
      });
    },
    // 提交流程
    postProcess() {
      if(this.message == '') {
        this.postFrom.commentsDesc = "同意";
      } else {
        this.postFrom.commentsDesc = this.message;
      }
      this.postFrom.businessKey = this.params.id;
      // this.postFrom.businessKey = "2019121486";
      setProjectProcess(this.postFrom).then(res => {
        if(res.code == 200) {
          this.$notify({
            type: "success",
            message: res.msg
          });
        } else {
          this.$notify({
            type: "danger",
            message: res.msg
          });
        }
      });
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
.xh-card-padding {
  .xh-top-10 {
    padding: 10px 0;
  }
}
</style>
