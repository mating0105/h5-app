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
                    <van-col
                      :span="16"
                      class="xh-text-right xh-ellipsis"
                    >{{ params.customerName?params.customerName:'--' }}</van-col>
                  </van-row>
                  <van-row class="xh-top-10">
                    <van-col :span="8">联系电话：</van-col>
                    <van-col
                      :span="16"
                      class="xh-text-right xh-ellipsis"
                    >{{ params.contactPhone?params.contactPhone:'--' }}</van-col>
                  </van-row>
                  <van-row class="xh-top-10">
                    <van-col :span="8">证件号码：</van-col>
                    <van-col
                      :span="16"
                      class="xh-text-right van-ellipsis"
                    >{{ params.certificateNum?params.certificateNum + ' | 身份证':'--' }}</van-col>
                  </van-row>
                </div>
              </template>
            </red-card>
            <van-row class="xh-page-body" style="padding: 1rem 0.5rem;">
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
                <div class="van-multi-ellipsis--l2 xh-top-10" style="font-size:14px;">{{ i.name }}</div>
                <!-- 徽章 -->
                <xh-badge toTop="15" toRight="30" v-if="i.show == 1"></xh-badge>
              </van-col>
            </van-row>
          </div>

          <!-- 电核意见 -->
          <Card style="margin: 10px 0;" v-for="(item,index) in optionList" :key="index" v-if="optionList.length>0 || params.activityId == 'WF_PROJ_APPR_01_T52'">
            <template v-slot:header>{{item.buttonName}}</template>
            <section>
              <van-cell-group :border="false">
                <van-field
                  v-model="form[item.actionValue]"
                  rows="2"
                  autosize
                  :disabled="!params.activityId"
                  label-width="0"
                  :border="false"
                  type="textarea"
                  placeholder="请输入"
                  show-word-limit
                />
              </van-cell-group>
            </section>
          </Card>
          <div>
            <!-- 审批结论 -->
            <van-row
              class="xh-page-mian xh-card-box xh-radius xh-top-10"
              v-if="params.activityId == 'WF_PROJ_APPR_01_T52' || params.activityId == 'WF_PROJ_APPR_01_T04'"
            >

              <van-cell
                :border="false"
                title="风控结论"
                title-class="xh-blue"
                is-link
                :value="completionDesc"
                @click="linkCode"
              />
            </van-row>
            
            <div v-if="(params.activityId == 'WF_PROJ_APPR_01_T52' && completion == '01') || windControl.gradeManual">
              <Card style="margin: 10px 0;">
                <template slot="header">风控措施</template>
                <van-row>
                  <van-cell-group :border="false">
                    <van-cell
                      title="风控评级"
                      required
                      is-link
                      :border="false"
                      :value="returnText('GradeManual', windControl.gradeManual)"
                      @click="params.dealState != '1' ? '':loadType('风控评级', 'GradeManual')"
                    />
                    <van-cell title="是否加入关注名单" :border="false" required>
                      <radio v-model="windControl.isFoucusList" :disabled="params.dealState != '1'">
                        <radio-item label="1">是</radio-item>
                        <radio-item label="0">否</radio-item>
                      </radio>
                    </van-cell>
                    <van-cell
                      title="风控条件"
                      required
                      is-link
                      :border="false"
                      :value="returnText('risk_condition', windControl.riskCondition)"
                      @click="params.dealState != '1' ? '':loadType('风控条件', 'risk_condition')"
                    />
                    <van-cell title="业务员上门调查" :border="false" required>
                      <radio v-model="windControl.wthrDtd" :disabled="params.dealState != '1'">
                        <radio-item label="1">是</radio-item>
                        <radio-item label="0">否</radio-item>
                      </radio>
                    </van-cell>
                    <!-- <van-field
                      v-model="windControl.gpsNum"
                      :disabled="params.dealState != '1'"
                      required
                      clearable
                      type="number"
                      :border="false"
                      label="GPS数量(台)"
                      input-align="right"
                      placeholder="请输入"
                      @blur.prevent="()=>{ }"
                    />-->
                    <van-cell
                      title="GPS数量(台)"
                      required
                      is-link
                      :border="false"
                      :value="windControl.gpsNumDesc"
                      @click="params.dealState != '1' ? '':loadTypeGps('GPS数量')"
                    />
                  </van-cell-group>
                </van-row>
              </Card>
            </div>

            <!-- 审批官选择做单文员 -->
            <van-row
              class="xh-page-mian xh-card-box xh-radius xh-top-10"
              v-if="params.activityId == 'WF_PROJ_APPR_01_T52' && completion == '01'"
            >
              <van-cell
                :border="false"
                title="选择做单文员"
                title-class="xh-blue"
                :is-link="isName"
                :value="windControl.acceptPersonlDesc"
                @click="isName?acceptCode():false"
              />
            </van-row>

            <!-- 意见 -->
            <Card style="margin: 10px 0;" v-if="!params.newPro && isView">
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
            <!-- <div v-if="!params.newPro">
              <div class="xh-submit" v-if="isActive">
                <van-row>
                  <van-col :span="4">
                    <van-button
                      size="large"
                      type="default"
                      :disabled="dLoading"
                      :loading="dLoading"
                      style="color: #000;"
                      @click="submitStop"
                    >终止</van-button>
                  </van-col>
                  <van-col :span="20">
                    <van-button
                      size="large"
                      class="xh-bg-main"
                      @click="submitTask"
                      :loading="dLoading"
                      :disabled="dLoading"
                    >提 交</van-button>
                  </van-col>
                </van-row>
              </div>
              <!-- 提交按钮 -->
              <div class="xh-submit" v-if="!params.newPro && isView">
                <van-button
                  size="large"
                  class="xh-bg-main"
                  @click="submitTask"
                  :disabled="dLoading"
                  :loading="dLoading"
                >提 交</van-button>
              </div>
            </div>
            <!-- <div class="xh-submit">
              <van-button
                size="large"
                class="xh-bg-main"
                @click="submitCeShi"
              >测试跳转待办按钮</van-button>
            </div>-->
          </div>
        </div>
      </van-tab>
      <van-tab title="征信信息" name="2" v-if="isCredit">
          <creditInfoTable title="银行征信" :dataList="dataList.surDtlList" type="creditResult" dateType="investigateDate"></creditInfoTable>
          <creditInfoTable title="大数据征信" :dataList="dataList.surDtlList" type="bigDataResult" dateType="bigDataDate"></creditInfoTable>
          <creditInfoTable title="人保征信" :dataList="dataList.surDtlList" type="personalGuaResult" dateType="peopleBankDate"></creditInfoTable>
      </van-tab>
      <van-tab title="审批记录" name="3">
        <ApprovalRecord
          :requestParams="{
          businessKey: params.projectId,
          businessType: 11
        }"
        ></ApprovalRecord>
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
import {
  Button,
  Row,
  Col,
  Cell,
  Tab,
  Tabs,
  Field,
  CellGroup,
  ActionSheet,
  Picker,
  Dialog
} from "vant";
import {
  setProjectTask,
  setProjectProcess,
  isEndActive,
  postGetUserIds,
  getProjectInfo,
  getAcceptList,
  postWindControl,
  getIsSave,
  setProcessBack,
  setProcessStop
} from "@/api/project";
import { getCreditInfo } from "@/api/credit";
import { mapMethodGaoDe } from "@/api/map";
import { getGPSData,nuclearOpinion,submitNuclearOpinion } from "@/api/project";
import { mapState } from "vuex";
import xhBadge from "@/components/Badge/index";
import redCard from "@/components/redCard/index";
import Card from "@/components/card/index";
import ViewPage from "@/layout/components/ViewPage";
import ApprovalRecord from "@/views/basicInfo/approvalRecord";
import creditInfoTable from "@/views/credit/viewCompoents/creditInfoTable";
import radio from "@/components/radio";
import radioItem from "@/components/radio/radioItem";

