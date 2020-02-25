<template>
    <ViewPage :loading="loading">
        <result :dataList="surDtlList" v-if="surDtlList" :creditName="nameFormatter()" :type="type" :creditRequire="creditRequire"></result>
        <Card style="margin-top: 1rem">
            <template v-slot:header>
                {{nameFormatter()}}征信报告照片
            </template>
            <div v-for="(item, index) in users" :key="index">
                <div class="xh-image-box">
                    <div class="xh-box-item">
                        <svg-icon icon-class="user"/>
                        <span>{{item.creditPersonName}}</span>
                        <span class="xh-danger-tag">{{returnText(item.creditObjectType, 'credit_object_type')}}</span>
                    </div>
                </div>
                <imageList :dataList="item.dataList"></imageList>
            </div>
        </Card>
        <Card v-if="isBank" v style="margin-top: 1rem">
            <template v-slot:header>
                意见描述
            </template>
            <van-field v-model="remarks" :border="false" type="textarea" placeholder="输入说明" rows="1"
                       :autosize='autosize' class="zh-textarea"/>
        </Card>
        <!-- 提交按钮 -->
        <div class="xh-submit-box" v-if="edit">
            <van-button size="large" @click="submit"
                        class="xh-btn"
            >提交
            </van-button>
        </div>
    </ViewPage>
</template>

