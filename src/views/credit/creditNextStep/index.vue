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
                <imageList :dataList="item.dataList"></imageList>
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
            >提交
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
  import { Field, Button, ActionSheet, Popup, Toast } from 'vant'
  import Vue from 'vue'
  import { getDocumentByType } from '@/api/document'
  import { getCreditInfo, createTask, getUsers, submitCredit } from '@/api/credit'

  Vue.use(Field).use(Button).use(ActionSheet).use(Popup).use(Toast)

  //0101 主借人身份证正面
  //0102 主借人身份证正面
  //0103 主借人授权书
  //0104 主借人银行征信授权书
  //2001 主借人银行卡正反面
  //0202 主借人征信报告

  //0105 主借人配偶身份证正面
  //0106 主借人配偶身份证反面
  //0107 主借人配偶授权书
  //0108 主借人配偶银行征信授权书
  //2002 主借人配偶银行卡正反面
  //0203 主借人配偶征信报告

  //0120 担保人身份证反面
  //0117 担保人身份证
  //0118 担保人授权书
  //0119 担保人银行征信授权书
  //2005 担保人银行卡正反面

  //0109 共债人身份证
  //0110 共债人身份证反面
  //0111 共债人授权书
  //0112 共债人银行征信授权书
  //2003 共债人银行卡正反面

  //0114 共债人配偶身份证反面
  //0115 共债人配偶授权书
  //0116 共债人配偶银行征信授权书
  //2004 共债人配偶英航卡正反面

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
          joiDebtorSpouse: ['0114', '0115', '0116', '2004'],//共债人配偶
          borrowerSpouse: ['0105', '0106', '0107', '0108', '2002'],//借款人配偶
          security: ['0120', '0117', '0118', '0119', '2005'],//担保人
          borrower: ['0101', '0102', '0103', '0104', '2001'],//借款人
          joiDebtor: ['0109', '0110', '0111', '0112', '2003'],//共债人
        },
        changeUserList: [],
        showUser: false,
        taskData: {},
        whiteList: []
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
          const {data} = await getDocumentByType(params)
          const declare = this.documentType[documentType] ? this.documentType[documentType].label : '图片描述'
          data.forEach(item => {
            item.declare = declare;
          })
          const isRequire = !this.whiteList.includes(documentType)
          obj.dataList.push({
            declare: declare,//图片描述
            isRequire: isRequire,//*是否必须
            deletable: true,//是否可以操作-上传和删除
            documentType: documentType,
            customerNum: this.$route.query.customerNum,
            customerId: this.$route.query.customerId,
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
          data.cuCreditRegister.surDtlList.forEach(item => {
            item.dataList = []
            const arr = this.obj[item.creditObjectType]
            arr.forEach(i => {
              this.getDocumentByType(i, item)
            })
          })
          this.users = data.cuCreditRegister.surDtlList.reverse()
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
          this.$nextTick(() => {
            this.$router.push('/creditList')
          })
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
