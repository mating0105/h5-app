<!--
 * @Description: 重权管理 - 基本信息
 * @Author: shenah
 * @Date: 2019-12-18 16:07:43
 * @LastEditors  : shenah
 * @LastEditTime : 2019-12-18 16:08:00
 -->

<template>
  <div class="basic">
    <Card
      :bodyPadding="true"
      class="xh-top-10"
    >
      <template v-slot:header>
        <section class="xh-plus">
          <van-cell>
            <span>客户信息</span>
          </van-cell>
        </section>
      </template>
      <!-- 基本信息 -->
      <van-row>
        <van-col span="24">
          <van-cell
            :value="details.customerName"
            class="info"
            title="客户姓名:"
          />
        </van-col>
        <van-col span="24">
          <van-cell
            :value="details.certificateNum"
            class="info"
            title="证件号码:"
          />
        </van-col>
        <van-col span="24">
          <van-cell
            :value="details.contactPhone"
            class="info"
            title="手机号码:"
          />
        </van-col>
        <van-col span="24">
          <van-cell
            :value="details.customerName"
            class="info"
            title="征信对象类型"
          />
        </van-col>
        <van-col span="24">
          <van-cell
            :value="details.customerName"
            class="info"
            title="银行:"
          />
        </van-col>
        <van-col span="24">
          <van-cell
            :value="details.loanAmt"
            class="info"
            title="意向贷款金额(元):"
          />
        </van-col>
      </van-row>
    </Card>
    <Card
      :bodyPadding="true"
      class="xh-top-10"
    >
      <template v-slot:header>
        <section class="xh-plus">
          <van-cell>
            <span>车辆信息</span>
          </van-cell>
        </section>
      </template>
      <van-row>
        <van-col span="24">
          <van-cell
            :value="details.carNature | codeInToName(wordbook.car_nature)"
            class="info"
            title="车辆性质:"
          />
        </van-col>
        <van-col span="24">
          <van-cell
            :value="details.carFrameNum"
            class="info"
            title="车架号:"
          />
        </van-col>
        <van-col span="24">
          <van-cell
            :value="details.automarke"
            class="info"
            title="车辆品牌:"
          />
        </van-col>
        <van-col span="24">
          <van-cell
            :value="details.customerName"
            class="info"
            title="车系"
          />
        </van-col>
        <van-col span="24">
          <van-cell
            :value="details.customerName"
            class="info"
            title="车辆型号"
          />
        </van-col>
        <van-col span="24">
          <van-cell
            :value="details.loanAmt"
            class="info"
            title="评估价:"
          />
        </van-col>
        <van-col span="24">
          <van-cell
            :value="details.loanAmt"
            class="info"
            title="实际开票价(元):"
          />
        </van-col>
        <van-col span="24">
          <van-cell
            :value="details.loanAmt"
            class="info"
            title="车牌号:"
          />
        </van-col>
        <van-col span="24">
          <van-cell
            :value="details.loanAmt"
            class="info"
            title="发动机号:"
          />
        </van-col>
        <van-col span="24">
          <van-cell
            :value="details.loanAmt"
            class="info"
            title="保险到期日:"
          />
        </van-col>
      </van-row>
    </Card>
  </div>
</template>

<script>
import Vue from "vue";
import { queryRightSuppleDetails } from "@/api/heavyRightSupplement";
// 自定义组件
import ViewPage from "@/layout/components/ViewPage";
import Card from "@/components/card/index";
// 其他组件
import { Tab, Tabs, Row, Col, Icon, Cell, Button, List } from "vant";
const Components = [Row, Col, Icon, Cell, Button, List, Tab, Tabs];

Components.forEach(item => {
  Vue.use(item);
});
import { mapState } from "vuex";
import { log } from "util";
export default {
  name: "basic",
  components: { Card },
  computed: {
    ...mapState({
      wordbook: state => state.user.wordbook
    }),
    id() {
      return this.$route.params.id;
    }
  },
  data() {
    return {
      details: {}
    };
  },
  props: {},
  mounted() {
    this.queryDetails();
  },
  methods: {
    // 查询补录的详情
    queryDetails() {
      queryRightSuppleDetails({
        projectId: this.id
      }).then(res => {
        const { code, data, msg } = res;
        if (code == 200) {
          this.details = data;
        } else {
          this.$notify({ type: "danger", message: msg });
          this.loading = false;
        }
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.basic {
  .xh-plus {
    span {
      color: rgb(196, 37, 42);
    }
  }
  .info {
    padding: 0 0 4px 0;
  }
}
</style>