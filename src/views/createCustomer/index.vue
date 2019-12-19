<template>
  <ViewPage>
    <div class="xh-create-img">
      <van-row type="flex" justify="space-between" class="xh-create-imgdiv">
        <van-col :span="10" class="xh-creat-imgbox" @click="loadImg">
          <van-icon name="plus" style="margin-top:30px;" />
          <p>身份证正面</p>
        </van-col>
        <van-col :span="10" class="xh-creat-imgbox" @click="loadImg">
          <van-icon name="plus" style="margin-top:30px;" />
          <p>身份证反面</p>
        </van-col>
      </van-row>
    </div>
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
        <van-cell-group :border="false" v-show="params.credit">
          <van-cell
            title="征信对象类型"
            required
            is-link
            :value="returnText('credit_object_type',customerData.creditObjectType)"
            @click="loadType('征信对象类型', 'credit_object_type')"
          />
        </van-cell-group>
        <van-cell-group :border="false">
          <van-cell title="性别" :value="customerData.sex == 1?'男':(customerData.sex == 2?'女':'')" />
        </van-cell-group>
        <van-cell-group :border="false">
          <van-cell title="出生日期" :value="customerData.birthday" />
        </van-cell-group>
        <van-cell-group :border="false">
          <van-cell title="年龄" :value="customerData.age" />
        </van-cell-group>
        <van-cell-group :border="false">
          <van-cell title="民族" required is-link v-model="customerData.nation" @click="showFamily" />
        </van-cell-group>
        <van-cell-group :border="false">
          <van-field
            v-model="customerData.familyAddress"
            required
            clearable
            label="身份证住址"
            input-align="right"
            placeholder="请输入"
            @blur.prevent="()=>{ }"
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
        <van-cell-group :border="false">
          <van-field
            v-model="customerData.contactPhone"
            required
            clearable
            label="手机号码"
            input-align="right"
            placeholder="请输入"
            @blur.prevent="()=>{ }"
          />
        </van-cell-group>
      </div>
    </card>
    <div class="xh-notice">*识别信息可能存在误差，请仔细核对后再保存</div>
    <!-- 提交按钮 -->
    <div class="xh-submit" style="padding: 20px 10px;">
      <van-button size="large" class="xh-bg-main" @click="submit" :loading="loading">保 存</van-button>
    </div>
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
    <!-- <MapSheet :showMap.sync="show3" @getProvince="getProvince"></MapSheet> -->
    <!-- 图片选择方式 -->
    <van-action-sheet v-model="show3" :actions="actions" @select="onSelect" />
    <!-- 弹出选项 -->
    <van-action-sheet get-container="#app" v-model="show4" class="xh-list">
      <div class="xh-list-body">
        <van-picker
          :columns="options"
          show-toolbar
          :value-key="valueKey"
          :title="selectName"
          @confirm="confirm"
          @cancel="cancel"
        />
      </div>
    </van-action-sheet>
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
import { callBridge, registerBridge } from "@/utils/bridge";
import { getSex, getBirth, getAge } from "@/utils/customer";
import { getDic, submitCreate } from "@/api/createCustomer";
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
      show3: false,
      show4: false,
      actions: [
        { name: "相机扫描识别", value: "scan" },
        { name: "相册导入识别", value: "album" }
      ],
      title1: "",
      currentDate: new Date(),
      //   minDate: new Date(1949, 01, 01),
      //   maxDate: new Date(2099, 12, 31)
      timeType: "", //区分打开时间弹框标识
      familyList: [], //民族数组
      loading: false
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
      this.customerData.nationName = label;
      this.customerData.nation = id;
      this.show2 = false;
    },
    //通过身份证查性别和出生年月、年龄
    getIdcard(e) {
      this.customerData.sex = getSex(e.target.value);
      this.customerData.birthday = getBirth(e.target.value);
      this.customerData.age = getAge(e.target.value);
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
    //上拉菜单选择
    loadType(title, field) {
      this.selectName = title;
      this.isWordbook = false;
      this.fieldName = field;
      switch (title) {
        case "缴费方式":
          this.options = this.dicList.pay_method;
          this.show3 = true;
          break;
        default:
          break;
      }
    },
    //保存信息
    submit() {
      if (this.params.credit) {
        //征信新增客户，直接返回上一页
        this.$store.dispatch('credit/setCustomerData', {
          data: this.customerData, index: this.$route.query.index
        })
        this.$router.go(-1)
      } else {
        //新建客户，走接口
        this.loading = true;
        console.log(this.customerData);
        submitCreate(this.customerData).then(res => {
          this.loading = false;
          this.$notify({
            type: "success",
            message: "保存成功"
          });
        });
      }
    },
    //点击上传身份证图片
    loadImg() {
      this.show3 = true;
    },
    onSelect(e) {
      console.log(e);
      callBridge("idCardOCR", { type: e.value }, data => {
        console.log(data);
      });
      this.show3 = false;
    },
    loadData() {
      for (let key in this.customerData) {
        if (this.customerData.hasOwnProperty(key)) {
          this.customerData[key] =
            this.$route.query[key] || this.customerData[key];
        }
      }
    }
  },
  mounted() {
    this.getFamilyDic();
    this.params = this.$route.query;
    if (this.$router.query.credit) {
      //从征信里进入
      this.loadData();
    } else {
      //新建客户
    }
  }
};
</script>
<style>
.xh-create-img {
  margin: 15px;
}
.xh-create-imgdiv {
  padding: 10px;
  background: #eee;
}
.xh-creat-imgbox {
  display: inline-block;
  border: 1px dashed #999;
  height: 100px;
  text-align: center;
}
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
.xh-notice {
  color: #c4252a;
  padding: 0 20px;
}
</style>