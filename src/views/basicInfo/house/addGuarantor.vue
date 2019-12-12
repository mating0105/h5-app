<template>
  <ViewPage>
    <div class="zh-page-body zh-bg-maingray">
      <div class="zh-card">
        <van-row>
          <van-col :span="24">
            <van-cell-group>
              <van-cell title="担保人：" required is-link :value="form.cuGuaranteeName" @click.native="loadList('担保人')" />
            </van-cell-group>
            <van-cell-group>
              <van-cell title="房产性质：" required is-link :value="form.houseTypeDesc" @click.native="loadList('房产性质')" />
            </van-cell-group>
            <van-cell-group>
              <van-cell title="房产区域：" required is-link :value="form.houseZonDesc" @click.native="loadList('房产区域')" />
            </van-cell-group>
            <van-cell-group>
              <van-field name="propertyValue" v-model="form.propertyValue" type="number" clearable required label="产权价值(万元)："
                input-align="right" placeholder="请输入产权价值" @blur.prevent="ruleMessge" :error-message="errorMsg.propertyValue"/>
            </van-cell-group>
            <van-cell-group>
              <van-field name="ownerProperty" v-model="form.ownerProperty" clearable required label="产权所有人：" input-align="right"
                placeholder="请输入产权所有人" @blur.prevent="ruleMessge" :error-message="errorMsg.ownerProperty"/>
            </van-cell-group>
            <van-cell-group>
              <van-cell title="房产所在地：" required is-link :value="form.provCityZon" @click.native="loadList('房产所在地')" />
            </van-cell-group>
            <van-cell-group>
              <van-field name="specificAddress" v-model="form.specificAddress" clearable required label="详细地址：" input-align="right"
                placeholder="请输入详细地址" @blur.prevent="ruleMessge" :error-message="errorMsg.specificAddress"/>
            </van-cell-group>
            <van-cell-group>
              <van-field name="houseArea" v-model="form.houseArea" type="number" clearable required label="房产面积(m２)：" input-align="right"
                placeholder="请输入房产面积" @blur.prevent="ruleMessge" :error-message="errorMsg.houseArea"/>
            </van-cell-group>
            <van-cell-group>
              <van-field name="propertyHolderNum" v-model="form.propertyHolderNum" type="number" clearable required label="产权共有人数(个)："
                input-align="right" placeholder="请输入产权共有人数" @blur.prevent="ruleMessge" :error-message="errorMsg.propertyHolderNum"/>
            </van-cell-group>
            <van-cell-group>
              <van-field name="propertyOwneratio" v-model="form.propertyOwneratio" type="number" clearable required label="本人产权占有比(%)："
                input-align="right" placeholder="请输入本人产权占有比" @blur.prevent="ruleMessge" :error-message="errorMsg.propertyOwneratio"/>
            </van-cell-group>

            <!-- 下拉选择器 -->
            <van-action-sheet v-model="selectShow" class="zh-list">
              <van-picker show-toolbar :title="pickerTitle" :value-key="'label'" :columns="columns" @cancel="onCancel"
                @confirm="onConfirm" />
            </van-action-sheet>

            <!-- 弹出省市区 -->
            <van-action-sheet v-model="addressShow" class="zh-list">
              <div class="zh-list-body">
                <van-area :area-list="areaList" :title="addressTitle" :loading="selectLoading"
                  @confirm="addressOnCancel" @cancel="addressOnConfirm" />
              </div>
            </van-action-sheet>

          </van-col>
        </van-row>
      </div>
      <!-- 保 存按钮 -->
      <div class="zh-submit">
        <van-button size="large" class="zh-bg-main" :class="[subDisabled ? 'buttonNoColor' : 'buttonColor']"
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
    return {}
  },
  components: {
    ViewPage
  }
}
</script>
