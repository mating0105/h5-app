<template>
  <div>
    <redCard label="客户基本信息" class="xh-page-body">
      <template slot="cardBody">
        <div class="xh-card-user">
          <!-- 客户信息 -->
          <van-row class="xh-user">
            <section>
              <div class="van-cell">
                <div class="van-cell__title van-field__label">编号:</div>
                <div class="van-cell__value">{{ projProjectInfo.customerNum }}</div>
              </div>
            </section>
            <section>
              <div class="van-cell">
                <div class="van-cell__title van-field__label">证件号码:</div>
                <div class="van-cell__value">{{ projProjectInfo.certificateNum }}</div>
              </div>
            </section>
            <section>
              <div class="van-cell">
                <div class="van-cell__title van-field__label">客户姓名:</div>
                <div class="van-cell__value">{{ projProjectInfo.customerName }}</div>
              </div>
            </section>
            <section>
              <div class="van-cell">
                <div class="van-cell__title van-field__label">联系电话:</div>
                <div class="van-cell__value">{{ projProjectInfo.contactPhone }}</div>
              </div>
            </section>
            <section>
              <van-cell
                title="单位性质:"
                :is-link="isView"
                :value="projProjectInfo.unitCharName"
                @click="!isView?'':loadList('unit_Property','单位性质', 'unitChar')"
                label-class="labelClass"
                @blur.prevent="ruleMessge"
                :label="errorMsg.unitChar"
              />
            </section>
            <section>
              <van-cell
                title="文化程度:"
                :is-link="isView"
                :value="projProjectInfo.levelEducationName"
                @click="!isView?'':loadList('DegreeOfEducation','文化程度', 'levelEducation')"
                label-class="labelClass"
                @blur.prevent="ruleMessge"
                :label="errorMsg.levelEducation"
              />
            </section>
            <section>
              <van-cell
                :title="'婚姻状况:'+(isView?'*':'')"
                :is-link="isView"
                :value="projProjectInfo.marriageName"
                @click="!isView?'':loadList('marriage_type','婚姻状况', 'marriage')"
                label-class="labelClass"
                @blur.prevent="ruleMessge"
                :label="errorMsg.marriage"
              />
            </section>
          </van-row>
          <!-- 配偶信息 -->
          <div
            class="xh-card-head"
            v-if="projProjectInfo.marriage == '2' || projProjectInfo.marriage == '4'"
          >
            配偶基本信息
            <img
              :src="require('./../../../assets/old_images/icon-ocr2.png')"
              class="xh-OCR"
              @click="OCRScan"
              v-if="isView"
            />
          </div>
          <van-row
            class="xh-user"
            v-if="projProjectInfo.marriage == '2' || projProjectInfo.marriage == '4'"
          >
            <section>
              <van-field
                v-model="projProjectInfo.spsNm"
                clearable
                name="spsNm"
                label-width="100px"
                :label="'配偶姓名:'+(isView?'*':'')"
                input-align="right"
                :placeholder="isView?'请填写':''"
                :disabled="!isView"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.spsNm"
                error-message-align="right"
              />
            </section>
            <section>
              <van-field
                v-model="projProjectInfo.spsCtcTel"
                type="number"
                clearable
                name="spsCtcTel"
                label-width="100px"
                :label="'联系电话:'+(isView?'*':'')"
                input-align="right"
                :placeholder="isView?'请填写':''"
                :disabled="!isView"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.spsCtcTel"
                error-message-align="right"
              />
            </section>
            <section>
              <van-field
                v-model="projProjectInfo.spsCrdtNo"
                clearable
                name="spsCrdtNo"
                label-width="100px"
                :label="'证件号码:'+(isView?'*':'')"
                input-align="right"
                :placeholder="isView?'请填写':''"
                :disabled="!isView"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.spsCrdtNo"
                error-message-align="right"
              />
            </section>
            <section>
              <van-cell
                title="单位性质:"
                :is-link="isView"
                :value="projProjectInfo.spsUnitCharName"
                @click="!isView?'':loadList('unit_Property','配偶单位性质', 'spsUnitChar')"
                label-class="labelClass"
                :value-class="projProjectInfo.spsUnitCharName?'':'xh-value-none'"
                @blur.prevent="ruleMessge"
                :label="errorMsg.spsUnitChar"
              />
            </section>
            <section>
              <van-cell
                title="文化程度:"
                :is-link="isView"
                :value="projProjectInfo.spsCltrDgrName"
                @click="!isView?'':loadList('DegreeOfEducation','配偶文化程度', 'spsCltrDgr')"
                label-class="labelClass"
                :value-class="projProjectInfo.spsUnitCharName?'':'xh-value-none'"
                @blur.prevent="ruleMessge"
                :label="errorMsg.spsCltrDgr"
              />
            </section>
          </van-row>
        </div>
      </template>
    </redCard>
    <!-- 基本信息 -->
    <Card class="xh-top-10">
      <template v-slot:header>项目信息</template>
      <van-row class="xh-project">
        <van-col span="24" class="xh-black xh-relative xh-boder-left">
          <section>
            <van-cell
              title="业务来源:"
              :required="isView"
              :is-link="isView"
              :value="(projProjectInfo.bsnSrcName?projProjectInfo.bsnSrcName:'') + (projProjectInfo.isAccessCarName?' | '+projProjectInfo.isAccessCarName:'')"
              @click="!isView?'':loadType('业务来源','bsnSrc')"
              label-class="labelClass"
              :value-class="projProjectInfo.isAccessCarName?'':'xh-value-none'"
              @blur.prevent="ruleMessge"
              :label="errorMsg.bsnSrc"
            />
          </section>
          <!-- 接口请求 -->
          <section>
            <van-cell
              title="车商:"
              :required="isView"
              :is-link="isView"
              :value="projProjectInfo.carDealersIdName"
              @click="!isView?'':loadType('车商', 'carDealersId')"
              label-class="labelClass"
              @blur.prevent="ruleMessge"
              :label="errorMsg.carDealersId"
            />
          </section>
          <section>
            <van-cell
              title="反担保状况:"
              :is-link="isView"
              :value="projProjectInfo.counterGuaranteeStatusName"
              @click="!isView?'':loadList('counter_Guarantee_Status','反担保状况', 'counterGuaranteeStatus')"
              label-class="labelClass"
              @blur.prevent="ruleMessge"
              :label="errorMsg.counterGuaranteeStatus"
            />
          </section>
          <section>
            <van-cell
              title="是否拆单:"
              :required="isView"
              :is-link="isView"
              :value="projProjectInfo.wthrBlName"
              @click="!isView?'':loadList('yes_no','是否拆单','wthrBl')"
              label-class="labelClass"
              @blur.prevent="ruleMessge"
              :label="errorMsg.wthrBl"
            />
          </section>
          <section v-if="projProjectInfo.wthrBl=='1'">
            <van-field
              v-model="projProjectInfo.blRsn"
              clearable
              :disabled="!isView"
              label="拆单原因:"
              input-align="right"
              :placeholder="isView?'请填写':''"
            />
          </section>
          <section>
            <van-cell
              title="预调查地址:"
              :border="false"
              :is-link="isView"
              :value="projProjectInfo.wbtProvCityZonName"
              @click="!isView?'':show2 = true"
              label-class="labelClass"
              :value-class="projProjectInfo.wbtProvCityZonName?'':'xh-value-none'"
              @blur.prevent="ruleMessge"
              :label="errorMsg.wbtProvCityZonCode"
            />
          </section>
          <section>
            <van-field
              v-model="projProjectInfo.addressDetail"
              clearable
              name="addressDetail"
              :disabled="!isView"
              label="具体地址:"
              input-align="right"
              :placeholder="isView?'请填写':''"
              @blur.prevent="ruleMessge"
              :error-message="errorMsg.addressDetail"
              error-message-align="right"
            />
          </section>
        </van-col>
      </van-row>
    </Card>
    <!-- 车辆信息 -->
    <Card style="margin-top: 1rem;">
      <template v-slot:header>
        车辆信息
        <span v-if="projProjectInfo.cars.length > 0 && isView">(请侧滑进行编辑或删除)</span>
        <div class="card-icon" @click="addVehicle" v-if="projProjectInfo.cars.length === 0 ">
          <van-icon name="add-o" />
        </div>
      </template>
      <div>
        <van-swipe-cell v-for="(item, index) in projProjectInfo.cars" :key="index" :disabled="!isView">
          <van-cell
            title="车辆类别:"
            :border="false"
            :value="nameToString(returnText('car_type' ,item.carType), returnText('car_type2',item.carType2))"
          />
          <van-cell title="车辆性质:" :border="false" :value="returnText('car_nature',item.carNature)" />
          <van-cell
            title="车辆规格:"
            :border="false"
            :value="returnText('vehicle_specifications',item.carSpecifications)"
          />
          <van-cell title="车辆来源:" :border="false" :value="returnText('CAR_SOURCE',item.carSource)" />
          <van-cell
            title="车辆品牌型号:"
            :border="false"
            :value="nameToString(item.brndNm, item.carSeries, item.carModel)"
          />
          <van-cell
            v-if="item.carNature === 'old_car'"
            title="车架号:"
            :border="false"
            :value="item.chassisNumber"
          />
          <van-cell
            title="销售价:"
            v-if="item.carNature === 'new_car'"
            :border="false"
            :value="numFilter(item.salePrice)"
          >
            <div slot="right-icon" class="xh-cell-right">元</div>
          </van-cell>
          <template v-else-if="item.carNature === 'old_car'">
            <van-cell title="车牌所在地:" :border="false" :value="item.carLicenseLocation" />
            <van-cell title="首次上牌日:" :border="false" :value="item.plateDate" />
            <van-cell title="行驶里程:" :border="false" :value="item.roadHaul">
              <div slot="right-icon" class="xh-cell-right">公里</div>
            </van-cell>
            <!-- <van-cell title="发动机号:" :border="false" :value="item.engineNum" /> -->
            <van-cell-group :border="false">
              <van-field
                v-model="item.engineNum"
                clearable
                name="colligateCharges"
                error-message-align="right"
                label="发动机号"
                input-align="right"
                placeholder="请输入"
              />
            </van-cell-group>
            <van-cell-group :border="false">
              <van-cell title="二手车照片:" />
            </van-cell-group>
             <imageList :dataList="dataImg" :view="true"></imageList>
          </template>
          <van-cell title="备注:" :value="item.remark" />
          <div slot="right" style="height: 100%">
            <van-button
              type="warning"
              style="height:100%;border-radius: 0;"
              @click="editCar(item, index)"
              v-if="item.carNature === 'new_car'"
            >修改</van-button>
            <van-button
              type="warning"
              style="height:100%;border-radius: 0;"
              @click="reChooseCar(item, index)"
              v-if="item.carNature === 'old_car'"
            >重选</van-button>
            <van-button
              type="danger"
              style="height:100%;border-radius: 0;"
              @click="removeCar(item,index)"
            >删除</van-button>
          </div>
          
        </van-swipe-cell>
       
      </div>
    </Card>

    <!-- 车辆评估信息 -->
    <Card class="xh-top-10" v-if="carNature == 'old_car'">
      <template v-slot:header>车辆评估信息</template>
      <van-row class="xh-project">
        <van-cell title="评估价:" :border="false" :value="projProjectInfo.cars.length>0?(projProjectInfo.cars[0].evaluatingPrice).toFixed(2):''" >
           <div slot="right-icon" class="xh-cell-right">元</div>
        </van-cell>
        <van-cell-group :border="false">
          <van-cell title="评估报告:" />
        </van-cell-group>
        <imageList :dataList="dataImg2" :view="true"></imageList>
      </van-row>
    </Card>

    <!-- 产品信息 -->
    <Card class="xh-top-10">
      <template v-slot:header>产品信息</template>
      <van-row class="xh-project">
        <van-col span="24" class="xh-black xh-relative xh-boder-left">
          <section>
            <van-cell
              title="业务模式:"
              :required="isView"
              :is-link="isView"
              :value="projProjectInfo.businessModelName"
              @click="!isView?'':loadType('业务模式','businessModel')"
              :value-class="projProjectInfo.businessModelName?'':'xh-value-none'"
              label-class="labelClass"
              @blur.prevent="ruleMessge"
              :label="errorMsg.businessModel"
            />
          </section>
          <section>
            <van-cell
              title="贷款期限:"
              :required="isView"
              :is-link="isView"
              :value="projProjectInfo.loanTerm"
              @click="!isView?'':loadType('贷款期限','loanTerm')"
              label-class="labelClass"
              :value-class="projProjectInfo.loanTerm?'':'xh-value-none'"
              @blur.prevent="ruleMessge"
              :label="errorMsg.loanTerm"
            />
          </section>
          <!-- 请求接口 -->
          <section>
            <van-cell
              title="放款平台:"
              :required="isView"
              :is-link="isView"
              :value="projProjectInfo.dsbrPltfrmNm"
              @click="!isView?'':loadType('放款平台','platform')"
              :value-class="projProjectInfo.dsbrPltfrmNm?'':'xh-value-none'"
              label-class="labelClass"
              @blur.prevent="ruleMessge"
              :label="errorMsg.loanPlatfomrId"
            />
          </section>
          <section>
            <van-cell
              title="产品类别:"
              :required="isView"
              :is-link="isView"
              :value="projProjectInfo.productCategoryIdName"
              @click="!isView?'':loadType('产品类别','productCategoryId')"
              :value-class="projProjectInfo.productCategoryIdName?'':'xh-value-none'"
              label-class="labelClass"
              @blur.prevent="ruleMessge"
              :label="errorMsg.productCategoryId"
            />
          </section>
          <section>
            <van-cell
              title="产品名称:"
              :required="isView"
              :is-link="isView"
              :value="projProjectInfo.productIdName"
              @click="!isView?'':loadType('产品名称','productId')"
              :value-class="projProjectInfo.productIdName?'':'xh-value-none'"
              label-class="labelClass"
              @blur.prevent="ruleMessge"
              :label="errorMsg.productId"
            />
          </section>
          <section>
            <van-field
              v-model="projProjectInfo.loanAmt"
              type="number"
              name="loanAmt"
              :required="isView"
              clearable
              label-width="100px"
              :disabled="!isView"
              label="银行贷款金额:"
              input-align="right"
              :placeholder="isView?'请填写':''"
              :error-message="errorMsg.loanAmt"
              @blur.prevent="priceFloat(projProjectInfo, 'loanAmt');ruleMessge($event)"
              error-message-align="right"
            >
              <div slot="button" v-if="projProjectInfo.loanAmt">元</div>
            </van-field>
          </section>
          <!-- 中建投 -->
          <!-- <div v-if="projProjectInfo.businessModel==4">
            <section>
              <van-cell title="客户首付成数:" :value="projProjectInfo.paymentNumberName" />
            </section>
            <section>
              <van-cell title="客户保证金(%):" :value="projProjectInfo.customerBond" />
            </section>
          </div>-->
          <!-- <div v-if="projProjectInfo.businessModel != 4"> -->
          <section>
            <van-cell
              title="盗抢险:"
              :required="isView"
              :is-link="isView"
              :value="projProjectInfo.thiefRescueName"
              @click="!isView?'':loadType('盗抢险','thiefRescue')"
              :value-class="projProjectInfo.thiefRescueName?'':'xh-value-none'"
              label-class="labelClass"
              @blur.prevent="ruleMessge"
              :label="errorMsg.thiefRescue"
            />
          </section>
          <section>
            <van-cell
              title="盗抢险购买平台:"
              :required="isView"
              :is-link="isView"
              :value="projProjectInfo.rbrinsPltfrmNmName"
              @click="!isView?'':loadType('盗抢险购买平台', 'rbrinsPltfrmNmId')"
              label-class="labelClass"
              :value-class="projProjectInfo.rbrinsPltfrmNmName?'':'xh-value-none'"
              @blur.prevent="ruleMessge"
              :label="errorMsg.rbrinsPltfrmNmId"
            />
          </section>
          <section>
            <van-cell title="贷款金额区间:" :value="projProjectInfo.loanRegion" />
          </section>
          <!-- </div> -->
          <section>
            <van-cell title="银行费率:" :value="this.numFilter(projProjectInfo.bankNewRate)">
              <div
                slot="right-icon"
                style="line-height: inherit;"
                v-if="projProjectInfo.bankNewRate"
              >%</div>
            </van-cell>
          </section>
          <section>
            <van-cell title="担保费率:" :value="this.numFilter(projProjectInfo.guaranteeRate)">
              <div
                slot="right-icon"
                style="line-height: inherit;"
                v-if="projProjectInfo.guaranteeRate"
              >%</div>
            </van-cell>
          </section>
          <section>
            <van-cell title="返利费率:" :value="this.numFilter(projProjectInfo.rebateStandard)">
              <div
                slot="right-icon"
                style="line-height: inherit;"
                v-if="projProjectInfo.rebateStandard"
              >%</div>
            </van-cell>
          </section>

          <!-- <section v-if="projProjectInfo.isQuickadjust=='1'">
            <van-cell
              title="是否t+0:"
              :is-link="isView"
              :required="isView"
              :value="projProjectInfo.isTandzeroName"
              @click="!isView?'':loadList('yes_no','是否t+0','isTandzero')"
            />
          </section>-->
          <section>
            <van-field
              v-model="projProjectInfo.rentingAmtGps"
              type="number"
              clearable
              name="rentingAmtGps"
              :disabled="!isView"
              label="加融金额:"
              input-align="right"
              :required="projProjectInfo.thiefRescue == 0?true:false"
              :placeholder="isView?'请填写(含GPS加融费用)':''"
              :error-message="errorMsg.rentingAmtGps"
              @blur.prevent="priceFloat(projProjectInfo, 'rentingAmtGps');ruleMessge($event)"
              error-message-align="right"
            >
              <div slot="button" v-if="projProjectInfo.rentingAmtGps">元</div>
            </van-field>
          </section>
          <section>
            <van-field
              v-model="projProjectInfo.surcharge"
              type="number"
              clearable
              :disabled="!isView"
              label="附加费:"
              input-align="right"
              @blur.prevent="priceFloat(projProjectInfo, 'surcharge')"
              :placeholder="isView?'请填写':''"
            >
              <div slot="button" v-if="projProjectInfo.surcharge">元</div>
            </van-field>
          </section>
        </van-col>
      </van-row>
    </Card>
    <Card class="xh-top-10" v-if="isView">
      <van-row class="xh-project" style="padding:10px;">
        <van-col :span="16">
          <van-checkbox v-model="assesstment">完善调查信息</van-checkbox>
        </van-col>
        <van-col :span="8" style="text-align:right" @click="conpleteInfo">
          {{projProjectInfo.perfectMsg}}
          <van-icon name="arrow" />
        </van-col>
      </van-row>
    </Card>
    <!-- 意见 -->
    <Card style="margin: 10px;" v-if="(isView && !params.activityId) || params.activityId == 'WF_PROJ_APPR_01_T01'">
      <template v-slot:header>意见描述</template>
      <section>
        <van-cell-group :border="false">
          <van-field
            v-model="message"
            rows="2"
            autosize
            label-width="0"
            :border="false"
            type="textarea"
            maxlength="200"
            placeholder="请输入"
            show-word-limit
          />
        </van-cell-group>
      </section>
    </Card>

    <!-- 提交按钮 -->
    <div class="xh-submit" style="padding: 20px 10px;" v-if="(isView && !params.activityId) || params.activityId == 'WF_PROJ_APPR_01_T01'">
      <van-button
        size="large"
        class="xh-bg-main"
        @click="submitProject"
        :loading="dLoading"
        :disabled="dLoading"
      >提 交</van-button>
    </div>

    <!-- 弹出选项 -->
    <van-action-sheet get-container="#app" v-model="show3" class="xh-list">
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
    <!-- 图片选择方式 -->
    <van-action-sheet
      :close-on-click-overlay="false"
      cancel-text="取消"
      @cancel="show4 = false"
      v-model="show4"
      :actions="actions"
      @select="onSelect"
    />
    <!-- 弹出省市区 -->
    <Provinces :showMap.sync="show2" @getProvince="confirmSelect"></Provinces>
  </div>
