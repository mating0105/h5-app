<template>
  <ViewPage :loading="loading">
    <Card :bodyPadding="true">
      <template v-slot:header>
        <section class="xh-plus">
          <van-cell title="名下车辆">
            <van-icon
              slot="right-icon"
              name="plus"
              style="line-height: inherit;"
              v-if="isView"
              @click="pullUrl"
            />
          </van-cell>
        </section>
      </template>
      <van-row class="xh-row">
        <van-col span="24" class="xh-row-col xh-swipe-button" v-for="(item,index) in carsList" :key="index">
          <van-swipe-cell :right-width="130" :disabled="!isView">
            <van-col span="24" style="padding: 5px 0;" @click.native="seeDetails(item)">
              <van-col span="24">
                <van-col span="12">
                  <span class="xh-main xh-title">车牌号：</span>
                  <span class="xh-black"></span>
                </van-col>
                <van-col span="12" class="xh-text-right">
                  <span style="margin-right: 10px;">{{item.carNumber}}</span> 
                  <van-tag color="#ee0a24">{{item.buyType == '1' ? '按揭' : '全款' }}</van-tag>
                </van-col>
              </van-col>
              <van-col span="24" class="xh-top-10">
                <van-col span="6" class="xh-main xh-title">车辆型号：</van-col>
                <van-col span="18" class="xh-text-right">{{item.carModel}}</van-col>
              </van-col>
            </van-col>
            <span slot="right">
              <van-button
                type="warning"
                style="border-radius: 0;"
                @click.native="editList(item)"
              >修改</van-button>
              <van-button
                type="danger"
                style="border-radius: 0;"
                @click.native="delList(item)"
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
import { getVehicleList, deleteVehicleList } from "@/api/client";
import { mapState } from "vuex";
import {
  Row,
  Col,
  Icon,
  Cell,
  SwipeCell,
  Button,
  Tag
} from "vant";

const Components = [
  Row,
  Col,
  Icon,
  Cell,
  SwipeCell,
  Button,
  Tag
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
      carsList: [],
      params: {},
      isView: false,
      loading: false
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
      this.loading = true;
      getVehicleList(dataList).then(res => {
        this.carsList = res.data;
        this.carsList.forEach(t => {
          t.buyTypeDesc = this.returnText('Purchase_method', t.buyType);
          t.carModel = t.carModel.split(" ").splice(1,4).join(' ');
        });
        
        this.loading = false;
      }).catch(()=> {
        this.loading = false;
      });
    },
    // 跳转新增
    pullUrl(){
      this.$router.push({ path: '/addCars', query: {...this.params, isView: 0 } });
    },
    // 修改
    editList(rows) {
      this.$router.push({ path: '/addCars', query: {...rows, projectId: this.params.projectId, isView: 0 } });
    },
    // 查看详情
    seeDetails(rows) {
      this.$router.push({ path: '/addCars', query: {...rows, projectId: this.params.projectId, isView: 1 } });
    },
    // 删除
    delList(rows) {
      deleteVehicleList({
        id: rows.id
      }).then(res => {
        this.$notify({
          type: "success",
          message: res.msg
        });
        this.loadData();
      });
    }
  },
  mounted() {
    this.params = this.$route.query;
    this.isView = this.params.isView == 0;
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

