<template>
  <Card>
    <template v-slot:header>
      {{title}}
      <span
        class="status"
        :class="{'status-pass':credit100Result === '通过'}"
        v-if="credit100Result"
      >{{credit100Result}}</span>
      <div class="credit-arrow-wrap" @click="isSpread = !isSpread">
        <van-icon v-if="isSpread" class="credit-arrow" name="arrow-up" />
        <van-icon v-else class="credit-arrow" name="arrow-down" />
      </div>
    </template>
    <div v-show="isSpread" class="xh-table-border">
      <section v-for="(item, index) in copyDataList" :key="index" class="xh-table-border">
        <van-cell class="credit-info-title" :border="false">
          <span class="text">{{item.creditObjectType | filterInfo}}</span>
        </van-cell>
        <div class="credit-info-detail">
          <van-cell title="客户姓名:" :border="false" :value="item.creditPersonName" />
          <van-cell title="证件号码:" :border="false" :value="item.cpCertificateNum" />
          <van-cell title="手机号码:" :border="false" :value="item.telephone" />
          <!-- <van-cell title="银行卡号:" :border="false" value="张三"/> -->
          <van-cell title="相关文档:" :border="false" v-if="showDocs">
            <van-button
              slot="right-icon"
              size="mini"
              style="line-height: inherit;"
              @click="lookDocs"
            >查看</van-button>
          </van-cell>
          <van-cell
            class="credit-result"
            title="贷前信息验证结果:"
            :border="false"
            :value="item.credit100VerificationResult|filterCResult"
          />
          <van-cell
            class="credit-result"
            title="查询时间:"
            :border="false"
            :value="item.credit100VerificationQuerydate|filterTime"
          />
          <van-cell class="credit-result" title="贷前信息查询报告:" :border="false">
            <van-button
              slot="right-icon"
              size="mini"
              style="line-height: inherit;"
              @click="lookUpResult(item.credit100VerificationReport)"
            >查看报告</van-button>
          </van-cell>
          <div class="credit-info-solid"></div>
          <van-cell
            class="credit-result"
            title="贷前风险策略结果:"
            :border="false"
            :value="item.credit100StrategyResult|filterCResult"
          />
          <van-cell
            class="credit-result"
            title="查询时间:"
            :border="false"
            :value="item.credit100StrategyQuerydate|filterTime"
          />
          <van-cell class="credit-result" title="贷前风险策略报告:" :border="false">
            <van-button
              slot="right-icon"
              size="mini"
              style="line-height: inherit;"
              @click="lookUpResult(item.credit100StrategyReport)"
            >查看报告</van-button>
          </van-cell>
        </div>
        <!-- 查看报告-图片 -->
        <van-image-preview class-name="reportClass" ref="preview" v-model="showImg" :images="images">
          <template v-slot:index>{{ imgTitle }}</template>
        </van-image-preview>
        
        <!-- <van-image width="100%"  v-model="showImg" :src="images" /> -->
        <!-- <van-overlay :show="showImg"  @click="showImg = false">
          <div style='overflow:auto;'>
            <van-image width="100%" :src="images" />
          </div>
        </van-overlay> -->

        <!-- 弹框 -->
        <!-- <van-dialog v-model="showPdf" show-cancel-button width="80%">
          <Pdf :path='urlSrc'></Pdf>
        </van-dialog> -->
      </section>
      </div>
    </Card>
    
</template>

