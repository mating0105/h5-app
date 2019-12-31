<template>
  <!-- 此页面由于产品设计不合理, 预计作废, 暂且保留 -->
  <ViewPage :rightMenuList="rightMenuList" :goPage="goPage" :iconClass="'ellipsis'" :loading="loading">
    <van-tabs v-model="activeName" @change="changeTabs">
      <van-tab title="项目信息" name="projectInfo">
        <ProjectInfo></ProjectInfo>
      </van-tab>
      <van-tab title="征信信息" name="creditReportingInfo">
        <CreditInfoTable title="人行征信" :dataList="surDtlList" type="creditResult"></CreditInfoTable>
        <CreditInfoTable title="互联网查询" :dataList="surDtlList" type="bigDataResult"></CreditInfoTable>
      </van-tab>
    </van-tabs>
  </ViewPage>
</template>

<script>
import ViewPage from "@/layout/components/ViewPage";
import ProjectInfo from './projectInfo';
import ApprovalRecord from '../basicInfo/approvalRecord/index';
// import BigDataQuery from '../credit/viewCompoents/creditInfoTable';
import CreditInfoTable from '../credit/viewCompoents/creditInfoTable'
import Cookies from "js-cookie";
import api from "@/api/contractUpload";
import { getCreditInfo } from '@/api/credit'
import Vue from 'vue'
import { Tab, Tabs } from "vant";
Vue.use(Tab).use(Tabs);

export default {
  name: "creditNextStep",
  components: {
    ViewPage,
    ProjectInfo,
    ApprovalRecord,
    CreditInfoTable
  },
  data() {
    return {
      activeName: "projectInfo",
      loading: false,
      surDtlList:[],
      rightMenuList:[{
        title:'项目基本信息',path:'/paymentProjectInfo'
      },{
        title:'费用信息',path:'/costDetail'
      },
      // {
      //   title:'走款信息',path:'/c'
      // },
      {
        title:'相关文档',path:'/proDocument'
      },{
        title:'风控措施',path:'/controlMeasure'
      },{
        title:'GPS 安装信息',path:'/gpsurl'
      }],
      projectInfo:{},
      gpsInfo:{},
      accout: ""
    };
  },
  computed:{
    routeData(){
      return this.$route.query;
    },
  },
  methods: {
    async getCreditInfo () {
      try {
        this.loading = true
        const params = {
          lpCertificateNum: this.projectInfo.certificateNum
        }
        const res = await getCreditInfo(params)
        this.loading = false
        this.surDtlList = res.data.cuCreditRegister.surDtlList;

      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    // 获取 userInfo
    getListDetails(){
      this.loading = true;
      api.getListDetails({id:this.routeData.projectId}).then(res=>{
        res.code === 200 ? this.loading = false : ''
        this.projectInfo = res.data.projectInfo;
        this.gpsInfo = res.data.gpsInfo[0];
      })
    },
    goPage(item){
      if(item.title === 'GPS 安装信息'){
        
        if(this.gpsInfo){
          this.$notify({
            type: "danger",
            message: "未安装 GPS!"
          });
          return false;

        } else {
          let url = `${this.$prefixurl}orderDetail?id=${this.gpsInfo.orderId}&showTitle=false&externalid=${this.projectInfo.projectNo}&externalcustnum=${this.projectInfo.customNum}&externalvehicleid=${this.projectInfo.cars[0].id}&username=${this.accout}`;
          this.$store.dispatch("user/gspUrl", url);

        }
      }

      let json = {projectId:this.projectInfo.projectId,businesskey:''};
      let params = {
        projectNo:this.projectInfo.projectNo,
        customerId:this.projectInfo.customerId,
        customerNum:this.projectInfo.customerNum,
        projectId:this.projectInfo.projectId,
        isView:'1',
        projectNo:this.projectInfo.projectNo,
        info:JSON.stringify(json),
        dealState:3
      };
      this.$router.push({ path: item.path, query: params });
    },
    changeTabs(title){
      if(title === 'creditReportingInfo'){
        this.getCreditInfo();
      }
    }
  },
  activated(){
    this.getListDetails();
    this.accout = Cookies.get("loginName");
      // this.accout = "18349309486"
  }
};
</script>