<template>
    <ViewPage :loading="loading">
        <!--        <Card>-->
        <!--            <template v-slot:header>-->
        <!--                电子签约-->
        <!--            </template>-->
        <!--            <electronicContract></electronicContract>-->
        <!--            <electronicContract></electronicContract>-->
        <!--        </Card>-->
        <Card>
            <template v-slot:header>
                征信查询照片
            </template>
            <div v-for="(item, index) in users" :key="index">
                <div class="xh-image-box">
                    <div class="xh-box-item">
                        <svg-icon icon-class="user"/>
                        <span>{{item.creditPersonName}}</span>
                        <span class="xh-danger-tag">{{returnText(item.creditObjectType, 'credit_object_type')}}</span>
                    </div>
                </div>
                <imageList :dataList="item.dataList" :isGroup="true"></imageList>
            </div>
        </Card>

        <Card style="margin-top: 1rem;">
            <template v-slot:header>
                意见描述
            </template>
            <van-field v-model="remarks" :border="false" type="textarea" placeholder="输入说明" rows="1"
                       :autosize='autosize' class="zh-textarea"/>
        </Card>

        <!-- 提交按钮 -->
        <div class="xh-submit-box">
            <van-button size="large"
                        @click="submit"
                        class="xh-btn"
            >发起征信查询
            </van-button>
        </div>
        <van-popup v-model="showUser" position="bottom" get-container="#app">
            <van-picker
                    show-toolbar
                    :columns="changeUserList.map(item => item.companyName + '-' + item.name)"
                    @cancel="showUser = false"
                    @confirm="onSelect"
            />
        </van-popup>
    </ViewPage>
</template>

<script>

  import ViewPage from '@/layout/components/ViewPage';
  import Card from '@/components/card';
  // import electronicContract from './electronicContract'
  import imageList from '@/components/imageList'
  import { Field, Button, ActionSheet, Popup, Toast, Picker } from 'vant'
  import Vue from 'vue'
  import { getDocumentByType } from '@/api/document'
  import { getCreditInfo, createTask, getUsers, submitCredit } from '@/api/credit'

  Vue.use(Field).use(Button).use(ActionSheet).use(Popup).use(Toast).use(Picker)

  export default {
    name: "creditNextStep",
    components: {
      ViewPage,
      Card,
      // electronicContract,
      imageList
    },
    data () {
      return {
        loading: false,
        remarks: "",
        autosize: {
          maxHeight: 100,
          minHeight: 80
        },
        users: [],
        obj: {
          joiDebtorSpouse: ['CUIDA04', 'CUIDB04', 'CRDPBOCA04', 'CUCARD04'],//共债人配偶
          borrowerSpouse: ['CUIDA02', 'CUIDB02', 'CRDPBOCA02', 'CUCARD02'],//借款人配偶
          security: ['CUIDB05', 'CUIDA05', 'CRDPBOCA05', 'CUCARD05'],//担保人
          borrower: ['CUIDA01', 'CUIDB01', 'CRDPBOCA01', 'CUCARD01'],//借款人
          joiDebtor: ['CUIDA03', 'CUIDB03', 'CRDPBOCA03', 'CUCARD03'],//共债人
        },
        changeUserList: [],
        showUser: false,
        taskData: {},
        whiteList: ['CUCARD01', 'CRDPBOCA05', 'CUCARD05', 'CRDPBOCA02', 'CUCARD02', 'CRDPBOCA03', 'CUCARD03', 'CRDPBOCA04', 'CUCARD04'],
        isIdCard: ['CUIDA01', 'CUIDB01', 'CUIDA02', 'CUIDB02', 'CUIDB05', 'CUIDA05', 'CUIDA03', 'CUIDB03', 'CUIDA04', 'CUIDB04']//身份证分类
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
      async getDocumentByType (documentType, obj) {
        try {
          const params = {
            customerNum: this.$route.query.customerNum,
            documentType: documentType
          }
          const declare = this.documentType[documentType] ? this.documentType[documentType].label : '图片描述'

          const isRequire = !this.whiteList.includes(documentType)
          const beanData = {
            declare: declare,//图片描述
            isRequire: isRequire,//*是否必须
            deletable: true,//是否可以操作-上传和删除
            documentType: documentType,
            customerNum: this.$route.query.customerNum,
            customerId: this.$route.query.customerId,
            kind: '1',
            fileList: [],
            title: this.isIdCard.includes(documentType) ? '身份证': '其他'
          }
          obj.dataList.push(beanData)
          const {data} = await getDocumentByType(params)
          data.forEach(item => {
            item.declare = declare;
          })
          beanData.fileList = data
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
          data.cuCreditRegister.surDtlList.forEach(item => {
            item.dataList = []
            const arr = this.obj[item.creditObjectType]
            arr.forEach(i => {
              this.getDocumentByType(i, item)
            })
          })
          this.users = data.cuCreditRegister.surDtlList
          this.loading = false
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      },
      /**
       * 提交
       * @return {Promise<void>}
       */
      async submit () {
        try {
          this.loading = true
          const params = {
            "businessKey": this.$route.query.creditRegisterId,
            "businessType": "07",
            "commentsDesc": "同意",
            "conclusionCode": "01",
            "processDefineKey": "WF_CU_CREDIT_001"
          }
          const {data} = await createTask(params)

          this.taskData = data;
          // if(data.status !== '05') {
          //
          // }
          const userParams = {
            "businessKey": this.$route.query.creditRegisterId,
            "commentsDesc": this.remarks,
            "conclusionCode": "01"
          }
          const res = await getUsers(userParams)
          this.changeUserList = res.data.list
          this.loading = false
          this.showUser = true
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      },
      async onSelect (item, index) {
        const data = this.changeUserList[index]
        this.showUser = false
        try {
          this.loading = true
          const params = {
            "ids": data.id,
            "taskBean": this.taskData.taskBean,
            "wfBizComments": this.taskData.wfBizComments
          }
          await submitCredit(params)
          this.loading = false
          this.$nextTick(() => {
            Toast.success('保存成功')
          })
          if(this.$route.query.canTermin) {
            this.$nextTick(() => {
              this.$router.push('/lendProcessList')
            })
          } else {
            this.$nextTick(() => {
              this.$router.push('/creditList')
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
      // this.initImage()
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

</style>
