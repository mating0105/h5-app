<template>
  <ViewPage>
    <van-tabs v-model="activeName">
      <van-tab title="费用信息" name="cost">
        <div class="xh-pay-content">
          <redCard label="客户基本信息">
            <template slot="cardBody">
              <div>
                <div class="xh-pay-div">客户姓名及编号：xxxxxxxx</div>
                <div class="xh-pay-div">证件号码：8383930282894748</div>
                <div class="xh-pay-div">电话：19980889939</div>
              </div>
            </template>
          </redCard>
          <!-- 步骤条 -->
          <div class="xh-steps">
            <div class="xh-step" v-for="i in list" :key="i.key" @click="stepVhange(i.key)">
              <div class="xh-step-head">
                <div class="zh-step-line">
                  <i class="xh-step-line-inner zh-border-gray"></i>
                </div>
                <div
                  class="xh-step-icon is-text"
                  :class="stepVal == i.key?'xh-step-active':'xh-step-gray'"
                >
                  <div class="zh-step-icon-inner zh-is-status"></div>
                </div>
              </div>
              <div class="xh-step-main">
                <div
                  class="xh-step-title"
                  :class="stepVal == i.key?'xh-step-active':'xh-step-gray'"
                >{{ i.name }}</div>
                <div class="zh-step-description is-success"></div>
              </div>
            </div>
          </div>
          <div v-show="stepVal ==1">
            <card>
              <template slot="header">产品费用</template>
              <van-row>
                <van-cell-group :border="false">
                  <van-cell title="产品名称" :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="产品性质" :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="贷款金额(元)" :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="贷款期数" :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="放款平台" :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="公司利率" :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="客户利率" :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="担保费率" :value="paymentList.name" />
                </van-cell-group>
              </van-row>
            </card>
          </div>
        </div>
      </van-tab>
      <van-tab title="项目信息" name="project">内容 2</van-tab>
    </van-tabs>
  </ViewPage>
</template>
<script>
import Vue from "vue";
import { Button, Row, Col, Tab, Tabs, Cell, CellGroup } from "vant";
import redCard from "@/components/redCard/index";
import card from "@/components/card/index";
import ViewPage from "@/layout/components/ViewPage";
const Components = [Button, Row, Col, Tab, Tabs, Cell, CellGroup];
Components.forEach(item => {
  Vue.use(item);
});
export default {
  components: {
    redCard,
    ViewPage,
    card
  },
  data() {
    return {
      activeName: "cost",
      list: [
        { name: "费用信息", key: 1 },
        { name: "走款信息", key: 2 },
        { name: "上传图片", key: 3 }
      ],
      stepVal: 1,
      paymentList:{},
    };
  },
  methods: {
    stepVhange(val) {
      this.stepVal = val;
    }
  }
};
</script>
<style lang="less">
.xh-pay-content {
  margin: 10px 0;
}
.xh-pay-div {
  margin: 10px 0;
}
.xh-steps {
  display: flex;
  white-space: nowrap;
  justify-content: center;
}
.xh-step {
  position: relative;
  flex-shrink: 1;
  flex-basis: 20%;
}
.xh-step-head {
  position: relative;
  width: 100%;
  text-align: center;
}
.xh-step-line {
  position: absolute;
  border-color: inherit;
  background-color: #c0c4cc;
  margin-right: 0px;
}
.zh-step-title {
  font-size: 12px;
  line-height: 38px;
}
.xh-step-line-inner {
  display: block;
  border-width: 1px;
  border-style: solid;
  transition: 0.15s ease-out;
  box-sizing: border-box;
  height: 0;
  transition-delay: 0;
}
.xh-step-icon {
  position: relative;
  z-index: 1;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1.5rem;
  box-sizing: border-box;
  transition: 0.15s ease-out;
  color: #fff;
}
.xh-step-main {
  white-space: normal;
  text-align: center;
}
.xh-step-active {
  color: rgb(196, 37, 42);
}
.xh-step-gray {
  color: rgb(204, 204, 204);
}
</style>