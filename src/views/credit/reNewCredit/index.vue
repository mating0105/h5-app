<template>
    <ViewPage :loading="loading">
        <basicInfo :dataList="dataList" :edit="edit" :form="form" :perInfoList="perInfoList" :query="query"></basicInfo>
    </ViewPage>
</template>

<script>
  import ViewPage from '@/layout/components/ViewPage';
  import Card from '@/components/card'
  import Vue from 'vue';
  import { getBank, getCreditInfo, saveCreditInfo, createTask, stopTask } from '@/api/credit'
  import { getValue, setValue, removeValue } from '@/utils/session'
  import { Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast, Notify, SwipeCell, Dialog } from 'vant';
  import formValidator from '@/mixins/formValidator'
  import basicInfo from './basicInfo'

  const Components = [Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast, Notify, SwipeCell, Dialog]
  Components.forEach(item => {
    Vue.use(item)
  })

  export default {
    name: "reNewCredit",
    mixins: [formValidator],
    components: {
      ViewPage,
      Card,
      basicInfo
    },
    data () {
      return {
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
        query: {},
      }
    },
    computed: {
      // 所有字典
      wordbook () {
        return this.$store.state.user.wordbook
      }
    },
    methods: {
      selectList () {

      },
      // 字典转换
      returnText (val, key) {
        let name = '';
        if (this.wordbook[key]) {
          this.wordbook[key].forEach(e => {
            if (e.value === val) {
              name = e.label;
            }
          });
        }
        return name;
      },
      async getCreditInfo () {
        try {
          this.loading = true
          if (getValue("credit")) {
            this.dataList = JSON.parse(getValue("credit"))
          } else {
            const params = {
              lpCertificateNum: this.query.lpCertificateNum,
              id: this.query.id
            }
            if (this.query.again) {
              params.reRegister = 1
            }
            const res = await getCreditInfo(params)
            this.dataList = res.data.cuCreditRegister;
          }
          this.loading = false

          this.dataList.surDtlList.forEach(e => {
            if (e.creditObjectType === 'borrower') {
              this.form = e;
            } else {
              this.perInfoList.push(e);
            }
          })

          // this.initCar()
          this.initCustomerData()
          // this.checkPrice()
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      },
      initCar () {
        const carData = this.$store.state.credit.carData
        if (carData) {
          const index = this.$store.state.credit.index
          if (index === -1) {
            this.dataList.carInfos.push(carData)
          } else {
            const carInfo = this.dataList.carInfos[index]
            if (carInfo) {
              for (let key in carData) {
                if (carData.hasOwnProperty(key)) {
                  carInfo[key] = carData[key] || carInfo[key]
                }
              }
            }
          }
          this.$store.dispatch('credit/removeCarData')
        }
      },
      initCustomerData () {
        let customerData = this.$store.state.credit.customerData
        if (customerData) {
          const index = this.$store.state.credit.index
          customerData = this.enFormatter(customerData)
          if (index === -1) {
            this.perInfoList.push(customerData)
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
          "bankCardNum": beanData.bankCardNum//银行卡号
        }
      },
      /**
       * 贷款金额与销售价
       */
      checkPrice () {
        this.priceFloat(this.dataList, 'intentionPrice')
        const investigateBankName = this.dataList.investigateBankName || '';
        const intentionPrice = this.dataList.intentionPrice || 0;
        let price = 0
        const carInfos = this.dataList.carInfos
        this.errorMsg.intentionPrice = ''

        if (!carInfos.length)
          return

        carInfos.forEach(item => {
          if (item.carNature === 'new_car') {
            price += item.salePriceDto
          }
        })

        if (!price)
          return;

        if (investigateBankName.includes('中国银行')) {
          if (intentionPrice >= (price * 0.7)) {
            this.errorMsg.intentionPrice = '贷款金额不能高于销售价7成！'
          }
        } else if (investigateBankName.includes('农业银行')) {
          if (intentionPrice >= (price * 0.88)) {
            this.errorMsg.intentionPrice = '贷款金额不能超过销售价的8.8成'
          }
        }
      }
    },
    mounted () {
      if (this.$route.query.info && this.$route.query.dealState) {
        const info = this.getStringToObj(this.$route.query.info)
        const query = this.$route.query
        this.query = {
          lpCertificateNum: info.certificateNum,
          id: info.businesskey
        }
        this.recordParams.businessKey = info.businesskey
        if (query.dealState == 3) {
          this.edit = false
        }
        if (query.dealState == 1) {
          this.edit = true
          this.canTermin = true
        }
        removeValue("credit");
      } else {
        this.query = this.$route.query
        this.edit = Boolean(this.$route.query.edit) && this.$route.query.edit !== 'false'
      }
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
