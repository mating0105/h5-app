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
            <!-- 百融 -->
            <creditQueryInfo v-if="TYPE" @lookDocs="lookDocs" title="大数据征信查询信息" :dataList="dataList.surDtlList" type="bigDataResult"></creditQueryInfo>
            <div v-else>
              <creditInfoTable title="银行征信" :dataList="dataList.surDtlList" type="creditResult"></creditInfoTable>
              <creditInfoTable title="大数据征信" :dataList="dataList.surDtlList" type="bigDataResult"></creditInfoTable>
              <creditInfoTable title="人保征信" :dataList="dataList.surDtlList" type="personalGuaResult"></creditInfoTable>
            </div>
        </template>
        <template v-else-if="active === 0">
            <basicInfoCredit :dataList="dataList" :edit="edit" :form="form" :perInfoList="perInfoList" :hiddenHandle="true"></basicInfoCredit>
            <basicInfo :dataList="dataList" :form="form" :perInfoList="perInfoList" :bigData="bigData" :rbCredit="rbCredit" :edit="edit"></basicInfo>
        </template>
        <template v-else-if="active === 2">
            <relatedDocs :requestParams="requestParams"></relatedDocs>
        </template>
        <template v-else-if="active === 3">
            <approvalRecord :requestParams="recordParams"></approvalRecord>
        </template>

        <!-- 提交按钮 -->
        <div class="xh-submit-box" v-if="edit && !TYPE">
            <van-button size="large" @click="nextStep"
                        class="xh-btn"
            >发起征信查询
            </van-button>
        </div>
        <div class="xh-submit-box" v-if="active === 0 && TYPE">
          <van-button size="large" @click="triggerQuery"
                      class="xh-btn"
          >发起征信查询</van-button>
        </div>
        
    </ViewPage>
</template>

<script>
  import ViewPage from '@/layout/components/ViewPage';
  import Card from '@/components/card'
  import creditInfoTable from '../viewCompoents/creditInfoTable'
  import creditQueryInfo from '../viewCompoents/creditQueryInfo'
  import basicInfo from '../viewCompoents/basicInfo'
  import basicInfoCredit from '../reNewCredit/basicInfo'
  import relatedDocs from '@/views/relatedDocs/relatedDocs'
  import approvalRecord from '@/views/basicInfo/approvalRecord'
  import { getValue, setValue, removeValue } from '@/utils/session'
  import Vue from 'vue';
  import { getCreditInfo,creditQueryOf100,getButtonOfCredit } from '@/api/credit'
  import Bus from '@/utils/bus';
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
      basicInfoCredit,
      relatedDocs,
      approvalRecord
    },
    data () {
      return {
        TYPE:'',
        reRegister:null, //百融征信查询，30天以内不能再次查询
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
        },
        bigData: false,
        rbCredit: false
      }
    },
    methods: {
      async getButtonOfCredit() {
        try {
          const {data} = await getButtonOfCredit()
          // 征信回复：:5/百融征信查询：6
          this.buttonId = data[0].buttonId
          if(this.buttonId){
            this.TYPE = this.buttonId == 6 ? 'bairong' : ''
          }else{
            this.TYPE =  ''
          }
        }catch (e) {
          console.log(e)
        }
      },
      async getCreditInfo () {
        try {
          this.loading = true
          const params = {
            lpCertificateNum: this.$route.query.lpCertificateNum,
            id: this.$route.query.id
          }
          let res;
          let dataList;
          if (getValue("credit")) {
            dataList = JSON.parse(getValue("credit"))
            if(this.TYPE)
                this.reRegister = dataList.reRegister
          } else {
            if(this.TYPE){
              res = await creditQueryOf100(params)
              this.reRegister = res.data.cuCreditRegister.reRegister
            }else{
              res = await getCreditInfo(params)
            }
            dataList = res.data.cuCreditRegister
          }

          this.requestParams.customerNum = dataList.perInfo ? dataList.perInfo.customerNum : ''
          this.requestParams.customerId = dataList.customerId
          this.recordParams.businesskey = dataList.id
          this.loading = false

          dataList.surDtlList.forEach(e => {
            e.dataList = []
            if (e.creditObjectType === 'borrower') {
              this.form = e;
            } else {
              this.perInfoList.push(e);
            }
          })
          this.dataList = dataList;
          this.initCustomerData()
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      },
      initCustomerData () {
        let customerData = this.$store.state.credit.customerData
        if (customerData) {
          const index = this.$store.state.credit.index
          customerData = this.enFormatter(customerData)
          if (index === -1) {
            this.perInfoList.push(customerData)
            this.dataList.surDtlList.push(customerData)
          } else {
            const perInfo = this.perInfoList[index]
            if (perInfo) {
              for (let key in customerData) {
                if (customerData.hasOwnProperty(key)) {
                  perInfo[key] = customerData[key] || perInfo[key]
                }
              }
            }
          }
          this.$store.dispatch('credit/removeCustomerData')
        }
      },
      enFormatter (beanData) {
        return {
          "sex": beanData.sex, //性别
          "creditPersonName": beanData.customerName,//客户姓名
          "cpCertificateNum": beanData.certificateNum,//身份证号码
          "age": beanData.age,//年龄
          "creditObjectType": beanData.creditObjectType,//征信对象类型
          "perInfo": {
            "nationName": beanData.nationName,//民族
            "nation": beanData.nation,//民族
            "birthday": beanData.birthday,//出生日期
            "signOrg": beanData.signOrg//身份证签发机关
          },
          "familyAddress": beanData.familyAddress,//身份证住址
          "startDate": beanData.startDate,//起始日
          "endDate": beanData.endDate,//截止日
          "telephone": beanData.contactPhone,//手机号码
          "bankCardNum": beanData.bankCardNum, //银行卡号
          dataList: [],
          canDel: true
        }
      },
      /**
       * 下一步
       **/
      async nextStep () {
        Bus.$off('creditSaveSuccess')
        let creditTypeFlag = 1
        if (this.rbCredit) {
          creditTypeFlag = 2
        }
        Bus.$emit('creditSave', creditTypeFlag);
        Bus.$on('creditSaveSuccess', query => {
          this.$router.push({
            path: '/bigDataReply',
            query: this.$route.query
          })
        })
      },
      async triggerQuery () {
        if(this.reRegister != true){
          Toast('30天后才能重新查询')
          return
        }
        Bus.$emit('creditSave',this.TYPE);
        this.active = 1
        const params = {
          lpCertificateNum: this.$route.query.lpCertificateNum,
          id: this.$route.query.id
        }
      　const res = await creditQueryOf100(params)
        this.reRegister = res.data.cuCreditRegister.reRegister
      },
      lookDocs(){
        this.active = 2
      }
    },
    created(){
    },
    mounted () {
      this.getButtonOfCredit().then(() => this.getCreditInfo() )
      this.edit = Boolean(this.$route.query.edit) && this.$route.query.edit !== 'false'
      this.bigData = Boolean(this.$route.query.bigData) && this.$route.query.bigData !== 'false'
      this.rbCredit = Boolean(this.$route.query.rbCredit) && this.$route.query.rbCredit !== 'false'
    }
  }
</script>

<style>

    </style>
