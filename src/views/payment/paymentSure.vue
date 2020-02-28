// 垫款确认
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
        <div>
          <van-cell-group
            :border="true"
            class="xh-conclusion"
            v-if="params.dealState == 1 && data.projPayInfo.riskLeader == 1"
          >
            <van-cell title="风控意见" :value="riskConclusion" />
          </van-cell-group>
          <van-cell-group :border="true" class="xh-conclusion" v-if="params.dealState == 1">
            <van-cell
              title="审批结论"
              :value="conclusion"
              :is-link="params.dealState == 1?true:false"
              @click="params.dealState == 1 && loadType('审批意见','message')"
            />
          </van-cell-group>
          <van-cell-group :border="true" class="xh-conclusion" v-if="params.dealState == 1">
            <van-cell title="审批意见" :value="data.projPayInfo.riskDescription" />
          </van-cell-group>
          <card v-if="showAdvances">
            <template slot="header">资方垫款信息</template>
            <van-cell-group :border="false">
              <van-cell
                title="垫款资方"
                required
                is-link
                :value="datalist.advancesAssetName"
                @click="loadType('垫款资方', 'managename')"
                label-class="labelClass"
              />
            </van-cell-group>
            <van-cell-group :border="false">
              <van-field
                v-model="datalist.loanAmt"
                clearable
                label="垫款金额"
                input-align="right"
                placeholder="请输入"
              />
            </van-cell-group>
            <van-cell-group :border="false">
              <van-cell
                title="垫款时间"
                required
                is-link
                :value="datalist.advancesTime"
                @click="showPopupTime"
                label-class="labelClass"
                @blur.prevent="ruleMessge"
              />
            </van-cell-group>
            <van-cell-group :border="false">
              <van-cell title="垫款凭证" />
            </van-cell-group>
            <imageList :dataList="dataImg"></imageList>
          </card>
          <card v-if="params.dealState == 1">
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
                />
              </van-cell-group>
            </section>
          </card>
          <div class="xh-submit" style="padding:0 10px 10px 10px;" v-if="params.dealState == 1">
            <van-button size="large" class="xh-bg-main" @click="submit">提交</van-button>
          </div>
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

    <van-action-sheet get-container="#app" v-model="show2" class="xh-list">
      <div class="xh-list-body">
        <van-datetime-picker
          title="请选择"
          type="datetime"
          v-model="currentDate"
          @confirm="confirmTime"
          @cancel="cancelTime"
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
  Field,
  DatetimePicker
} from "vant";
import redCard from "@/components/redCard/index";
import card from "@/components/card/index";
import ViewPage from "@/layout/components/ViewPage";
import Approval from "@/views/basicInfo/approvalRecord/index";
import Cookies from "js-cookie";
import {
  getPaymentDetail,
  getDic,
  submitGo,
  managementList
} from "@/api/payment";
import imageList from "@/components/imageList";
import { getDocumentByType } from "@/api/document";
import { format } from "@/utils/format";
import { mapState } from "vuex";
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
  Field,
  DatetimePicker
];
Components.forEach(item => {
  Vue.use(item);
});
export default {
  components: {
    redCard,
    ViewPage,
    card,
    Approval,
    imageList
  },
  data() {
    return {
      activeName: "project",
      params: {}, //上个页面接收的数据
      data: {
        projProjectInfo: {},
        projPayInfo: {
          riskConclusion: ""
        }
      },
      riskConclusion: "",
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
          url: "/paymentDocument"
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
          url: "/gpsurl"
        }
      ],
      show: false,
      show2: false,
      currentDate: "",
      options: [
        {
          name: "已垫款",
          value: "01"
        },
        {
          name: "回退",
          value: "02"
        },
        {
          name: "拒绝",
          value: "04"
        }
      ],
      conclusion: "", //审批结论
      message: "", //意见描述
      conclusionCode: "",
      time: "", //垫款时间
      loading: false,
      accout: "",
      phone: "",
      showAdvances: false, //资方垫款信息是否显示
      datalist: {},
      dataImg: [],
      manageList: [] //资方数组
    };
  },
  computed: {
    wordbook() {
      return this.$store.state.user.wordbook;
    },
    documentType() {
      let obj = {};
      if (this.wordbook.document_type && this.wordbook.document_type.length) {
        this.wordbook.document_type.forEach(item => {
          obj[item.value] = item;
        });
      }
      return obj;
    }
  },
  methods: {
    meunList(row) {
      console.log(row);
      this.params.dealState = "3";
      if (row.url == "/paymentProjectInfo") {
        this.$router.push({
          path: row.url,
          query: {
            projectId: this.data.projBudgetList.projectId,
            isView: "1"
          }
        });
      } else if (row.url == "/gpsurl") {
        if (
          this.data.projGpsInstals[0].gpsnum > 0 &&
          this.data.projGpsInstals[0].gpsIsDone != "-1"
        ) {
          let url =
            this.$prefixurl +
            `orderDetail?id=${this.data.projGpsInstals[0].orderId}&showTitle=false&externalid=${this.params.info.projectNum}&externalcustnum=${this.params.info.customerNum}&externalvehicleid=${this.params.info.customerId}&username=${this.accout}&xhphonenum=${this.phone}&type=xh_h5`;
          //通知移动端加载gps安装页面
          this.$bridge.callHandler("loadUrl", url, data => {
            this.onLoad();
          });
          // window.location.href = url;
        }else{
          this.$notify({ type: "danger", message: "未安装GPS" });
        }
      } else {
        this.$router.push({
          path: row.url,
          query: {
            info: JSON.stringify(this.params.info),
            dealState: this.params.dealState
          }
        });
      }
    },
    loadData() {
      this.loading = true;
      getPaymentDetail({
        projectId: this.params.info.projectId,
        businesskey: this.params.info.businesskey
      })
        .then(res => {
          this.data = res.data;
          this.datalist.loanAmt = this.numFilter(
            this.data.projProjectInfo.loanAmt
          );
          this.message = this.data.projPayInfo.riskDescription;
          if (this.data.projPayInfo.advancesAssetName) {
            this.showAdvances = true;
          } else {
            this.showAdvances = false;
          }
          switch (this.data.projPayInfo.riskConclusion) {
            case 0:
              this.riskConclusion = "不通过";
              break;
            case 1:
              this.riskConclusion = "通过";
              break;
            default:
              this.riskConclusion = "";
              break;
          }
          this.loading = false;
        })
        .catch(e => {
          this.loading = false;
        });
    },
    //加载垫款资方
    loadManagement() {
      managementList().then(res => {
        this.manageList = res.data;
      });
    },
    //上拉菜单选择
    loadType(title, field) {
      this.show = true;
      switch (title) {
        case "垫款资方":
          let list = [];
          this.manageList.forEach(e => {
            list.push({
              name: e.advancesAssetName,
              value: e.id,
              type: "垫款资方"
            });
          });
          this.options = list;
          break;
        case "审批意见":
          this.options = [
            {
              name: "已垫款",
              value: "01"
            },
            {
              name: "回退",
              value: "02"
            },
            {
              name: "拒绝",
              value: "04"
            }
          ];
          break;
      }
    },
    confirm(value) {
      console.log(value);
      if (value.type == "垫款资方") {
        this.datalist.advancesAssetName = value.name;
        this.datalist.advancesAssetId = value.value;
        console.log("advancesAssetId", this.datalist.advancesAssetId);
      } else {
        this.conclusion = value.name;
        this.conclusionCode = value.value;
        if (this.conclusionCode == "01" && this.params) {
          this.showAdvances = true;
        } else {
          this.showAdvances = false;
        }
      }
      this.show = false;
    },
    cancel() {
      this.show = false;
    },
    showPopupTime() {
      this.show2 = true;
    },
    confirmTime(value) {
      this.time = Date.parse(new Date(value));
      var time = format(value, "yyyy-MM-dd hh:mm");
      this.datalist.advancesTime = time;
      this.show2 = false;
    },
    cancelTime() {
      this.show2 = false;
    },
    //提交流程
    submit() {
      if (this.data.projPayInfo.riskLeader == 1 && this.riskConclusion == "") {
        this.$notify({ type: "danger", message: "请通知审批官审批" });
      } else {
        if (this.dataImg.length < 1 && this.conclusionCode == "01") {
          this.$notify({ type: "danger", message: "请上传垫款资料" });
        } else {
          let businessKey = this.params.info.businesskey;
          let data = {
            wfComment: {
              businessKey: businessKey,
              commentsDesc: this.message,
              conclusionCode: this.conclusionCode
            },
            projPayInfo: {
              advancesAssetId: this.datalist.advancesAssetId,
              advancesAssetName: this.datalist.advancesAssetName,
              advancesMoney: this.datalist.loanAmt,
              advancesTime: this.time
            }
          };
          if (this.conclusionCode) {
            if (this.conclusionCode == "02") {
              if (!this.message) {
                this.$notify({ type: "danger", message: "请输入意见描述" });
              } else {
                this.loading = true;
                submitGo(data)
                  .then(res => {
                    this.loading = false;
                    this.$notify({ type: "success", message: "流程提交成功" });
                    this.$router.go(-1);
                  })
                  .catch(e => {
                    this.loading = false;
                  });
              }
            } else {
              this.loading = true;
              if (this.message == "") {
                data.commentsDesc = "同意";
              }
              submitGo(data)
                .then(res => {
                  this.loading = false;
                  this.$notify({ type: "success", message: "流程提交成功" });
                  this.$router.go(-1);
                })
                .catch(e => {
                  this.loading = false;
                });
            }
          } else {
            this.$notify({ type: "danger", message: "请选择审批结论" });
          }
        }
      }
    },
    //加载垫款图片
    loadImg() {
      this.getDocumentByType("0001");
    },
    async getDocumentByType(documentType) {
      try {
        const params = {
          customerNum: this.params.info.customerNum,
          documentType: documentType
        };
        const { data } = await getDocumentByType(params);
        const declare = this.documentType[documentType]
          ? this.documentType[documentType].label
          : "图片描述";
        data.forEach(item => {
          item.declare = declare;
        });
        this.dataImg.push({
          declare: declare, //图片描述
          isRequire: true, //*是否必须
          deletable: true, //是否可以操作-上传和删除
          documentType: documentType,
          customerNum: this.params.info.customerNum,
          customerId: this.params.info.customerId,
          kind: "1",
          fileList: data
        });
      } catch (e) {
        console.log(e);
      }
    }
  },
  mounted() {
    this.params = {
      info: this.getStringToObj(this.$route.query.info),
      dealState: this.$route.query.dealState
    };
    console.log(this.params);
    this.accout = Cookies.get("loginName");
    this.phone = Cookies.get("phone");
    // this.accout = '18349309486';
    this.loadData(); //加载详情数据
    this.loadManagement(); //加载资方
    this.loadImg();
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
.xh-conclusion span {
  color: #c4252a;
  font-weight: bold;
}
</style>
