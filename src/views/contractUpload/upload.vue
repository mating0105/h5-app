<template>
  <!-- 此页面由于产品设计不合理, 预计作废, 暂且保留 -->
  <ViewPage
    :rightMenuList="rightMenuList"
    :goPage="goPage"
    :iconClass="'ellipsis'"
    :loading="loading"
  >
    <van-tabs v-model="activeName" @change="changeTabs">
      <van-tab title="项目信息" name="projectInfo">
        <ProjectInfo></ProjectInfo>
      </van-tab>
      <van-tab title="征信信息" name="creditReportingInfo">     
          <CreditInfoTable title="银行征信" :dataList="dataList.surDtlList" type="creditResult" dateType="investigateDate"></CreditInfoTable>
          <creditQueryInfo v-if="TYPE == 'bairong'" @lookDocs="lookDocs" title="大数据征信" :credit100Result="brdataList.credit100Result" :dataList="brdataList.surDtlList" type="bigDataResult"></creditQueryInfo>
          <CreditInfoTable v-else title="大数据征信" :dataList="dataList.surDtlList" type="bigDataResult" dateType="bigDataDate"></CreditInfoTable>
          <CreditInfoTable v-if="rg" title="人工征信" :dataList="dataList.surDtlList" type="artificialCreditResult" dateType="investigateDate"></CreditInfoTable>
          <CreditInfoTable v-if="!rg"title="人保征信" :dataList="dataList.surDtlList" type="personalGuaResult" dateType="peopleBankDate"></CreditInfoTable>

      
      </van-tab>
    </van-tabs>
  </ViewPage>
</template>

<script>
import ViewPage from "@/layout/components/ViewPage";
import ProjectInfo from "./projectInfo";
import ApprovalRecord from "../basicInfo/approvalRecord/index";
import CreditInfoTable from "../credit/viewCompoents/creditInfoTable";
import creditQueryInfo from '../credit/viewCompoents/creditQueryInfo'
import Cookies from "js-cookie";
import api from "@/api/contractUpload";
import { getCreditInfo,getCreditType,getCompanyName,creditQueryOf100 } from "@/api/credit";
import Vue from "vue";
import { Tab, Tabs } from "vant";
Vue.use(Tab).use(Tabs);

export default {
  name: "creditNextStep",
  components: {
    ViewPage,
    ProjectInfo,
    ApprovalRecord,
    CreditInfoTable,
    creditQueryInfo
  },
  data() {
    return {
      activeName: "projectInfo",
      loading: false,
      rightMenuList: [
        {
          title: "项目基本信息",
          path: "/paymentProjectInfo"
        },
        {
          title: "费用信息",
          path: "/costDetail"
        },
        // {
        //   title:'垫款信息',path:'/c'
        // },
        {
          title: "相关文档",
          path: "/proDocument"
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
      gpsInfo: {},
      accout: "",
      phone:'',
      TYPE:'',
      dataList:{},
      brdataList:{},//百融数据
      rg:false,//是否有人工
    };
  },
  computed: {
    routeData() {
      return this.$route.query;
    }
  },
  watch: {
    activeName(val) {
      console.log(val)
      if (val == 'creditReportingInfo') {
        this.loadBigDataType();
        this.getCreditInfo();
      }
    }
  },
  methods: {
    async getCreditInfo() {
      try {
        this.loading = true;
        const params = {
          lpCertificateNum: this.projectInfo.certificateNum
        };
        const res = await getCreditInfo(params);
        this.dataList = res.data.cuCreditRegister;
        this.loading = false;
      } catch (e) {
        this.loading = false;
        console.log(e);
      }
    },
    // 获取 userInfo
    getListDetails() {
      this.loading = true;
      api.getListDetails({ id: this.routeData.projectId }).then(res => {
        res.code === 200 ? (this.loading = false) : "";
        this.projectInfo = res.data.projectInfo;
        this.gpsInfo = res.data.gpsInfo[0];
      });
    },
    goPage(item) {
      if (item.title === "GPS 安装信息") {
        if (!this.gpsInfo || !this.gpsInfo.orderId) {
          this.$notify({
            type: "danger",
            message: "未安装 GPS!"
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
    changeTabs(title) {
      if (title === "creditReportingInfo") {
        this.getCreditInfo();
      }
    },
    //获取该公司的大数据征信类型
    async loadBigDataType(){
      const {data} = await getCreditType();
      // 征信回复：:5/百融征信查询：6
      let buttonId = data[0].buttonId
      if(buttonId){
        this.TYPE = buttonId == 6 ? 'bairong' : '';
        const params = {
          lpCertificateNum: this.projectInfo.certificateNum
        }
        const res = await creditQueryOf100(params);
        this.brdataList = res.data.cuCreditRegister;
      }else{
        this.TYPE =  ''
      }
    },
    async getCompany(){
      const res = await getCompanyName();
      //鑫弘 显示人工，其他不显示
      if(res.data.companyId == '190215509218' || res.data.companyId == '190215509212'){
        this.rg = true;
      }else{
        this.rg = false;
      }
    },
    lookDocs(){
      this.activeName = 'creditReportingInfo';
    }
  },
  activated() {
    this.getListDetails();
    this.accout = Cookies.get("loginName");
    this.phone = Cookies.get("phone");
    this.getCompany();
    // this.accout = "18349309486"
  }
};
</script>
