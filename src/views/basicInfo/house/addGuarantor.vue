<template>
  <ViewPage :loading="loading">
    <div class="xh-page-body xh-bg-maingray">
      <div class="xh-card">
        <van-row>
          <van-col :span="24">
            <section>
              <van-cell
                title="担保人："
                required
                :is-link="isView"
                :value="form.cuGuaranteeName"
                label-class="labelClass"
                :label="errorMsg.guaranteeId"
                @click.native="!isView?'':loadList('担保人')"
              />
            </section>
            <section>
              <van-cell
                title="房产性质："
                required
                :is-link="isView"
                :value="form.houseTypeDesc"
                label-class="labelClass"
                :label="errorMsg.houseType"
                @click.native="!isView?'':loadList('房产性质')"
              />
            </section>
            <section>
              <van-cell
                title="房产区域："
                required
                :is-link="isView"
                :value="form.houseZonDesc"
                label-class="labelClass"
                :label="errorMsg.houseZon"
                @click.native="!isView?'':loadList('房产区域')"
              />
            </section>
            <section>
              <van-field
                name="propertyValue"
                v-model="form.propertyValue"
                type="number"
                clearable
                required
                :disabled="!isView"
                label="产权价值(万元)："
                input-align="right"
                placeholder="请输入产权价值"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.propertyValue"
                error-message-align="right"
              />
            </section>
            <section>
              <van-field
                name="ownerProperty"
                v-model="form.ownerProperty"
                clearable
                required
                :disabled="!isView"
                label="产权所有人："
                input-align="right"
                placeholder="请输入产权所有人"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.ownerProperty"
                error-message-align="right"
              />
            </section>
            <section>
              <van-cell
                title="房产所在地："
                required
                :is-link="isView"
                :value="form.provCityZon"
                label-class="labelClass"
                @blur.prevent="ruleMessge"
                :label="errorMsg.provCityZon"
                @click.native="!isView?'':loadList('房产所在地')"
              />
            </section>
            <section>
              <van-field
                name="specificAddress"
                v-model="form.specificAddress"
                clearable
                required
                :disabled="!isView"
                label="详细地址："
                input-align="right"
                placeholder="请输入详细地址"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.specificAddress"
                error-message-align="right"
              />
            </section>
            <section>
              <van-field
                name="houseArea"
                v-model="form.houseArea"
                type="number"
                clearable
                required
                :disabled="!isView"
                label="房产面积(m２)："
                input-align="right"
                placeholder="请输入房产面积"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.houseArea"
                error-message-align="right"
              />
            </section>
            <section>
              <van-field
                name="propertyHolderNum"
                v-model="form.propertyHolderNum"
                type="number"
                clearable
                required
                :disabled="!isView"
                label="产权共有人数(个)："
                input-align="right"
                placeholder="请输入产权共有人数"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.propertyHolderNum"
                error-message-align="right"
              />
            </section>
            <section>
              <van-field
                name="propertyOwneratio"
                v-model="form.propertyOwneratio"
                type="number"
                clearable
                required
                :disabled="!isView"
                label="本人产权占有比(%)："
                input-align="right"
                placeholder="请输入本人产权占有比"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.propertyOwneratio"
                error-message-align="right"
              />
            </section>

            <!-- 下拉选择器 -->
            <van-action-sheet v-model="selectShow" class="xh-list">
              <van-picker
                show-toolbar
                :title="pickerTitle"
                :columns="columns"
                :value-key="'label'"
                @cancel="selectShow = false"
                @confirm="onConfirm"
              />
            </van-action-sheet>

            <!-- 弹出省市区 -->
            <Provinces :showMap.sync="addressShow" @getProvince="addressOnConfirm"></Provinces>
          </van-col>
        </van-row>
      </div>
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
  Picker
} from "vant";
import {
  getGuaranteeHouse,
  setGuaranteeHouse,
  editGuaranteeHouse
} from "@/api/client";
import { toUserCard } from "@/utils/validate";
import ViewPage from "@/layout/components/ViewPage";
import Provinces from "@/components/provinces/index";
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
  Picker
];

