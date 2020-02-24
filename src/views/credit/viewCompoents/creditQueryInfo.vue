<template>
    <Card>
        <template v-slot:header>
            {{title}} 
            <!-- <span class="typeDesc" v-if="typeDesc">{{typeDesc}}</span> -->
            <div class="credit-arrow-wrap" @click="isSpread = !isSpread">
              <van-icon v-if="isSpread" class="credit-arrow" name="arrow-up"/>
              <van-icon v-else class="credit-arrow" name="arrow-down"/>
            </div>
        </template>
        <div v-show="isSpread" class="xh-table-border">
          <section v-for="(item, index) in copyDataList" :key="index" class="xh-table-border">
            <van-cell class="credit-info-title" :border="false"><span class="text">{{item.creditObjectType | filterInfo}}</span></van-cell>
            <div class="credit-info-detail">
              <van-cell title="客户姓名:" :border="false" :value="item.creditPersonName"/>
              <van-cell title="证件号码:" :border="false" :value="item.cpCertificateNum"/>
              <van-cell title="手机号码:" :border="false" :value="item.telephone"/>
              <!-- <van-cell title="银行卡号:" :border="false" value="张三"/> -->
              <van-cell title="相关文档:" :border="false">
                <van-button
                  slot="right-icon"
                  size="mini"
                  style="line-height: inherit;"
                  @click="lookDocs"
                >查看</van-button>
              </van-cell>
              <van-cell class="credit-result" title="贷前信息验证结果:" :border="false" :value="item.credit100VerificationResult|filterCResult"/>
              <van-cell class="credit-result" title="查询时间:" :border="false" :value="item.credit100VerificationQuerydate|filterTime"/>
              <van-cell class="credit-result" title="贷前信息查询报告:" :border="false">
                <van-button
                  slot="right-icon"
                  size="mini"
                  style="line-height: inherit;"
                  @click="lookUpResult(item.credit100VerificationReport,'贷前信息查询报告')"
                >查看报告</van-button>
              </van-cell>
              <div class="credit-info-solid"></div>
              <van-cell class="credit-result" title="贷前风险策略结果:" :border="false" :value="item.credit100StrategyResult|filterCResult"/>
              <van-cell class="credit-result" title="查询时间:" :border="false" :value="item.credit100StrategyQuerydate|filterTime"/>
              <van-cell class="credit-result" title="贷前风险策略报告:" :border="false">
                <van-button
                  slot="right-icon"
                  size="mini"
                  style="line-height: inherit;"
                  @click="lookUpResult(item.credit100StrategyReport,'贷前风险策略报告')"
                >查看报告</van-button>
              </van-cell>
            </div>
          </section>
        </div>
        <van-image-preview v-model="showImg" :images="images">
          <template v-slot:index>{{ imgTitle }}</template>
        </van-image-preview>
    </Card>
</template>

<script>

  import Card from '@/components/card'
  import Vue from 'vue';
  import { getBank, getCreditInfo, saveCreditInfo } from '@/api/credit'
  import { Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast, Notify, SwipeCell, Dialog, Tab, Tabs,ImagePreview } from 'vant';
  import { format } from "@/utils/format";
  const Components = [Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast, Notify, SwipeCell, Dialog, Tab, Tabs,ImagePreview]
  Components.forEach(item => {
    Vue.use(item)
  })

  export default {
    name: "creditQueryInfo",
    components: {
      Card
    },
    props: {
      title: String,
      dataList: {
        default () {
          return []
        }
      },
      type: String
    },
    data(){
      return {
        copyDataList:this.dataList,
        isSpread:true,
        qaueryResult:0,
        showImg:false,
        images:[]

      }
    },
    computed: {
      // 所有字典
      wordbook () {
        return this.$store.state.user.wordbook
      },
      typeDesc() {
        switch (this.qaueryResult) {
          case 0:
            return '拒绝'
            break;
          case 1:
            return '查询'
            break;
          case 2:
            return '复议'
            break;
          case 3:
            return '通过'
            break;
          default:
            return '其他'
            break;
        }
      }
    },
    filters:{
      filterInfo(info){
        switch (info) {
          case 'borrower':
            return '借款人信息'
            break;
          case 'borrowerSpouse':
            return '借款人配偶信息'
            break;
          case 'joiDebtor':
            return '共债人信息'
            break;
          case 'joiDebtorSpouse':
            return '共债人配偶信息'
            break;
          case 'security':
            return '担保人信息'
            break;
          default:
            break;
        }
      },
        // Accept - 通过，Reject - 拒绝，Review - 复议
      filterCResult(result){
        switch (result) {
          case 'Accept':
            return '通过'
            break;
          case 'Reject':
            return '拒绝'
            break;
          case 'Review':
            return '复议'
            break;
        
          default:
            break;
        }
      },
      filterTime(time){
        return time ? format(new Date(time),'yyyy MM dd hh:mm:ss') : ''
        
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
      lookUpResult(url,text){
        this.images = []
        this.imgTitle = text
        this.images = ['data:image/jpeg/jpg/png;base64,'+url]
        this.showImg = true
      },
      lookDocs(){
        this.$emit('lookDocs')
      }
    }
  }
</script>

<style>

    .xh-pass .van-cell__value {
        color: #3ECE73;
    }

    .xh-no-pass .van-cell__value {
        color: #C4252A;
    }
    .typeDesc{
        display: inline-block;
        padding: 4px 8px;
        border-radius: 2px;
        color: #fff;
        background-color: #C4252A;
    }
    .credit-arrow-wrap{
      float: right;
    }
    .van-icon.credit-arrow{
      font-size: 20px;
      color: #ccc;
    }
    .credit-info-title .text{
      color: #C4252A;
    }
    .credit-info-title .text:before{
      content: '.';
      display: inline-block;
      height: 20px;
      width: 5px;
      background-color: #C4252A;
      vertical-align: middle;
      margin-right: 5px;
    }
    .credit-info-title.van-cell{
      padding-left: 10px;
      padding-right: 10px;
    }
    .credit-info-detail{
      padding: 0 20px;
    }
    .credit-info-detail .van-cell{
      padding-left: 0;
      padding-right: 0;
    }
    .credit-info-solid{
      border-bottom: 0.08333rem solid #ebeeef;
    }
    .credit-result .van-cell__title{
      font-weight: bold;
    }
</style>
