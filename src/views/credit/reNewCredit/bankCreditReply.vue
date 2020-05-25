<!--
 * @Description: 银行征信回复
 * @Author: mating
 * @Date: 2020-03-17
 * @upData: 2020-05-19
 -->
<template>
    <ViewPage :loading="loading">
        <template v-slot:head>
            <van-tabs v-model="active">
                <van-tab title="基本信息"></van-tab>
                <van-tab title="征信信息"></van-tab>
                <van-tab title="操作记录"></van-tab>
            </van-tabs>
        </template>
        <template v-if="active === 0 && dataList.surDtlList.length>0">
            <replyInfo
              :dataList="dataList" 
              :edit="edit" 
              :form="form" 
              :perInfoList="perInfoList" 
              :query="query" 
              :buttonId='buttonId'
              :isShowTitle='true'
              :isPeople='isPeople'
              @viewRecord='viewRecord'
            ></replyInfo>
        </template>
        <template v-else-if="active === 1">
            <div class="tip" style="padding:0 1rem;">
                <van-divider :dashed="true" :style="{ color: 'red', borderColor: 'red' }">以下为历史征信记录</van-divider>
            </div>
            <!-- <collapsBox label="银行征信查询信息" :showSign="showSign" :showTime="showTime" :sign='sign' :signColor='signColor' :changeitem='changeitem'>
                <template>内容</template>
            </collapsBox> -->
        </template>
        <template v-else-if="active === 2">
            <approvalRecord :requestParams="recordParams"></approvalRecord>
        </template>
    </ViewPage>
</template>
<script>
import Vue from 'vue';
import ViewPage from '@/layout/components/ViewPage';
import replyInfo from './replyInfo.vue'
import approvalRecord from "@/views/basicInfo/approvalRecord";
import collapsBox from "@/components/collapseBox/index";
import { format } from "@/utils/format";

import {
  getCreditInfo,
  
  setBookObj,
  getByServer,
  saveCreditInfo,
  createTask,
  getUsers,
  submitCredit,
  getCreditHistory
} from "@/api/credit";
import { Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast, Notify, SwipeCell, Dialog, Tab, Tabs,Collapse, CollapseItem,Divider } from 'vant';
const Components = [Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast, Notify, SwipeCell, Dialog, Tab, Tabs,Collapse, CollapseItem,Divider ]

Components.forEach(item => {
    Vue.use(item)
})

export default {
    name:'bankCreditReply',
    components: {
      ViewPage,
      replyInfo,
      approvalRecord,
      collapsBox
    },
    data(){
      return {
        active:0,
        loading: false,
        recordParams: {
            businessKey: '', businessType: '07'
        },
        dataList: {
          status:'',
          investigateBank: '',
          investigateBankName: '',
          isInternetCredit: '',
          carInfos: [],
          surDtlList: []
        },
        form: {},
        perInfoList: [], //客户下面的其他客户数据
        edit: false,
        query: {},
        buttonId:'',
        isPeople:false
      }
    },
    computed: {
      // 所有字典
      wordbook () {
        return this.$store.state.user.wordbook
      }
    },
    methods:{
      //加载数据
      async loadDataDetail() {
        try{
          this.loading = true;
          let params = {
            buttonId: 1,
            lpCertificateNum: this.params.info.certificateNum,
            id: this.params.info.businesskey,
          };
          const res = await getCreditInfo(params);

          res.data.surDtlList.forEach(e => {
            e.dataList = [];
            if (e.creditObjectType === "borrower") {
              this.form = e;
              this.form.investigateDate = this.form.investigateDate?this.form.investigateDate:format(new Date(), "yyyy-MM-dd hh:mm");
            } else {
              e.investigateDate = e.investigateDate?e.investigateDate:format(new Date(), "yyyy-MM-dd hh:mm");
              e.creditList = [];
              this.perInfoList.push(e);
            }
          });
          this.dataList = res.data;
          if(this.dataList.creditSearchType=='11'){
            this.isPeople=false
          }else{
            this.isPeople=true
          }
          this.initCustomerData();
          this.loading = false;
        }catch(err){
          this.loading = false
          console.log(err)
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
      //加载历史数据
      async loadHistory() {
        let datalist = {
          creditType: this.params.info.creditType,
          lpCertificateNum: this.params.info.certificateNum
        };
        let res = await getCreditHistory(datalist);
        let arr = [];
        arr = res.data;
        arr.forEach(e => {
          e.label = "大数据征信查询信息";
          e.showSign = true;
          e.showTime = true;
          if (
            e.status == "02" ||
            e.status == "03" ||
            e.status == "05" ||
            e.status == "06"
          ) {
            e.signColor = "#E60000";
          } else if (e.status == "04") {
            e.signColor = "#00C67C";
          } else if (e.status == "01") {
            e.signColor = "#999";
          }
        });
        this.creditHistoryList = arr;
      },
      changeitem(val){
          console.log(val)
      },
      async viewRecord(){
        this.active=1;
        this.loadHistory();
      }
    },
    mounted() {
      this.params = {
        info: this.getStringToObj(this.$route.query.info),
        dealState: this.$route.query.dealState
      };
      this.edit = false;
      this.loadDataDetail();
      this.loadHistory();
    }
}
</script>
<style lang="scss" scoped>

</style>