<template>
  <ViewPage :loading="allLoading" iconClass="filter-o" :rightMenuList="rightlist" :goPage="goPage">
    <template v-slot:head>
      <van-search
        v-model="searchKey"
        placeholder="请输入客户名称"
        show-action
        @search="onSearch"
        @cancel="onCancel"
      />
    </template>
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <div v-for="(item,ie) in list" :key="ie" class="van-clearfix">
          <Card class="xh-top-10" :bodyPadding='true'>
            <template v-slot:header>
              <section class="xh-plus">
                <van-cell :title="item.customerNum" :value="returnText(item.creditState)" icon="notes-o"></van-cell>
              </section>
            </template>
            <van-row @click="selectSubmit(item)">
              <van-col span="24">客户名称：{{ item.customerName }}</van-col>
              <van-col span="24" class="xh-top-10">身份证：{{ item.certificateNum }}</van-col>
              <van-col span="24" class="xh-top-10">手机号码：{{ item.contactPhone }}</van-col>
            </van-row>
          </Card>
        </div>
      </van-list>
    </van-pull-refresh>
  </ViewPage>
</template>

<script>
import Vue from "vue";
import { getCustomerList, getCuListManage, createNewProj } from "@/api/project";
// 自定义组件
import ViewPage from "@/layout/components/ViewPage";
import Card from "@/components/card/index";
// 其他组件
import { Row, Col, Icon, Cell, Button, List, Search, PullRefresh } from "vant";
const Components = [Row, Col, Icon, Cell, Button, List, Search, PullRefresh ];

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
      searchKey: '',
      params: {
        pageIndex: 1,
        pageSize: 10
      },
      rightlist: [],
      allLoading: false
    };
  },
  computed: {
    // 所有字典
    ...mapState({
      wordbook: state => state.user.wordbook
    })
  },
  methods: {
    // 字典转换
    returnText(val) {
      let name;
      this.wordbook.credit_result.forEach(e => {
        if(e.value == val) {
          name = e.label;
        }
      });
      return name;
    },
    // 返回搜索有值的参数
    returnVal(vals) {
      let obj = {};
      for (var i in vals) {
        if (vals[i] || vals[i] === 0) {
          obj[i] = vals[i];
        }
      }
      this.params = obj;
    },
    // 筛选返回
    goPage(val) {
      this.params.pageIndex = 1;
      this.params.state = val.value;
      this.list = [];
      this.onLoad();
    },
    // 搜索
    onSearch(val) {
      this.params.pageIndex = 1;
      this.params.customerName = val;
      this.returnVal(this.params);
      this.list = [];
      this.onLoad();
    },
    // 取消搜索
    onCancel() {
      this.params = {
        pageIndex: 1,
        pageSize: 10
      }
      this.list = [];
      this.onLoad();
    },
    onRefresh() {
      this.params = {
        pageIndex: 1,
        pageSize: 10
      }
      this.list = [];
      this.onLoad();
    },
    onLoad() {
      this.loading = true;
      getCustomerList(this.params).then(res => {
        const { data } = res;
        setTimeout(() => {
          data.result.forEach(t => {
            this.list.push(t);
          });
          // 加载状态结束
          this.loading = false;
          this.params.pageIndex ++;
          const { credit_result } = this.wordbook;
          credit_result.forEach(t => {
            t.title = t.label;
          });
          this.rightlist = credit_result;
          // 数据全部加载完成
          if (this.list.length == data.totalCount) {
            this.finished = true;
          } else {
            this.finished = false;
          }
          if(data.result.length == 0) {
            this.finished = true;
          }
        }, 500);
      }).catch(()=>{
        this.loading = false;
        setTimeout(()=> {
          this.finished = true;
        },300);
      });
    },
    confirmInfo(msg) {
      this.$notify({
        type: "success",
        message: msg
      });
    },
    // 选择客户报单
    selectSubmit(item) {
      getCuListManage({
        customerId: item.id
      }).then(res => {
        let info,nmlstTp;
        let { data } = res;
        if(data.cuListManageList.length > 0) {
          data.cuListManageList.forEach(t => {
            nmlstTp = t.nmlstTp
          });
          if(nmlstTp === '001' ){
            info = "这个客户为黑名单客户，是否发起报单？";
            this.confirmInfo(info);
          }else if(nmlstTp === '002'){
            info = "这个客户为灰名单客户，是否发起报单？";
            this.confirmInfo(info);
          }else if(nmlstTp === '003'){
            info = "这个客户为白名单客户";
            this.confirmInfo(info);
          } else {
            this.newProject(item.id);
          }
        } else {
          this.newProject(item.id);
        }
      }).catch(()=>{

      });
    },
    // 创建一个新报单
    newProject(id) {
      this.allLoading = true;
      createNewProj({
        id: id
      }).then(res => {
        let { data } = res;
        let projectInfo = data.projectInfo;
        this.allLoading = false;
        this.$router.push({ path: '/xhProject', query: {
          customerName: projectInfo.customerName, //客户姓名
          contactPhone: projectInfo.contactPhone, //客户身份证
          certificateNum: projectInfo.certificateNum, //客户手机号码
          customerId: projectInfo.customerId,
          customerNum: projectInfo.customerNum,
          projectNo: projectInfo.projectNo,
          projectId: projectInfo.projectId,
          isView: 0
        }});
      }).catch(()=>{
        this.allLoading = false;
      });
    }
  },
  mounted() {
    this.onLoad();
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
</style>
