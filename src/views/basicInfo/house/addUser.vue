<template>
  <ViewPage>
    <div class="xh-page-body">
      <van-row class="xh-card-box xh-radius">
        <section>
          <van-cell
            name="isHasHouse"
            title="是否有房产："
            required
            :is-link="isView == 0"
            :value="formData.isHasHouseDesc"
            @click.native="isView == 1?'':loadList('是否有房产')"
            @blur.prevent="ruleMessge"
          />
        </section>
        <div v-if="formData.isHasHouse == '1' || formData.isHasHouse == '' ">
          <section>
            <van-field
              name="ownerProperty"
              v-model="formData.ownerProperty"
              :disabled="isView == 1"
              required
              label="产权所有人："
              input-align="right"
              label-width="100px"
              placeholder="请输入产权所有人"
              @blur.prevent="ruleMessge"
              :error-message="errorMsg.ownerProperty"
            />
          </section>
          <section>
            <van-cell
              name="houseType"
              title="房产性质："
              required
              :is-link="isView == 0"
              :value="formData.houseTypeDesc"
              @click.native="isView == 1?'':loadList('房产性质')"
            />
          </section>
          <section>
            <van-cell
              name="houseZon"
              title="房产区域："
              required
              :is-link="isView == 0"
              :value="formData.houseZonDesc"
              @click.native="isView == 1?'':loadList('房产区域')"
            />
          </section>

          <section>
            <van-cell
              name="provCityZon"
              title="房产所在地："
              required
              :is-link="isView == 0"
              :value="formData.provCityZon"
              @click.native="isView == 1?'':loadList('房产所在地')"
            />
          </section>
          <section>
            <van-field
              name="specificAddress"
              v-model="formData.specificAddress"
              required
              :disabled="isView == 1"
              label="详细地址："
              input-align="right"
              placeholder="请输入详细地址"
              @blur.prevent="ruleMessge"
              :error-message="errorMsg.specificAddress"
            />
          </section>
          <section>
            <van-field
              name="houseArea"
              v-model="formData.houseArea"
              required
              :disabled="isView == 1"
              label="房产面积(m²)："
              input-align="right"
              placeholder="请输入房产面积"
              @blur.prevent="ruleMessge"
              :error-message="errorMsg.houseArea"
            />
          </section>
        </div>

        <!-- 下拉选择器 -->
        <van-action-sheet v-model="selectShow" class="xh-list">
          <van-picker
            show-toolbar
            :title="pickerTitle"
            :columns="columns"
            :value-key="'label'"
            @cancel="onCancel"
            @confirm="onConfirm"
          />
        </van-action-sheet>

        <!-- 弹出省市区 -->
        <Provinces :showMap.sync="addressShow" @getProvince="addressOnConfirm"></Provinces>
      </van-row>
      <!-- 保 存按钮 -->
      <div class="xh-submit">
        <van-button
          size="large"
          class="xh-bg-main"
          :class="[subDisabled ? 'buttonNoColor' : 'buttonColor']"
          :loading="subLoading"
          :disabled="subDisabled"
          @click.native="custSubmit"
        >保 存</van-button>
      </div>
    </div>
  </ViewPage>
</template>

<script>
import Vue from "vue";
import {
  Dialog,
  Button,
  Row,
  Col,
  Field,
  Cell,
  CellGroup,
  ActionSheet,
  Area,
  Picker,
  Popup
} from "vant";
import ViewPage from "@/layout/components/ViewPage";
import Provinces from "@/components/provinces/index";
import { getHouseInfo, setHouseInfo, editHouseInfo } from "@/api/client";
import { mapState } from "vuex";
const Components = [
  Dialog,
  Button,
  Row,
  Col,
  Field,
  Cell,
  CellGroup,
  ActionSheet,
  Area,
  Picker,
  Popup
];