</template>

<script>
import Vue from "vue";
import {
  getProjectInfo,
  getProjectCustomer,
  getProductTypeList,
  getLoanPlatformTree,
  getAllTpBuyPlatform,
  setProjectInfo,
  setNewCar,
  deleteCar,
  setProjectTask,
  setProjectProcess
} from "@/api/project";
// 校验
import formValidator from "@/mixins/formValidator";
// 自定义组件
import redCard from "@/components/redCard/index";
import Provinces from "@/components/provinces/index";
import Card from "@/components/card/index";
// 其他组件
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
  Icon,
  SwipeCell,
  Toast,
  Checkbox,
  CheckboxGroup
} from "vant";
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
  Icon,
  SwipeCell,
  Checkbox,
  CheckboxGroup
];

Components.forEach(item => {
  Vue.use(item);
});
import { mapState } from "vuex";
import imageList from "@/components/imageList";
import { getValue, setValue, removeValue } from '@/utils/session'
import { getDocumentByType } from "@/api/document";
export default {
  mixins: [formValidator],
  name: "projectInfo",
  components: {
    redCard,
    Card,
    Provinces,
    imageList
  },
  computed: {
    bankTotal() {
      return this.bankGuaranteeRate - this.bankRate;
    },
    // 所有字典
    ...mapState({
      wordbook: state => state.user.wordbook
    }),
    documentType() {
      let obj = {};
      if (this.wordbook.document_type && this.wordbook.document_type.length) {
        this.wordbook.document_type.forEach(item => {
          obj[item.value] = item;
        });
      }
      return obj;
    }
  },
  watch: {
    // 婚姻状况
    "projProjectInfo.marriage"(newValue, oldValue) {
      var arr = ["spsNm", "spsCtcTel", "spsCrdtNo"];
      if (newValue == "2" || newValue == "4") {
        arr.forEach((item, index) => {
          this.$set(this.errorMsg, item, "");
        });
      } else {
        arr.forEach((item, index) => {
          Vue.delete(this.errorMsg, item);
        });
      }
    },
    // 获取贷款期限
    "projProjectInfo.businessModel"(val) {
      if (val && this.isView) {
        this.productTypeList({
          type: 2,
          carType: this.carType,
          carNature: this.carNature,
          companyId: this.projProjectInfo.companyId,
          businessMode: val
        });
      }
    },
    // 查询放款平台
    "projProjectInfo.loanTerm"(val) {
      if (val && this.projProjectInfo.businessModel) {
        this.loanPlatformTree(val);
      }
    },
    // 获取放款平台name 和 产品类别
    "projProjectInfo.loanPlatfomrs"(val) {
      if (val) {
        this.productTypeList({
          type: 3,
          carType: this.carType,
          carNature: this.carNature,
          companyId: this.projProjectInfo.companyId,
          businessMode: this.projProjectInfo.businessModel,
          platformId: val
        });
      }
    },
    // 获取产品list
    "projProjectInfo.productCategoryId"(val) {
      if (val && this.isView) {
        this.productTypeList({
          type: 4,
          companyId: this.projProjectInfo.companyId,
          productCategoryId: val
        });
      }
    },
    // 获取产品详情
    "dataList.productId"(val) {
      if (val && this.isView) {
        this.productTypeList({
          type: 5,
          productId: val
        });
      }
    },
    //
    "projProjectInfo.thiefRescue"(val) {
      if (val == 0) {
        Vue.delete(this.errorMsg, "thiefRescue");
      } else {
        this.$set(this.errorMsg, "thiefRescue", "");
      }
    }
  },
  data() {
    return {
      actions: [
        { name: "相机扫描识别", value: "scan" },
        { name: "相册导入识别", value: "album" }
      ],
      params: {}, // 传过来的数据
      show3: false, //弹框选择
      show2: false, //地址选择
      show4: false, // 图片选择
      dLoading: false,
      options: [], // 字典集合
      valueKey: "label", // 下拉选择取的哪个描述值
      valueId: "", // 下拉选择取的哪个value值
      thiefRescueList: [], // 盗抢险组数
      isWordbook: true, // 是否从字典获取
      businessModellist: [], //业务模式
      termList: [], //贷款期限
      platform: [], //放款平台
      customerList: [], // 车商
      productTypeRows: [], // 产品类别
      productTypeName: [], // 产品名字
      platformList: [], // 盗抢险购买平台
      isRule: true, // 验证是否通过 默认通过true
      bankGuaranteeRate: "", // 银行费率+担保费率
      bankRate: "", // 银行费率
      businessList: [], //业务来源
      selectName: "",
      fieldName: "", // 选择字段名
      // 初始化数据
      projProjectInfo: {
        loanPlatfomrs: "",
        wbtProvCityId: [],
        cars: []
      },
      errorMsg: {
        loanPlatfomrId: "",
        // wbtProvCityZonCode: "",
        productId: "",
        // thiefRescue: "",
        // counterGuaranteeStatus: "",
        bsnSrc: "",
        rbrinsPltfrmNmId: "",
        loanAmt: "",
        customerName: "",
        cars: "",
        loanTerm: "",
        productCategoryId: "",
        // addressDetail: "",
        wthrBl: "",
        marriage: "",
        businessModel: "",
        // unitChar: "",
        // levelEducation: "",
        contactPhone: "",
        carDealersId: ""
      },
      carNature: "", //车辆性质
      carType: "", //车辆类型
      carType2: "", //车辆类型2
      platformId: "", //
      isView: false,
      oldCarList: {}, //新增二手车信息
      assesstment: false, //是否完善信息
      dataImg: [], //二手车照片
      dataImg2: [], //评估报告
      message: "",
      userlist: false, //是否有下一节点人
      processedBy: "",
      imageTypeList: ['6700', '6701', '6702', '6703', '6704', '6705', '6706', '6707', '6708', '6709', '6710', '6711', '6712', '6713', '6714', '6715', '6716', '6717', '6718', '6719', '6720', '6721', '6722', '6723'],//二手车照片类型

    };
  },
  methods: {
    //新增车辆
    addVehicle() {
      // if (!this.edit) {
      //   return
      // }
      sessionStorage.setItem('proInfo',JSON.stringify(this.projProjectInfo))
      const query = {
        customerId: this.params.customerId,
        customerNum: this.params.customerNum,
        projectId: this.params.projectId?this.params.projectId:this.params.businesskey
      };
      this.$router.push({
        path: "/addVehicle",
        query
      });
    },
    nameToString() {
      return [...arguments].map(item => item).join(" ");
    },
    // 车辆编辑 
    editCar(rows, inx) {
      const query = {
        customerId: this.params.customerId,
        customerNum: this.params.customerNum,
        brndNm: rows.automarke.brndNm,
        carModelId: rows.automarke.carModelId,
        carBrandId: rows.automarke.brndNmId,
        carSeriesId: rows.automarke.carSeriesId,
        index: inx,
        ...rows
      };
      query.projectId = this.params.projectId;
      
      this.$router.push({
        path: "/addVehicle",
        query
      });
    },
    //二手车重选
    reChooseCar(rows, inx) {
      deleteCar({
        id: rows.id
      }).then(res => {
        
        this.$router.push({
          path: "/priceEvaluationChoose",
          query: {
            type: 1,
            projectId: this.params.projectId
          }
        });
      });
    },
    // 车辆删除
    removeCar(rows, inx) {
      this.loading = true;
      deleteCar({
        id: rows.id
      }).then(res => {
        this.projProjectInfo.cars.splice(inx, 1);
        this.loading = false;
        this.carNature = '';
      });
    },
    //加载二手车照片
    async loadImg() {
      try {
        this.imageTypeList.forEach(item => {
            this.getDocumentByType(item, this.dataImg)
            this.getDocumentByType('6666', this.dataImg2)//二手车评估报告
        })
      } catch (e) {
        
      }
    },
    async getDocumentByType (documentType, arr) {
        try {
          const params = {
            customerNum: this.projProjectInfo.cars[0].assessId,
            documentType: documentType
          }
          const {data} = await getDocumentByType(params)
          const declare = this.documentType[documentType] ? this.documentType[documentType].label : '图片描述'
          data.forEach(item => {
            item.declare = declare;
          })
          let deletable = documentType === '6666' || this.isView
          arr.push({
            declare: declare,//图片描述
            isRequire: false,//*是否必须
            deletable: false,//是否可以操作-上传和删除
            documentType: documentType,
            customerNum: this.projProjectInfo.cars[0].assessId,
            customerId: this.projProjectInfo.cars[0].assessId,
            kind: '1',
            fileList: data
          })
        } catch (e) {
          console.log(e)
        }
    },
    // 字典转换
    returnText(n, val, list, ids, field) {
      let name;
      if (ids && field) {
        list.forEach(e => {
          if (e[ids] == val) {
            name = e[field];
          }
        });
      } else {
        this.wordbook[n].forEach(e => {
          if (e.value == val) {
            name = e.label;
          }
        });
      }
      return name;
    },
    returnPlatform(val, list) {
      let name;
      list.forEach(i => {
        if (i.value == val) {
          name = i.dsbrPltfrmNm;
        }
      });
      return name;
    },
    // 获取车商
    getCustomer() {
      if (
        this.projProjectInfo.businessGroupIds &&
        this.projProjectInfo.isAccessCar
      ) {
        let list = {
          belongGroupId: this.projProjectInfo.businessGroupIds,
          state: this.projProjectInfo.isAccessCar
        };
        getProjectCustomer(list).then(res => {
          if (res.code == 200) {
            this.customerList = res.data;
          } else {
            this.$notify({ type: "danger", message: res.msg });
          }
        });
      }
    },
    // 获取盗抢险购买平台
    getPlatform() {
      let list = {};
      getAllTpBuyPlatform(list).then(res => {
        if (res.code == 200) {
          this.platformList = res.data;
        } else {
          this.$notify({ type: "danger", message: res.msg });
        }
      });
    },
    // 字典获取数据
    loadList(state, title, field) {
      this.valueKey = "label";
      this.show3 = true;
      this.isWordbook = true;
      this.options = this.wordbook[state];
      this.selectName = title;
      this.fieldName = field;
    },
    // 产品转id类型
    changeRows(projectInfo) {
      let ids = "";
      if (this.productTypeName.length > 0) {
        this.productTypeName.forEach(t => {
          if (t.productName == projectInfo.proPat.productName) {
            ids = t.productId;
          }
        });
      }
      if(ids){
        this.$set(this.projProjectInfo, "productId", ids);
      }
      
    },
    // 省市区选择
    confirmSelect(code, name) {
      this.projProjectInfo.wbtProvCityZon = code;
      this.projProjectInfo.wbtProvCityZonName = name;
      this.projProjectInfo.wbtProvCityZonCode = code;
      this.errorMsg.wbtProvCityZonCode = "";
      this.show2 = false;
    },
    // 其他接口数据
    loadType(title, field) {
      this.selectName = title;
      this.isWordbook = false;
      this.show2 = false;
      switch (title) {
        case "业务来源":
          let businessList = JSON.parse(sessionStorage.getItem('businessList'));
          this.businessList = this.businessList.length != 0?this.businessList:businessList;
          if (this.businessList.length == 0) {
            this.$notify({
              type: "danger",
              message: "没有业务来源"
            });
            return;
          }
          this.valueKey = "labelName";
          this.valueId = "id";
          this.fieldName = field;
          this.options = this.businessList;
          this.show3 = true;
          break;
        case "车商":
          if (this.customerList.length == 0) {
            this.$notify({
              type: "danger",
              message: "没有对应车商"
            });
            return;
          }
          this.valueKey = "carDealersName";
          this.valueId = "id";
          this.fieldName = field;
          this.options = this.customerList;
          this.show3 = true;
          break;
        case "贷款期限":
          if (this.termList.length == 0) {
            return;
          }
          this.valueKey = "loanCount";
          this.valueId = "loanCount";
          this.fieldName = "loanTerm";
          this.options = this.termList;
          this.show3 = true;
          break;
        case "放款平台":
          if (this.platform.length == 0) {
            return;
          }
          this.valueKey = "dsbrPltfrmNm";
          this.valueId = "value";
          this.fieldName = "loanPlatfomrId";
          this.options = this.platform;
          this.show3 = true;
          break;
        case "业务模式":
          let cars = this.projProjectInfo.cars;
          if (Array.isArray(cars) && cars.length > 0) {
            this.carType = cars[0].carType + "-" + cars[0].carType2;
            this.carNature = cars[0].carNature;
            this.productTypeList({
              type: 1,
              carType: cars[0].carType + "-" + cars[0].carType2,
              carNature: cars[0].carNature,
              companyId: this.projProjectInfo.companyId
            });
            if (this.businessModellist.length == 0) {
              return;
            }
            this.valueKey = "businessModeDesc";
            this.valueId = "businessMode";
            this.fieldName = "businessModel";
            this.options = this.businessModellist;
            this.show3 = true;
          }else{
            this.$notify({
              type: "danger",
              message: "请先添加车辆"
            });
            return;
          }
          break;
        case "产品类别":
          if (this.productTypeRows.length == 0) {
            return;
          }
          this.valueKey = "productCategory";
          this.valueId = "id";
          this.fieldName = field;
          this.options = this.productTypeRows;
          this.show3 = true;
          break;
        case "产品名称":
          if (this.productTypeName.length == 0) {
            return;
          }
          this.valueKey = "productName";
          this.valueId = "productId";
          this.fieldName = field;
          this.options = this.productTypeName;
          this.show3 = true;
          break;
        case "盗抢险":
          if (this.thiefRescueList.length == 0) {
            return;
          }
          this.valueKey = "name";
          this.valueId = "id";
          this.fieldName = "thiefRescue";
          this.options = this.thiefRescueList;
          this.show3 = true;
          break;
        case "盗抢险购买平台":
          this.platformList = this.platformList.length != 0?this.platformList:platformList;
          if (this.platformList.length == 0) {
            return;
          }
          this.valueKey = "rbrinsPltfrmNm";
          this.valueId = "id";
          this.fieldName = "rbrinsPltfrmNmId";
          this.options = this.platformList;
          this.show3 = true;
          break;
        case "下一节点处理人":
          this.show3 = true;
          break;
        default:
          break;
      }
    },
    // 字典选择确认
    confirm(row) {
      if (this.userlist) {
        this.processedBy = row.id;
        this.postProcess();
      } else {
        if (this.isWordbook) {
          this.projProjectInfo[this.fieldName] = row.value;
          this.projProjectInfo[this.fieldName + "Name"] = row.label;
          this.errorMsg[this.fieldName] = "";
          if (this.selectName == "业务来源") {
            this.getCustomer();
          }
        } else {
          this.projProjectInfo[this.fieldName] = row[this.valueId];
          this.projProjectInfo[this.fieldName + "Name"] = row[this.valueKey];
          this.errorMsg[this.fieldName] = "";
          switch (this.selectName) {
            case "业务来源":
              if (this.fieldName == "bsnSrc") {
                this.valueKey = "label";
                this.isWordbook = true;
                this.fieldName = "isAccessCar";
                this.options = this.wordbook.is_Access_Car;
                this.projProjectInfo.carDealersIdName = '';
                return;
              }
              break;
            case "业务模式":
              // 初始数据
              let arr = [
                "loanTerm",
                "dsbrPltfrmNm",
                "loanPlatfomrId",
                "productCategoryIdName",
                "productCategoryId",
                "productIdName",
                "productId",
                "thiefRescueName",
                "thiefRescue",
                "loanRegion",
                "guaranteeRate",
                "rebateStandard"
              ];
              arr.forEach(t => {
                this.projProjectInfo[t] = "";
              });
              // 其他
              this.productTypeList({
                type: 2,
                carType: this.carType,
                carNature: this.carNature,
                companyId: this.projProjectInfo.companyId,
                businessMode: this.projProjectInfo.businessModel
              });
              break;
            case "贷款期限":
              // 初始数据
              let arr3 = [
                "dsbrPltfrmNm",
                "loanPlatfomrId",
                "productCategoryIdName",
                "productCategoryId",
                "productIdName",
                "productId",
                "thiefRescueName",
                "thiefRescue",
                "loanRegion",
                "bankNewRate",
                "guaranteeRate",
                "rebateStandard"
              ];
              arr3.forEach(t => {
                this.projProjectInfo[t] = "";
              });
              this.loanPlatformTree(row.value);
              break;
            case "放款平台":
              // 初始数据
              let arr2 = [
                "productCategoryIdName",
                "productCategoryId",
                "productIdName",
                "productId",
                "thiefRescueName",
                "thiefRescue",
                "loanRegion",
                "guaranteeRate",
                "rebateStandard"
              ];
              arr2.forEach(t => {
                this.projProjectInfo[t] = "";
              });
              this.bankRate = row.intrt;
              this.projProjectInfo.bankNewRate = row.intrt;
              this.projProjectInfo.dsbrPltfrmNm = row.dsbrPltfrmNm;
              this.projProjectInfo.loanPlatfomrId = row.value;
              this.productTypeList({
                type: 3,
                carType: this.carType,
                carNature: this.carNature,
                companyId: this.projProjectInfo.companyId,
                businessMode: this.projProjectInfo.businessModelId,
                platformId: row.id
              });
              break;
            case "产品类别":
              // 初始数据
              let arr1 = [
                "productIdName",
                "productId",
                "thiefRescueName",
                "thiefRescue",
                "loanRegion",
                "guaranteeRate",
                "rebateStandard"
              ];
              arr1.forEach(t => {
                this.projProjectInfo[t] = "";
              });
              // 其他
              this.productTypeList({
                type: 4,
                companyId: this.projProjectInfo.companyId,
                productCategoryId: row.id
              });
              break;
            case "产品名称":
              // 初始数据
              let arr4 = [
                "thiefRescue",
                "loanRegion",
                "guaranteeRate",
                "rebateStandard"
              ];
              arr4.forEach(t => {
                this.projProjectInfo[t] = "";
              });
              this.productTypeList({
                type: 5,
                productId: row.productId
              });
              break;
            case "盗抢险购买平台":
              this.projProjectInfo.rbrinsPltfrmNmName = row.rbrinsPltfrmNm;
              this.projProjectInfo.rbrinsPltfrmNmId = row.id;
              break;

            default:
              break;
          }
        }
      }
      this.show3 = false;
    },
    // 字典选择取消
    cancel() {
      this.userlist = false;
      this.show3 = false;
    },
    returnVal(val, type) {
      switch (type) {
        case "array":
          val = val === null ? [] : val;
          break;
        case "number":
          val = val === null ? "" : Number(val);
          break;
        case "obj":
          val = val === null ? {} : val;
          break;
        default:
          val = val === null ? "" : val;
          break;
      }
      return val;
    },
    // 获取报单数据
    loanData() {
      if(JSON.parse(sessionStorage.getItem("pro"))){
        this.dealData(JSON.parse(sessionStorage.getItem("pro")));
        this.productName
      }else{
        Toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
          loadingType: "spinner",
          overlay: true
        });
        let projectId = this.params.projectNum?this.params.projectNum.replace('XM',''):'';
        getProjectInfo({
          id: this.params.projectId?this.params.projectId:projectId?projectId:this.params.businesskey
        })
          .then(res => {
            this.dealData(res);
            sessionStorage.setItem('pro',JSON.stringify(res));
          })
          .catch(() => {
            Toast.clear();
          });
      }
    },
    //处理初始化数据
    dealData(res){
      const { code, data, msg } = res;
      const {
        projectInfo,
        courseMap,
        thiefRescue,
        lpmsBusinessSource,
        ruleFlag
      } = data;
      let row = projectInfo;
      this.courseMap = courseMap;
      this.thiefRescueList = thiefRescue; // 获取盗抢险
      this.businessList = lpmsBusinessSource;//业务来源

      let loanPlatfomr = row.loanPlatfomr
        ? row.loanPlatfomr
        : {
            id: "",
            blngInstid: null,
            dsbrPltfrmNm: ""
          };
      let carDealer = row.carDealer
        ? row.carDealer
        : {
            id: ""
          };
      let customer = row.customer
        ? row.customer
        : {
            levelEducation: "",
            unitChar: "",
            marriage: "",
            customerName: "",
            certificateNum: "",
            contactPhone: "",
            spsNm: "",
            spsCrdtNo: "",
            spsCtcTel: "",
            spsCltrDgr: "",
            spsUnitChar: ""
          };

      let clientManager = row.clientManager
        ? row.clientManager
        : {
            groupName: "",
            businessGroupIds: ""
          };
      let loanProductModel = row.loanProductModel
        ? row.loanProductModel
        : {
            id: "",
            isAccessCar: ""
          };
      let cars = row.cars ? row.cars : [];
      let proPat = row.proPat
        ? row.proPat
        : {
            id: ""
          };
      let riskMeasure = row.riskMeasure ? row.riskMeasure : {};

      if (Array.isArray(cars) && cars.length > 0) {
        this.carType = cars[0].carType + "-" + cars[0].carType2;
        this.carNature = cars[0].carNature;
        this.productTypeList({
          type: 1,
          carType: cars[0].carType + "-" + cars[0].carType2,
          carNature: cars[0].carNature,
          companyId: row.companyId
        });
      }
      let projProjectInfo = sessionStorage.getItem('proInfo');
      if(!projProjectInfo){
        this.projProjectInfo = {
          loanPlatfomr: loanPlatfomr,
          carDealer: carDealer,
          customer: customer,
          cars: cars,
          clientManager: clientManager,
          loanProductModel: loanProductModel,
          proPat: proPat,
          riskMeasure: riskMeasure,
          wbtProvCityId:
            row.wbtProvCityZonCode == null
              ? []
              : row.wbtProvCityZonCode.split("-"),
          groupName: this.returnVal(clientManager.groupName),
          thiefRescue: this.returnVal(row.thiefRescue),
          carDealersId: carDealer.id,
          carDealersIdName: carDealer.carDealersName,
          bsnSrc: this.returnVal(loanProductModel.id),
          isAccessCar: this.returnVal(row.isAccessCar),
          businessGroupIds: this.returnVal(clientManager.businessGroupIds),
          customerName: this.returnVal(customer.customerName),
          levelEducation: this.returnVal(customer.levelEducation),
          unitChar: this.returnVal(customer.unitChar),
          marriage: this.returnVal(customer.marriage),
          certificateNum: this.returnVal(customer.certificateNum),
          contactPhone: this.returnVal(customer.contactPhone),
          spsNm: this.returnVal(customer.spsNm),
          spsCrdtNo: this.returnVal(customer.spsCrdtNo),
          spsCtcTel: this.returnVal(customer.spsCtcTel),
          spsCltrDgr: this.returnVal(customer.spsCltrDgr),
          spsUnitChar: this.returnVal(customer.spsUnitChar),
          rbrinsPltfrmNmId: this.returnVal(row.rbrinsPltfrmNmId, "number"),
          productCategoryId: this.returnVal(row.productCategoryId),
          loanPlatfomrId: this.returnVal(row.loanPlatId),
          loanPlatfomrs: row.loanPlatId,
          companyName: this.returnVal(row.companyName),
          officeName: this.returnVal(row.officeName),
          counterGuaranteeStatus: this.returnVal(row.counterGuaranteeStatus),
          wthrBl: this.returnVal(row.wthrBl),
          blRsn: this.returnVal(row.blRsn),
          addressDetail: this.returnVal(row.addressDetail),
          // sngldayPrd: this.custData.type === 'NEWOBL' ? utils.formatDate.format(new Date(), 'yyyyMMdd') : this.returnVal(row.sngldayPrd),
          businessModel: this.returnVal(row.businessModelId),
          rbrinsPltfrmNmName: this.returnVal(row.rbrinsPltfrmNmName), // 盗抢险购买平台
          // rbrinsPltfrmNmId: row.rbrinsPltfrmNmId?row.rbrinsPltfrmNmId:190109469838, // 盗抢险购买平台
          loanTerm: this.returnVal(row.loanTerm),
          loanAmt: this.numFilter(row.loanAmt),
          isQuickadjust: "0",
          isTandzero: this.returnVal(row.isTandzero),
          guaranteeRate: this.returnVal(row.guaranteeRate),
          bankNewRate: this.returnVal(row.bankNewRate),
          rebateStandard: this.returnVal(row.rebateStandard),
          loanRegion: this.returnVal(row.loanRegion),
          rentingAmtGps: this.numFilter(row.rentingAmtGps),
          surcharge: this.numFilter(row.surcharge),
          rentingCarRatio: this.returnVal(row.rentingCarRatio),
          rentingServiceFee: this.returnVal(row.rentingServiceFee),
          rentingAmt: this.returnVal(row.rentingAmt),
          marginRatio: this.returnVal(row.marginRatio),
          keepPrice: this.returnVal(row.keepPrice),
          concactNum: this.returnVal(row.concactNum),
          accountNum: this.returnVal(row.accountNum),
          accountName: this.returnVal(row.accountName),
          accountBank: this.returnVal(row.accountBank),
          wbtProvCityZonName: this.returnVal(row.wbtProvCityZon),
          wbtProvCityZon: row.wbtProvCityZon,
          wbtProvCityZonCode: row.wbtProvCityZonCode,
          paymentNumber: this.returnVal(row.paymentNumber),
          paymentNumberName: this.returnVal(row.paymentNumberName),
          customerBond: this.returnVal(row.customerBond),
          projectId: row.projectId,
          projectNo: row.projectNo,
          id: row.projectId,
          customerNum: row.customerNum,
          customerRate: row.customerRate,
          loanPercentage: row.loanPercentage,
          productCategoryIdName: row.productCategoryName,
          bankGuaranteeRate: row.bankGuaranteeRate,
          wbtProvCityZon: row.wbtProvCityZon,
          companyId: row.companyId,
          isChange: row.isChange,
          isChangeProj: row.isChangeProj,
          ruleFlag: ruleFlag,
          perfectMsg: row.perfectMsg,
          // 字典转换 --------------
          unitCharName: this.returnText("unit_Property", customer.unitChar),
          levelEducationName: this.returnText(
            "DegreeOfEducation",
            customer.levelEducation
          ),
          marriageName: this.returnText("marriage_type", customer.marriage),
          spsUnitCharName: this.returnText(
            "unit_Property",
            customer.spsUnitChar
          ),
          spsCltrDgrName: this.returnText(
            "DegreeOfEducation",
            customer.spsCltrDgr
          ),
          bsnSrcName: this.returnText(
            "",
            loanProductModel.id,
            this.businessList,
            "id",
            "labelName"
          ),
          isAccessCarName: this.returnText("is_Access_Car", row.isAccessCar),
          counterGuaranteeStatusName: row.counterGuaranteeStatus
            ? this.returnText(
                "counter_Guarantee_Status",
                row.counterGuaranteeStatus
              )
            : "无需担保",
          counterGuaranteeStatus: row.counterGuaranteeStatus
            ? row.counterGuaranteeStatus
            : "0",
          wthrBlName: this.returnText("yes_no", row.wthrBl),
          onHouseTypeName: this.returnText("ON_HOUSE_TYPE", row.onHouseType),
          isTandzeroName: this.returnText("yes_no", row.isTandzero),
          marginRatioName: this.returnText("Margin_Ratio", row.marginRatio),
          productIdName: proPat.productName,
          thiefRescueName: this.returnText(
            "",
            row.thiefRescue,
            thiefRescue,
            "id",
            "name"
          )
        };
      }else{
        this.projProjectInfo = JSON.parse(projProjectInfo);
      }
      console.log(this.projProjectInfo,1111)
      if (this.projProjectInfo.cars[0].carNature == "old_car") {
        this.loadImg();
      }
      setTimeout(() => {
        // 处理产品破数据
        this.changeRows(row);
        this.getCustomer();
        this.getPlatform();
        Toast.clear();
      }, 500);
    },
    // 查询放款平台
    loanPlatformTree(val) {
      if (val == undefined || val == null || val == "" || val == null) {
        return;
      }
      let obj = {
        loanCount: val,
        businessMode: this.projProjectInfo.businessModel
      };
      getLoanPlatformTree(obj).then(res => {
        if (res.code == 200) {
          let datas = [];
          let list = res.data;
          list.forEach(t => {
            if (t.children) {
              t.children.forEach(i => {
                datas.push({
                  value: i.id,
                  dsbrPltfrmNm: i.dsbrPltfrmNm,
                  bankCode: i.bankCode,
                  intrt: i.intrt
                });
              });
            }
          });
          this.platform = datas;

          if (this.projProjectInfo.loanPlatfomrId) {
            this.$set(
              this.projProjectInfo,
              "dsbrPltfrmNm",
              this.returnPlatform(
                this.projProjectInfo.loanPlatfomrId,
                this.platform
              )
            );
          }
        } else {
          this.$notify({ type: "danger", message: res.msg });
        }
      });
    },
    // 查询产品类别、名称、放款平台
    productTypeList(dataList) {
      getProductTypeList(dataList).then(res => {
        if (res.code == 200) {
          let list = res.data;
          // 1-查询业务模式，2-查询贷款期限，3-查询产品类别，4-查询产品列表，5-查询产品详细信息
          switch (dataList.type) {
            case 1:
              this.businessModellist = list;
              if (this.projProjectInfo.businessModel) {
                this.$set(
                  this.projProjectInfo,
                  "businessModelName",
                  this.returnText(
                    "",
                    this.projProjectInfo.businessModel,
                    list,
                    "businessMode",
                    "businessModeDesc"
                  )
                );
              }
              break;
            case 2:
              this.termList = list;
              break;
            case 3:
              this.productTypeRows = list;
              break;
            case 4:
              this.productTypeName = list;
              this.changeRows(this.projProjectInfo);
              break;
            case 5:
              let datas = list[0];
              this.projProjectInfo.rebateStandard = datas.rebateStandard;
              this.projProjectInfo.loanRegion =
                datas.businessMode === 1 || datas.businessMode === 3
                  ? datas.loanRegionForUnion
                  : datas.loanRegion;
              this.projProjectInfo.customerRate = datas.customerRate;
              this.projProjectInfo.bankGuaranteeRate = datas.bankGuaranteeRate;
              this.bankGuaranteeRate = datas.bankGuaranteeRate;
              if (this.projProjectInfo.businessModel == "4") {
                this.projProjectInfo.paymentNumber = datas.paymentNumber;
                this.projProjectInfo.paymentNumberDesc =
                  datas.paymentNumberDesc;
                this.projProjectInfo.customerBond = datas.customerBond;
              }
              let n = datas.thiefRescue.split(",");
              let p = datas.thiefRescueDesc.split(",");
              let ar = [];
              n.forEach((i, ins) => {
                p.forEach((t, int) => {
                  if (ins === int) {
                    ar.push({
                      id: i,
                      name: t
                    });
                  }
                });
              });
              this.thiefRescueList = ar;
              this.projProjectInfo.guaranteeRate = this.bankTotal.toFixed(2); // 计算担保费率
              break;

            default:
              break;
          }
        }
      });
    },
    // 保存信息
    submitProject() {
      if (this.isRule) {
        let yanzheng = true;
        for (let i = 0; i < this.projProjectInfo.cars.length; i++) {
          if (this.projProjectInfo.cars[i].carNature == "new_car") {
            if (!this.projProjectInfo.cars[i].salePrice) {
              yanzheng = false;
              this.$notify({
                type: "danger",
                message: "请填写车辆价格"
              });
              break;
            }
          }
        }
        if (yanzheng) {
          let formList = { ...this.projProjectInfo };
          var dataList = {
            projectId: formList.projectId,
            projectNo: formList.projectNo,
            id: formList.projectId,
            customer: formList.customer,
            loanProductModel: formList.loanProductModel,
            carDealer: formList.carDealer,
            proPat: formList.proPat,
            riskMeasure: formList.riskMeasure, //盗抢险
            clientManager: formList.clientManager, // 大区等
            cars: formList.cars, // 车辆
            customerNum: formList.customerNum,
            companyName: formList.companyName,
            companyId: formList.companyId,
            officeName: formList.officeName,
            customerName:
              formList.isChangeProj == "1"
                ? formList.spsNm
                : formList.customerName,
            certificateNum:
              formList.isChangeProj == "1"
                ? formList.spsCrdtNo
                : formList.certificateNum,
            contactPhone:
              formList.isChangeProj == "1"
                ? formList.spsCtcTel
                : formList.contactPhone,
            counterGuaranteeStatus: formList.counterGuaranteeStatus,
            wthrBl: formList.wthrBl,
            blRsn: formList.blRsn,
            addressDetail: formList.addressDetail,
            sngldayPrd: formList.sngldayPrd,
            productCategoryId: formList.productCategoryId,
            productCategoryName: formList.productCategoryIdName,
            productCategoryIdDesc: formList.productCategoryIdName,
            businessModelId: formList.businessModel,
            businessModelName: formList.businessModelName,
            loanTerm: formList.loanTerm,
            loanAmt: formList.loanAmt,
            isQuickadjust: formList.isQuickadjust,
            isTandzero: formList.isTandzero,
            guaranteeRate: formList.guaranteeRate,
            bankNewRate: formList.bankNewRate,
            rebateStandard: formList.rebateStandard,
            loanRegion: formList.loanRegion,
            rentingAmtGps: formList.rentingAmtGps,
            rentingCarRatio: formList.rentingCarRatio,
            rentingServiceFee: formList.rentingServiceFee,
            rentingAmt: formList.rentingAmt,
            marginRatio: formList.marginRatio,
            keepPrice: formList.keepPrice,
            concactNum: formList.concactNum,
            accountNum: formList.accountNum,
            accountName: formList.accountName,
            accountBank: formList.accountBank,
            // ------------------------------ 地址 --------
            wbtProvCityZonCode: formList.wbtProvCityZonCode,
            wbtProvCityZon: formList.wbtProvCityZonName,
            wbtProvCityZonDesc: formList.wbtProvCityZonName,
            rbrinsPltfrmNmName: formList.rbrinsPltfrmNmName,
            rbrinsPltfrmNmId: formList.rbrinsPltfrmNmId,
            thiefRescue: formList.thiefRescue,
            isAccessCar: formList.isAccessCar,
            bankGuaranteeRate: formList.bankGuaranteeRate,
            customerRate: formList.customerRate,
            dsbrPltfrmNm: formList.dsbrPltfrmNm,
            customerRate: formList.customerRate,
            loanPercentage: formList.loanPercentage,
            paymentNumber: formList.paymentNumber,
            paymentNumberDesc: formList.paymentNumberDesc,
            customerBond: formList.customerBond,
            isSaveRisk: "1", //是否保存风控措施 默认是
            certificateType: "1",
            bsnSrc: formList.bsnSrc,
            isChange: formList.isChange, // 是否有原单变更
            isChangeProj: formList.isChangeProj, // 是否有配偶互换
            // 嘉易融新加字段 --------------
            downPayment: formList.downPayment,
            downPaymentDesc: formList.downPaymentDesc,
            onHouseType: formList.onHouseType,
            insuranceCharge: formList.insuranceCharge,
            totalCharge: formList.totalCharge,
            isAffiliated: formList.isAffiliated,
            isAffiliatedDesc:
              formList.isAffiliated == 0
                ? "否"
                : formList.isAffiliated == 1
                ? "是"
                : "",
            gpsMeltingCharge: formList.gpsMeltingCharge,
            purchaseTaxCharge: formList.purchaseTaxCharge,
            surcharge: formList.surcharge
          };
          dataList.customer.levelEducation = formList.levelEducation;
          dataList.customer.unitChar = formList.unitChar;
          dataList.customer.marriage = formList.marriage;
          dataList.customer.customerName = formList.customerName;
          dataList.customer.certificateNum = formList.certificateNum;
          dataList.customer.contactPhone = formList.contactPhone;
          dataList.customer.spsNm = formList.spsNm;
          dataList.customer.spsCrdtNo = formList.spsCrdtNo;
          dataList.customer.spsCtcTel = formList.spsCtcTel;
          dataList.customer.spsCltrDgr = formList.spsCltrDgr;
          dataList.customer.spsUnitChar = formList.spsUnitChar;
          dataList.customer.spsCrdtTp = "1";
          dataList.loanProductModel.bsnSrc = formList.bsnSrc;
          dataList.loanProductModel.id = formList.bsnSrc;
          dataList.loanProductModel.isAccessCar = formList.isAccessCar;
          dataList.carDealer.id = formList.carDealersId;
          dataList.proPat.id = formList.productId;
          dataList.proPat.productName = formList.productName;
          dataList.proPat.rbrinsPltfrmNmName = formList.rbrinsPltfrmNmName;
          dataList.riskMeasure.tp = {};
          dataList.riskMeasure.tp.id = formList.rbrinsPltfrmNmId;

          dataList.loanPlatfomr = {};
          dataList.loanPlatfomr.id = formList.loanPlatfomrId;
          dataList.loanPlatfomr.dsbrPltfrmNm = formList.dsbrPltfrmNm;
          if (this.projProjectInfo.cars.length < 1) {
            this.$notify({
              type: "danger",
              message: "请添加车辆"
            });
          } else {
            this.postProject(dataList);
          }
        } else {
          this.$notify({
            type: "danger",
            message: "请检查信息的完整"
          });
        }
      }
    },
    // 提交数据
    postProject(dataList) {
      let num = 0;
      console.log(this.errorMsg);
      for (let item in this.errorMsg) {
        this.errorMsg[item] = this.returnMsg(item, this.projProjectInfo[item]);
        if (this.errorMsg[item]) {
          num++;
        }
      }
      if (num !== 0) {
        return;
      }
      this.dLoading = true;
      setProjectInfo(dataList)
        .then(res => {
          this.createTask();
        })
        .catch(() => {
          this.dLoading = false;
        });
    },
    // 提交流程
    createTask() {
      if (this.message == "") {
        this.message = "同意";
      }
      let obj = {
        wfBizComments: {
          conclusionCode: "01",
          businessKey: this.params.projectId?this.params.projectId:this.params.businesskey,
          commentsDesc: this.message
        },
        isPerfectMsg: this.assesstment ? "1" : "0",
        projCarInfo: {
          id: this.projProjectInfo.cars[0].id,
          engineNum: this.projProjectInfo.cars[0].engineNum
        }
      };
      setProjectTask(obj)
        .then(res => {
          let objArr = [];
          let { data } = res;
          this.userlist = true;
          data.list.forEach(t => {
            objArr.push({
              ...t,
              label: t.companyName + "-" + t.name
            });
          });
          this.options = objArr;
          this.loadType("下一节点处理人", "nextpeople");
          this.dLoading = false;
        })
        .catch(() => {
          this.dLoading = false;
        });
    },
    // 提交流程
    postProcess() {
      let obj = {
        conclusionCode: "01",
        businessKey: this.params.projectId?this.params.projectId:this.params.businesskey,
        commentsDesc: this.message,
        processedBy: this.processedBy
      };
      setProjectProcess(obj)
        .then(res => {
          this.$notify({
            type: "success",
            message: res.msg
          });
          this.dLoading = false;
          // this.$bridge.callHandler("jumpToTaskTab", "", res => {});
          if(this.params.newCus){
            this.$router.go(-2);
          }else{
            this.$router.go(-1);
          }
        })
        .catch(() => {
          this.dLoading = false;
        });
    },
    OCRScan() {
      this.show4 = true;
    },
    onSelect(rows) {
      this.$bridge.callHandler("idCardOCR", rows.value, res => {
        this.projProjectInfo.spsNm = res.ID_NAME || "";
        this.projProjectInfo.spsCrdtNo = res.ID_NUM || "";
        this.show4 = false;
      });
    },
    //点击完善信息
    conpleteInfo() {
      let info = {...this.params ,newPro: true};
      if(this.$route.query.dealState){
        this.$router.push({
          path: "/xhProject",
          query:{info:JSON.stringify(info),dealState:this.$route.query.dealState}
        });
      }else{
        this.$router.push({
          path: "/xhProject",
          query:info
        });
      }
        
    }
  },
  mounted() {
    if (this.$route.query.info) {
      this.params = JSON.parse(this.$route.query.info);
    } else {
      this.params = this.$route.query;
    }
    this.isView = this.params.isView == 0;
    if(this.$route.query.dealState){
      if(this.params.isView){
        this.isView = this.$route.query.dealState == 1 && this.isView && this.params.activityId == 'WF_PROJ_APPR_01_T01';
      }else{
        this.isView = this.$route.query.dealState == 1  && this.params.activityId == 'WF_PROJ_APPR_01_T01';
      }
    }
    // let datas = JSON.parse(sessionStorage.getItem("pro"));
    // let datas = null
    // if (!datas) {
    //   this.loanData();
    // }else{
    //   this.projProjectInfo = datas;
    //   if (datas.cars[0].carNature == "old_car") {
    //     this.loadImg();
    //   }
    // }
    this.loanData();
    this.rulesForm("order-project-xh");
  },
  destroyed () {
    sessionStorage.setItem("proInfo", JSON.stringify(this.projProjectInfo));
  }
};
</script>

<style lang="scss">
.xh-card-user {
  .van-cell {
    background-color: transparent;
    color: #fff;
    padding: 10px 0;
    .van-field__control,
    .van-cell__value,
    .van-cell__right-icon {
      color: #fff;
    }
    .labelClass,
    .van-field__error-message {
      text-align: right;
      color: #d3d3d3;
    }
  }
  .xh-card-head {
    .xh-OCR {
      float: right;
      width: 30px;
      height: auto;
      padding-right: 10px;
      padding-top: 0;
    }
  }
  .van-field__control:disabled {
    -webkit-text-fill-color: #fff;
  }
}
.xh-value-none {
  display: none;
}
</style>

