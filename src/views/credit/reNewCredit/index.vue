<!--
 * @Description: 银行征信查询
 * @Author: mating
 * @Date: 2020-03-12
 -->
<template>
    <ViewPage :loading="loading">
        <template v-slot:head>
            <van-tabs v-model="active">
                <van-tab title="基本信息"></van-tab>
                <van-tab title="操作记录"></van-tab>
            </van-tabs>
        </template>
        <template v-if="active === 0&& dataList.surDtlList.length>0">
            <basicInfo
              :dataList="dataList" 
              :edit="edit" 
              :form="form" 
              :perInfoList="perInfoList" 
              :query="query" 
              :buttonId='buttonId'
              @reLoad="reLoad"
            ></basicInfo>
        </template>
        <template v-else-if="active === 1">
            <approvalRecord :requestParams="recordParams"></approvalRecord>
        </template>
    </ViewPage>
</template>

<script>
  import ViewPage from '@/layout/components/ViewPage';
  import Card from '@/components/card'
  import Vue from 'vue';
  import { getBank, getCreditInfo, saveCreditInfo, createTask, stopTask } from '@/api/credit'
  import { getDic } from "@/api/createCustomer";
  import { getValue, setValue, removeValue } from '@/utils/session'
  import { Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast, Notify, SwipeCell, Dialog, Tab, Tabs} from 'vant';
  import formValidator from '@/mixins/formValidator'
  import basicInfo from './basicInfo'
  import approvalRecord from "@/views/basicInfo/approvalRecord";

  const Components = [Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast, Notify, SwipeCell, Dialog, Tab, Tabs]
  Components.forEach(item => {
    Vue.use(item)
  })

  export default {
    name: "reNewCredit",
    mixins: [formValidator],
    components: {
      ViewPage,
      Card,
      basicInfo,
      approvalRecord
    },
    data () {
      return {
        active:0,
        dataList: {
          status:'',
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
        query: {},
        recordParams: {
          businessKey: '', businessType: '07'
        },
        buttonId:'',
      }
    },
    computed: {
      // 所有字典
      wordbook () {
        return this.$store.state.user.wordbook
      }
    },
    methods: {
      //获取征信查询--详情
      async getCreditInfo () {
        try {
          this.loading = true
          if (getValue("credit")) {
            this.dataList = JSON.parse(getValue("credit"))
          } else {
            const params = {
              lpCertificateNum: this.query.lpCertificateNum,
              id: this.query.id,
              buttonId:this.query.buttonId
            }
            if (this.query.again) {
              params.reRegister = 1
            }
            const res = await getCreditInfo(params)
            this.dataList = res.data;
          }
          this.loading = false

          this.perInfoList = [];
          this.dataList.surDtlList.forEach(e => {
            if (e.creditObjectType === 'borrower') {
              this.form = e;
            } else {
              this.perInfoList.push(e);
            }
          })
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
            this.dataList.surDtlList.push(customerData);
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
          creditObjectRelation: beanData.creditObjectRelation, //征信对象类型
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
          "bankCardNum": beanData.bankCardNum,//银行卡号
          dataList: [],
          canDel: true,
          isPeopleBankCredit : beanData.isPeopleBankCredit 
        }
      },
      //重新加载数据,更新征信状态
      async reLoad(){
        this.getCreditInfo();
      }
    },
    mounted () {
    //   if (this.$route.query.info && this.$route.query.dealState) {
    //     const info = this.getStringToObj(this.$route.query.info)
    //     const query = this.$route.query
    //     this.query = {
    //       lpCertificateNum: info.certificateNum,
    //       id: info.businesskey
    //     }
    //     this.recordParams.businessKey = info.businesskey
    //     if (query.dealState == 3) {
    //       this.edit = false
    //     }
    //     if (query.dealState == 1) {
    //       this.edit = true
    //       this.canTermin = true
    //     }
    //     removeValue("credit");
    //   } else {
        this.query = this.$route.query
        this.edit = Boolean(this.$route.query.edit) && this.$route.query.edit !== 'false'
        this.buttonId=this.query.buttonId;
    //   }
      this.getCreditInfo()
    }
  }
</script>

<style lang="scss">

    .labelClass {
        left: 1.33333rem;
    }

    .xh-credit-picker {

        .column1 {
            flex: none;
            min-width: 25%;
        }

        .column2 {
            text-align: left;
        }

    }
</style>
