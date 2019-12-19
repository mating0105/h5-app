// 走款确认
<template>
  <ViewPage :loading="loading">
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
                  >{{ data.projProjectInfo.customerName?"客户姓名：" + data.projProjectInfo.customerName:""}}</van-col>
                  <van-col
                    span="12"
                    class="xh-top-10 xh-text-right"
                  >{{ data.projProjectInfo.contactPhone?"联系电话：" + data.projProjectInfo.contactPhone:"" }}</van-col>
                </van-row>
                <van-row>
                  <van-col
                    span="24"
                    class="xh-top-10 xh-ellipsis"
                  >{{ data.projProjectInfo.certificateNum?"证件号码：" + data.projProjectInfo.certificateNum+" | 身份证":"" }}</van-col>
                </van-row>
              </div>
            </template>
          </redCard>
          <van-row class="xh-page-body">
            <van-col span="6" class="xh-meun" v-for="i in meunRow" :key="i.id" @click="meunList(i)">
              <div class="xh-icon">
                <img :src="require('./../../assets/old_images/'+i.icon)" alt />
              </div>
              <div class="xh-ellipsis xh-top-10" style="font-size:14px;">{{ i.name }}</div>
            </van-col>
          </van-row>
        </div>
        <van-cell-group :border="true" class="xh-conclusion">
          <van-cell title="审批结论" :value="conclusion" is-link @click="chooseConclusion" />
        </van-cell-group>
        <card>
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
        </card>
        <div class="xh-submit">
          <van-button size="large" class="xh-bg-main" @click="submit">提交</van-button>
        </div>
      </van-tab>

      <van-tab title="审批记录" name="approval">
        <div class="xh-paysure-card">
          <Approval></Approval>
        </div>
      </van-tab>
    </van-tabs>

    <!-- 弹出选项 -->
    <van-action-sheet get-container="#app" v-model="show" class="xh-list">
      <div class="xh-list-body">
        <van-picker
          :columns="options"
          show-toolbar
          value-key="name"
          @confirm="confirm"
          @cancel="cancel"
        />
      </div>
    </van-action-sheet>
  </ViewPage>
</template>
<script>
import Vue from "vue";
import {
  Button,
  Row,
  Col,
  Tab,
  Tabs,
  Cell,
  CellGroup,
  ActionSheet,
  Picker,
  Field
} from "vant";
import redCard from "@/components/redCard/index";
import card from "@/components/card/index";
import ViewPage from "@/layout/components/ViewPage";
import Approval from "@/views/basicInfo/approvalRecord/index";
import { getPaymentDetail, getDic, submitGo } from "@/api/payment";
const Components = [
  Button,
  Row,
  Col,
  Tab,
  Tabs,
  Cell,
  CellGroup,
  ActionSheet,
  Picker,
  Field
];
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
      params: {}, //上个页面接收的数据
      data: {},
      meunRow: [
        {
          name: "项目基本信息",
          key: 1,
          icon: "icon-project.png",
          url: "/paymentProjectInfo"
        },
        {
          name: "费用信息",
          key: 2,
          icon: "icon-pay.png",
          url: "/costDetail"
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
          url: "/controlMeasure"
        },
        {
          name: "GPS安装信息",
          key: 6,
          icon: "icon-gps.png",
          url: "/vehicleList"
        }
      ],
      show: false,
      options: [
        {
          name: "同意",
          value: "01"
        },
        {
          name: "拒绝",
          value: "02"
        },
        {
          name: "回退",
          value: "04"
        }
      ],
      conclusion: "", //审批结论
      message: "", //意见描述
      conclusionCode: "",
      loading: false
    };
  },
  methods: {
    meunList(row) {
      this.$router.push({ path: row.url, query: this.params });
    },
    loadData() {
      getPaymentDetail({ projectId: this.params.projectId })
        .then(res => {
          this.loading = false;
          this.data = res.data;
        })
        .catch(e => {
          this.loading = false;
        });
    },
    chooseConclusion() {
      this.show = true;
    },
    confirm(value) {
      console.log(value);
      this.conclusion = value.name;
      this.conclusionCode = value.value;
      this.show = false;
    },
    cancel() {
      this.show = false;
    },
    //提交流程
    submit() {
      this.loading = true;
      let data = {
        businessKey: this.params.businessKey,
        commentsDesc: this.message,
        conclusionCode: this.conclusionCode
      };
      submitGo(data)
        .then(res => {
          this.loading = false;
          this.$notify({ type: "success", message: "流程提交成功" });
        })
        .catch(e => {
          this.loading = false;
        });
    }
  },
  mounted() {
    this.params = this.$route.query;
    this.params.projectId = "190228185906";
    this.params.businessKey = "190412507328";
    this.params.businessType = "08";
    this.loadData(); //加载详情数据
  }
};
</script>
<style >
.xh-paysure-card {
  padding: 10px 10px 0 10px;
}
.xh-page-body {
  background: #fff;
  border-radius: 5px;
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
.xh-conclusion {
  margin: 10px;
  border: 1px solid #ddd;
}
</style>