Components.forEach(item => {
  Vue.use(item);
});
export default {
  computed: {
    // 所有字典
    ...mapState({
      wordbook: state => state.user.wordbook
    })
  },
  components: {
    ViewPage,
    Provinces
  },
  data() {
    return {
      isView: 1, // 是否查看
      formData: {
        // 额外提交(上页传递)
        customerNum: "", // 客户编号
        customerId: "", // 客户ID
        // 额外提交

        isHasHouse: "", //是否有房产
        ownerProperty: "", //产权所有人
        houseType: "", //房产性质
        houseZon: "", //房产区域
        provCityZon: "", //房产所在地
        specificAddress: "", //详细地址
        houseArea: "" //房产面积(m²)
      },
      columns: [], //待选择列表
      errorMsg: {
        ownerProperty: "", //产权所有人
        specificAddress: "", //详细地址
        houseArea: "", //房产面积(m²)
        isHasHouse: "",
        houseType: "", //房产性质
        houseZon: "", //房产区域
        provCityZon: "" //房产所在地
      },

      searchData: {
        id: ""
      },

      subData: {},

      params: {},

      selectShow: false, //下拉选择器显示
      pickerTitle: "", //下拉列表title
      addressShow: false, // 城市下拉选择器显示
      selectLoading: true, //下拉选择 loading
      addressTitle: "", //城市下拉列表title
      areaList: {}, //城市列表 init

      subLoading: false, //提交loading
      subDisabled: false, //按钮禁用状态
      ruleData: {} // 验证信息
    };
  },
  methods: {
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
    // 获取详情
    loadData() {
      getHouseInfo({
        projectId: this.params.projectId,
        id: this.params.id
      }).then(res => {
        if(res.code == 200) {
          this.formData = res.data;
          this.formData.isHasHouseDesc = this.returnText('yes_no', this.formData.isHasHouse);
          this.formData.houseZonDesc = this.returnText('Property_area', this.formData.houseZon);
          this.formData.houseTypeDesc = this.returnText('Property_nature', this.formData.houseType);
        }
      });
    },
    loadList(val) {
      this.pickerTitle = val;
      switch (val) {
        case "是否有房产":
          this.selectShow = true;
          this.columns = this.wordbook.yes_no;
          break;
        case "房产性质":
          this.selectShow = true;
          this.columns = this.wordbook.Property_nature;
          break;
        case "房产所在地":
          this.addressShow = true;
          this.addressTitle = "户籍地址";
          break;
        case "房产区域":
          this.selectShow = true;
          this.columns = this.wordbook.Property_area;
          break;
      }
    },
    onConfirm(rows, index) {
      switch (this.pickerTitle) {
        case "是否有房产":
          this.formData.isHasHouse = rows.value;
          this.formData.isHasHouseDesc = rows.label;
          break;
        case "房产性质":
          this.formData.houseType = rows.value;
          this.formData.houseTypeDesc = rows.label;
          break;
        case "房产区域":
          this.formData.houseZon = rows.value;
          this.formData.houseZonDesc = rows.label;
          break;
      }
      this.selectShow = false;
    },
    onCancel() {
      this.selectShow = false;
      this.selectLoading = true;
    },
    // 省市区 ------------------------
    addressOnConfirm(code, name) {
      this.formData.provCityZon = name;
      this.formData.wbtProvCityZonCode = code;
      this.addressShow = false;
    },
    // 保存
    custSubmit() {
      this.formData.customerId = this.params.customerId;
      if (this.formData.isHasHouse == 0) {
        this.formData.ownerProperty = "";
        this.formData.houseArea = "";
        this.formData.provCityZon = "";
        this.formData.specificAddress = "";
        this.formData.houseType = "";
        this.formData.houseZon = "";
        this.formData.houseTypeDesc = "";
        this.formData.houseZonDesc = "";
        this.formData.houseAreaDesc = "";
        this.formData.wbtProvCityZonCode = "";
      }
      if(this.isView == 0) {
        setHouseInfo(this.formData).then(res => {
          if(res.code == 200) {
            this.$notify({
              type: "success",
              message: res.msg
            });
            this.$router.go(-1);
          } else {
            this.$notify({
              type: "danger",
              message: res.msg
            });
          }
        });
      } else {
        editHouseInfo(this.formData).then(res => {
          if(res.code == 200) {
            this.$notify({
              type: "success",
              message: res.msg
            });
            this.$router.go(-1);
          } else {
            this.$notify({
              type: "danger",
              message: res.msg
            });
          }
        });
      }
    }
  },
  mounted() {
    this.params = this.$route.query;
    this.isView = this.params.type;
    if(this.params.type == 1) {
      this.loadData();
    }
  }
};
</script>
