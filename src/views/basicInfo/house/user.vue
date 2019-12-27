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
        <div class="xh-row-col xh-swipe-button" v-for="(list,index) in houseList" :key="index">
          <van-swipe-cell :right-width="130" :disabled="!isView">
            <section>
              <van-cell title="是否有房产:" :value="list.isHasHouse == '1'?'有房产':'没有房产'" />
            </section>
            <section v-if="list.isHasHouse == '1'">
              <van-cell title="房产所有人:"  :value="list.ownerProperty"/>
            </section>
            <section v-if="list.isHasHouse == '1'">
              <div class="van-cell">
                <div class="van-cell__title">房产面积(m<sup>2</sup>)：</div>
                <div class="van-cell__value">{{ list.houseArea }}</div>
              </div>
            </section>
            <section v-if="list.isHasHouse == '1'">
              <van-cell title="房产所在地:"  :value="list.provCityZon"/>
            </section>
            <section v-if="list.isHasHouse == '1'">
              <van-cell title="详细地址:"  :value="list.specificAddress"/>
            </section>
            <section v-if="list.isHasHouse == '1'">
              <van-cell title="房产性质:"  :value="list.houseTypeDesc"/>
            </section>
            <section v-if="list.isHasHouse == '1'">
              <van-cell title="房产区域:"  :value="list.houseZonDesc"/>
            </section>
            <span slot="right">
              <van-button
                type="warning"
                style="height:100%;border-radius: 0;"
                @click.native="editList(list)"
              >修改</van-button>
              <van-button
                type="danger"
                style="height:100%;border-radius: 0;"
                @click.native="delList(list)"
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
import { getHouseList, deleteHouseList } from "@/api/client";
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
      this.$router.push({ path: '/addHouseUser', query: {...this.params, isView: 0 } });
    },
    loadData() {
      let obj = {
        customerId: this.params.customerId
      }
      this.loading = true;
      getHouseList(obj).then(res => {
        this.houseList = res.data;
        this.houseList.forEach(t => {
          t.houseTypeDesc = this.returnText('Property_nature', t.houseType);
          t.houseZonDesc = this.returnText('Property_area', t.houseZon);
        });
        this.loading = false;
      }).catch(()=>{
        this.loading = false;
      });
    },
    // 修改
    editList(rows) {
      this.$router.push({ path: '/addHouseUser', query: {...rows, projectId: this.params.projectId, isView: 0 } });
    },
    // 删除
    delList(rows) {
      deleteHouseList({
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
