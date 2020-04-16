<template>
    <ViewPage :loading="loading">
        <template v-slot:head>
            <van-tabs v-model="active">
                <van-tab title="基本信息"></van-tab>
                <van-tab title="历史征信"></van-tab>
                <van-tab title="相关文档"></van-tab>
                <van-tab title="审批记录"></van-tab>
            </van-tabs>
        </template>

        <template v-if="active === 1">
            <creditInfoTable title="银行征信" :dataList="dataList.surDtlList" type="creditResult" dateType="investigateDate"></creditInfoTable>
            <creditQueryInfo v-if="TYPE == 'bairong' && dataList.surDtlList.length>0" @lookDocs="lookDocs" title="大数据征信" :credit100Result="dataList.credit100Result" :dataList="brdataList.surDtlList" type="bigDataResult"></creditQueryInfo>
            <creditInfoTable v-else title="大数据征信" :dataList="dataList.surDtlList" type="bigDataResult" dateType="bigDataDate"></creditInfoTable>
            <creditInfoTable v-if="rg" title="人工征信" :dataList="dataList.surDtlList" type="artificialCreditResult" dateType="investigateDate"></creditInfoTable>
            <creditInfoTable v-if="!rg" title="人保征信" :dataList="dataList.surDtlList" type="personalGuaResult" dateType="peopleBankDate"></creditInfoTable>
        </template>
        <template v-else-if="active === 0">
            <basicInfoCredit :dataList="dataList" :edit="false" :form="form" :perInfoList="perInfoList" :hiddenHandle="true"></basicInfoCredit>
<!--            <basicInfo :dataList="dataList" :form="form" :perInfoList="perInfoList" :edit="edit" :showImage="false"></basicInfo>-->
        </template>
        <template v-else-if="active === 2">
            <relatedDocs :requestParams="requestParams" ></relatedDocs>
        </template>
        <template v-else-if="active === 3">
            <approvalRecord :requestParams="recordParams"></approvalRecord>
        </template>

        <!-- 提交按钮 -->
        <div class="xh-submit-box" v-if="edit">
            <van-button size="large" style="width: 25%; flex: none" class="xh-btn xh-primary" @click="backVisible = true"
            >回退
            </van-button>
            <van-button size="large" @click="nextStep"
                        class="xh-btn"
            >征信回复
            </van-button>
        </div>
        <transition name="page-move">
            <backspace v-if="backVisible" :visible.sync="backVisible" @submit="backspaceFn"></backspace>
        </transition>
    </ViewPage>
</template>

<script>
  import ViewPage from '@/layout/components/ViewPage';
  import Card from '@/components/card'
  import creditInfoTable from '../viewCompoents/creditInfoTable'
  import basicInfo from '../viewCompoents/basicInfo'
  import basicInfoCredit from '../reNewCredit/basicInfo'
  import creditQueryInfo from '../viewCompoents/creditQueryInfo'
  import backspace from '../viewCompoents/backspace'
  import relatedDocs from '@/views/relatedDocs/relatedDocs'
  import approvalRecord from '@/views/basicInfo/approvalRecord'
  import Vue from 'vue';
  import { getCreditInfo,getCompanyName,getButtonOfCredit,creditQueryOf100 } from '@/api/credit'
  import { bankReply } from '@/api/bigData'
  import { Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast, Notify, SwipeCell, Dialog, Tab, Tabs } from 'vant';

  const Components = [Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast, Notify, SwipeCell, Dialog, Tab, Tabs]
  Components.forEach(item => {
    Vue.use(item)
  })

  export default {
    name: "bankQuery",
    components: {
      ViewPage,
      Card,
      creditInfoTable,
      basicInfo,
      backspace,
      relatedDocs,
      approvalRecord,
      basicInfoCredit,
      creditQueryInfo
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
        brdataList:{},//百融的数据
        loading: false,
        form: {},
        perInfoList: [], //客户下面的其他客户数据
        edit: false,
        backVisible: false,
        query: {},
        requestParams: {
          customerNum: '', customerId: '', dealState: '3'
        },
        recordParams: {
          businesskey: '', businesstype: '07'
        },
        TYPE:'',
        rg:false,
      }
    },
    methods: {
      async getCreditInfo () {
        try {
          this.loading = true
          const params = {
            lpCertificateNum: this.query.lpCertificateNum,
            id: this.query.id
          }
          const res = await getCreditInfo(params)
          const dataList = res.data.cuCreditRegister
          this.requestParams.customerNum = dataList.perInfo ? dataList.perInfo.customerNum : ''
          this.requestParams.customerId = dataList.customerId
          this.recordParams.businesskey = dataList.id
          this.loading = false

          res.data.cuCreditRegister.surDtlList.forEach(e => {
            e.dataList = []
            if (e.creditObjectType === 'borrower') {
              this.form = e;
            } else {
              this.perInfoList.push(e);
            }
          })
          this.dataList = res.data.cuCreditRegister;
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
          query: {...this.query, isBank: true}
        })
      },
      async backspaceFn (commentsDesc) {
        try {
          this.loading = true
          const params = {wfBizComments: {commentsDesc, conclusionCode: '02', businessKey: this.dataList.id}, cuCreditRegister: this.dataList}
          await bankReply(params)
          this.loading = false
          this.$nextTick(() => {
            Toast.success('回退成功')
          })
          this.$nextTick(() => {
            this.$router.push('/lendProcessList')
          })
        } catch (e) {
          this.loading = false
          console.log(e)
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
      //获取该公司的大数据征信类型
      async loadBigDataType(){
        const {data} = await getButtonOfCredit();
        // 征信回复：:5/百融征信查询：6
        let buttonId = data[0].buttonId
        if(buttonId){
          this.TYPE = buttonId == 6 ? 'bairong' : '';
          const params = {
            lpCertificateNum: this.query.lpCertificateNum,
          }
          const res = await creditQueryOf100(params);
          this.brdataList = res.data.cuCreditRegister;
        }else{
          this.TYPE =  ''
        }
      },
      lookDocs(){
        this.active = 1;
      },
    },
    mounted () {
      if (this.$route.query.info && this.$route.query.dealState) {
        const info = this.getStringToObj(this.$route.query.info)
        const query = this.$route.query
        this.query = {
          lpCertificateNum: info.certificateNum,
          id: info.businesskey
        }
        this.requestParams.dealState = query.dealState
        if (query.dealState == 3) {
          this.edit = false
        }
        if (query.dealState == 1) {
          this.edit = true
        }
      } else {
        this.query = this.$route.query
        this.edit = Boolean(this.$route.query.edit) && this.$route.query.edit !== 'false'
      }
      this.getCreditInfo();
      this.getCompany();
      this.loadBigDataType();
    }
  }
</script>

<style>

    </style>
