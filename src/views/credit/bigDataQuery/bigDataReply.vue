<template>
    <ViewPage :loading="loading">
        <result :dataList="surDtlList" :isBank="isBank" v-if="surDtlList"></result>
        <Card style="margin-top: 1rem">
            <template v-slot:header>
                {{isBank ? '银行' : '大数据'}}征信报告照片
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
  import { Field, Button, ActionSheet, Popup, Toast } from 'vant'
  import Vue from 'vue'
  import { getDocumentByType } from '@/api/document'
  import { getCreditInfo } from '@/api/credit'
  import { reply, bankReply } from '@/api/bigData'
  import _ from 'lodash'

  Vue.use(Field).use(Button).use(ActionSheet).use(Popup).use(Toast)

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
        obj: {
          joiDebtorSpouse: ['0114', '0115', '0116', '2004'],//共债人配偶
          borrowerSpouse: ['0105', '0106', '0107', '0108', '2002', '0203'],//借款人配偶
          security: ['0120', '0117', '0118', '0119', '2005'],//担保人
          borrower: ['0101', '0102', '0103', '0104', '2001', '0202'],//借款人
          joiDebtor: ['0109', '0110', '0111', '0112', '2003'],//共债人
        },
        edit: true,
        form: {},
        surDtlList: null,
        isBank: false,
        remarks: '',
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
          obj.dataList.push({
            declare: declare,//图片描述
            isRequire: true,//*是否必须
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
          form.surDtlList = data.cuCreditRegister.surDtlList.reverse()
          const users = _.cloneDeep(form.surDtlList)
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
      async submit () {
        try {
          this.loading = true
          if (this.isBank) {
            const params = {wfBizComments: {commentsDesc: this.remarks, conclusionCode: '01', businessKey: this.form.id}, cuCreditRegister: this.form}
            await bankReply(params)
            this.loading = false
            this.$nextTick(() => {
              Toast.success('提交成功')
            })
            this.$nextTick(() => {
              this.$router.push('/lendProcessList')//todo
            })
          } else {
            await reply(this.form.surDtlList)
            this.loading = false
            this.$nextTick(() => {
              Toast.success('提交成功')
            })
            this.$nextTick(() => {
              this.$router.push('/bigDataQueryList')//todo
            })
          }

        } catch (e) {
          this.loading = false
          console.log(e)
        }
      }
    },
    mounted () {
      this.getCreditInfo()
      // this.edit = Boolean(this.$route.query.edit) && this.$route.query.edit !== 'false'
      this.isBank = Boolean(this.$route.query.isBank)
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
