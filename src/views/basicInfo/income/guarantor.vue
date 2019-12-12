<template>
  <ViewPage>
    <Card>
      <template v-slot:header>
        <section class="xh-plus">
          <van-cell title="家庭收入">
            <van-icon
              slot="right-icon"
              name="plus"
              style="line-height: inherit;"
            />
          </van-cell>
        </section>
      </template>
    </Card>
  </ViewPage>
</template>

<script>
import Vue from "vue";
// 自定义组件
import Card from "@/components/card/index";
import ViewPage from "@/layout/components/ViewPage";
// 其他组件
import {
  Row,
  Col,
  Icon,
  Cell
} from "vant";
const Components = [
  Row,
  Col,
  Icon,
  Cell
];
Components.forEach(item => {
  Vue.use(item);
});
export default {
  data() {
    return {}
  }
}
</script>
