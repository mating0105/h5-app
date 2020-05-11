/*
 * @Author: wuyueqi 
 * @Date: 2020-04-21 14:26:22 
 * @Last Modified by: wuyueqi
 * @Last Modified time: 2020-04-21 18:33:32
 * @description: 历史征信信息组件
 */
<template>
  <div>
    <creditInfoTable
      title="银行征信"
      :dataList="dataList.surDtlList"
      type="creditResult"
      dateType="investigateDate"
    ></creditInfoTable>
    <creditQueryInfo
      v-if="TYPE == 'bairong' && brdataList.surDtlList.length >0"
      @lookDocs="lookDocs"
      title="大数据征信"
      :credit100Result="brdataList.credit100Result"
      :dataList="brdataList.surDtlList"
      type="bigDataResult"
    ></creditQueryInfo>
    <creditInfoTable
      v-else
      title="大数据征信"
      :dataList="dataList.surDtlList"
      type="bigDataResult"
      dateType="bigDataDate"
    ></creditInfoTable>
    <creditInfoTable
      v-if="rg"
      title="人工征信"
      :dataList="dataList.surDtlList"
      type="artificialCreditResult"
      dateType="investigateDate"
    ></creditInfoTable>
    <creditInfoTable
      v-if="!rg"
      title="人保征信"
      :dataList="dataList.surDtlList"
      type="personalGuaResult"
      dateType="peopleBankDate"
    ></creditInfoTable>
  </div>
</template>
<script>
import creditInfoTable from "../viewCompoents/creditInfoTable";
import creditQueryInfo from "../viewCompoents/creditQueryInfo";
import {
  getCreditInfo,
  getCompanyName,
  getButtonOfCredit,
  creditQueryOf100,
  getCreditType
} from "@/api/credit";
export default {
  name: "creditHistoryPage",
  components: {
    creditInfoTable,
    creditQueryInfo
  },
  data() {
    return {
      TYPE: "",
      rg: false
    };
  },
  methods: {
    //判断登录账户属于哪个公司
    async getCompany() {
      const res = await getCompanyName();
      //鑫弘 显示人工，其他不显示
      if (
        res.data.companySchemaName == "xh-vloan" || res.data.companySchemaName == "ww-vloan"
      ) {
        this.rg = true;
      } else {
        this.rg = false;
      }
    },
    //获取征信基本信息
    async getCreditInfo() {
      try {
        this.loading = true;
        const params = {
          lpCertificateNum: this.query.lpCertificateNum,
          id: this.query.id
        };
        const res = await getCreditInfo(params);
        const dataList = res.data.cuCreditRegister;
        this.loading = false;

        res.data.cuCreditRegister.surDtlList.forEach(e => {
          e.dataList = [];
          if (e.creditObjectType === "borrower") {
            this.form = e;
          } else {
            this.perInfoList.push(e);
          }
        });
        this.dataList = res.data.cuCreditRegister;
      } catch (e) {
        this.loading = false;
        console.log(e);
      }
    }
  },
  mounted() {
    this.getCompany();
  }
};
</script>