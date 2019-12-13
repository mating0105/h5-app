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
          <div class="xh-steps xh-steps-horizontal xh-step-center">
            <div
              class="xh-step is-horizontal"
              v-for="i in list"
              :key="i.key"
              @click="stepVhange(i.key)"
            >
              <div class="xh-step-head">
                <div class="xh-step-line">
                  <i class="xh-step-line-inner xh-border-gray"></i>
                </div>
                <div
                  class="xh-step-icon is-text"
                  :class="stepVal == i.key?'xh-bg-active':'xh-bg-gray'"
                >
                  <div class="xh-step-icon-inner xh-is-status"></div>
                </div>
              </div>
              <div class="xh-step-main">
                <div
                  class="xh-step-title"
                  :class="stepVal == i.key?'xh-step-active':'xh-step-gray'"
                >{{ i.name }}</div>
                <div class="xh-step-description"></div>
              </div>
            </div>
          </div>
          <div v-show="stepVal ==1">
            <card>
              <template slot="header">产品费用</template>
              <van-row>
                <van-cell-group :border="false">
                  <van-cell title="产品名称" required is-link :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="产品性质" required is-link :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="贷款金额(元)" required is-link :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="贷款期数" required is-link :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="放款平台" required is-link :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="公司利率" required is-link :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="客户利率" required is-link :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="担保费率" required is-link :value="paymentList.name" />
                </van-cell-group>
              </van-row>
            </card>
            <card style="margin-top:10px;">
              <template slot="header">其他费用</template>
              <van-row>
                <van-cell-group :border="false">
                  <van-cell title="担保费(元)" required is-link :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="评估费(元)" required is-link :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="调查费(元)" required is-link :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="GPS费(元)" required is-link :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="综合服务费(元)" required is-link :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="公证费(元)" required is-link :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="异地上户费(元)" required is-link :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="上户保证金(元)" required is-link :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="履约保证金(元)" required is-link :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="实收车商(元)" required is-link :value="paymentList.name" />
                </van-cell-group>
              </van-row>
            </card>
            <card style="margin-top:10px;">
              <template slot="header">缴费明细</template>
              <van-row>
                <van-cell-group :border="false">
                  <van-cell title="费用合计" required is-link :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="打折金额(元)" required is-link :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="实收金额(元)" required is-link :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="缴费时间" required is-link :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="缴费方式" required is-link :value="paymentList.name" />
                </van-cell-group>
              </van-row>
            </card>
            <div class="xh-submit">
              <van-button size="large" class="xh-bg-main" @click="submit" :loading="loading">保 存</van-button>
            </div>
          </div>
          <div v-show="stepVal ==2">
            <card>
              <template slot="header">走款信息</template>
              <van-row>
                <van-cell-group :border="false">
                  <van-cell title="银行贷款金额" required is-link :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="送审金额(元)" required is-link :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="应走款金额(元)" required is-link :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="走款模式" required is-link :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="走款时间" required is-link :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="银行账号" required is-link :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="开户银行" required is-link :value="paymentList.name" />
                </van-cell-group>
                <van-cell-group :border="false">
                  <van-cell title="账户名" required is-link :value="paymentList.name" />
                </van-cell-group>
              </van-row>
            </card>
            <div class="xh-submit">
              <van-button size="large" class="xh-bg-main" @click="submit" :loading="loading">保 存</van-button>
            </div>
          </div>
          <div v-show="stepVal ==3">
            <card>
              <template slot="header">走款资料</template>
            </card>
          </div>
        </div>
      </van-tab>
      <van-tab title="项目信息" name="project">
        <ProjectInfo></ProjectInfo>
      </van-tab>
    </van-tabs>
  </ViewPage>
</template>
<script>
import Vue from "vue";
import { Button, Row, Col, Tab, Tabs, Cell, CellGroup } from "vant";
import redCard from "@/components/redCard/index";
import card from "@/components/card/index";
import ViewPage from "@/layout/components/ViewPage";
import ProjectInfo from "@/views/basicInfo/projectInfo/index";
const Components = [Button, Row, Col, Tab, Tabs, Cell, CellGroup];
Components.forEach(item => {
  Vue.use(item);
});
export default {
  components: {
    redCard,
    ViewPage,
    card,
    ProjectInfo
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
      paymentList: {}
    };
  },
  methods: {
    stepVhange(val) {
      this.stepVal = val;
    }
  }
};
</script>
<style>
.xh-pay-content {
  margin: 10px 0;
}
.xh-pay-div {
  margin: 10px 0;
}
.xh-steps {
  display: flex;
  margin-top:10px;
}
.xh-steps-horizontal {
  white-space: nowrap;
}
.xh-step.xh-horizontal {
  display: inline-block;
}
.xh-step {
  position: relative;
  flex-shrink: 1;
  flex-basis: 20%;
}
.xh-step.is-horizontal .xh-step-line {
  height: 2px;
  top: 13px;
  left: -50%;
  right: 50%;
}
.xh-step.is-horizontal:first-child .xh-step-line {
  left: 50%;
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
.xh-step-line-inner {
  display: block;
  border-width: 1px;
  border-style: solid;
  transition: 0.15s ease-out;
  box-sizing: border-box;
  height: 0;
  transition-delay: 0ms;
  width: 100%;
  color:#c0c4cc;
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
.xh-step-icon.is-text {
  border-radius: 50%;
}
.xh-step-icon-inner {
  display: inline-block;
  user-select: none;
  text-align: center;
  line-height: 1;
  color: inherit;
}
.xh-step-main {
  white-space: normal;
  text-align: center;
}
.xh-step-title {
  font-size: 12px;
  line-height: 38px;
}
.xh-step-center {
  justify-content: center;
}
.xh-step-active {
  color: rgb(196, 37, 42);
}
.xh-step-gray {
  color: rgb(204, 204, 204);
}
.xh-bg-active {
  background: rgb(196, 37, 42);
}
.xh-bg-gray {
  color: rgb(204, 204, 204);
}
</style>
