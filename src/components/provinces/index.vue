//省市区组件
<template>
  <div>
    <!-- <van-action-sheet get-container="#app" :close-on-click-overlay="false" v-model="showMap" class="xh-list">
      <div class="xh-list-body">
        <van-area :area-list="areaList" @confirm="confirm" @cancel="cancel" />
      </div>
    </van-action-sheet>-->
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
              <span @click="provinceTab" :style="{ color: isProvince?'#1989fa':''}">{{ province.name }}</span>
              <span v-if="city.name">-</span>
              <span @click="cityTab" :style="{ color: isCity?'#1989fa':''}">{{ city.name }}</span>
              <span v-if="county.name">-</span>
              <span @click="countyTab" :style="{ color: isCounty?'#1989fa':''}">{{ county.name }}</span>
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
                :id="'p'+index"
                @click="provinceChenge(i,index)"
                :style="{ color: i.name == province.name?'#1989fa':'' }"
                v-if="isProvince"
              >{{ i.name }}</div>
              <div
                class="van-ellipsis van-picker-column__item"
                v-for="(i,index) in city_list"
                :key="index"
                :id="'c'+index"
                @click="cityChenge(i,index)"
                :style="{ color: i.name == city.name?'#1989fa':'' }"
                v-if="isCity"
              >{{ i.name }}</div>
              <div
                class="van-ellipsis van-picker-column__item"
                v-for="(i,index) in county_list"
                :key="index"
                :id="'co'+index"
                @click="countyChenge(i,index)"
                :style="{ color: i.name == county.name?'#1989fa':'' }"
                v-if="isCounty"
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
      // areaList: {
      //   province_list: {},
      //   city_list: {},
      //   county_list: {}
      // },
      province: {},
      city: {},
      county: {},
      isProvince: false,
      province_list: [],
      isCity: false,
      city_list: [],
      isCounty: false,
      county_list: [],
      number: 1,
      pr: '',
      ci: '',
      co: '',
    };
  },
  methods: {
    provinceTab() {
      this.isProvince = true;
      this.isCity = false;
      this.isCounty = false;
      this.city = {};
      this.county = {};
      this.activeAbc(this.pr);
    },
    cityTab() {
      this.isProvince = false;
      this.isCity = true;
      this.isCounty = false;
      this.county = {};
      this.activeAbc(this.ci);
    },
    countyTab() {
      this.isProvince = false;
      this.isCity = false;
      this.isCounty = true;
      this.activeAbc(this.co);
    },
    provinceChenge(row,index) {
      this.province = row;
      this.city_list = row.districts;
      this.isProvince = false;
      this.isCity = true;
      this.pr = index;
    },
    cityChenge(row,index) {
      this.city = row;
      this.county_list = row.districts;
      this.isCounty = true;
      this.isCity = false;
      this.ci = index;
    },
    countyChenge(row,index) {
      this.county = row;
      this.co = index;
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
      // mapMethod({}).then(res => {
      //   let json = res.data;
      //   let provincelist = {},
      //     citylist = {},
      //     countrylist = {};
      //   getGroupMap("province", json.province);
      //   getGroupMap("city", json.city);
      //   getGroupMap("country", json.country);
      //   this.areaList.province_list = provincelist;
      //   this.areaList.city_list = citylist;
      //   this.areaList.county_list = countrylist;
      //   function getGroupMap(name, list) {
      //     list.forEach(e => {
      //       switch (name) {
      //         case "province":
      //           provincelist[e.id] = e.name;
      //           break;
      //         case "city":
      //           citylist[e.id] = e.name;
      //           break;
      //         case "country":
      //           countrylist[e.id] = e.name;
      //           break;
      //       }
      //     });
      //   }
      // });
      mapMethodGaoDe({}).then(res => {
        let { data } = res;
        this.province_list = data.districts[0].districts;
        this.isProvince = true;
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
      if(this.city.name) {
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
