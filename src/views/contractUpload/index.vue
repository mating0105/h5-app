<template>
  <ViewPage :backFn="closeNativeWebView" :scroll="true">
    <template v-slot:head>
      <van-search
        v-model="params.searchKey"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch"
        @cancel="onSearch"
      />
    </template>
    <van-list
      ref="listBox"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="onLoad"
    >
      <van-pull-refresh v-model="loading" @refresh="onRefresh">
        <div v-for="(item,ie) in list" :key="ie" class="van-clearfix">
          <Card class="xh-top-10" :bodyPadding="true">
            <van-row class="contractUploadBox">
              <van-col span="24">
                <span class="projectNo">NO.{{item.projectNo}}</span>
              </van-col>
              <van-col span="24"><img src="../../assets/new_images/icon_name.png" />
                <span>{{item.customerName}}</span>
              </van-col>
              <van-col span="24" class="xh-top-10"><img src="../../assets/new_images/icon_telephone.png" />
                <span>{{item.contactPhone}}</span>
              </van-col>
              <van-col span="24" class="xh-top-10">
                <img src="../../assets/new_images/icon_idcard.png" />
                <span>{{item.certificateNum}}</span>
                <span class="idCard">身份证</span>
              </van-col>
            </van-row>
            <template v-slot:footer>
              <div class="upBtn">
                <van-button round type="info" size="small" @click="goUpload(item)" v-show="item.bankMakeLoan === null || item.bankMakeLoan.processState !== '已放款'">合同上传</van-button>
              </div>
            </template>
          </Card>
        </div>
      </van-pull-refresh>
    </van-list>
  </ViewPage>
</template>

<script>
import Vue from "vue";
import api from "@/api/contractUpload";
// 自定义组件
import ViewPage from "@/layout/components/ViewPage";
import Card from "@/components/card/index";
import { removeValue } from "@/utils/session";
// 其他组件
import { Row, Col, Button, List, Search, PullRefresh } from "vant";

const Components = [Row, Col, Button, List, Search, PullRefresh];

Components.forEach(item => {
  Vue.use(item);
});
import { mapState } from "vuex";

export default {
  components: {
    ViewPage,
    Card
  },
  data() {
    return {
      list: [],
      loading: false,
      error: false,
      finished: false,
      params: {
        pageIndex: 1,
        pageSize: 10,
        searchKey: ""
      },
      scroll: 0
    };
  },
  watch: {
    error(value) {
      if (!value) {
        if(this.list.length > 0){
          this.params.pageIndex = this.params.pageIndex;
          this.onLoad()
        }else{
          this.onLoad(true)
        }
      }
    }
  },
  methods: {
    onRefresh(){
      this.onLoad(true);
    },
    onLoad (isPullRefresh) {
      this.loading = true;

      // 是否下拉刷新
      if(isPullRefresh){
        this.list = [];
        this.params.searchKey = '';
        this.params.pageIndex = 1;
      }

      api.getList(this.params).then(res => {
        const {code, data, msg} = res;
        setTimeout(() => {
          data.result.forEach(t => {
            this.list.push(t);
          });
          // 加载状态结束
          this.loading = false;
          this.params.pageIndex++;
          // 数据全部加载完成
          this.finished = this.list.length === data.totalCount;
        }, 500);
      }).catch(() => {
        this.error = true
        this.loading = false
      });
    },
    onSearch() {
      this.list = [];
      this.finished = false;
      this.params.pageIndex = 1;
      this.onLoad();
    },
    // 合同上传
    goUpload(item) {
      this.scroll = this.$refs.listBox.$refs.placeholder.offsetParent.scrollTop;
      this.$router.push({ path: "/contractUpload", query: {
          customerId:item.customerId,customerNum:item.customerNum,projectId:item.projectId,remark:item.remark,
          lpCertificateNum:item.certificateNum ,id:item.id
        } 
      });
    }
  },
  created() {
    this.onLoad();
  },
  activated(){
    this.$refs.listBox.$refs.placeholder.offsetParent.scrollTop = this.scroll;
  }
};
</script>

<style lang="scss">
.xh-plus {
  span {
    color: rgb(196, 37, 42);
  }
}

.xh-fixed-submit {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 99;

  .van-button {
    border-radius: 0;
  }
}
.contractUploadBox {
  .van-col {
    display: flex;
    align-items: center;
  }
  img {
    width: 26px;
  }
  span {
    margin-left: 16px;
  }
  .projectNo{
    font-size: 14px;
    color: #9B9B9B;
    margin: 0 4px 10px;
  }
  .idCard {
    font-size: 12px;
    color: #fc8a7f;
    padding: 4px 6px;
    border-radius: 10px;
    background-color: #fdf1f0;
    margin-left: 10px;
  }
}
.upBtn {
  display: flex;
  justify-content: flex-end;
  button {
    // padding: 4px 8px;
    width: 100px;
    border-color: transparent;
    background-color: #eb191f;
  }
}
</style>
