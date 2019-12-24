<template>
  <ViewPage>
    <Card :bodyPadding="true">
      <template v-slot:header>
        <section class="xh-plus">
          <van-cell title="担保人收入">
            <van-icon slot="right-icon" name="plus" style="line-height: inherit;" @click="pullUrl"
              v-if="isView"/>
          </van-cell>
        </section>
      </template>
      <van-row class="xh-row">
        <van-col span="24" class="xh-row-col xh-swipe-button"
          v-for="(i,index) in guarantorList"
          :key="index"
        >
          <van-swipe-cell :right-width="130" :disabled="!isView">
            <div class="xh-form-body">
              <section>
                <van-cell title="担保人姓名：" :value="i.cuGuaranteeName" />
              </section>
              <section>
                <van-cell title="收入人：" :value="i.incomePeopleDesc" />
              </section>
              <section>
                <van-cell title="职业情况：" :value="i.occupationalStatusDesc" />
              </section>
              <section>
                <van-cell title="单位名称：" :value="i.companyName" />
              </section>
              <section>
                <van-cell title="月固定收入：" :value="i.personalIncome" />
              </section>
            </div>
            <span slot="right">
              <van-button
                type="warning"
                style="border-radius: 0;height:100%;"
                @click.native="editList(i)"
              >修改</van-button>
              <van-button
                type="danger"
                style="border-radius: 0;height:100%;"
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
import Card from "@/components/card/index";
import ViewPage from '@/layout/components/ViewPage';
import { getGuaranteeList, deleteGuaranteeIncome } from "@/api/client";
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
      guarantorList: [],
      projectId: "",
      params: {},
      isView: false
    };
  },
  computed: {
    // 所有字典
    ...mapState({
      wordbook: state => state.user.wordbook
    })
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
    pullUrl() {
      this.$router.push({ path: '/addGuarantorIncome', query: {...this.params, type: 0 } });
    },
    loadData() {
      let obj = {
        customerNum: this.params.customerNum,
        projectId: this.params.projectId,
      }
      this.loading = true;
      getGuaranteeList(obj).then(res => {
        try {
          this.guarantorList = res.data.cuGuaranteeIncome;
          this.guarantorList.forEach(t => {
            t.incomePeopleDesc = this.returnText('income_person', t.incomePeople);
            t.occupationalStatusDesc = this.returnText('OccupationalStatus', t.occupationalStatus);
          });
          this.loading = false;
        } catch {
          this.loading = false;
        }
      })
    },
    // 修改
    editList(rows) {
      this.$router.push({ path: '/addGuarantorIncome', query: {...rows, projectId: this.params.projectId, type: 1 } });
    },
    // 删除
    delList(rows) {
      deleteGuaranteeIncome({
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
    this.isView = this.params.isView == 0;
    this.loadData();
  }
};
</script>
