<template>
  <ViewPage>
    <div class="xh-card-box xh-radius">
      <div>
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
  </ViewPage>
</template>

<script>
import Vue from "vue";
import ViewPage from '@/layout/components/ViewPage';
import {
  Cell, Row, Col
} from "vant";

Vue.use(Cell).use(Row).use(Col);
export default {
  data() {
    return {}
  },
  components: {
    ViewPage
  }
}
</script>
