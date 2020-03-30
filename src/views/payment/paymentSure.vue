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
            v-if="params.dealState && data.projPayInfo.riskLeader == 1"
          >
            <van-cell title="风控意见" :value="riskConclusion" />
          </van-cell-group>
          <card v-if="params.dealState && data.projPayInfo.riskLeader == 1">
            <template v-slot:header>风控说明</template>
            <section>
              <van-cell-group :border="false">
                <van-field
                  v-model="data.projPayInfo.riskDescription"
                  rows="2"
                  autosize
                  disabled
                  label-width="0"
                  :border="false"
                  type="textarea"
                />
              </van-cell-group>
            </section>
          </card>
          <van-cell-group :border="true" class="xh-conclusion" v-if="params.dealState">
            <van-cell
              title="审批结论"
              :value="conclusion"
              :is-link="params.dealState == 1?true:false"
              @click="params.dealState == 1 && loadType('审批意见','message')"
            />
          </van-cell-group>
          <van-cell-group :border="true" class="xh-conclusion" v-show="conclusionCode == '01'">
            <van-cell
              title="贷款金额"
              :value="this.numFilter(data.projProjectInfo.loanAmt)"
            >
             <div slot="right-icon" class="xh-cell-right">元</div>
            </van-cell>
          </van-cell-group>

          <card style="margin-top: 1rem;">
            <div>
              <van-swipe-cell
                :disabled="params.dealState == 3"
                v-for="(item,index) in advanceList"
                :key="index"
                v-show="conclusionCode == '01'"
              >
                <div class="title">第{{index+1}}次垫款信息</div>
                <van-cell-group :border="false">
                  <van-cell
                    title="垫款资方"
                    :required="params.dealState != 3"
                    :is-link="params.dealState != 3"
                    :value="item.advancesAssetName"
                    @click="params.dealState == 3?'':loadType('垫款资方', 'managename',index)"
                    label-class="labelClass"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-field
                    v-model="item.advancesMoney"
                    clearable
                    :required="params.dealState != 3"
                    label="垫款金额"
                    input-align="right"
                    placeholder="请输入"
                    :disabled="params.dealState == 3"
                    @blur.prevent="priceFloat(item, 'advancesMoney')"
                  >
                    <div slot="button">元</div>
                  </van-field>
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell
                    title="垫款时间"
                    :required="params.dealState != 3"
                    :is-link="params.dealState != 3"
                    :value="item.time"
                    @click="params.dealState == 3?'':showPopupTime(index)"
                    label-class="labelClass"
                    @blur.prevent="ruleMessge"
                  />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell :required="params.dealState != 3" title="垫款凭证" />
                </van-cell-group>
                <imageList
                  :dataList="[one]"
                  v-for="one in item.dataImg"
                  :key="item.id"
                  :view="params.dealState == 3"
                ></imageList>

                <div slot="right" style="height: 100%">
                  <van-button
                    type="danger"
                    style="height:100%;border-radius: 0;"
                    @click="remove(index, item)"
                  >删除</van-button>
                </div>
              </van-swipe-cell>
              <div class="title" v-if="showAdvances && params.dealState == 1">
                添加垫款记录
                <div class="card-icon" @click="addCard">
                  <van-icon name="add-o" />
                </div>
              </div>
            </div>
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
  DatetimePicker,
  SwipeCell,
  Toast,
  Dialog
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
  DatetimePicker,
  SwipeCell,
  Dialog
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
      manageList: [], //资方数组
      advanceList: [], //垫款记录数组
      advanceIndex: "",
      timeIndex: ""
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
  watch:{
    advanceList(val){
      console.log('44444',val)
    }
  },
  methods: {
    meunList(row) {
      console.log(row);
      // this.params.dealState = "3";
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
        } else {
          this.$notify({ type: "danger", message: "未安装GPS" });
          console.log(this.params.dealState);
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
    async loadData() {
      this.loading = true;
      getPaymentDetail({
        projectId: this.params.info.projectId,
        businesskey: this.params.info.businesskey
      })
        .then(res => {
          this.data = res.data;
          if (res.data.projPayInfo.examineApprove === "01") {
            this.showAdvances = true;
          } else {
            this.showAdvances = false;
          }
          this.message = this.data.projPayInfo.riskDescription;
          switch (this.data.projPayInfo.riskConclusion) {
            case 0:
              this.riskConclusion = "拒绝";
              break;
            case 1:
              this.riskConclusion = "通过";
              break;
            default:
              this.riskConclusion = "";
              break;
          }
          let name;
          this.options.forEach(item => {
            if (item.value == res.data.projPayInfo.examineApprove) {
              this.conclusion = item.name;
              this.conclusionCode = item.value;
            }
          });
          this.advanceList = res.data.projPayInfo.advancesAsset;
          if (this.advanceList.length < 1) {
            this.advanceList = [{ dataImg: [] }];
            this.advanceList.forEach(e => {
              e.time = format(new Date(), "yyyy-MM-dd hh:mm");
              e.dataImg.push({
                declare: "垫款凭证", //图片描述
                isRequire: true, //*是否必须
                deletable: true, //是否可以操作-上传和删除
                documentType: "0001",
                customerNum: e.id ? e.id : this.params.info.customerNum,
                customerId: this.params.info.customerId,
                kind: "1",
                fileList: []
              });
            });
          } else {
            let list = JSON.parse(JSON.stringify(this.advanceList));
            list.forEach(e => {
              e.time = format(new Date(e.advancesTime), "yyyy-MM-dd hh:mm");
              e.dataImg = [];
              this.getDocumentByType("0001", e);
            });
            setTimeout(() => {
              this.advanceList = list;
            });
            console.log('2dsfds', this.advanceList)
          }
          this.loading = false;
        })
        .catch(e => {
          this.loading = false;
        });
    },
    //加载垫款资方
    async loadManagement() {
      managementList().then(res => {
        this.manageList = res.data;
        if (this.manageList.length < 2) {
          this.advanceList.forEach(e => {
            e.advancesAssetName = this.manageList[0].advancesAssetName;
            e.advancesAssetId = this.manageList[0].id;
          });
        }
      });
    },
    //上拉菜单选择
    loadType(title, field, index) {
      this.show = true;
      this.advanceIndex = index;
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
      if (value.type == "垫款资方") {
        this.advanceList[this.advanceIndex].advancesAssetName = value.name;
        this.advanceList[this.advanceIndex].advancesAssetId = value.value;
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
    showPopupTime(index) {
      this.show2 = true;
      this.timeIndex = index;
    },
    confirmTime(value) {
      var time = format(value, "yyyy-MM-dd hh:mm");
      this.advanceList[this.timeIndex].time = time;
      this.advanceList[this.timeIndex].advancesTime = Date.parse(
        new Date(value)
      );
      this.show2 = false;
    },
    cancelTime() {
      this.show2 = false;
    },
    //删除垫款记录
    remove(index, item) {
      Dialog.confirm({
        title: "删除",
        message: "确定删除该垫款记录？"
      })
        .then(() => {
          this.advanceList.splice(index, 1);
        })
        .catch(() => {
          reject()
        });
    },
    //提交流程
    submit() {
      if (this.data.projPayInfo.riskLeader == 1 && this.riskConclusion == "") {
        this.$notify({ type: "danger", message: "请通知审批官审批" });
      } else {
        if (!this.conclusionCode) {
          this.$notify({ type: "danger", message: "请选择审批结论" });
          return;
        }
        let money = 0;
        let thisT = true;
        if (this.conclusionCode == "01") {
          for (let e = 0; e < this.advanceList.length; e++) {
            if (!this.advanceList[e].advancesAssetName) {
              this.$notify({ type: "danger", message: "请选择垫款资方" });
              thisT = false;
              break;
            }
            if (!this.advanceList[e].advancesMoney) {
              this.$notify({ type: "danger", message: "请输入垫款金额" });
              thisT = false;
              break;
            }
            if (!this.advanceList[e].advancesTime) {
              this.$notify({ type: "danger", message: "请选择垫款时间" });
              thisT = false;
              break;
            }
            if (this.advanceList[e].dataImg[0].fileList.length < 1) {
              this.$notify({ type: "danger", message: "请上传垫款资料" });
              thisT = false;
              break;
            }
            console.log(
              parseFloat(money),
              parseFloat(this.advanceList[e].advancesMoney)
            );
            money =
              parseFloat(money) + parseFloat(this.advanceList[e].advancesMoney);
            this.advanceList[e].documentIds = [];
            this.advanceList[e].dataImg.forEach(i => {
              i.fileList.forEach(p => {
                this.advanceList[e].documentIds.push(p.documentId);
              });
            });
          }
        }
        if (!thisT) {
          return;
        }
        if (money != this.data.projProjectInfo.loanAmt) {
          Toast("垫款金额需等于贷款金额时才能提交");
          return;
        }
        let businessKey = this.params.info.businesskey;
        this.advanceList.forEach(e => {
          e.projPayId = businessKey;
          e.id = e.id ? e.id : "";
        });
        let data = {
          wfComment: {
            businessKey: businessKey,
            commentsDesc: this.message,
            conclusionCode: this.conclusionCode
          },
          projPayInfo: {
            advancesAsset: this.advanceList
          }
        };
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
      }
    },
    async getDocumentByType(documentType, obj) {
      try {
        const params = {
          customerNum: obj.id,
          documentType: documentType
        };
        const { data } = await getDocumentByType(params);
        const declare = this.documentType[documentType]
          ? this.documentType[documentType].label
          : "图片描述";
        obj.dataImg.push({
          declare: declare, //图片描述
          isRequire: true, //*是否必须
          deletable: this.params.dealState != 3, //是否可以操作-上传和删除
          documentType: documentType,
          customerNum: obj.id,
          customerId: this.params.info.customerId,
          kind: "1",
          fileList: data
        });
      } catch (e) {
        console.log(e);
      }
    },
    //添加垫款记录
    addCard() {
      this.advanceList.push({ dataImg: [], time: format(new Date(), "yyyy-MM-dd hh:mm") });
      this.advanceList[this.advanceList.length - 1].dataImg.push({
        declare: "垫款凭证", //图片描述
        isRequire: true, //*是否必须
        deletable: true, //是否可以操作-上传和删除
        documentType: "0001",
        customerNum: this.params.info.customerNum,
        customerId: this.params.info.customerId,
        kind: "1",
        fileList: []
      });
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
    this.loadData().then(() => this.loadManagement()); //加载详情数据
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
.add-card {
  padding: 1rem;
  color: #c4252a;
}
.title {
  padding: 1rem;
  color: #c4252a;
}
</style>
