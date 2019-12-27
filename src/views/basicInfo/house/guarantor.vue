<template>
  <ViewPage :loading="loading">
    <Card :bodyPadding="true">
      <template v-slot:header>
        <section class="xh-plus">
          <van-cell title="房产信息">
            <van-icon
              slot="right-icon"
              name="plus"
              style="line-height: inherit;"
              @click="pathHouse"
              v-if="isView"
            />
          </van-cell>
        </section>
      </template>
      <div class="xh-row">
        <div class="xh-row-col xh-swipe-button"  v-for="(i,index) in houseList" :key="index">
          <van-swipe-cell :right-width="130" :disabled="!isView">
            <div class="xh-form-body" @click="seeDetails(i)">
              <van-col span="24">
                <van-col span="12">
                  <span class="xh-main xh-title">房产所有人：</span>
                </van-col>
                <van-col span="12" class="xh-text-right">
                  <span class="xh-black">{{ i.cuGuaranteeName }}</span>
                  <van-tag color="#ee0a24">{{ i.houseTypeDesc }}</van-tag>
                </van-col>
              </van-col>
              <van-col span="24" class="xh-top-10">
                <van-col span="6" class="xh-main xh-title">房产所在地：</van-col>
                <van-col span="18" class="xh-text-right">{{ i.provCityZon }}</van-col>
              </van-col>
            </div>
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
        </div>
      </div>
    </Card>
  </ViewPage>
</template>

<script>
import Vue from "vue";
import Card from "@/components/card/index";
import ViewPage from '@/layout/components/ViewPage';
import { getGuaranteeList, deleteGuaranteeHouse } from "@/api/client";
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
  data() {
    return {
      houseList: [],
      loading: false,
      isView: false
    }
  },
  computed: {
    // 所有字典
    ...mapState({
      wordbook: state => state.user.wordbook
    })
  },
  components: {
    ViewPage,
    Card
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
    pathHouse() {
      this.$router.push({ path: '/addHouseGuarantor', query: {...this.params, isView: 0 } });
    },
    loadData() {
      let obj = {
        customerNum: this.params.customerNum,
        projectId: this.params.projectId,
      }
      this.loading = true;
      getGuaranteeList(obj).then(res => {
        try {
          this.houseList = res.data.cuGuaranteeHouseList;
          this.houseList.forEach(t => {
            t.houseTypeDesc = this.returnText('Property_nature', t.houseType);
          });
          this.loading = false;
        } catch {
          this.loading = false;
        }
      })
    },
    // 修改
    editList(rows) {
      this.$router.push({ path: '/addHouseGuarantor', query: {...rows, projectId: this.params.projectId, isView: 0 } });
    },
    // 查看详情
    seeDetails(rows) {
      this.$router.push({ path: '/addHouseGuarantor', query: {...rows, projectId: this.params.projectId, isView: 1 } });
    },
    // 删除
    delList(rows) {
      deleteGuaranteeHouse({
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
  }
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
