<template>
  <ViewPage>
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
              <van-cell :title="item.customerNum" :value="returnText(item.processState)" icon="notes-o"></van-cell>
            </section>
          </template>
          <van-row>
            <van-col span="24">客户名称：{{ item.customerName }}</van-col>
            <van-col span="24" class="xh-top-10">身份证：{{ item.certificateNum }}</van-col>
            <van-col span="24" class="xh-top-10">手机号码：{{ item.contactPhone }}</van-col>
          </van-row>
          <template v-slot:footer>
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
import { getProjectList } from "@/api/project";
// 自定义组件
import ViewPage from "@/layout/components/ViewPage";
import Card from "@/components/card/index";
// 其他组件
import { Row, Col, Icon, Cell, Button, List } from "vant";
const Components = [Row, Col, Icon, Cell, Button, List];

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
      parms: {
        pageIndex: 1,
        pageSize: 10
      }
    };
  },
  computed: {
    // 所有字典
    ...mapState({
      wordbook: state => state.user.wordbook,
    })
  },
  methods: {
    // 字典转换
    returnText(val) {
      let name;
      this.wordbook.apply_status.forEach(e => {
        if(e.value == val) {
          name = e.label;
        }
      });
      return name;
    },
    onLoad() {
      this.loading = true;
      getProjectList(this.parms).then(res => {
        const { code, data, msg } = res;
        if(code == 200) {
          setTimeout(() => {
            data.result.forEach(t => {
              this.list.push(t);
            });
            // 加载状态结束
            this.loading = false;
            this.parms.pageIndex ++;
            // 数据全部加载完成
            if (this.list.length == data.totalCount) {
              this.finished = true;
            } else {
              this.finished = false;
            }
          }, 500);
        } else {
          this.$notify({ type: 'danger', message: msg });
          this.loading = false;
        }
      });
    },
    // 发起报单
    startForm(rows) {
      this.$router.push({ path: '/xhProject', query: {
        customerName: rows.customerName, //客户姓名
        contactPhone: rows.contactPhone, //客户身份证
        certificateNum: rows.certificateNum, //客户手机号码
        id: rows.projectId,
        customerId: rows.customerId,
        projectNo: rows.projectNo
      }});
    },
    // 新建客户
    addClint() {}
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