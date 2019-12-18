//省市区组件
<template>
  <div>
    <van-action-sheet get-container="#app" v-model="showMap" class="xh-list">
      <div class="xh-list-body">
        <van-area :area-list="areaList" @confirm="confirm" @cancel="cancel" />
      </div>
    </van-action-sheet>
  </div>
</template>
<script>
import Vue from "vue";
import { Area, ActionSheet } from "vant";
import { mapMethod } from "@/api/map";
const Components = [Area, ActionSheet];
Components.forEach(item => {
  Vue.use(item);
});
export default {
  name: "mapSheet",
  props: {
    showMap: Boolean
  },
  data() {
    return {
      areaList: {
        province_list: {},
        city_list: {},
        county_list: {}
      }
    };
  },
  methods: {
    getMap() {
      mapMethod({}).then(res => {
        let json = res.data;
        let provincelist = {},
          citylist = {},
          countrylist = {};
        getGroupMap("province", json.province);
        getGroupMap("city", json.city);
        getGroupMap("country", json.country);
        this.areaList.province_list = provincelist;
        this.areaList.city_list = citylist;
        this.areaList.county_list = countrylist;
        function getGroupMap(name, list) {
          list.forEach(e => {
            switch (name) {
              case "province":
                provincelist[e.id] = e.name;
                break;
              case "city":
                citylist[e.id] = e.name;
                break;
              case "country":
                countrylist[e.id] = e.name;
                break;
            }
          });
        }
      });
    },
    confirm(value) {
      let code = [],name =[];
      value.forEach(e =>{
          code.push(e.code);
          name.push(e.name);
      })
      this.$emit("getProvince", code.join('-'),name.join('-'));
    },
    cancel() {
      this.$emit("update:showMap", false);
    }
  },
  mounted() {
    this.getMap();
  }
};
</script>