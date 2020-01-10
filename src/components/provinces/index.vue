//省市区组件
<template>
  <div>
    <van-popup
      get-container="#app"
      round
      position="bottom"
      v-model="showMap"
    >
      <div class="van-picker xh-address">
        <div class="van-hairline--top-bottom van-picker__toolbar xh-address-header">
          <div style="width: 100%;">
            <div class="xh-opt">
              <span @click="cancel">取消</span>
              <span @click="onConfirm">确定</span>
            </div>
            <div class="xh-text-address">
              <span @click="textTab('province')" :style="{ color: isColor.province?'#1989fa':''}">
                <span v-if="province.name">{{ province.name }}</span>
                <span style="color: #ee0a24;" v-else-if="province_list.length > 0 && !province.name">请选择</span>
              </span>
              <span v-if="city.name">-</span>
              <span @click="textTab('city')" :style="{ color: isColor.city?'#1989fa':''}">
                <span v-if="city.name">{{ city.name }}</span>
                <span style="color: #ee0a24;" v-else-if="city_list.length > 0 && !city.name"> - 请选择</span>
              </span>
              <span v-if="county.name">-</span>
              <span @click="textTab('county')" :style="{ color: isColor.county?'#1989fa':''}">
                <span v-if="county.name">{{ county.name }}</span>
                <span style="color: #ee0a24;" v-else-if="county_list.length > 0 && !county.name"> - 请选择</span>
              </span>
            </div>
          </div>
        </div>
        <div class="van-picker__columns xh-address-body">
          <div class="van-picker-column">
            <div
              class="van-picker-column__wrapper"
              style="transform: translate3d(0px, 0px, 0px); transition-duration: 0ms; transition-property: none; line-height: 44px;"
            >
              <div
                class="van-ellipsis van-picker-column__item"
                v-for="(i,index) in province_list"
                :key="index"
                :id="'province'+index"
                @click="provinceChenge(i,index)"
                :style="{ color: i.name == province.name?'#1989fa':'' }"
                v-if="isColor.province"
              >{{ i.name }}</div>
              <div
                class="van-ellipsis van-picker-column__item"
                v-for="(i,index) in city_list"
                :key="index"
                :id="'city'+index"
                @click="cityChenge(i,index)"
                :style="{ color: i.name == city.name?'#1989fa':'' }"
                v-if="isColor.city"
              >{{ i.name }}</div>
              <div
                class="van-ellipsis van-picker-column__item"
                v-for="(i,index) in county_list"
                :key="index"
                :id="'county'+index"
                @click="countyChenge(i,index)"
                :style="{ color: i.name == county.name?'#1989fa':'' }"
                v-if="isColor.county"
              >{{ i.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import Vue from "vue";
import { Area, ActionSheet, IndexBar, IndexAnchor, Popup, Picker } from "vant";
import { mapMethod, mapMethodGaoDe } from "@/api/map";
const Components = [Area, ActionSheet, IndexBar, IndexAnchor, Popup, Picker];
Components.forEach(item => {
  Vue.use(item);
});
export default {
  name: "mapSheet",
  props: {
    showMap: Boolean,
    manualClose: Boolean //是否在点击遮罩层后关闭
  },
  data() {
    return {
      // 获取的值 对象
      province: {},
      city: {},
      county: {},
      // 是否显示
      isColor: {
        province: false,
        city: false,
        county: false,
      },
      // 省市区集合
      province_list: [],
      city_list: [],
      county_list: [],
      // 当前定点
      point: {
        province: '',
        city: '',
        county: '',
      }
    };
  },
  methods: {
    textTab(val) {
      this.showColor(val);
      this.activeAbc(this.point[val]);
    },
    showColor(val) {
      for(var i in this.isColor) {
        if(i == val) {
          this.isColor[i] = true;
        } else {
          this.isColor[i] = false;
        }
      }
    },
    provinceChenge(row,index) {
      this.province = row;
      this.city_list = row.districts;
      this.county_list = [];
      this.showColor('city');
      this.city = {};
      this.county = {};
      this.point.province = 'province'+ index;
    },
    cityChenge(row,index) {
      this.city = row;
      this.county_list = row.districts;
      this.showColor('county');
      this.county = {};
      this.point.city = 'city'+index;
    },
    countyChenge(row,index) {
      this.county = row;
      this.point.county = 'county'+index;
    },
    activeAbc(ids) {
      // 找到锚点
      let anchorElement = document.getElementById(ids);
      // 如果对应id的锚点存在，就跳转到锚点
      if (anchorElement) {
        anchorElement.scrollIntoView();
      }
    },
    getMap() {
      mapMethodGaoDe({}).then(res => {
        let { data } = res;
        this.province_list = data.districts[0].districts;
        this.showColor('province');
      });
    },
    cancel() {
      this.$emit("update:showMap", false);
    },
    onConfirm() {
      let code = [], name = [], list = [];
      if(this.province.name) {
        list = [this.province];
      } else {
        return
      }
      if(this.city.name) {
        list = [this.province, this.city];
      }
      if(this.county.name) {
        list = [this.province, this.city, this.county];
      }
      list.forEach(t => {
        code.push(t.adcode);
        name.push(t.name);
      });
      this.$emit("getProvince", code.join("-"), name.join("-"), list);
    }
  },
  mounted() {
    this.getMap();
  }
};
</script>

<style lang="scss">
.xh-address {
  overflow: auto;
  height: 300px;
  .xh-address-header {
    width: 100%;
    background-color: #fff;
    position: fixed;
    z-index: 100;
    height: 80px;
    .xh-opt {
      width: 100%;
      height: 40px;
      display: flex;
      padding: 0 10px;
      justify-content: space-between;
      border-bottom: 1px solid #f7f8fa;
      span {
        color: #1989fa;
      }
    }
    .xh-text-address {
      text-align: center;
      overflow-x: auto;
      box-sizing: border-box;
      word-break: break-all;
      white-space: nowrap;
      span {
        font-size: 18px;
      }
    }
  }
  .xh-address-body {
    padding-top: 80px;
  }
}
.xh-main-b {
  color: #1989fa;
}
</style>
