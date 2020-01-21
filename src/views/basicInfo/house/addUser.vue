<template>
  <ViewPage>
    <div class="xh-page-body">
      <van-row class="xh-card-box xh-radius">
        <section>
          <van-cell
            name="isHasHouse"
            title="是否有房产："
            :required="isView"
            :is-link="isView"
            :value="formData.isHasHouseDesc"
            label-class="labelClass"
            @blur.prevent="ruleMessge"
            :label="errorMsg.isHasHouse"
            @click.native="!isView?'':loadList('是否有房产')"
          />
        </section>
        <div v-if="formData.isHasHouse == '1' || formData.isHasHouse == '' ">
          <section>
            <van-field
              name="ownerProperty"
              v-model="formData.ownerProperty"
              :disabled="!isView"
              label="产权所有人："
              input-align="right"
              label-width="100px"
              :placeholder="isView?'请填写':''"
              @blur.prevent="ruleMessge"
              :error-message="errorMsg.ownerProperty"
              error-message-align="right"
            />
          </section>
          <section>
            <van-cell
              name="houseType"
              title="房产性质："
              :is-link="isView"
              :value="formData.houseTypeDesc"
              label-class="labelClass"
              @blur.prevent="ruleMessge"
              :label="errorMsg.houseType"
              @click.native="!isView?'':loadList('房产性质')"
            />
          </section>
          <section>
            <van-cell
              name="houseZon"
              title="房产区域："
              :is-link="isView"
              :value="formData.houseZonDesc"
              label-class="labelClass"
              @blur.prevent="ruleMessge"
              :label="errorMsg.houseZon"
              @click.native="!isView?'':loadList('房产区域')"
            />
          </section>

          <section>
            <van-cell
              name="provCityZon"
              title="房产所在地："
              :required="isView"
              :is-link="isView"
              :value="formData.provCityZon"
              label-class="labelClass"
              @blur.prevent="ruleMessge"
              :label="errorMsg.provCityZon"
              @click.native="!isView?'':loadList('房产所在地')"
            />
          </section>
          <section>
            <van-field
              name="specificAddress"
              v-model="formData.specificAddress"
              :required="isView"
              :disabled="!isView"
              label="详细地址："
              input-align="right"
              :placeholder="isView?'请填写':''"
              @blur.prevent="ruleMessge"
              :error-message="errorMsg.specificAddress"
              error-message-align="right"
            />
          </section>
          <section>
            <van-field
              name="houseArea"
              v-model="formData.houseArea"
              :disabled="!isView"
              label="房产面积："
              input-align="right"
              :placeholder="isView?'请填写':''"
              @blur.prevent="ruleMessge"
              :error-message="errorMsg.houseArea"
              error-message-align="right"
            >
              <span slot="button" v-if="formData.houseArea">m²</span>
            </van-field>
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
      <div class="xh-submit" v-if="isView">
        <van-button
          size="large"
          class="xh-bg-main"
          :loading="dLoading"
          :disabled="dLoading"
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
// 校验
import formValidator from "@/mixins/formValidator";

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
  mixins: [formValidator],
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
      isView: true, // 是否查看
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
        isHasHouse: "", //是否有房产
        // ownerProperty: "", //产权所有人
        // houseType: "", //房产性质
        // houseZon: "", //房产区域
        provCityZon: "", //房产所在地
        specificAddress: "", //详细地址
        // houseArea: "" //房产面积(m²)
      },
      params: {},
      selectShow: false, //下拉选择器显示
      pickerTitle: "", //下拉列表title
      dLoading: false, //按钮禁用状态
      addressShow: false,
      subDisabled: false
    };
  },
  watch: {
    "formData.isHasHouse"(value) {
      if (value == 0) {
        this.errorMsg = {
          isHasHouse: "" //是否有房产
        };
      } else {
        this.errorMsg = {
          isHasHouse: "", //是否有房产
          ownerProperty: "", //产权所有人
          houseType: "", //房产性质
          houseZon: "", //房产区域
          provCityZon: "", //房产所在地
          specificAddress: "", //详细地址
          houseArea: "" //房产面积(m²)
        };
      }
    }
  },
  methods: {
    initError(bool) {
      if (bool == "1") {
        this.errorMsg = {
          isHasHouse: "", //是否有房产
          ownerProperty: "", //产权所有人
          houseType: "", //房产性质
          houseZon: "", //房产区域
          provCityZon: "", //房产所在地
          specificAddress: "", //详细地址
          houseArea: "" //房产面积(m²)
        };
      } else {
        this.errorMsg = {
          isHasHouse: "" //是否有房产
        };
      }
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
    // 获取详情
    loadData() {
      getHouseInfo({
        projectId: this.params.projectId,
        id: this.params.id
      }).then(res => {
        if (res.code == 200) {
          this.formData = res.data;
          this.formData.isHasHouseDesc = this.returnText(
            "yes_no",
            this.formData.isHasHouse
          );
          this.formData.houseZonDesc = this.returnText(
            "Property_area",
            this.formData.houseZon
          );
          this.formData.houseTypeDesc = this.returnText(
            "Property_nature",
            this.formData.houseType
          );
          this.initError();
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
          this.errorMsg.isHasHouse = "";
          break;
        case "房产性质":
          this.formData.houseType = rows.value;
          this.formData.houseTypeDesc = rows.label;
          this.errorMsg.houseType = "";
          break;
        case "房产区域":
          this.formData.houseZon = rows.value;
          this.formData.houseZonDesc = rows.label;
          this.errorMsg.houseZon = "";
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
      this.errorMsg.provCityZon = "";
      this.formData.wbtProvCityZonCode = code;
      this.addressShow = false;
    },
    // 保存
    custSubmit() {
      let num = 0;
      for (let item in this.errorMsg) {
        this.errorMsg[item] = this.returnMsg(item, this.formData[item]);
        if (this.errorMsg[item]) {
          num++;
        }
      }
      if (num !== 0) {
        return;
      }
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
      this.dLoading = true;
      if (!this.params.id) {
        setHouseInfo(this.formData)
          .then(res => {
            this.$notify({
              type: "success",
              message: res.msg
            });
            this.$router.go(-1);
            this.dLoading = false;
          })
          .catch(() => {
            this.dLoading = false;
          });
      } else {
        editHouseInfo(this.formData)
          .then(res => {
            this.$notify({
              type: "success",
              message: res.msg
            });
            this.$router.go(-1);
            this.dLoading = false;
          })
          .catch(() => {
            this.dLoading = false;
          });
      }
    }
  },
  mounted() {
    this.params = this.$route.query;
    this.isView = this.params.isView == 0;
    console.log(this.isView);
    if (this.params.id) {
      this.loadData();
    }
    this.rulesForm("customer/cuPersonalHouse");
  }
};
</script>
