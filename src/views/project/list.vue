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
      <div v-for="item in list" :key="item" :title="item">
        <Card class="xh-top-10">
          <template v-slot:header>
            <section class="xh-plus">
              <van-cell title="xh201903884521223" value="项目未报单" icon="notes-o"></van-cell>
            </section>
          </template>
          <van-row>
            <van-col span="24">客户名称：张三三</van-col>
            <van-col span="24" class="xh-top-10">身份证：101011252252152522</van-col>
            <van-col span="24" class="xh-top-10">手机号码：18985458888</van-col>
          </van-row>
          <template v-slot:footer>
            <div style="text-align:right;">
              <van-button
                plain
                type="danger"
                class="xh-radius"
                style="border-radius: 6px;"
                @click="startForm"
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
  methods: {
    onLoad() {
      // getProjectList(this.parms).then(res => {
      //   console.log(res);
      // });
      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1);
        }
        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true;
        }
      }, 500);
    },
    // 发起报单
    startForm() {
      this.$router.push("/xhProject");
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