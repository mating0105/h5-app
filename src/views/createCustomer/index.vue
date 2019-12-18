<template>
  <ViewPage>
    <div></div>
    <card>
      <template slot="header">客户信息</template>
      <div>
        <van-cell-group :border="false">
          <van-field
            v-model="customerData.customerName"
            required
            clearable
            label="客户姓名"
            input-align="right"
            placeholder="请输入"
            @blur.prevent="()=>{ }"
          />
        </van-cell-group>
        <van-cell-group :border="false">
          <van-field
            v-model="customerData.certificateNum"
            required
            clearable
            label="身份证号码"
            input-align="right"
            placeholder="请输入"
            @blur.click="getIdcard"
            @blur.prevent="()=>{ }"
          />
        </van-cell-group>
        <van-cell-group :border="false">
          <van-cell title="性别" :value="customerData.sex" />
        </van-cell-group>
        <van-cell-group :border="false">
          <van-cell title="出生日期" :value="customerData.birthday" />
        </van-cell-group>
        <van-cell-group :border="false">
          <van-cell title="民族" required is-link v-model="customerData.nation" @click="showFamily" />
        </van-cell-group>
        <van-cell-group :border="false">
          <van-cell
            title="身份证住址"
            required
            is-link
            v-model="customerData.familyAddress"
            @click="showMapMethod"
          />
        </van-cell-group>
        <van-cell-group :border="false">
          <van-field
            v-model="customerData.signOrg"
            required
            clearable
            label="身份证签发机关"
            input-align="right"
            placeholder="请输入"
            @blur.prevent="()=>{ }"
          />
        </van-cell-group>
        <van-cell-group :border="false">
          <van-cell
            title="请选择起始日："
            required
            is-link
            v-model="customerData.startDate"
            @click="showTime('jrnlDateStart')"
          />
        </van-cell-group>
        <van-cell-group :border="false">
          <van-cell
            title="请选择截止日"
            required
            is-link
            v-model="customerData.endDate"
            @click="showTime('jrnlDateEnd')"
          />
        </van-cell-group>
      </div>
    </card>

    <!-- 时间选择器 -->
    <van-action-sheet get-container="#app" v-model="show1" class="xh-list">
      <van-datetime-picker
        :title="title1"
        type="date"
        :formatter="formatter"
        v-model="currentDate"
        @confirm="confirmTime"
        @cancel="cancelTime"
      />
    </van-action-sheet>
    <!-- 民族选择 -->
    <van-action-sheet get-container="#app" v-model="show2" class="xh-list">
      <van-row class="xh-customer-family">
        <van-col span="6" class="xh-customer-f" v-for="(item,index) in familyList" :key="index">
          <span @click="getFamily(item.id,item.label)">{{item.label}}</span>
        </van-col>
      </van-row>
    </van-action-sheet>
    <!-- 地图弹框 -->
      <MapSheet :showMap.sync="show3" @getProvince="getProvince"></MapSheet>
  </ViewPage>
</template>
<script>
import Vue from "vue";
import {
  Button,
  Row,
  Col,
  Cell,
  Field,
  CellGroup,
  DatetimePicker,
  ActionSheet
} from "vant";
import ViewPage from "@/layout/components/ViewPage";
import MapSheet from "@/components/provinces/index";
import card from "@/components/card/index";
import { format } from "@/utils/format";
import { getSex, getBirth } from "@/utils/customer";
import { getDic } from "@/api/createCustomer";
import { get } from "http";
const Components = [
  Button,
  Row,
  Col,
  Cell,
  Field,
  CellGroup,
  DatetimePicker,
  ActionSheet
];
Components.forEach(item => {
  Vue.use(item);
});
export default {
  components: {
    ViewPage,
    card,
    MapSheet
  },
  data() {
    return {
      customerData: {
        sex: "",
        birthday: ""
      },
      show1: false,
      show2: false,
      title1: "",
      show3:false,
      currentDate: new Date(),
      //   minDate: new Date(1949, 01, 01),
      //   maxDate: new Date(2099, 12, 31)
      timeType: "", //区分打开时间弹框标识
      familyList: [] //民族数组
    };
  },
  methods: {
    formatter(type, value) {
      if (type == "year") {
        return `${value}年`;
      } else if (type == "month") {
        return `${value}月`;
      } else if (type == "day") {
        return `${value}日`;
      }
    },
    //弹出时间选择
    showTime(type) {
      this.timeType = type;
      switch (type) {
        case "jrnlDateStart":
          this.show1 = true;
          this.title1 = "请选择起始日";
          this.currentDate = this.customerData.startDate
            ? new Date(this.customerData.startDate)
            : new Date();
          break;
        case "jrnlDateEnd":
          this.show1 = true;
          this.title1 = "请选择截止日";
          this.currentDate = this.customerData.endDate
            ? new Date(this.customerData.endDate)
            : new Date();
          break;
      }
    },
    //确认时间选择
    confirmTime(value) {
      var time = format(value, "yyyy-MM-dd");
      switch (this.timeType) {
        case "jrnlDateStart":
          this.customerData.startDate = time;
          break;
        case "jrnlDateEnd":
          this.customerData.endDate = time;
          break;
      }
      this.show1 = false;
    },
    //取消时间选择
    cancelTime() {
      this.show1 = false;
    },
    //选择民族
    showFamily() {
      this.show2 = true;
    },
    getFamily(id, label) {
      console.log(id, label);
      this.customerData.nation = label;
      this.show2 = false;
    },
    //通过身份证查性别和出生年月
    getIdcard(e) {
      let sex = getSex(e.target.value);
      let birth = getBirth(e.target.value);
      this.customerData.sex = sex;
      this.customerData.birthday = birth;
    },
    //获取民族
    getFamilyDic() {
      let arr = [
        "FAMOUS_RACE" //民族
      ];
      getDic(arr).then(res => {
        if (res.code == 200) {
          this.familyList = res.data.FAMOUS_RACE;
        }
      });
    },
    showMapMethod() {
      this.show3 = true;
    },
    getProvince(code,name){
      this.show3 = false;
    }
  },
  mounted() {
    this.getFamilyDic();
  }
};
</script>
<style>
.xh-customer-family {
  padding: 10px 20px;
}
.xh-customer-f {
  margin: 5px 0;
}
.xh-customer-f span {
  display: inline-block;
  border: 1px solid #ddd;
  text-align: center;
  padding: 10px 0;
  width: 90%;
}
</style>