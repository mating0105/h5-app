<template>
    <ViewPage :loading="loading">
        <template v-slot:head>
            <van-tabs v-model="active">
                <van-tab title="基本信息"></van-tab>
                <van-tab title="征信信息"></van-tab>
                <van-tab title="相关文档"></van-tab>
                <van-tab title="审批记录"></van-tab>
            </van-tabs>
        </template>
        <template v-if="active === 1">
            <creditInfoTable title="人行征信" :dataList="dataList.surDtlList" type="creditResult"></creditInfoTable>
            <creditInfoTable title="互联网查询" :dataList="dataList.surDtlList" type="bigDataResult"></creditInfoTable>
            <!-- 百融 -->
            <creditQueryInfo title="大数据征信查询信息" :dataList="dataList.surDtlList" type="bigDataResult"></creditQueryInfo>
        </template>
        <template v-else-if="active === 0">
            <basicInfo :dataList="dataList" :form="form" :perInfoList="perInfoList"></basicInfo>
        </template>
        <template v-else-if="active === 2">
            <relatedDocs :requestParams="requestParams"></relatedDocs>
        </template>
        <template v-else-if="active === 3">
            <approvalRecord :requestParams="recordParams"></approvalRecord>
        </template>

        <!-- 提交按钮 -->
        <div class="xh-submit-box" v-if="edit">
            <van-button size="large" @click="nextStep"
                        class="xh-btn"
            >征信回复
            </van-button>
        </div>
    </ViewPage>
</template>

<script>
  import ViewPage from '@/layout/components/ViewPage';
  import Card from '@/components/card'
  import creditInfoTable from '../viewCompoents/creditInfoTable'
  import creditQueryInfo from '../viewCompoents/creditQueryInfo'
  import basicInfo from '../viewCompoents/basicInfo'
  import relatedDocs from '@/views/relatedDocs/relatedDocs'
  import approvalRecord from '@/views/basicInfo/approvalRecord'
  import Vue from 'vue';
  import { getCreditInfo } from '@/api/credit'
  import { Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast, Notify, SwipeCell, Dialog, Tab, Tabs } from 'vant';

  const Components = [Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast, Notify, SwipeCell, Dialog, Tab, Tabs]
  Components.forEach(item => {
    Vue.use(item)
  })

  export default {
    name: "bigDataQueryDetail",
    components: {
      ViewPage,
      Card,
      creditInfoTable,
      creditQueryInfo,
      basicInfo,
      relatedDocs,
      approvalRecord
    },
    data () {
      return {
        active: 0,
        dataList: {
          investigateBank: '',
          investigateBankName: '',
          isInternetCredit: '',
          carInfos: [],
          surDtlList: []
        },
        loading: false,
        form: {},
        perInfoList: [], //客户下面的其他客户数据
        edit: false,
        requestParams: {
          customerNum: '', customerId: '', dealState: '3'
        },
        recordParams: {
          businesskey: '', businesstype: '07'
        }
      }
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
          this.dataList = res.data.cuCreditRegister;
          this.requestParams.customerNum = this.dataList.perInfo ? this.dataList.perInfo.customerNum : ''
          this.requestParams.customerId = this.dataList.customerId
          this.recordParams.businesskey = this.dataList.id
          this.loading = false

          this.dataList.surDtlList.forEach(e => {
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
      /**
       * 下一步
       **/
      async nextStep () {
        this.$router.push({
          path: '/bigDataReply',
          query: this.$route.query
        })
      }
    },
    mounted () {
      this.getCreditInfo()
      this.edit = Boolean(this.$route.query.edit) && this.$route.query.edit !== 'false'
    }
  }
</script>

<style>

    </style>
