<template>
  <ViewPage>
    <div class="xh-page-body xh-bg-maingray">
      <div class="xh-card">
        <van-row>
          <van-col :span="24">
            <section>
              <van-cell title="担保人：" required is-link :value="form.cuGuaranteeName" @click.native="loadList('担保人')" />
            </section>
            <section>
              <van-cell title="房产性质：" required is-link :value="form.houseTypeDesc" @click.native="loadList('房产性质')" />
            </section>
            <section>
              <van-cell title="房产区域：" required is-link :value="form.houseZonDesc" @click.native="loadList('房产区域')" />
            </section>
            <section>
              <van-field name="propertyValue" v-model="form.propertyValue" type="number" clearable required label="产权价值(万元)："
                input-align="right" placeholder="请输入产权价值" @blur.prevent="ruleMessge" :error-message="errorMsg.propertyValue"/>
            </section>
            <section>
              <van-field name="ownerProperty" v-model="form.ownerProperty" clearable required label="产权所有人：" input-align="right"
                placeholder="请输入产权所有人" @blur.prevent="ruleMessge" :error-message="errorMsg.ownerProperty"/>
            </section>
            <section>
              <van-cell title="房产所在地：" required is-link :value="form.provCityZon" @click.native="loadList('房产所在地')" />
            </section>
            <section>
              <van-field name="specificAddress" v-model="form.specificAddress" clearable required label="详细地址：" input-align="right"
                placeholder="请输入详细地址" @blur.prevent="ruleMessge" :error-message="errorMsg.specificAddress"/>
            </section>
            <section>
              <van-field name="houseArea" v-model="form.houseArea" type="number" clearable required label="房产面积(m２)：" input-align="right"
                placeholder="请输入房产面积" @blur.prevent="ruleMessge" :error-message="errorMsg.houseArea"/>
            </section>
            <section>
              <van-field name="propertyHolderNum" v-model="form.propertyHolderNum" type="number" clearable required label="产权共有人数(个)："
                input-align="right" placeholder="请输入产权共有人数" @blur.prevent="ruleMessge" :error-message="errorMsg.propertyHolderNum"/>
            </section>
            <section>
              <van-field name="propertyOwneratio" v-model="form.propertyOwneratio" type="number" clearable required label="本人产权占有比(%)："
                input-align="right" placeholder="请输入本人产权占有比" @blur.prevent="ruleMessge" :error-message="errorMsg.propertyOwneratio"/>
            </section>

            <!-- 下拉选择器 -->
            <van-action-sheet v-model="selectShow" class="xh-list">
              <van-picker show-toolbar :title="pickerTitle" :value-key="'label'" :columns="columns" @cancel="onCancel"
                @confirm="onConfirm" />
            </van-action-sheet>

            <!-- 弹出省市区 -->
            <van-action-sheet v-model="addressShow" class="xh-list">
              <div class="xh-list-body">
                <van-area :area-list="areaList" :title="addressTitle" :loading="selectLoading"
                  @confirm="addressOnCancel" @cancel="addressOnConfirm" />
              </div>
            </van-action-sheet>

          </van-col>
        </van-row>
      </div>
      <!-- 保 存按钮 -->
      <div class="xh-submit">
        <van-button size="large" class="xh-bg-main" :class="[subDisabled ? 'buttonNoColor' : 'buttonColor']"
          :loading="subLoading" :disabled="subDisabled" @click.native="custSubmit">保 存</van-button>
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
  Picker
];

Components.forEach(item => {
  Vue.use(item);
});
export default {
  data() {
    return {
      form: {
        guaranteeId: '',
        houseArea: '',
        houseType: '',
        houseZon: '',
        ishashouse: '',
        ownerProperty: '',
        propertyHolderNum: '',
        propertyOwneratio: '',
        propertyValue: '',
        provCityZonId: '',
        specificAddress: '',
      },
      errorMsg: {
        guaranteeId: '',
        houseArea: '',
        houseType: '',
        houseZon: '',
        ishashouse: '',
        ownerProperty: '',
        propertyHolderNum: '',
        propertyOwneratio: '',
        propertyValue: '',
        provCityZonId: '',
        specificAddress: '',
      },
      selectShow: false, //下拉选择器显示
      selectLoading: true, //下拉选择 loading
      pickerTitle: '',//下拉列表title
      addressShow: false,// 城市下拉选择器显示
      addressTitle: '',//城市下拉列表title
      areaList: {},//城市列表 init
      columns: [], //待选择列表
      addressList: {}, //城市列表


      // 下拉菜单 List
      guaranteeList: [],//担保人
      subLoading: false, //提交loading
      subDisabled: false, //按钮禁用状态
      projectId: '',//项目id
      ruleData: {}
    }
  },
  components: {
    ViewPage
  }
}
</script>
