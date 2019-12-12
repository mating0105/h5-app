<template>
  <ViewPage>
    <div class="xh-card">
      <van-row>
        <section>
          <van-cell
            name="isHasHouse"
            title="是否有房产："
            required
            is-link
            :value="fromData.isHasHouseDesc"
            @click.native="loadList('是否有房产')"
            @blur.prevent="ruleMessge"
          />
        </section>
        <div v-if="fromData.isHasHouse == '1' || fromData.isHasHouse == '' ">
          <section>
            <van-field
              name="ownerProperty"
              v-model="fromData.ownerProperty"
              :disabled="select == '0' "
              required
              label="产权所有人："
              input-align="right"
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
              is-link
              :value="fromData.houseTypeDesc"
              @click.native="loadList('房产性质')"
            />
          </section>
          <section>
            <van-cell
              name="houseZon"
              title="房产区域："
              required
              is-link
              :value="fromData.houseZonDesc"
              @click.native="loadList('房产区域')"
            />
          </section>

          <section>
            <van-cell
              name="provCityZon"
              title="房产所在地："
              required
              is-link
              :value="fromData.provCityZon"
              @click.native="loadList('房产所在地')"
            />
          </section>
          <section>
            <van-field
              name="specificAddress"
              v-model="fromData.specificAddress"
              required
              :disabled="select == '0' "
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
              v-model="fromData.houseArea"
              required
              :disabled="select == '0' "
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
        <van-action-sheet v-model="addressShow" class="xh-list">
          <div class="xh-list-body">
            <van-area
              :area-list="areaList"
              :title="addressTitle"
              :loading="selectLoading"
              @confirm="addressOnCancel"
              @cancel="addressOnConfirm"
            />
          </div>
        </van-action-sheet>
      </van-row>
    </div>
    <!-- 保 存按钮 -->
    <div class="xh-submit" v-if="select == '1' || select == '2'">
      <van-button
        size="large"
        class="xh-bg-main"
        :class="[subDisabled ? 'buttonNoColor' : 'buttonColor']"
        :loading="subLoading"
        :disabled="subDisabled"
        @click.native="custSubmit"
      >保 存</van-button>
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
  data() {
    return {
      fromData: {
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

      select: "1", //是否是查看

      selectShow: false, //下拉选择器显示
      pickerTitle: "", //下拉列表title
      addressShow: false, // 城市下拉选择器显示
      selectLoading: true, //下拉选择 loading
      addressTitle: "", //城市下拉列表title
      areaList: {}, //城市列表 init

      subLoading: false, //提交loading
      subDisabled: false, //按钮禁用状态

      // 下拉菜单 List
      isHasHouseList: ["是", "否"], //是否有房产
      houseTypeList: [
        "自建房",
        "福利房",
        "商铺",
        "按揭商品房",
        "全款商品房",
        "无明确所属房产"
      ], //房产性质
      houseZonList: ["省会城市", "二线城市", "郊区、县、村、镇"], //房产区域
      ruleData: {} // 验证信息
    };
  },
  components: {
    ViewPage
  }
};
</script>
