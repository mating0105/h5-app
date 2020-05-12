<template>
    <ViewPage :loading="loading">
        <template v-slot:head>
            <van-tabs v-model="active">
                <van-tab title="基本信息"></van-tab>
                <van-tab title="操作记录"></van-tab>
            </van-tabs>
        </template>
        <template v-if="active === 1">
            <creditInfoTable title="银行征信" :dataList="dataList.surDtlList" type="creditResult" dateType="investigateDate"></creditInfoTable>
            <creditQueryInfo v-if="TYPE == 'bairong' && brdataList.surDtlList.length >0" @lookDocs="lookDocs" title="大数据征信" :credit100Result="brdataList.credit100Result" :dataList="brdataList.surDtlList" type="bigDataResult"></creditQueryInfo>
            <creditInfoTable v-else title="大数据征信" :dataList="dataList.surDtlList" type="bigDataResult" dateType="bigDataDate"></creditInfoTable>
            <creditInfoTable v-if="rg" title="人工征信" :dataList="dataList.surDtlList" type="artificialCreditResult" dateType="investigateDate"></creditInfoTable>
            <creditInfoTable v-if="!rg" title="人保征信" :dataList="dataList.surDtlList" type="personalGuaResult" dateType="peopleBankDate"></creditInfoTable>
        </template>
        <template v-else-if="active === 0">
            <basicInfoCredit :dataList="dataList" :edit="edit" :form="form" :perInfoList="perInfoList" :hiddenHandle="true"></basicInfoCredit>
            <basicInfo ref="basicInfo" :dataList="dataList" :form="form" :perInfoList="perInfoList" :bigData="bigData" :rbCredit="rbCredit" :edit="edit"></basicInfo>
        </template>
        <!-- <template v-else-if="active === 2">
            <relatedDocs :requestParams="requestParams"></relatedDocs>
        </template> -->
        <template v-else-if="active === 3">
            <approvalRecord :requestParams="recordParams"></approvalRecord>
        </template>

        <!-- 提交按钮 -->
        <div class="xh-submit-box" v-if="edit && TYPE !== 'bairong'">
            <van-button size="large" @click="nextStep"
                        class="xh-btn"
            >发起征信查询
            </van-button>
        </div>
        <div class="xh-submit-box" v-if="active === 0 && TYPE === 'bairong'">
          <van-button size="large" @click="triggerQuery"
                      class="xh-btn"
                      :disabled="disableClick"
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
  import { getCreditInfo,creditQueryOf100,getButtonOfCredit,getCompanyName } from '@/api/credit'
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
        disableClick:false,
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
        brdataList:{},
        perInfoList: [], //客户下面的其他客户数据
        edit: false,
        requestParams: {
          customerNum: '', customerId: '', dealState: '3'
        },
        recordParams: {
          businesskey: '', businesstype: '07'
        },
        bigData: false,
        rbCredit: false,
        rgCredit: false,
        rg:false
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
      async getCreditInfo (_tag) {
        try {
          this.loading = true
          const params = {
            lpCertificateNum: this.$route.query.lpCertificateNum,
            id: this.$route.query.id
          }
          let res;
          let dataList;
          if(_tag && _tag ==='getBrAgain'){
            res = await creditQueryOf100(params)
            dataList = res.data.cuCreditRegister
          }else{
            if (getValue("credit")) {
              dataList = JSON.parse(getValue("credit"))
            } else {
              if(this.TYPE === 'bairong'){
               let res2 = await creditQueryOf100(params)
                res = await getCreditInfo(params)
                this.brdataList = res2.data.cuCreditRegister
              }else{
                res = await getCreditInfo(params)
              }
              dataList = res.data.cuCreditRegister
            }
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
        
        let nowDate = new Date()
        
        // 当前时间与查询时间+30天对比
        let isRegister = this.brdataList.surDtlList.some(element => {
          let dateItem = element.credit100StrategyQuerydate ? new Date(element.credit100StrategyQuerydate) : ''
          return dateItem ? new Date(dateItem.setDate(dateItem.getDate() + 30)) >= nowDate : false
        });
        /* const _itemList = this.dataList.surDtlList.filter(item => item.dataList && item.dataList.length > 0)
        if(_itemList.length > 0){
          _itemList.forEach((item,index) => {
            item.dataList.forEach((ele)=> {
              if (ele.documentType === "CRDBIGA01" && ele.fileList.length <= 0) {
                _arr.push(item.creditPersonName)
              }
              resolve(true)
            })
          })
        } */
        if(isRegister){
          Toast('已查询的用户请30天后重新查询')
          return
        }
        
        Bus.$emit('creditSave',this.TYPE);
        Bus.$on("queryStart", res => {
          // this.loading = true
          this.disableClick = true
        });

        Bus.$on('queryFaile', res => {
          // this.loading = false
          this.disableClick = false
          // this.active = 1
        })
        Bus.$on('querySuccess', res => {
          // this.loading = false
          this.disableClick = false
          if(res === 'bairong'){
            this.$refs['basicInfo'].initData()
            this.getCreditInfo('getBrAgain').then(() => {
                this.active = 1
                this.$forceUpdate()
            }).catch(() => {
              this.active = 1
            })
          }
        })
      },
      lookDocs(){
        this.active = 2
      },
      async getCompany(){
        const res = await getCompanyName();
        //鑫弘 显示人工，其他不显示
         if(res.data.companySchemaName == 'xh-vloan' || res.data.companySchemaName == 'ww-vloan'){
          this.rg = true;
        }else{
          this.rg = false;
        }
      },
    },
    created(){
    },
    mounted () {
      this.getButtonOfCredit().then(() => this.getCreditInfo() )
      this.getCompany();
      this.edit = Boolean(this.$route.query.edit) && this.$route.query.edit !== 'false'
      this.bigData = Boolean(this.$route.query.bigData) && this.$route.query.bigData !== 'false'
      this.rbCredit = Boolean(this.$route.query.rbCredit) && this.$route.query.rbCredit !== 'false'
      this.rgCredit = Boolean(this.$route.query.rgCredit) && this.$route.query.rgCredit !== 'false'
    }
  }
</script>

<style>
  
</style>