<script>

  import Card from '@/components/card'
  import Pdf from './pdf2.vue'
  import Vue from 'vue';
  import { getBank, getCreditInfo, saveCreditInfo,getCompanyName } from '@/api/credit'
  import { Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast, Notify, SwipeCell, Dialog, Tab, Tabs,ImagePreview } from 'vant';
  import { format } from "@/utils/format";
  const Components = [Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast, Notify, SwipeCell, Dialog, Tab, Tabs,ImagePreview]
  Components.forEach(item => {
    Vue.use(item)
  })

  export default {
    name: "creditQueryInfo",
    components: {
      Card,
      Pdf
    },
    props: {
      title: String,
      dataList: {
        default () {
          return []
        }
      },
      type: String,
      credit100Result:String,
      showDocs:{
        type:Boolean,
        default:false
      }
    },
    data(){
      return {
        copyDataList:[],
        isSpread:true,
        total_result:false,
        showImg:false,
        images:[],
        roles:'',
        //pdf
        url:'',
        showPdf:false,
        urlSrc:''

      }
    },
    computed: {
    // 所有字典
    wordbook() {
      return this.$store.state.user.wordbook;
    }
  },
  filters: {
    filterInfo(info) {
      switch (info) {
        case "borrower":
          return "借款人信息";
          break;
        case "borrowerSpouse":
          return "借款人配偶信息";
          break;
        case "joiDebtor":
          return "共债人信息";
          break;
        case "joiDebtorSpouse":
          return "共债人配偶信息";
          break;
        case "security":
          return "担保人信息";
          break;
        default:
          break;
      }
    },
    // Accept - 通过，Reject - 拒绝，Review - 复议
    filterCResult(result) {
      switch (result) {
        case "Accept":
          return "通过";
          break;
        case "Reject":
          return "拒绝";
          break;
        case "Review":
          return "复议";
          break;
        case null:
          return "未查询";
          break;
        case "":
          return "无建议";
          break;
        default:
          break;
      }
    },
    filterTime(time) {
      return time ? format(new Date(time), "yyyy MM dd hh:mm:ss") : "";
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
    lookUpResult(url){
        if(this.roles == 'CustomerManager'){
          this.$toast("暂无查看权限");
        }else{
          this.images = []
          this.imgTitle = null
          this.images = ['data:image/jpeg/jpg/png;base64,'+url]
          this.showImg = true
          // ImagePreview(this.images)
          // let params={
          //   images:this.images,
          //   imgTitle:this.imgTitle,
          //   showImg:this.showImg
          // }
          // this.$router.push({ path: '/img', params: params });

          // this.urlSrc =window.URL.createObjectURL(new Blob([url], {type:"application/pdf;charset-UTF-8"}))+'.pdf';
          // // console.log(this.url,'this.url')
          // this.showPdf=true;
        }
      
    },
    lookDocs(){
      this.$emit('lookDocs')
    },
    async getCompany() {
      const res = await getCompanyName();
      //获取该用户角色-若只是客户经理，则不显示征信报告，存在其他角色，则显示征信报告
      res.data.roleInfoList.forEach(e => {
          if(e.enname == 'CustomerManager' && res.data.roleInfoList.length == 1){
            this.roles = 'CustomerManager';
          }
      });

    },
  },
  mounted(){
    //获取该用户角色
    this.getCompany();
    setTimeout(()=>{
      this.copyDataList = this.dataList;
    },500)
    
  }
};
</script>

<style>
.xh-pass .van-cell__value {
  color: #3ece73;
}
    .xh-pass .van-cell__value {
        color: #3ECE73;
    }

    .xh-no-pass .van-cell__value {
        color: #C4252A;
    }
    .status{
        display: inline-block;
        padding: 4px 8px;
        border-radius: 2px;
        color: #fff;
        background-color: #E60000;
    }
    .status-pass{
        background-color: #21C272;
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

.van-overlay{
  overflow: auto;}
.xh-no-pass .van-cell__value {
  color: #c4252a;
}
.status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 2px;
  color: #fff;
  background-color: #e60000;
}
.status-pass {
  background-color: #21c272;
}
.credit-arrow-wrap {
  float: right;
}
.van-icon.credit-arrow {
  font-size: 20px;
  color: #ccc;
}
.credit-info-title .text {
  color: #c4252a;
}
.credit-info-title .text:before {
  content: ".";
  display: inline-block;
  height: 20px;
  width: 5px;
  background-color: #c4252a;
  vertical-align: middle;
  margin-right: 5px;
}
.credit-info-title.van-cell {
  padding-left: 10px;
  padding-right: 10px;
}
.credit-info-detail {
  padding: 0 20px;
}
.credit-info-detail .van-cell {
  padding-left: 0;
  padding-right: 0;
}
.credit-info-solid {
  border-bottom: 0.08333rem solid #ebeeef;
}
.credit-result .van-cell__title {
  font-weight: bold;
}
/* .reportClass{*/
/*  overflow: auto!important;*/
/*}*/
/* .reportClass div{*/
/*   overflow: auto!important;*/
/* }*/
/*.reportClass .van-image>img{*/
/*  height: auto;*/
/*}*/

    /*.reportClass .van-image.van-image-preview__image {*/
    /*    overflow: scroll;*/
    /*}*/

    .reportClass .van-image__img {
        height: auto;
    }

    .reportClass .van-swipe.van-image-preview__swipe {
        overflow: scroll;
    }

    .reportClass .van-swipe__track {
        height: auto;
    }
</style>
