<template>
  <ViewPage :loading="loading">
    <Card :bodyPadding="true">
      <template v-slot:header>
        <section class="xh-plus">
          <van-cell title="担保人信息">
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
        <div class="xh-row-col xh-swipe-button" v-for="(i,index) in houseList" :key="index">
          <van-swipe-cell :right-width="130" :disabled="!isView">
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
            <span slot="right">
              <van-button
                type="warning"
                style="height:100%;border-radius: 0;"
                @click.native="editList(i)"
              >修改</van-button>
              <van-button
                type="danger"
                style="height:100%;border-radius: 0;"
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
            t.isBondsDesc = this.returnText('yes_no', t.isBonds);
            t.relationCusDesc = this.returnText('relation_Cus', t.relationCus);
            t.levelEducationDesc = this.returnText('DegreeOfEducation', t.levelEducation);
            t.marriageDesc = this.returnText('marriage_type', t.marriage);
          });
          this.loading = false;
        } catch {
          this.loading = false;
        }
      })
    },
    // 修改
    editList(rows) {
      this.$router.push({ path: '/addGuarantor', query: {...rows, projectId: this.params.id, isView: 1 } });
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
    this.isView = this.params.isView == 0?true:false;
    this.loadData();
  }
}
</script>
