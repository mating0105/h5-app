<template>
  <ViewPage>
    <Card>
      <template v-slot:header>
        <section class="xh-plus">
          <van-cell title="家庭收入">
            <van-icon slot="right-icon" name="plus" style="line-height: inherit;" />
          </van-cell>
        </section>
      </template>
      <van-row class="xh-row">
        <van-col span="24" class="xh-row-col xh-swipe-button"
          v-for="(i,index) in guarantorList"
          :key="index"
          @click="pushUrl(i)"
        >
          <van-swipe-cell :right-width="120">
            <div class="xh-form-body">
              <section>
                <van-cell title="担保人姓名：" :value="i.customerName" />
              </section>
              <section>
                <van-cell title="证件号码：" :value="i.certificateNum" />
              </section>
              <section>
                <van-cell title="是否共债人：" :value="i.isBondsDesc" />
              </section>
              <section>
                <van-cell title="与客户关系：" :value="i.relationCusDesc" />
              </section>
              <section>
                <van-cell title="担保人联系电话：" :value="i.contactPhone" />
              </section>
              <section>
                <van-cell title="婚姻状况：" :value="i.marriageDesc" />
              </section>
              <section>
                <van-cell title="户籍地址：" :value="i.pProvCityZon" />
              </section>
            </div>
            <van-row slot="right" class="xh-swipe-btn">
              <div class="xh-col-12 xh-swipe-edit" @click="edit(i.id)">编辑</div>
              <div class="xh-col-12 xh-swipe-delete" @click="deleteThis(i.id)">删除</div>
            </van-row>
          </van-swipe-cell>
        </van-col>
      </van-row>
    </Card>
  </ViewPage>
</template>

<script>
import Vue from "vue";
import Card from "@/components/card/index";
import ViewPage from '@/layout/components/ViewPage';
import { getGuaranteeList, deleteHouseList } from "@/api/client";
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
  data() {
    return {
      guarantorList: [
        { name: 1 }
      ],
      projectId: "",
      params: {}
    };
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
      this.$router.push({ path: '/addGuarantor', query: {...this.params, type: 0 } });
    },
    loadData() {
      let obj = {
        customerNum: this.params.customerNum,
        projectId: this.params.projectId,
      }
      this.loading = true;
      getGuaranteeList(obj).then(res => {
        try {
          this.houseList = res.data.cuGuaranteeList;
          this.houseList.forEach(t => {
            t.houseTypeDesc = this.returnText('Property_nature', t.houseType);
            t.houseZonDesc = this.returnText('Property_area', t.houseZon);
          });
          this.loading = false;
        } catch {
          this.loading = false;
        }
      })
    },
    // 修改
    editList(rows) {
      this.$router.push({ path: '/addGuarantor', query: {...rows, projectId: this.params.id, type: 1 } });
    },
    // 删除
    delList(rows) {
      deleteHouseList({
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
};
</script>