<script>

  import ViewPage from '@/layout/components/ViewPage';
  import Card from '@/components/card';
  import imageList from '@/components/imageList'
  import result from '../viewCompoents/result'
  import { Field, Button, ActionSheet, Popup, Toast, Dialog } from 'vant'
  import Vue from 'vue'
  import { getDocumentByType } from '@/api/document'
  import { getCreditInfo } from '@/api/credit'
  import { reply, bankReply } from '@/api/bigData'
  import { removeValue } from '@/utils/session'
  import _ from 'lodash'

  Vue.use(Field).use(Button).use(ActionSheet).use(Popup).use(Toast).use(Dialog)
  const bank = {
    joiDebtorSpouse: ['0205'],//共债人配偶
    borrowerSpouse: ['0203'],//借款人配偶
    security: ['0206'],//担保人
    borrower: ['0202'],//借款人
    joiDebtor: ['0204'],//共债人
  }
  const bigData = {
    joiDebtorSpouse: ['0210'],//共债人配偶
    borrowerSpouse: ['0208'],//借款人配偶
    security: ['0211'],//担保人
    borrower: ['0207'],//借款人
    joiDebtor: ['0209'],//共债人
  }
  const rb = {
    joiDebtorSpouse: ['6699'],//共债人配偶
    borrowerSpouse: ['6696'],//借款人配偶
    security: ['6697'],//担保人
    borrower: ['6695'],//借款人
    joiDebtor: ['6698'],//共债人
  }

  export default {
    name: "creditNextStep",
    components: {
      ViewPage,
      Card,
      imageList,
      result
    },
    data () {
      return {
        loading: false,
        autosize: {
          maxHeight: 100,
          minHeight: 80
        },
        users: [],
        obj: {},
        edit: true,
        form: {},
        surDtlList: null,
        isBank: false,
        remarks: '',
        bigData: false,
        rbCredit: false,
      }
    },
    computed: {
      wordbook () {
        return this.$store.state.user.wordbook
      },
      documentType () {
        let obj = {}
        if (this.wordbook.document_type && this.wordbook.document_type.length) {
          this.wordbook.document_type.forEach(item => {
            obj[item.value] = item
          })
        }
        return obj
      },
      type () {
        if (this.isBank) {
          return 'creditResult'
        } else if (this.rbCredit) {
          return 'personalGuaResult'
        } else {
          return 'bigDataResult'
        }
      },
      creditRequire() {
        if (this.isBank) {
          return 'canPeopleBankResult'
        } else if (this.rbCredit) {
          return 'canPersonalCreditResult'
        } else {
          return 'canBigDataResult'
        }
      }
    },
    methods: {
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
      async getDocumentByType (documentType, obj, beanData) {
        try {
          const customerNum = beanData.perInfo ? beanData.perInfo.customerNum : ''
          const params = {
            customerNum: customerNum,
            documentType: documentType
          }
          const {data} = await getDocumentByType(params)
          const declare = this.documentType[documentType] ? this.documentType[documentType].label : '图片描述'
          data.forEach(item => {
            item.declare = declare;
          })
          const require = obj[this.creditRequire]
          obj.dataList.push({
            declare: declare,//图片描述
            isRequire: require,//*是否必须
            deletable: true,//是否可以操作-上传和删除
            documentType: documentType,
            customerNum: customerNum,
            customerId: beanData.customerId,
            kind: '1',
            fileList: data
          })
        } catch (e) {
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
          const {data} = await getCreditInfo(params)
          const form = data.cuCreditRegister
          form.surDtlList = data.cuCreditRegister.surDtlList
          const users = _.cloneDeep(form.surDtlList)
          if (this.isBank) {
            this.obj = bank
          } else if (this.rbCredit) {
            this.obj = rb
          } else {
            this.obj = bigData
          }
          users.forEach(item => {
            item.dataList = []
            const arr = this.obj[item.creditObjectType]
            arr.forEach(i => {
              this.getDocumentByType(i, item, form)
            })
          })
          this.users = users
          this.form = form
          this.surDtlList = form.surDtlList
          this.loading = false
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      },
      checkCar () {
        let flag = true
        if (this.form.carInfos.length) {
          this.form.carInfos.forEach(item => {
            if (item.carNature === 'old_car' && !item.evaluatingPriceDot) {
              flag = false
            }
          })
        }
        return flag
      },
      checkResult () {
        let flag = true
        if (!this.surDtlList) {
          return
        }
        this.surDtlList.forEach(item => {
          if (!item[this.type]) {
            flag = false
          }
        })
        return flag
      },
      async submit () {
        try {
          if (!this.checkResult()) {
            Toast.fail('未选择征信结果!')
            return
          }
          if (this.isBank) {
            if (!this.checkCar()) {
              Dialog.confirm({
                title: '提示',
                message: '暂无二手车评估价，确定提交流程吗？'
              }).then(() => {
                this.loading = true
                this.submitBank()
              }).catch(() => {
                //
              });
            } else {
              this.submitBank()
            }
          } else {
            let url = '/order/creditInfo/updateCreditResult'
            if (this.rbCredit) {
              url = '/order/creditInfo/updatePersonalGuarantee'
            }
            this.loading = true
            await reply(url, this.form.surDtlList)
            this.loading = false
            this.$nextTick(() => {
              Toast.success('提交成功')
            })
            this.$nextTick(() => {
              this.$router.push('/creditList')
            })
          }
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      },
      async submitBank () {
        try {
          const params = {wfBizComments: {commentsDesc: this.remarks, conclusionCode: '01', businessKey: this.form.id}, cuCreditRegister: this.form}
          await bankReply(params)
          this.loading = false
          this.$nextTick(() => {
            Toast.success('提交成功')
          })
          this.$nextTick(() => {
            this.$router.push('/lendProcessList')
          })
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      },
      nameFormatter () {
        let name = '';
        if (this.isBank) {
          name = '银行'
        } else if (this.bigData) {
          name = '大数据'
        } else if (this.rbCredit) {
          name = '人保'
        }
        return name
      }
    },
    mounted () {
      removeValue("credit");
      this.getCreditInfo()
      // this.edit = Boolean(this.$route.query.edit) && this.$route.query.edit !== 'false'
      this.isBank = Boolean(this.$route.query.isBank)
      this.bigData = Boolean(this.$route.query.bigData) && this.$route.query.bigData !== 'false'
      this.rbCredit = Boolean(this.$route.query.rbCredit) && this.$route.query.rbCredit !== 'false'
    }
  }
</script>

<style scoped lang="scss">

    .xh-image-box {
        padding: 0 1rem 0 1rem;

        &:first-child {
            padding-top: 1rem;
        }

        .xh-box-item {
            margin-bottom: .5rem;

            &:last-child {
                margin-bottom: 0;
            }

            span {
                display: inline-block;
            }

            span:nth-of-type(1) {
                margin: 0 .5rem;
            }
        }
    }

    .xh-electronic-box {
        background: rgb(242, 242, 242);
        margin: 1rem;
        padding: 1rem;
        display: flex;
        position: relative;
        border-radius: 5px;
        overflow: hidden;

        .xh-box-item {
            margin-bottom: .5rem;

            &:last-child {
                margin-bottom: 0;
            }

            span {
                display: inline-block;
            }

            span:nth-of-type(1) {
                margin: 0 .5rem;
            }
        }

    }


    .xh-electronic-tag {
        background: #FDF1F0;
        border-radius: 4px;
        padding: .2rem;
        color: #C4252A;
    }

    .xh-contract-status {
        > div {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translate(0, -50%);
        }

        .xh-contract-true {
            color: #3ECE73;
        }

        .xh-contract-false {
            color: #C4252A;
        }

        .xh-contract-icon {
            font-size: 2.4rem;
            font-weight: 600;
            display: inline-block;
            vertical-align: middle;
            color: #999;
        }
    }

</style>
