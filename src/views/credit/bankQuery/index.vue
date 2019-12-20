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
            <creditInfoTable title="人行征信" :dataList="dataList.surDtlList" type="creditResult"></creditInfoTable>
            <creditInfoTable title="互联网查询" :dataList="dataList.surDtlList" type="bigDataResult"></creditInfoTable>
        </template>
        <template v-else-if="active === 0">
            <basicInfo :dataList="dataList" :form="form" :perInfoList="perInfoList"></basicInfo>
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
  import backspace from '../viewCompoents/backspace'
  import Vue from 'vue';
  import { getCreditInfo } from '@/api/credit'
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
      backspace
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
        backVisible: false,
        query: {}
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
          this.dataList = res.data.cuCreditRegister;
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
      }
    },
    mounted () {
      if(this.$route.query.info && this.$route.query.dealState) {
        this.query = {
          lpCertificateNum: this.$route.query.info.certificateNum,
          id: this.$route.query.info.businesskey
        }
        if(this.$route.query.dealState == 3) {
          this.edit = false
        }
        if(this.$route.query.dealState == 1) {
          this.edit = true
        }
      } else {
        this.query = this.$route.query
        this.edit = Boolean(this.$route.query.edit) && this.$route.query.edit !== 'false'
      }
      this.getCreditInfo()
    }
  }
</script>

<style>

    .label_plus .van-field__label {
        width: 9rem;
    }

</style>
