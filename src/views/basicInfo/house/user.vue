<template>
  <ViewPage>
    <Card>
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
        <div class="xh-row-col">
          <section>
            <van-cell title="是否有房产:" value="list.isHasHouse == '1'?'有房产':'没有房产'" />
          </section>
          <section>
            <van-cell title="房产所有人:"  value="list.ownerProperty"/>
          </section>
          <section>
            <div class="van-cell">
              <div class="van-cell__title">房产面积(m<sup>2</sup>)：</div>
              <div class="van-cell__value">list.houseArea</div>
            </div>
          </section>
          <section>
            <van-cell title="房产所在地:"  value="list.provCityZon"/>
          </section>
          <section>
            <van-cell title="详细地址:"  value="list.specificAddress"/>
          </section>
          <section>
            <van-cell title="房产性质:"  value="list.houseTypeDesc"/>
          </section>
        </div>
      </div>
    </Card>
  </ViewPage>
</template>

<script>
import Vue from "vue";
import Card from "@/components/card/index";
import ViewPage from '@/layout/components/ViewPage';
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
  },
  components: {
    ViewPage,
    Card
  },
  methods: {
    pathHouse() {
      this.$router.push('/addHouseUser');
    }
  }
}
</script>
