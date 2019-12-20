<template>
  <ViewPage>
    <template v-slot:head>
      <van-search
        @cancel="onSearch"
        @search="onSearch"
        @input="onSearch"
        placeholder="请输入搜索关键词"
        show-action
        v-model="params.customerName"
      />
    </template>
    <van-list
      :error.sync="error"
      :finished="finished"
      @load="onLoad"
      error-text="请求失败，点击重新加载"
      finished-text="没有更多了"
      v-model="loading"
    >
      <div
        :key="ie"
        class="van-clearfix"
        v-for="(item,ie) in list"
      >
        <Card
          :bodyPadding="true"
          class="xh-top-10"
        >
          <template v-slot:header>
            <section class="xh-plus">
              <van-cell
                :title="item.customerNum"
                :value="returnText(item.processState)"
                icon="notes-o"
              ></van-cell>
            </section>
          </template>
          <van-row>
            <van-col span="24">客户名字：{{ item.customerName }}</van-col>
            <van-col
              class="xh-top-10"
              span="24"
            >身份证：{{ item.certificateNum }}</van-col>
            <van-col
              class="xh-top-10"
              span="24"
            >手机号码：{{ item.contactPhone }}</van-col>
          </van-row>
          <template v-slot:footer>
            <div style="text-align:right;">
              <van-button
                @click="supple(item)"
                class="xh-radius"
                plain
                style="border-radius: 6px;"
                type="danger"
              >重权资料补录</van-button>
            </div>
          </template>
        </Card>
      </div>
    </van-list>
  </ViewPage>
</template>

<script>
import Vue from "vue";
import { queryRightSuppleList } from "@/api/heavyRightSupplement";
// 自定义组件
import ViewPage from "@/layout/components/ViewPage";
import Card from "@/components/card/index";
// 其他组件
import { Row, Col, Icon, Cell, Button, List, Search } from "vant";
const Components = [Row, Col, Icon, Cell, Button, List, Search];

Components.forEach(item => {
  Vue.use(item);
});
import { mapState } from "vuex";
import { log } from "util";
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
        customerName: "",
        pageIndex: 1,
        pageSize: 10
      }
    };
  },
  computed: {
    // 所有字典
    ...mapState({
      wordbook: state => state.user.wordbook
    })
  },
  methods: {
    onSearch() {
      this.list = [];
      this.finished = false;
      this.params.pageIndex = 1;
      this.onLoad();
    },
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
    onLoad() {
      this.loading = true;
      queryRightSuppleList(this.params).then(res => {
        const { code, data, msg } = res;
        if (code == 200) {
          setTimeout(() => {
            data.result.forEach(t => {
              this.list.push(t);
            });
            // 加载状态结束
            this.loading = false;
            this.params.pageIndex++;
            // 数据全部加载完成
            if (this.list.length == data.totalCount) {
              this.finished = true;
            } else {
              this.finished = false;
            }
          }, 500);
        } else {
          this.$notify({ type: "danger", message: msg });
          this.loading = false;
        }
      });
    },
    // 重权补录
    supple(rows) {
      this.$router.push({
        name: "HeavyRightBasic",
        params: {
          id: rows.projectId
        }
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