const Components = [
  Button,
  Row,
  Col,
  Cell,
  Tab,
  Tabs,
  Field,
  CellGroup,
  ActionSheet,
  Picker
];

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
    radio,
    radioItem
  },
  computed: {
    // 所有字典
    ...mapState({
      wordbook: state => state.user.wordbook
    })
  },
  watch: {
    activeName(val) {
      if (val == 2) {
        this.getCreditInfo();
      }
    }
  },
  data() {
    return {
      isView: false,
      activeName: "1",
      selected: 1,
      showSheet: false,
      columns: [],
      meunRow: [
        {
          name: "项目基本信息",
          key: 1,
          icon: "icon-project.png",
          url: "/projectInfo",
          show: 0
        },
        {
          name: "客户及配偶",
          key: 2,
          icon: "icon-spouse.png",
          url: "/clientIndex",
          show: 0
        },
        {
          name: "紧急联系人",
          key: 3,
          icon: "icon-contact.png",
          url: "/contactPerson",
          show: 0
        },
        {
          name: "新增房产信息",
          key: 4,
          icon: "icon-house.png",
          url: "/houseUser",
          show: 0
        },
        {
          name: "家庭收入",
          key: 5,
          icon: "icon-income.png",
          url: "/incomeFamily",
          show: 0
        },
        {
          name: "名下车辆",
          key: 6,
          icon: "icon-carinfo.png",
          url: "/vehicleList",
          show: 0
        },
        {
          name: "担保人信息",
          key: 7,
          icon: "icon-guarantor.png",
          url: "/guarantor",
          show: 0
        },
        {
          name: "担保人房产",
          key: 8,
          icon: "icon-guarantor.png",
          url: "/houseGuarantor",
          show: 0
        },
        {
          name: "担保人收入信息",
          key: 9,
          icon: "icon-guarantorhouse.png",
          url: "/incomeGuarantor",
          show: 0
        },
        {
          name: "调查结论",
          key: 10,
          icon: "icon-findings.png",
          url: "/survey",
          show: 0
        },
        {
          name: "相关文档",
          key: 11,
          icon: "icon-filed.png",
          url: "/proDocument",
          show: 0
        }
      ],
      params: {},
      message: "",
      postFrom: {
        businessKey: "",
        commentsDesc: "",
        conclusionCode: "01"
      },

      certificateNum: "",
      showQRCode: false,
      qrCodeUrl: "",
      loading: false,
      dLoading: false, // 按钮loading
      completionList: [
        { label: "通过", value: "01" },
        { label: "退回", value: "03" },
        { label: "拒绝", value: "04" }
      ],
      completionDesc: "",
      completion: "", // 结论
      typeTitle: "",
      isActive: false,

      windControl: {
        acceptPersonlDesc: "",
        acceptPersonl: ""
      }, // 获取风控措施信息
      personlList: [], // 做单人员列表
      dataList: {
        // 征信数据
        investigateBank: "",
        investigateBankName: "",
        isInternetCredit: "",
        carInfos: [],
        surDtlList: []
      },
      isName: true, // 那个需求
      isCredit: true, // 是否显示征信
      gpsList: [], // gps套餐
      array:[],
      form:{},
      optionList:[],//意见的数组
    };
  },
  methods: {
    // 字典转换
    returnText(n, val) {
      let name;
      this.wordbook[n].forEach(e => {
        if (e.value == val) {
          name = e.label;
        }
      });
      return name;
    },
    confirm(row) {
      switch (this.typeTitle) {
        case "下一节点处理人":
          this.postFrom.processedBy = row.id;
          this.postProcess();
          break;
        case "意见":
          this.completionDesc = row.label;
          this.completion = row.value;
          break;
        case "风控评级":
          this.windControl.gradeManual = row.value;
          break;
        case "风控条件":
          this.windControl.riskCondition = row.value;
          break;
        case "选择做单文员":
          this.windControl.acceptPersonl = row.value;
          this.windControl.acceptPersonlDesc = row.label;
          break;
        case "GPS数量":
          this.windControl.gpsNum = row.value;
          this.windControl.gpsNumDesc = row.label;
          break;
        default:
          break;
      }
      this.showSheet = false;
    },
    submitTask() {
      this.dLoading = true;
      switch (this.params.activityId) {
        case "WF_PROJ_APPR_01_T01":
          this.createTask();
          break;
        case "WF_PROJ_APPR_01_T04":
          if (this.completion == "01") {
            this.getUserIds();
          } else {
            this.postProcess();
          }
          break;
        case "WF_PROJ_APPR_01_T52":
          this.form.projId = this.params.projectId;
          submitNuclearOpinion(this.form).then(res =>{})
          if (this.completion == "01") {
            this.setWindControl();
          } else {
            this.postProcess();
          }
          break;
        default:
          this.createTask();
          break;
      }
    },
    // 第一个节点
    createTask() {
      if (this.message == "") {
        this.message = "同意";
      }
      let obj = {
        wfBizComments: {
          conclusionCode: "01",
          businessKey: this.params.projectId,
          commentsDesc: this.message
        },
        isPerfectMsg: "",
        projCarInfo: {}
      };

      setProjectTask(obj)
        .then(res => {
          let objArr = [];
          let { data } = res;
          this.typeTitle = "下一节点处理人";
          this.showSheet = true;
          data.list.forEach(t => {
            objArr.push({
              ...t,
              label: t.companyName + "-" + t.name
            });
          });
          this.columns = objArr;
          this.dLoading = false;
        })
        .catch(() => {
          this.dLoading = false;
        });
    },
    // 内勤和审批官
    getUserIds() {
      if (this.completion != "01" && this.message == "") {
        this.$toast("请填写您的意见");
        return;
      }
      let obj = {
        conclusionCode: this.completion,
        businessKey: this.params.projectId,
        commentsDesc: this.message
      };
      postGetUserIds(obj)
        .then(res => {
          let objArr = [];
          let { data } = res;
          this.typeTitle = "下一节点处理人";
          this.showSheet = true;
          data.list.forEach(t => {
            objArr.push({
              ...t,
              label: t.companyName + "-" + t.name
            });
          });
          this.columns = objArr;
          this.dLoading = false;
        })
        .catch(() => {
          this.dLoading = false;
        });
    },
    // 提交流程
    postProcess() {
      if (this.completion != "01" && this.message == "") {
        this.$toast("请填写您的意见");
        this.dLoading = false;
        return;
      }
      if (this.message == "") {
        this.postFrom.commentsDesc = "同意";
      } else {
        this.postFrom.commentsDesc = this.message;
      }
      this.postFrom.conclusionCode = this.completion;
      this.postFrom.businessKey = this.params.projectId;
      if (this.completion == "03") {
        setProcessBack(this.postFrom)
          .then(res => {
            this.$notify({
              type: "success",
              message: res.msg
            });
            this.dLoading = false;
            this.$bridge.callHandler("jumpToTaskTab", "", res => {});
          })
          .catch(() => {
            this.dLoading = false;
          });
      } else {
        setProjectProcess(this.postFrom)
          .then(res => {
            this.$notify({
              type: "success",
              message: res.msg
            });
            this.dLoading = false;
            // this.$bridge.callHandler("jumpToTaskTab", "", res => {});
            this.$router.go(-1);
          })
          .catch(() => {
            this.dLoading = false;
          });
      }
    },
    // 流程终止
    submitStop() {
      this.dLoading = true;
      Dialog.confirm({
        title: "确定终止项目报单吗？",
        message: ""
      })
        .then(() => {
          setProcessStop({
            businessKey: this.params.projectId,
            businessType: 11
          })
            .then(res => {
              this.$notify({
                type: "success",
                message: res.msg
              });
              this.dLoading = false;
              this.$bridge.callHandler("jumpToTaskTab", "", res => {});
            })
            .catch(() => {
              this.dLoading = false;
            });
        })
        .catch(() => {
          this.dLoading = false;
        });
    },
    meunList(row) {
      this.$router.push({ path: row.url, query: this.params });
    },
    // 其他情况弹出同意不同意
    linkCode() {
      this.typeTitle = "意见";
      this.showSheet = true;
      this.columns = this.completionList;
    },
    // 是否出现终止
    endActive() {
      isEndActive({
        projId: this.params.projectId
      }).then(res => {
        this.isActive = res.data == "05" ? true : false;
      });
    },
    // 获取风控措施回显
    loadData() {
      getProjectInfo({
        id: this.params.projectId
      }).then(res => {
        let { data } = res;
        this.windControl = {
          projId: data.projectInfo.projectId, //项目id
          gradeManual:
            data.projectInfo.customer && data.projectInfo.customer.gradeManual, //手动评分
          riskCondition:
            data.projectInfo.riskMeasure &&
            data.projectInfo.riskMeasure.riskCondition, //风控条件
          gpsNum:
            data.projectInfo.riskMeasure && data.projectInfo.riskMeasure.gpsNum, //gps数量
          gpsNumDesc:
            data.projectInfo.riskMeasure && data.projectInfo.riskMeasure.gpsNumDesc, //gps数量
          wthrDtd: data.projectInfo.wthrDtd, //是否上门
          isFoucusList:
            data.projectInfo.riskMeasure &&
            data.projectInfo.riskMeasure.isFoucusList
        }; //是否关注名单
        // 转换文字

        if (data.projectInfo.clientManager) {
          this.findGpsData({
            mobile: data.projectInfo.clientManager.mobile,
            thiefRescue: data.projectInfo.thiefRescue == 2 ? "N" : "Y"
          });
        }
        this.getAcceptPersonl();
      });
    },
    // 获取做单文员
    getAcceptPersonl() {
      getAcceptList({
        projId: this.params.projectId,
        ename: "AcceptOrdersClerk"
      }).then(res => {
        let { data } = res;
        let arr = [];
        if (data.list) {
          data.list.forEach(t => {
            arr.push({
              value: t.id,
              label: t.companyName + "-" + t.name
            });
          });
        }
        if (arr.length == 1) {
          let obj = arr[0];
          this.windControl.acceptPersonlDesc = obj.label;
          this.windControl.acceptPersonl = obj.value;
          this.isName = false;
        } else {
          this.personlList = arr;
        }
      });
    },
    // 保存风控
    setWindControl() {
      for (var i in this.windControl) {
        if (
          this.windControl[i] == "" ||
          this.windControl[i] == undefined ||
          this.windControl[i] == null
        ) {
          this.$toast("带 * 必须填写完整, 且填写无误");
          this.dLoading = false;
          return;
        }
      }
      if (!this.windControl.acceptPersonl) {
        this.$toast("您还没有选做单文员");
        this.dLoading = false;
        return;
      }
      postWindControl(this.windControl)
        .then(res => {
          this.postProcess();
        })
        .catch(() => {
          this.dLoading = false;
        });
    },
    // 风控选择
    loadType(title, name) {
      this.typeTitle = title;
      this.columns = this.wordbook[name];
      this.showSheet = true;
    },
    // gps
    loadTypeGps(name) {
      this.typeTitle = name;
      this.columns = this.gpsList;
      this.showSheet = true;
    },
    // 选择做单文员
    acceptCode() {
      this.typeTitle = "选择做单文员";
      this.columns = this.personlList;
      this.showSheet = true;
    },
    // 记录保存结果红点是否存在
    getIsSaveObj() {
      getIsSave({
        projectId: this.params.projectId
      })
        .then(res => {
          let { data } = res;
          this.meunRow.forEach(t => {
            switch (t.url) {
              case "/projectInfo":
                t.show = data.projectInfo;
                break;
              case "/clientIndex":
                t.show = data.personalInfo;
                break;
              case "/contactPerson":
                t.show = data.cuEmergencyContact;
                break;
              case "/houseUser":
                t.show = data.customerHouse;
                break;
              case "/incomeFamily":
                t.show = data.customerInco;
                break;
              // case '/vehicleList':
              //   t.show = data.customerCar;
              //   break;
              // case '/guarantor':
              //   t.show = data.cuGuarantee;
              //   break;
              // case '/houseGuarantor':
              //   t.show = data.cuguaranteeHouse;
              //   break;
              // case '/incomeGuarantor':
              //   t.show = data.cuguaranteeInco;
              //   break;
              case "/survey":
                t.show = data.conclusion;
                break;

              default:
                break;
            }
          });
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    async getCreditInfo() {
      const params = {
        lpCertificateNum: this.params.certificateNum
      };
      const res = await getCreditInfo(params);
      this.dataList = res.data.cuCreditRegister;
    },
    getLocation() {
      const self = this;
      AMap.plugin("AMap.Geolocation", function() {
        var geolocation = new AMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 10000
        });

        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, "complete", onComplete);
        AMap.event.addListener(geolocation, "error", onError);

        function onComplete(data) {
          // data是具体的定位信息
          console.log("定位成功信息：", data);
          // 调用ip定位
          self.getLngLatLocation();
        }

        function onError(data) {
          // 定位出错
          console.log("定位失败错误：", data);
          // 调用ip定位
          self.getLngLatLocation();
        }
      });
    },
    getLngLatLocation() {
      AMap.plugin("AMap.CitySearch", function() {
        var citySearch = new AMap.CitySearch();
        citySearch.getLocalCity(function(status, result) {
          console.log(status, result);
          if (status === "complete" && result.info === "OK") {
            // 查询成功，result即为当前所在城市信息
            console.log("通过ip获取当前城市：", result);
            //逆向地理编码
            AMap.plugin("AMap.Geocoder", function() {
              var geocoder = new AMap.Geocoder({
                // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                city: result.adcode
              });

              var lnglat = result.rectangle.split(";")[0].split(",");
              geocoder.getAddress(lnglat, function(status, data) {
                if (status === "complete" && data.info === "OK") {
                  // result为对应的地理位置详细信息
                  console.log(data);
                }
              });
            });
          }
        });
      });
    },
    getMapGaoDe() {
      mapMethodGaoDe().then(res => {
        console.log(res);
        let { data } = res;
        let citys = districts[0].districts;
        citys.forEach(t => {});
      });
    },
    // 获取GPS套餐
    findGpsData(val) {
      getGPSData(val).then(res => {
        let { data } = res;
        let arr = data.records;
        let list = [];
        arr.forEach(t => {
          list.push({
            label: t.cmsPackage.packageprod,
            value: t.cmsPackage.id
          });
        });
        this.gpsList = list;
      });
    },
    // 测试按钮
    submitCeShi() {
      this.$bridge.callHandler("jumpToTaskTab", "", res => {});
    },
    //是否存在电核意见
    loadOpinion(){
      nuclearOpinion().then(res =>{
        this.optionList = res.data;
      })
    },
  },
  mounted() {
    let { info, dealState } = this.$route.query;
    console.log(this.$route.query)
    if (dealState) {
      // 待办已办进入
      let obj = JSON.parse(info);
      console.log(obj)
      this.params = {
        customerName: obj.customerName, //客户姓名
        contactPhone: obj.contactPhone, //客户身份证
        certificateNum: obj.certificateNum, //客户手机号码
        customerId: obj.customerId,
        customerNum: obj.customerNum,
        projectNo: obj.projectNo,
        projectId: obj.businesskey,
        isView: dealState == 1 ? 0 : 1,
        dealState: dealState,
        activityId: obj.activityId,
        newPro:obj.newPro
      };
      this.isView = dealState == 1;
      //如果是新的报单并且是查看状态 就不显示项目基本信息
      if(obj.newPro && this.isView){
        this.meunRow.splice(0,1);
      }
      //判断是否有电核意见
      if(obj.electricityNuclearOpinion){
        this.loadOpinion();
        this.form.electricityNuclearOpinion = obj.electricityNuclearOpinion
      }
      if(dealState == 3){
        this.loadData();
      }
      // 待办已办
      switch (obj.activityId) {
        case "WF_PROJ_APPR_01_T01": // 客户经理待办
          this.params.isView = 0;
          break;
        case "WF_PROJ_APPR_01_T04": // 内勤待办
          this.completionList.splice(
            this.completionList.findIndex(item => item.value === "04"),
            1
          );
          this.params.isView = 0;
          break;
        case "WF_PROJ_APPR_01_T52"://风控审批代办
          this.loadData();
          this.loadOpinion();
          this.params.isView = 1;
          break;
        default:
          break;
      }
    } else {
      this.params = this.$route.query;
      this.params.dealState = this.params.isView == 0 ? 1 : 3; // 图片 上传 1 ----  查看 3
      this.params.businesskey = this.$route.query.projectId;
      this.isView = this.params.isView == 0;
      if(this.params.newPro && this.isView){
        this.meunRow.splice(0,1);
      }
    }
    if (this.isView) {
      this.getIsSaveObj();
    }
    this.endActive();
    // let datas = JSON.parse(sessionStorage.getItem("pro"));
    // if (datas) {
    //   sessionStorage.removeItem("pro");
    // }
    // this.getMapGaoDe();
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
  position: relative;
  vertical-align: middle;
  display: inline-block;
  height: 100px;
}
.xh-icon {
  width: 100%;
  height: 30px;
  margin-top: 25px;
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
  color: #c4252a;
  font-weight: 700;
}
</style>
