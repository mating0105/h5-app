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

          <!-- 审批结论 -->

          <!-- <van-row class="xh-page-mian xh-card-box xh-radius xh-top-10" v-if="params.activityId == 'WF_PROJ_APPR_01_T04'"> -->
          <van-row class="xh-page-mian xh-card-box xh-radius xh-top-10">
            <van-cell :border="false" title="审批结论" title-class="xh-blue" is-link :value="completionDesc" @click="linkCode"/>
          </van-row>

          <controlMeasure></controlMeasure>

          <!-- 意见 -->
          <Card style="margin: 10px 0;">
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
          <!-- 有终止的提交按钮 -->
          <div class="xh-submit" v-if="isActive">
            <van-row>
              <van-col :span="4"><van-button size="large" type="default" style="color: #000;">终止</van-button></van-col>
              <van-col :span="20"><van-button size="large" class="xh-bg-main" @click="submitTask" :loading="loading">提 交</van-button></van-col>
            </van-row>
          </div>
          <!-- 提交按钮 -->
          <div class="xh-submit" v-else>
            <van-button size="large" class="xh-bg-main" @click="submitTask" :loading="loading">提 交</van-button>
          </div>
        </div>
      </van-tab>
      <van-tab title="征信信息" name="2">
        <creditInfoTable title="人行征信" :dataList="surDtlList" type="creditResult"></creditInfoTable>
        <creditInfoTable title="互联网查询" :dataList="surDtlList" type="bigDataResult"></creditInfoTable>
      </van-tab>
      <van-tab title="审批记录" name="3">
        <ApprovalRecord></ApprovalRecord>
      </van-tab>
    </van-tabs>

    <!-- 弹出选项 -->
    <van-action-sheet get-container="#app" v-model="showSheet" class="xh-list">
      <div class="xh-list-body">
        <van-picker
          :columns="columns"
          show-toolbar
          value-key="label"
          :title="typeTitle"
          @confirm="confirm"
          @cancel="showSheet = false"
        />
      </div>
    </van-action-sheet>
  </ViewPage>
</template>
<script>
import Vue from "vue";
import { Button, Row, Col, Cell, Tab, Tabs, Field, CellGroup, ActionSheet, Picker } from "vant";
import {
  setProjectTask,
  setProjectProcess,
  isEndActive
} from "@/api/project";
import xhBadge from "@/components/Badge/index";
import redCard from "@/components/redCard/index";
import Card from "@/components/card/index";
import ViewPage from '@/layout/components/ViewPage';
import ApprovalRecord from '@/views/basicInfo/approvalRecord';
import creditInfoTable from '@/views/credit/viewCompoents/creditInfoTable';
import controlMeasure from '@/views/basicInfo/payment/controlMeasure';

const Components = [ Button, Row, Col, Cell, Tab, Tabs, Field, CellGroup, ActionSheet, Picker ];

Components.forEach(item => {
  Vue.use(item);
});

export default {
  components: {
    xhBadge,
    redCard,
    ViewPage,
    Card,
    ApprovalRecord,
    creditInfoTable,
    controlMeasure
  },
  data() {
    return {
      activeName: "1",
      selected: 1,
      showSheet: false,
      columns: [],
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
          url: "/guarantor"
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
      loading: false,
      surDtlList: [],
      completionList: [
        { label: '通过', value: '01'},
        { label: '退回', value: '03'},
        { label: '拒绝', value: '04'}
      ],
      completionDesc: '通过',
      completion: '01', // 结论
      typeTitle: '',
      isActive: false
    };
  },
  methods: {
    handleClose() {
      this.$toast("关闭!");
    },
    confirm(row) {
      if(this.typeTitle == '下一节点处理人') {
        this.postFrom.processedBy = row.id;
        this.postProcess();
      } else {
        this.completionDesc = row.label;
        this.completion = row.value;
      }
      this.showSheet = false;
    },
    submitTask() {
      if(this.message == '') {
        this.message = "同意";
      }
      let obj = {
        conclusionCode: "01",
        businessKey: this.params.projectId,
        commentsDesc: this.message
      }
      setProjectTask(obj).then(res => {
        if(res.code == 200) {
          let objArr = [];
          let { data } = res;
          this.typeTitle = '下一节点处理人';
          this.showSheet = true;
          data.list.forEach(t => {
            objArr.push({
              ...t,
              label: t.companyName+'-'+t.name
            })
          });
          this.columns = objArr;
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
    // 其他情况弹出同意不同意
    linkCode() {
      this.typeTitle = '意见';
      this.showSheet = true;
      this.columns = this.completionList;
    },
    // 是否出现终止
    endActive() {
      isEndActive({
        projId: this.params.projectId
      }).then(res => {
        this.isActive = res.data == '05'?true:false;
      });
    }
  },
  mounted() {
    console.log(this.$route.query);
    let { info, dealState } = this.$route.query;
    if(dealState) { // 待办已办进入
     let obj = JSON.parse(info);
      this.params = {
        customerName: obj.customerName, //客户姓名
        contactPhone: obj.contactPhone, //客户身份证
        certificateNum: obj.certificateNum, //客户手机号码
        customerId: obj.customerId,
        customerNum: obj.customerNum,
        projectNo: obj.projectNo,
        projectId: obj.businesskey,
        isView: dealState == 3?1:0,
        activityId: obj.activityId
      }
      // 
      switch (obj.activityId) {
        case 'WF_PROJ_APPR_01_T01': // 客户经理待办
          // this.completionList.splice(this.completionList.findIndex(item => item.value === '03'), 1);
          break;
        case 'WF_PROJ_APPR_01_T04': // 内勤待办
          this.completionList.splice(this.completionList.findIndex(item => item.value === '04'), 1);
          break;
        default:
          break;
      }
    } else {
      this.params = this.$route.query;
      this.endActive();
    }
    // this.surDtlList = {
    //   lpCertificateNum: this.params.certificateNum,
    //   id: this.params.customerId
    // }; 
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
.xh-blue {
  color:#c4252a;
  font-weight: 700;
}
</style>
