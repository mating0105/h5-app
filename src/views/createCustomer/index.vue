<template>
  <ViewPage :loading="loading" class="xh-creat">
    <div class="xh-create-img">
      <van-row type="flex" justify="space-between" class="xh-create-imgdiv">
        <van-col :span="10" class="xh-creat-imgbox" @click="loadImg('src')">
          <div v-if="!src">
            <van-icon name="plus" style="margin-top:30px;" />
            <p>身份证正面</p>
          </div>
          <div v-else>
            <img :src="src" alt style="width:100%;" />
          </div>
        </van-col>
        <van-col :span="10" class="xh-creat-imgbox" @click="loadImg('srcBack')">
          <div v-if="!srcBack">
            <van-icon name="plus" style="margin-top:30px;" />
            <p>身份证反面</p>
          </div>
          <div v-else>
            <img :src="srcBack" alt style="width:100%;" />
          </div>
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
            name="customerName"
            input-align="right"
            error-message-align="right"
            placeholder="请输入"
            @blur.prevent="ruleMessge"
            :error-message="errorMsg.customerName"
          />
        </van-cell-group>
        <van-cell-group :border="false">
          <van-field
            v-model="customerData.certificateNum"
            required
            clearable
            name="certificateNum"
            label="身份证号码"
            input-align="right"
            error-message-align="right"
            placeholder="请输入"
            @blur.prevent="ruleMessge"
            :error-message="errorMsg.certificateNum"
          />
        </van-cell-group>
        <van-cell-group :border="false" v-show="params.credit">
          <van-cell
            title="征信对象类型"
            required
            is-link
            :value="returnText('credit_object_type',customerData.creditObjectType)"
            @click="loadType('征信对象类型', 'creditObjectType')"
            label-class="labelClass"
            @blur.prevent="ruleMessge"
            :label="errorMsg.creditObjectType"
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
        <van-cell-group :border="false" v-show="!params.credit">
          <van-cell
            title="民族"
            required
            is-link
            v-model="customerData.nation"
            @click="showFamily"
            label-class="labelClass"
            @blur.prevent="ruleMessge"
            :label="errorMsg.nation"
          />
        </van-cell-group>
        <van-cell-group :border="false">
          <van-field
            v-model="customerData.familyAddress"
            required
            clearable
            name="familyAddress"
            error-message-align="right"
            label="身份证住址"
            input-align="right"
            placeholder="请输入"
            @blur.prevent="ruleMessge"
            :error-message="errorMsg.familyAddress"
          />
        </van-cell-group>
        <van-cell-group :border="false" v-show="!params.credit">
          <van-field
            v-model="customerData.signOrg"
            required
            clearable
            name="signOrg"
            error-message-align="right"
            label="身份证签发机关"
            input-align="right"
            placeholder="请输入"
            @blur.prevent="ruleMessge"
            :error-message="errorMsg.signOrg"
          />
        </van-cell-group>
        <van-cell-group :border="false">
          <van-cell
            title="请选择起始日："
            required
            is-link
            v-model="customerData.startDate"
            @click="showTime('jrnlDateStart')"
            label-class="labelClass"
            @blur.prevent="ruleMessge"
            :label="errorMsg.startDate"
          />
        </van-cell-group>
        <van-cell-group :border="false">
          <van-cell
            title="请选择截止日"
            required
            is-link
            v-model="customerData.endDate == '9999-99-99' ? '长期有效': customerData.endDate"
            @click="showTime('jrnlDateEnd')"
            label-class="labelClass"
            @blur.prevent="ruleMessge"
            :label="errorMsg.endDate"
          />
        </van-cell-group>
        <van-cell-group :border="false">
          <van-field
            v-model="customerData.contactPhone"
            required
            clearable
            name="contactPhone"
            error-message-align="right"
            label="手机号码"
            input-align="right"
            placeholder="请输入"
            @blur.prevent="ruleMessge"
            :error-message="errorMsg.contactPhone"
          />
        </van-cell-group>
      </div>
    </card>
    <div class="xh-notice">*识别信息可能存在误差，请仔细核对后再保存</div>
    <!-- 提交按钮 -->
    <div class="xh-submit" style="padding: 20px 10px;">
      <van-button size="large" class="xh-bg-main" @click="submit">保 存</van-button>
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
        :min-date="minDate"
        :max-date="maxDate"
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
  ActionSheet,
  Picker,
  Toast,
  ImagePreview,
  Dialog
} from "vant";
import ViewPage from "@/layout/components/ViewPage";
import MapSheet from "@/components/provinces/index";
import card from "@/components/card/index";
import { format } from "@/utils/format";
import { uploadsDocument } from "@/api/document";
import { getSex, getBirth, getAge } from "@/utils/customer";
import { getDic, submitCreate } from "@/api/createCustomer";
import { get } from "http";
import { mapState } from "vuex";
import formValidator from "@/mixins/formValidator";
const Components = [
  Button,
  Row,
  Col,
  Cell,
  Field,
  CellGroup,
  DatetimePicker,
  ActionSheet,
  Picker,
  Toast,
  ImagePreview,
  Dialog
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
  mixins: [formValidator],
  data() {
    return {
      customerData: {
        sex: "", //性别
        birthday: "", //出生日期
        customerName: "", //客户姓名
        certificateNum: "", //身份证号码
        age: "", //年龄
        creditObjectType: "", //征信对象类型
        nation: "", //
        familyAddress: "", //身份证住址
        signOrg: "", //身份证签发机关
        startDate: "", //起始日
        endDate: "", //截止日
        contactPhone: "" //手机号码
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
      minDate: new Date(1949, 1, 1),
      maxDate: new Date(2099, 12, 31),
      timeType: "", //区分打开时间弹框标识
      familyList: [], //民族数组
      loading: false,
      params: {},
      options: [],
      valueKey: "label",
      selectName: "",
      valueId: "id", // 下拉选择取的哪个value值
      src:"", //正面图片
      srcBack: "", //背面图片
      errorMsg: {
        customerName: "", //客户姓名
        certificateNum: "", //身份证号
        nation: "", //民族
        familyAddress: "", //身份证住址
        signOrg: "", //身份证签发机关
        startDate: "", //起始日
        endDate: "", //截止日
        contactPhone: "" //手机号
      },
      sign: "" //标识点击正反面照片查看
    };
  },
  computed: {
    // 所有字典
    ...mapState({
      wordbook: state => state.user.wordbook
    })
  },
  watch: {
    "customerData.certificateNum"(e) {
      this.customerData.sex = getSex(e);
      this.customerData.birthday = getBirth(e);
      this.customerData.age = getAge(e);
    }
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
          Dialog.confirm({
            title: "",
            message: "身份证是否长期有效？",
            confirmButtonText:'是',
            cancelButtonText:'否'
          })
            .then(() => {
              this.customerData.endDate = "9999-99-99";
              this.errorMsg.endDate = "";
            })
            .catch(() => {
              this.show1 = true;
              this.title1 = "请选择截止日";
              this.currentDate = this.customerData.endDate
                ? new Date(this.customerData.endDate)
                : new Date();
            });
          break;
      }
    },
    //确认时间选择
    confirmTime(value) {
      var time = format(value, "yyyy-MM-dd");
      switch (this.timeType) {
        case "jrnlDateStart":
          this.customerData.startDate = time;
          this.errorMsg.startDate = "";
          break;
        case "jrnlDateEnd":
          this.customerData.endDate = time;
          this.errorMsg.endDate = "";
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
      this.customerData.nation = label;
      this.show2 = false;
      this.errorMsg.nation = "";
    },
    //通过身份证查性别和出生年月、年龄
    // getIdcard(e) {
    //   this.customerData.sex = getSex(e.target.value);
    //   this.customerData.birthday = getBirth(e.target.value);
    //   this.customerData.age = getAge(e.target.value);
    // },
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
        case "征信对象类型":
          this.options = this.wordbook.credit_object_type;
          this.show4 = true;
          break;
        default:
          break;
      }
    },
    // 字典选择确认
    confirm(row) {
      this.show4 = false;
      this.customerData[this.fieldName] = row.value;
      console.log(this.fieldName);
      this.errorMsg[this.fieldName] = "";
    },
    cancel() {},
    //保存信息
    submit() {
      let num = 0;
      for (let item in this.errorMsg) {
        this.errorMsg[item] = this.returnMsg(item, this.customerData[item]);
        if (this.errorMsg[item]) {
          num++;
        }
      }
      if (num !== 0) {
        return;
      }
      if (this.params.credit) {
        //征信新增客户，直接返回上一页
        if (this.customerData.creditObjectType === "borrower") {
          Toast.fail("不能添加借款人");
          return;
        }
        this.$store.dispatch("credit/setCustomerData", {
          data: this.customerData,
          index: this.$route.query.index
        });
        this.$router.go(-1);
      } else {
        //新建客户，走接口
        if (this.src && this.srcBack) {
        this.loading = true;
        submitCreate(this.customerData)
          .then(res => {
            const params = {
              kind: "1",
              customerNum: res.data.customerNum,
              customerId: res.data.id
            };
            this.uploadImg("0101", params, this.dataURLtoFile(this.src));
            this.uploadImg("0102", params, this.dataURLtoFile(this.srcBack));

          //   this.$notify({
          //     type: "success",
          //     message: "建档成功"
          //   });
          //   this.loading = false;
          //   this.$router.go(-1);
          // })
          // .catch(e => {
          //   this.loading = false;
          });
        } else {
          this.$notify({
            type: "danger",
            message: "请上传身份证正反面"
          });
        }
      }
    },
    uploadImg(val, params, file) {
      params.documentType = val;
      params.file = file;
      uploadsDocument(params)
        .then(res => {
          this.$notify({
            type: "success",
            message: "建档成功"
          });
          this.loading = false;
          this.$router.go(-1);
        })
        .catch(e => {
          this.loading = false;
        });
    },
    //点击上传身份证图片
    loadImg(name) {
      this.sign = name;
      if (this[name]) {
        this.actions = [
          { name: "相机扫描识别", value: "scan" },
          { name: "相册导入识别", value: "album" },
          { name: "查看", value: "see" }
        ];
      } else {
        this.actions = [
          { name: "相机扫描识别", value: "scan" },
          { name: "相册导入识别", value: "album" }
        ];
      }
      this.show3 = true;
    },
    newData(val) {
      let d = val.split(".");
      let a = d.join("-");
      return a;
    },
    //选择获取图片方式
    onSelect(e) {
      if (e.value == "see") {
        if (this.sign == "src") {
          ImagePreview([this.src]);
        } else {
          ImagePreview([this.srcBack]);
        }
      } else {
        this.$bridge.callHandler("idCardOCR", e.value, data => {
          if (data.ID_TYPE == "正面") {
            this.$set(this.customerData, "customerName", data.ID_NAME);
            this.$set(this.customerData, "certificateNum", data.ID_NUM);
            this.$set(this.customerData, "familyAddress", data.ID_ADDRESS);
            this.$set(this.customerData, "nation", data.ID_FOLK);
            if (data.ID_SEX == "女") {
              this.$set(this.customerData, "sex", "2");
            } else if (data.ID_SEX == "男") {
              this.$set(this.customerData, "sex", "1");
            }
            this.src = "data:image/jpg;base64," + data.FRONT_IMG;
          } else if (data.ID_TYPE == "背面") {
            this.$set(this.customerData, "signOrg", data.ID_ISSUE);
            if (data.ID_VALID.indexOf("-") != -1) {
              this.$set(
                this.customerData,
                "startDate",
                this.newData(data.ID_VALID.split("-")[0])
              );
              if (data.ID_VALID.split("-")[1] == "长期") {
                this.$set(this.customerData, "endDate", "9999-12-30");
              } else {
                this.$set(
                  this.customerData,
                  "endDate",
                  this.newData(data.ID_VALID.split("-")[1])
                );
              }
            }
            this.srcBack = "data:image/jpg;base64," + data.BACK_IMG;
          }
        }); //原生直接调用
      }
      this.show3 = false;
    },
    // 字典转换
    returnText(n, val) {
      let name;
      this.wordbook[n].forEach(e => {
        if (e.value == val) {
          name = e.label;
        }
      });
      return name;
    },
    //获取信息
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
    this.rulesForm("cs-personal-xh");
    if (this.params.credit) {
      //从征信里进入
      this.loadData();
      this.errorMsg = {
        customerName: "", //客户姓名
        certificateNum: "", //身份证号
        familyAddress: "", //身份证住址
        startDate: "", //起始日
        endDate: "", //截止日
        contactPhone: "", //手机号
        creditObjectType: "" //征信对象类型
      };
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
  overflow: hidden;
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
.xh-creat .labelClass {
  left: calc(100% + 1.33333rem);
}
</style>
