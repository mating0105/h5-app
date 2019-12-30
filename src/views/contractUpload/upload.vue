<template>
  <!-- 此页面由于产品设计不合理, 预计作废, 暂且保留 -->
  <ViewPage :rightMenuList="rightMenuList" :goPage="goPage" :iconClass="'ellipsis'" :loading="loading">
    <van-tabs v-model="activeName">
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
      },{
        title:'走款信息',path:'/c'
      },{
        title:'相关文档',path:'/proDocument'
      },{
        title:'风控措施',path:'/controlMeasure'
      },{
        title:'GPS 安装信息',path:'/gpsurl'
      }],
      projectInfo:{}
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
          lpCertificateNum: this.projectInfo.certificateNum,
          // id: this.projectInfo.id
          // lpCertificateNum: '511623198710011746',
          
        }
        const res = await getCreditInfo(params)
        // this.dataList = res.data.cuCreditRegister;
        this.loading = false

        this.surDtlList.forEach(e => {
          if (e.creditObjectType === 'borrower') {
            this.form = e;
          } else {
            this.perInfoList.push(e);
          }
        })

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
      })
    },
    goPage(item){
      let params = {};
      switch (item.title) {
        case '项目基本信息':
          params = {projectNo:this.projectInfo.projectNo,customerId:this.projectInfo.customerId,projectId:this.projectInfo.projectId,isView:'1',projectNo:this.projectInfo.projectNo}
          break;
        case '费用信息':
          let json = {info:{projectId:this.projectInfo.projectId,businesskey:''}};
          params = {info:JSON.stringify(json),dealState:'3'}
          break;
        default:
          break;
      }
      this.$router.push({ path: item.path, query: params });
    },
  },
  created(){
    this.getListDetails();
    setTimeout(()=>{
      this.getCreditInfo();
    },500)
  }
};
</script>