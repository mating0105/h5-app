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
            />
          </van-cell>
        </section>
      </template>
      <div class="xh-row">
        <div class="xh-row-col xh-swipe-button"  v-for="(i,index) in houseList" :key="index">
          <van-swipe-cell :right-width="130">
            <div class="xh-form-body">
              <van-col span="24">
                <van-col span="12">
                  <span class="xh-main xh-title">房产所有人：</span>
                  <span class="xh-black">{{ i.cuGuaranteeName }}</span>
                </van-col>
                <van-col span="12" class="xh-text-right">
                  <span class="xh-main">{{ i.houseTypeDesc }}</span>
                </van-col>
              </van-col>
              <van-col span="24" class="xh-top-10">
                <span class="xh-main xh-title">房产所在地：</span>
                <span class="xh-black">{{ i.provCityZon }}</span>
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
import { getGuaranteeList, deleteGuaranteeList } from "@/api/client";
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
  data() {
    return {
      houseList: [],
      loading: false
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
      this.$router.push({ path: '/addHouseGuarantor', query: {...this.params, type: 0 } });
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
      this.$router.push({ path: '/addHouseGuarantor', query: {...rows, projectId: this.params.id, type: 1 } });
    },
    // 删除
    delList(rows) {
      deleteGuaranteeList({
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
