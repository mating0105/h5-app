<template>
  <ViewPage 
  iconClass="filter-o" 
  :rightMenuList="rightlist" 
  :goPage="goPage"
  :backFn="closeNativeWebView">
    <template v-slot:head>
      <van-search v-model="params.searchKey" placeholder="请输入搜索关键词" show-action @search="onSearch" @cancel="onCancel"/>
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
          <Card class="xh-top-10" :bodyPadding="true">
            <template v-slot:header>
              <section class="xh-plus">
                <van-cell
                  :title="item.customerNum"
                  :value="returnText(item.processState)"
                  icon="notes-o"
                ></van-cell>
              </section>
            </template>
            <van-row @click.native="seeView(item)">
              <van-col span="24">客户名称：{{ item.customerName }}</van-col>
              <van-col span="24" class="xh-top-10">身份证：{{ item.certificateNum }}</van-col>
              <van-col span="24" class="xh-top-10">手机号码：{{ item.contactPhone }}</van-col>
            </van-row>
            <template v-slot:footer v-if="item.processState == '01'">
              <div style="text-align:right;">
                <van-button
                  plain
                  type="danger"
                  class="xh-radius"
                  style="border-radius: 6px;"
                  @click="startForm(item)"
                >发起报单</van-button>
              </div>
            </template>
          </Card>
        </div>
      </van-list>
    </van-pull-refresh>
    <div class="xh-fixed-submit">
      <div class="xh-submit">
        <van-button
          icon="plus"
          size="large"
          class="xh-bg-main"
          @click="addClint"
          :loading="loading"
        >新建报单</van-button>
      </div>
    </div>
  </ViewPage>
</template>

<script>
import Vue from "vue";
import { getProjectList, getDeclaration } from "@/api/project";
// 自定义组件
import ViewPage from "@/layout/components/ViewPage";
import Card from "@/components/card/index";
// 其他组件
import { Row, Col, Icon, Cell, Button, List, Search, PullRefresh } from "vant";
const Components = [Row, Col, Icon, Cell, Button, List, Search, PullRefresh];

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
        pageSize: 10
      },
      rightlist: []
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
      this.wordbook.apply_status.forEach(e => {
        if (e.value == val) {
          name = e.label;
        }
      });
      return name;
    },
    // 筛选返回
    goPage(val) {
      this.params.processState = val.value;
      this.params.pageIndex = 1;
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
      getProjectList(this.params)
        .then(res => {
          const { data } = res;
          setTimeout(() => {
            data.result.forEach(t => {
              this.list.push(t);
            });
            // 加载状态结束
            this.loading = false;
            this.params.pageIndex++;
            const { apply_status } = this.wordbook;
            apply_status.forEach(t => {
              t.title = t.label;
            });
            this.rightlist = apply_status;
            // 数据全部加载完成
            if (this.list.length == data.totalCount) {
              this.finished = true;
            } else {
              this.finished = false;
            }
            if (data.result.length == 0) {
              this.finished = true;
            }
          }, 500);
        })
        .catch(() => {
          this.loading = false;
          setTimeout(() => {
            this.finished = true;
          }, 300);
        });
    },
    // 发起报单
    startForm(rows) {
      getDeclaration({
        id: rows.id
      }).then(res => {
        this.$router.push({
          path: "/xhProject",
          query: {
            customerName: rows.customerName, //客户姓名
            contactPhone: rows.contactPhone, //客户身份证
            certificateNum: rows.certificateNum, //客户手机号码
            customerId: rows.customerId,
            customerNum: rows.customerNum,
            projectNo: rows.projectNo,
            projectId: rows.projectId,
            isView: 0
          }
        });
      });
    },
    // 新建客户
    addClint() {
      this.$router.push({ path: "/customerList" });
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
    // 查看
    seeView(rows) {
      getDeclaration({
        id: rows.id
      }).then(res => {
        this.$router.push({
          path: "/xhProject",
          query: {
            customerName: rows.customerName, //客户姓名
            contactPhone: rows.contactPhone, //客户身份证
            certificateNum: rows.certificateNum, //客户手机号码
            customerId: rows.customerId,
            customerNum: rows.customerNum,
            projectNo: rows.projectNo,
            projectId: rows.projectId,
            isView: 1
          }
        });
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