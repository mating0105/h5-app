<template>
  <div>
    <div>

    </div>
    <!-- 弹出选项 -->
    <van-actionsheet v-model="show3" class="xh-list">
      <div class="xh-list-body">
        <van-picker :columns="actions" show-toolbar :title="selectName" @confirm="onSelect" @cancel="cancel"
          @change="onChange" />
      </div>
    </van-actionsheet>
    <!-- 弹出省市区 -->
    <van-actionsheet v-model="show2" title="" class="xh-list">
      <div class="xh-list-body">
        <van-area :area-list="areaList" :value="projProjectInfo.wbtProvCityZonCode" @confirm="confirmSelect"
          @cancel="cancelSelect" />
      </div>
    </van-actionsheet>
  </div>  
</template>

<script>
import Vue from "vue";
import { Dialog, Button, Row, Col, ActionSheet, Area } from "vant";
const Components = [Dialog, Button, Row, Col, ActionSheet, Area];

Components.forEach(item => {
  Vue.use(item);
});

export default {
  data() {
    return {}
  }
}
</script>