Components.forEach(item => {
  Vue.use(item);
});
export default {
  mixins: [formValidator],
  data() {
    return {
      isView: false,
      form: {
        guaranteeId: "",
        houseArea: "",
        houseType: "",
        houseZon: "",
        ownerProperty: "",
        propertyHolderNum: "",
        propertyOwneratio: "",
        propertyValue: "",
        provCityZon: "",
        specificAddress: ""
      },
      errorMsg: {
        guaranteeId: "",
        houseArea: "",
        houseType: "",
        houseZon: "",
        ownerProperty: "",
        propertyHolderNum: "",
        propertyOwneratio: "",
        propertyValue: "",
        provCityZon: "",
        specificAddress: ""
      },
      selectShow: false, //下拉选择器显示
      selectLoading: true, //下拉选择 loading
      pickerTitle: "", //下拉列表title
      addressShow: false, // 城市下拉选择器显示
      columns: [], //待选择列表
      // 下拉菜单 List
      guaranteeList: [], //担保人
      loading: false, // loading
      dLoading: false, //按钮禁用状态
      projectId: "" //项目id
    };
  },
  components: {
    ViewPage,
    Provinces
  },
  computed: {
    // 所有字典
    ...mapState({
      wordbook: state => state.user.wordbook
    })
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
    loadList(key) {
      this.pickerTitle = key;
      switch (key) {
        case "担保人":
          this.selectShow = true;
          this.columns = this.guaranteeList;
          break;
        case "房产性质":
          this.selectShow = true;
          this.columns = this.wordbook.Property_nature;
          break;
        case "房产区域":
          this.selectShow = true;
          this.columns = this.wordbook.Property_area;
          break;
        case "房产所在地":
          this.addressShow = true;
          break;

        default:
          break;
      }
    },
    loadData(id) {
      var dataList = {
        projectId: this.params.projectId
      };
      if (id) {
        dataList.id = id;
      }
      getGuaranteeHouse(dataList).then(res => {
        try {
          let { data } = res;
          data.listCuGuarantee.forEach(e => {
            this.guaranteeList.push({
              label: e.customerName,
              value: e.id
            });
          });
          if (id) {
            this.form = data;
            this.form.houseTypeDesc = this.returnText(
              "Property_nature",
              this.form.houseType
            );
            this.form.houseZonDesc = this.returnText(
              "Property_area",
              this.form.houseZon
            );
          }
          this.loading = false;
        } catch {
          this.loading = false;
        }
      });
    },
    onConfirm(rows) {
      switch (this.pickerTitle) {
        case "担保人":
          this.form.cuGuaranteeName = rows.label;
          this.form.guaranteeId = rows.value;
          this.errorMsg.guaranteeId = '';
          break;
        case "房产性质":
          this.form.houseTypeDesc = rows.label;
          this.form.houseType = rows.value;
          this.errorMsg.houseType = '';
          break;
        case "房产区域":
          this.form.houseZonDesc = rows.label;
          this.form.houseZon = rows.value;
          this.errorMsg.houseZon = '';
          break;
      }
      this.selectShow = false;
    },

    // 省市区选择
    addressOnConfirm(code, name) {
      this.form.provCityZon = name;
      this.errorMsg.provCityZon = '';
      this.form.provCityZonCode = code;
      this.addressShow = false;
    },
    // 保存
    custSubmit() {
      let num = 0;
      for (let item in this.errorMsg) {
        this.errorMsg[item] = this.returnMsg(item, this.form[item]);
        if (this.errorMsg[item] !== "") {
          num++;
        }
      }
      if (num !== 0) {
        return;
      }
      this.dLoading = true;
      if (!this.form.id) {
        setGuaranteeHouse(this.form).then(res => {
          try {
            this.$notify({
              type: "success",
              message: res.msg
            });
            this.$router.go(-1);
            this.dLoading = false;
          } catch {
            this.dLoading = false;
          }
        });
      } else {
        editGuaranteeHouse(this.form).then(res => {
          try {
            this.$notify({
              type: "success",
              message: res.msg
            });
            this.$router.go(-1);
            this.dLoading = false;
          } catch {
            this.dLoading = false;
          }
        });
      }
    }
  },
  mounted() {
    this.params = this.$route.query;
    this.isView = this.params.isView == 0;
    if (this.params.id) {
      this.loadData(this.params.id);
    } else {
      this.loadData();
    }
    this.rulesForm("customer/cuPersonalHouse");
  }
};
</script>
