<template>
  <ViewPage>
    <Card :bodyPadding="true">
      <template v-slot:header>
        <section class="xh-plus">
          <van-cell title="家庭收入(*请侧滑进行编辑或删除)">
            <van-icon
              slot="right-icon"
              name="plus"
              style="line-height: inherit;"
              @click="pullUrl"
              v-if="isView == 0"
            />
          </van-cell>
        </section>
      </template>
      <van-row class="xh-row">
        <van-col span="24" class="xh-row-col xh-swipe-button" v-for="(i,index) in homelist" :key="index" @click.native="pushUrl(i)">
          <van-swipe-cell :right-width="130">
            <van-col span="24">
              <van-col span="24">
                <van-col span="12">
                  <span class="xh-main xh-title">收入人：</span>
                  <span class="xh-black">{{ i.incomePeopleDesc}}</span>
                </van-col>
                <van-col span="12" class="xh-text-right">
                  <span class="xh-main">{{ i.occupationalStatusDesc }}</span>
                </van-col>
              </van-col>
              <van-col span="24" class="xh-top-10">
                <span class="xh-main xh-title">单位名称：</span>
                <span class="xh-black">{{ i.companyName }}</span>
              </van-col>
            </van-col>
            <span slot="right">
              <van-button
                type="warning"
                style="border-radius: 0;"
                @click.native="editList(i)"
              >修改</van-button>
              <van-button
                type="danger"
                style="border-radius: 0;"
                @click.native="delList(i)"
              >删除</van-button>
            </span>
          </van-swipe-cell>
        </van-col>
      </van-row>
    </Card>
  </ViewPage>
</template>

<script>
import Vue from "vue";
// 自定义组件
import Card from "@/components/card/index";
import ViewPage from "@/layout/components/ViewPage";
import { getIncomeList, deleteIncomeList } from "@/api/client";
import { mapState } from "vuex";
import {
  Row,
  Col,
  Icon,
  Cell,
  SwipeCell,
  Button
} from "vant";

const Components = [
  Row,
  Col,
  Icon,
  Cell,
  SwipeCell,
  Button
];

Components.forEach(item => {
  Vue.use(item);
});
export default {
  components: {
    Card,
    ViewPage
  },
  computed: {
    // 所有字典
    ...mapState({
      wordbook: state => state.user.wordbook
    })
  },
  data() {
    return {
      homelist: [],
      params: {},

    }
  },
  methods: {
    // 字典转换
    returnText(n, val) {
      let name;
      this.wordbook[n].forEach(e => {
        if (e.value == val) {
          name = e.label;
        }
      });
      return name;
    },
    loadData() {
      let dataList = {
        customerId: this.params.customerId
      };
      getIncomeList(dataList).then(res => {
        if(res.code == 200) {
          this.homelist = res.data;
          this.homelist.forEach(t => {
            t.incomePeopleDesc = this.returnText('income_person', t.incomePeople);
            t.occupationalStatusDesc = this.returnText('OccupationalStatus', t.occupationalStatus);
          });
        } else {
          this.$notify({
            type: "danger",
            message: res.msg
          });
        }
      })
    },
    // 跳转新增
    pullUrl(){
      this.$router.push({ path: '/addIncome', query: {...this.params, type: 0 } });
    },
    // 修改
    editList(rows) {
      this.$router.push({ path: '/addIncome', query: {...rows, projectId: this.params.id, type: 1 } });
    },
    // 删除
    delList(rows) {
      deleteIncomeList({
        id: rows.id
      }).then(res => {
        if(res.code == 200) {
          this.$notify({
            type: "success",
            message: res.msg
          });
          this.loadData();
        } else {
          this.$notify({
            type: "danger",
            message: res.msg
          });
        }
      });
    }
  },
  mounted() {
    this.params = this.$route.query;
    this.isView = this.params.isView;
    this.loadData();
  },
}
</script>

<style lang="scss">
.xh-row {
  .xh-title {
    font-size: 1.2rem;
    font-weight: 700;
  }
  .xh-main {
    color: rgb(196, 37, 42);
  }
}
</style>
