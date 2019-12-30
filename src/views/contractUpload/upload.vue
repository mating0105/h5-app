<template>
  <!-- 此页面由于产品设计不合理, 预计作废, 暂且保留 -->
  <ViewPage>
    <van-tabs v-model="activeName">
      <van-tab title="项目信息" name="projectInfo">
        <ProjectInfo></ProjectInfo>
      </van-tab>
      <van-tab title="征信信息" name="creditReportingInfo">
        <CreditInfoTable title="人行征信" :dataList="surDtlList" type="creditResult"></CreditInfoTable>
        <CreditInfoTable title="互联网查询" :dataList="surDtlList" type="bigDataResult"></CreditInfoTable>
      </van-tab>
      <van-tab title="审批记录" name="approvalRecord">
        <ApprovalRecord></ApprovalRecord>
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
      surDtlList:[]
    };
  },
  methods: {
    async getCreditInfo () {
      try {
        this.loading = true
        const params = {
          lpCertificateNum: this.$route.query.lpCertificateNum,
          id: this.$route.query.id
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
    }
  },
  created(){
    this.getCreditInfo();
  }
};
</script>