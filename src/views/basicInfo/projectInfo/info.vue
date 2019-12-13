<template>
  <div>
    <redCard label="客户基本信息">
      <template slot="cardBody">
        <div class="xh-card-user">
          <!-- 客户信息 -->
          <van-row class="xh-user">
            <section>
              <div class="van-cell">
                <div class="van-cell__title van-field__label">编号:</div>
                <div class="van-cell__value">{{ projProjectInfo.customer.customerNum }}</div>
              </div>
            </section>
            <section>
              <div class="van-cell">
                <div class="van-cell__title van-field__label">证件号码:</div>
                <div class="van-cell__value">{{ certificateNum }}</div>
              </div>
            </section>
            <section>
              <van-field
                v-model="customerName"
                clearable
                label="客户姓名:"
                input-align="right"
                :required="params.activityId == 'WF_PROJ_APPR_01_T12'?false:true"
                placeholder="请输入"
                :disabled="params.activityId == 'WF_PROJ_APPR_01_T12'?true:false"
                :error-message="errorMsg.customerName"
              />
            </section>
            <section>
              <van-field
                v-model="contactPhone"
                type="number"
                clearable
                label="联系电话:"
                input-align="right"
                :required="params.activityId == 'WF_PROJ_APPR_01_T12'?false:true"
                placeholder="请输入"
                :disabled="params.activityId == 'WF_PROJ_APPR_01_T12'?true:false"
                @blur.prevent="()=>{ return errorMsg.contactPhone = rules('phone',$event,this)}"
                :error-message="errorMsg.contactPhone"
              />
            </section>
            <section>
              <van-cell
                title="单位性质:"
                :required="params.activityId == 'WF_PROJ_APPR_01_T12'?false:true"
                :is-link="params.activityId == 'WF_PROJ_APPR_01_T12'?false:true"
                :value="spsType(projProjectInfo.customer == null ? '':projProjectInfo.customer.unitChar)"
                @click="params.activityId == 'WF_PROJ_APPR_01_T12'?true:loadList('car_nature','单位性质', 'customer.unitChar')"
              />
            </section>
            <section>
              <van-cell
                title="文化程度:"
                :required="params.activityId == 'WF_PROJ_APPR_01_T12'?false:true"
                :is-link="params.activityId == 'WF_PROJ_APPR_01_T12'?false:true"
                :value="projProjectInfo.customer == null ? '':projProjectInfo.customer.levelEducationDesc"
                @click="params.activityId == 'WF_PROJ_APPR_01_T12'?true:loadList('DegreeOfEducation','文化程度', 'customer.levelEducation')"
              />
            </section>
            <section>
              <van-cell
                title="婚姻状况:"
                :required="params.activityId == 'WF_PROJ_APPR_01_T12'?false:true"
                :is-link="params.activityId == 'WF_PROJ_APPR_01_T12'?false:true"
                :value="projProjectInfo.customer == null ? '':projProjectInfo.customer.marriageDesc"
                @click="params.activityId == 'WF_PROJ_APPR_01_T12'?true:loadList('marriage_type','婚姻状况', 'customer.marriage')"
              />
            </section>
          </van-row>
          <!-- 配偶信息 -->
          <div class="xh-card-head">
            配偶基本信息
            <img
              :src="require('./../../../assets/old_images/icon-ocr2.png')"
              class="xh-OCR"
              @click="OCRScan('1');"
            />
          </div>
          <van-row class="xh-user">
            <section>
              <van-field
                v-model="spsNm"
                clearable
                :required="params.activityId == 'WF_PROJ_APPR_01_T12'?false:true"
                label="配偶姓名:"
                input-align="right"
                placeholder="请输入"
                :disabled="params.activityId == 'WF_PROJ_APPR_01_T12'?true:false"
              />
            </section>
            <section>
              <van-field
                v-model="spsCtcTel"
                type="number"
                :required="params.activityId == 'WF_PROJ_APPR_01_T12'?false:true"
                clearable
                label="联系电话:"
                input-align="right"
                placeholder="请输入"
                :disabled="params.activityId == 'WF_PROJ_APPR_01_T12'?true:false"
                @blur.prevent="()=>{ return errorMsg.spsCtcTel = rules('phone',$event,this)}"
                :error-message="errorMsg.spsCtcTel"
              />
            </section>
            <section>
              <van-field
                v-model="spsCrdtNo"
                :required="params.activityId == 'WF_PROJ_APPR_01_T12'?false:true"
                clearable
                label="证件号码:"
                input-align="right"
                placeholder="请输入"
                :disabled="params.activityId == 'WF_PROJ_APPR_01_T12'?true:false"
                @blur.prevent="()=>{ return errorMsg.spsCrdtNo = cpCertificateNum($event)}"
                :error-message="errorMsg.spsCrdtNo"
              />
            </section>
            <section>
              <van-cell
                title="单位性质:"
                :required="params.activityId == 'WF_PROJ_APPR_01_T12'?false:true"
                :is-link="params.activityId == 'WF_PROJ_APPR_01_T12'?false:true"
                :value="spsType(projProjectInfo.customer == null ? '':projProjectInfo.customer.spsUnitChar)"
                @click="params.activityId == 'WF_PROJ_APPR_01_T12'?true:loadList('unit_Property','配偶单位性质', 'customer.spsUnitChar')"
              />
            </section>
            <section>
              <van-cell
                title="文化程度:"
                :required="params.activityId == 'WF_PROJ_APPR_01_T12'?false:true"
                :is-link="params.activityId == 'WF_PROJ_APPR_01_T12'?false:true"
                :value="projProjectInfo.customer == null ? '':projProjectInfo.customer.spsCltrDgrDesc"
                @click="params.activityId == 'WF_PROJ_APPR_01_T12'?true:loadList('DegreeOfEducation','配偶文化程度', 'customer.spsCltrDgr')"
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
              required
              is-link
              :value="(projProjectInfo.isAccessCarDesc == '' || projProjectInfo.isAccessCarDesc == null)?'':(projProjectInfo.bsnSrcDesc + ' | ' + projProjectInfo.isAccessCarDesc)"
              @click="loadList('business_origin','业务来源','loanProductModel.bsnSrc')"
            />
          </section>
          <!-- 接口请求 -->
          <section>
            <van-cell
              title="车商:"
              required
              is-link
              :value="projProjectInfo.carDealer == null ? '':projProjectInfo.carDealer.carDealersName"
              @click="loadType('CarDealer','车商',projProjectInfo.carDealer.id)"
            />
          </section>
          <section>
            <van-cell
              title="反担保状况:"
              required
              is-link
              :value="projProjectInfo.counterGuaranteeStatusDesc"
              @click="loadList('counter_Guarantee_Status','反担保状况', 'counterGuaranteeStatus')"
            />
          </section>
          <section>
            <van-cell
              title="是否拆单:"
              required
              is-link
              :value="projProjectInfo.wthrBlDesc"
              @click="loadList('yes_no','是否拆单','wthrBl')"
            />
          </section>
          <section v-if="projProjectInfo.wthrBl=='1'">
            <van-field
              v-model="projProjectInfo.blRsn"
              clearable
              label="拆单原因:"
              input-align="right"
              placeholder="请输入拆单原因"
            />
          </section>
          <section>
            <van-cell
              title="预调查地址:"
              required
              is-link
              :value="projProjectInfo.wbtProvCityZon"
              @click="show2 = true"
            />
          </section>
          <section>
            <van-field
              v-model="projProjectInfo.addressDetail"
              required
              clearable
              label="具体地址:"
              input-align="right"
              placeholder="请输入详细地址"
            />
          </section>
        </van-col>
      </van-row>
    </Card>
    <!-- 车辆信息 -->
    <Card class="xh-top-10">
      <template v-slot:header>
        <section class="xh-plus">
          <van-cell
            :title="projProjectInfo.cars && projProjectInfo.cars.length > 0 && projProjectInfo.isAses != '1'?'车辆信息（请侧滑进行编辑或删除）':'车辆信息'"
          >
            <!-- <van-icon
              slot="right-icon"
              name="plus"
              style="line-height: inherit;"
              @click="pullCars"
              v-if="projProjectInfo.isAses == '1' ? false : true"
            />-->
            <van-icon
              slot="right-icon"
              name="plus"
              style="line-height: inherit;"
              @click="pullCars"
            />
          </van-cell>
        </section>
      </template>
      <van-row class="xh-swipe-button">
        <van-col span="24" v-for="(i,index) in projProjectInfo.cars" :key="index">
          <van-swipe-cell right-width="110">
            <section>
              <van-cell title="车辆类别:" :value="i.carTypeDesc+' '+i.carType2Desc" />
            </section>
            <section>
              <van-cell title="车辆性质:" :value="i.carNatureDesc" />
            </section>
            <section>
              <van-cell title="车辆规格:" :value="i.carSpecificationsDesc" />
            </section>
            <section>
              <van-cell title="车辆来源:" :value="i.carSourceDesc" />
            </section>
            <section>
              <van-cell title="车辆品牌:" :value="i.automarke.brndNm" />
            </section>
            <section>
              <van-cell title="车系:" :value="i.automarke.carSeries" />
            </section>
            <section>
              <van-cell title="车辆型号:" :value="i.automarke.carModel" />
            </section>
            <section v-show="i.chassisNumber">
              <van-cell title="车架号:" :value="i.chassisNumber" />
            </section>
            <section>
              <van-cell title="销售价(元):" :value="i.salePrice" />
            </section>
            <!-- 二手车是否已评估 isAses 评估后显示-->
            <div v-if="projProjectInfo.isAses == '1'">
              <section>
                <van-cell title="评估价(元)：" :value="i.estimateOriginalPrice" />
              </section>
              <section>
                <van-cell title="最高送审金额(元)：" :value="i.hgstAmt" />
              </section>
              <section>
                <van-cell title="评估公司：" :value="i.asesInstNm" />
              </section>
            </div>
            <section>
              <van-cell title="备注：" :value="i.remark" />
            </section>
            <span slot="right" v-if="projProjectInfo.isAses == '1' ? false : true">
              <van-button
                type="warning"
                style="height:100%;border-radius: 0;"
                @click.native="carsEdit(i)"
              >修改</van-button>
              <van-button
                type="danger"
                style="height:100%;border-radius: 0;"
                @click.native="carsDel(i)"
              >删除</van-button>
            </span>
          </van-swipe-cell>
        </van-col>
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
              required
              is-link
              :value="projProjectInfo.businessModelName"
              @click="loadList('business_mode','业务模式','businessModelName')"
            />
          </section>
          <section>
            <van-cell
              title="贷款期限:"
              required
              is-link
              :value="projProjectInfo.loanTerm"
              @click="loadType('DEADLINE','贷款期限','loanTerm')"
            />
          </section>
          <!-- 请求接口 -->
          <section>
            <van-cell
              title="放款平台:"
              required
              is-link
              :value="projProjectInfo.loanPlatfomr==null?'':projProjectInfo.loanPlatfomr.dsbrPltfrmNm"
              @click="loadType(6,'放款平台',projProjectInfo.platform)"
            />
          </section>
          <section v-if="projProjectInfo.businessModelId == 5">
            <van-cell
              title="上户类型:"
              required
              is-link
              :value="projProjectInfo.onHouseTypeDesc"
              @click="loadList('ON_HOUSE_TYPE','上户类型', 'onHouseType')"
            />
          </section>
          <section>
            <van-cell
              title="产品类别:"
              required
              is-link
              :value="projProjectInfo.productCategoryIdDesc"
              @click="loadType(5,'产品类别',projProjectInfo.productCategoryId)"
            />
          </section>
          <section>
            <van-cell
              title="产品名称:"
              required
              is-link
              :value="projProjectInfo.productName"
              @click="loadType(7,'产品名称',projProjectInfo.proPat==null?'':projProjectInfo.proPat.id)"
            />
          </section>
          <section>
            <van-field
              v-model="projProjectInfo.loanAmt"
              type="number"
              required
              clearable
              label="银行贷款金额(元):"
              input-align="right"
              placeholder="请输入"
              @blur.prevent="compareCount"
              :error-message="errorMsg.loanAmt"
            />
          </section>
          <!-- 中建投 -->
          <div v-if="projProjectInfo.businessModelId==4">
            <section>
              <van-cell title="客户首付成数:" :value="projProjectInfo.paymentNumberDesc" />
            </section>
            <section>
              <van-cell title="客户保证金(%):" :value="projProjectInfo.customerBond" />
            </section>
          </div>
          <div v-if="projProjectInfo.businessModelId != 4">
            <section>
              <van-cell
                title="盗抢险:"
                required
                is-link
                value="SubDicForText('thiefRescueList',projProjectInfo.thiefRescue)"
                @click="loadType(8,'盗抢险',projProjectInfo.thiefRescue)"
              />
            </section>
            <section>
              <van-cell
                title="盗抢险购买平台:"
                required
                is-link
                :value="projProjectInfo.rbrinsPltfrmNmName"
                @click="loadType(9,'盗抢险购买平台', projProjectInfo.rbrinsPltfrmNmId == null?'':projProjectInfo.rbrinsPltfrmNmId)"
              />
            </section>
            <!-- 嘉易融产品 -->
            <div v-if="projProjectInfo.businessModelId == 5">
              <section>
                <van-cell title="首付比例:" required :value="projProjectInfo.downPaymentDesc" />
              </section>
              <section>
                <van-cell title=" 是否挂靠:" required :value="projProjectInfo.isAffiliatedDesc" />
              </section>
            </div>
            <section>
              <van-cell title="贷款金额区间:" :value="projProjectInfo.loanRegion" />
            </section>
          </div>
          <section>
            <van-cell title="银行费率(%):" :value="projProjectInfo.bankNewRate" />
          </section>
          <section>
            <van-cell title="担保费率(%):" :value="projProjectInfo.guaranteeRate" />
          </section>
          <section>
            <van-cell title="返利费率(%):" :value="projProjectInfo.rebateStandard" />
          </section>

          <!-- 是联合贷 -->
          <div v-if="projProjectInfo.businessModelId==2">
            <section>
              <van-field
                v-model="projProjectInfo.rentingCarRatio"
                type="number"
                required
                clearable
                label="加融车价金额(元):"
                input-align="right"
                placeholder="请输入"
                @blur.prevent="rentingCarRatioCount"
                :error-message="errorMsg.rentingCarRatio"
              />
            </section>
            <section>
              <van-field
                v-model="projProjectInfo.rentingServiceFee"
                type="number"
                required
                clearable
                label="担保服务费(元)："
                input-align="right"
                placeholder="请输入"
                @blur.prevent="rentingServiceFeeCount"
                :error-message="errorMsg.rentingServiceFee"
              />
            </section>
            <section>
              <van-field
                v-model="projProjectInfo.rentingRatio"
                type="number"
                clearable
                label="加融车价比例%:"
                disabled
                input-align="right"
                placeholder="加融车价金额/销售价"
                error
              />
            </section>
            <section>
              <van-field
                v-model="projProjectInfo.rentingAmt"
                type="number"
                clearable
                label="加融总金额(元):"
                disabled
                input-align="right"
                placeholder="加融车价金额+担保服务费"
                error
              />
            </section>
            <section>
              <van-field
                v-model="projProjectInfo.totalLoanAmt"
                type="number"
                clearable
                required
                label="贷款总金额(元):"
                disabled
                input-align="right"
                placeholder="银行贷款金额+加融车价金额"
                error
              />
            </section>
          </div>
          <!-- 融租公司 or 是联合贷 -->
          <section>
            <van-cell
              title="是否满足快提快调:"
              value="SubDicForText('isLook',projProjectInfo.isQuickadjust)"
            />
          </section>
          <section v-if="projProjectInfo.isQuickadjust=='1'">
            <van-cell
              title="是否t+0:"
              is-link
              required
              value="SubDicForText('isLook',projProjectInfo.isTandzero)"
              @click="loadList('yes_no','是否t+0','isTandzero')"
            />
          </section>
          <!-- 嘉易融产品 -->
          <div v-if="projProjectInfo.businessModelId == 5">
            <section>
              <van-field
                v-model="projProjectInfo.gpsMeltingCharge"
                required
                type="number"
                clearable
                label="GPS加融费用(元):"
                input-align="right"
                placeholder="请输入"
              />
            </section>
            <section>
              <van-field
                v-model="projProjectInfo.purchaseTaxCharge"
                required
                type="number"
                clearable
                label="购置税加融金额(元):"
                input-align="right"
                placeholder="请输入"
              />
            </section>
            <section>
              <van-field
                v-model="projProjectInfo.insuranceCharge"
                required
                type="number"
                clearable
                label="保险加融费用(元):"
                input-align="right"
                placeholder="请输入"
              />
            </section>
            <section>
              <van-field
                v-model="projProjectInfo.totalCharge"
                type="number"
                clearable
                label="加融总金额(元):"
                input-align="right"
                placeholder="请输入"
              />
            </section>
          </div>
          <section v-if="projProjectInfo.businessModelId != 5">
            <van-field
              v-model="projProjectInfo.rentingAmtGps"
              type="number"
              clearable
              label="加融金额(元):"
              input-align="right"
              placeholder="(含GPS加融费用)"
            />
          </section>

          <div
            v-if="projProjectInfo.businessModelId==1 || projProjectInfo.businessModelId==2 || projProjectInfo.businessModelId==3"
          >
            <section>
              <van-cell
                is-link
                :value="projProjectInfo.marginRatio"
                title="保证金比例(%):"
                @click="loadList('Margin_Ratio','保证金比例','marginRatio')"
                :disabled="projProjectInfo.businessModelId==2?true:false"
              />
            </section>
            <section>
              <van-field
                v-model="projProjectInfo.keepPrice"
                type="number"
                clearable
                label="留购价(元):"
                input-align="right"
                placeholder="请输入"
                :disabled="projProjectInfo.businessModelId=='2'?true:false"
              />
            </section>
            <section>
              <van-field
                v-model="projProjectInfo.concactNum"
                clearable
                label="合同编号:"
                input-align="right"
                placeholder="请输入"
              />
            </section>
            <section>
              <van-field
                v-model="projProjectInfo.accountNum"
                type="number"
                clearable
                label="还款卡号:"
                input-align="right"
                placeholder="请输入"
              />
            </section>
            <section>
              <van-field
                v-model="projProjectInfo.accountName"
                clearable
                label="还款卡账户名称:"
                input-align="right"
                placeholder="请输入"
              />
            </section>
            <section>
              <van-field
                v-model="projProjectInfo.accountBank"
                clearable
                label="还款卡开户行:"
                input-align="right"
                placeholder="请输入"
              />
            </section>
          </div>
          <section>
            <van-field
              v-model="projProjectInfo.surcharge"
              type="number"
              clearable
              label="附加费(元):"
              input-align="right"
              placeholder="请填写附加费"
            />
          </section>
        </van-col>
      </van-row>
    </Card>

    <!-- 提交按钮 -->
    <div class="xh-submit" style="padding: 20px 0;">
      <van-button size="large" class="xh-bg-main" @click="submit" :loading="loading">保 存</van-button>
    </div>

    <!-- 弹出选项 -->
    <van-action-sheet get-container="#app" v-model="show3" class="xh-list">
      <div class="xh-list-body">
        <van-picker
          :columns="options"
          show-toolbar
          value-key="label"
          :title="selectName"
          @confirm="onSelect"
          @cancel="cancel"
          @change="onChange"
        />
      </div>
    </van-action-sheet>
    <!-- 弹出省市区 -->
    <van-action-sheet get-container="#app" v-model="show2" title class="xh-list">
      <div class="xh-list-body">
        <van-area
          :area-list="areaList"
          :value="projProjectInfo.wbtProvCityZonCode"
          @confirm="confirmSelect"
          @cancel="cancelSelect"
        />
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import Vue from "vue";
// 自定义组件
import redCard from "@/components/redCard/index";
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
  SwipeCell
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
  SwipeCell
];

Components.forEach(item => {
  Vue.use(item);
});
import { mapState } from "vuex";

export default {
  name: "projectInfo",
  components: {
    redCard,
    Card
  },
  computed: {
    // 所有字典
    ...mapState({
      wordbook: state => state.user.wordbook,
    })
  },
  data() {
    return {
      params: {},
      show3: false, //弹框选择
      show2: false, //地址选择
      loading: false,
      options: [], // 字典集合
      isNum: "",
      isVal: "",
      selectName: "",
      areaList: {
        province_list: {},
        city_list: {},
        county_list: {}
      },
      bankArr: [], //银行数组
      bankList: {},
      customerName: "", // 客户名字
      contactPhone: "", // 客户电话
      certificateNum: "", // 客户证件号码
      certificateTypeDesc: "", // 客户证件描述
      spsNm: "", // 客户配偶名字
      spsCtcTel: "", // 客户配偶电话
      spsCrdtNo: "", // 客户配偶证件号码
      spsCrdtTpDesc: "", // 客户配偶证件描述
      selectType: "", //选择的类别
      projProjectInfo: {
        customer: {},
        projectId: "",
        loanProductModel: {
          bsnVrtyName: "", // 业务品种
          bsnSrc: "", // 业务来源
          id: "",
          isAccessCar: "",
          isAccessCarDesc: ""
        },
        carDealer: {
          id: ""
        },
        proPat: {
          id: "",
          delFlag: "0"
        },
        riskMeasure: {
          payInsurance: "",
          tp: {}
        }, //盗抢险
        loanPlatfomr: {
          id: "",
          dsbrPltfrmNm: ""
        }, //放款平台
        wbtProvCityZon: "",
        gpsMeltingCharge: 0,
        purchaseTaxCharge: 0,
        insuranceCharge: 0,
        isAses: 0,
        cars: [{ automarke: { brndNm: "wee" }, carNatureDesc: "kkkk" }]
      },
      lpmsBusinessSource: [], //业务来源
      businessModellist: [], //业务模式
      loanCountList: [], //贷款期限
      // businessModellist:[],//业务模式
      getProductCategory: [], //产品类别
      platform: [], //放款平台
      pattern: [], //产品名称
      payInsurance: [], //盗抢险
      loanRegion: "", //贷款区间
      buyPlatform: [], //盗抢险购买平台
      rules: {},
      imgList: [], //图片
      errorMsg: {
        // 验证初始化
        customerName: "",
        contactPhone: "",
        unitChar: "",
        levelEducation: "",
        marriage: "",
        isAccessCar: "",
        carDealersName: "",
        counterGuaranteeStatus: "",
        wthrBl: "",
        wthrDcn: "",
        wbtProvCityZon: "",
        addressDetail: "",
        productCategoryId: "",
        dsbrPltfrmNm: "",
        productName: "",
        loanAmt: "" //银行贷款金额
      },
      spsType: val => {
        switch (val) {
          case "1":
            return "国企/事业单位/机关团体（合同工/正式员工）";
            break;
          case "2":
            return "私企";
            break;
          case "3":
            return "个体商户";
            break;
          case "4":
            return "自由职业";
            break;
          default:
            return;
        }
      },
      selected: ["4"],
      courseText: "", //风控条件
      carNature: "", //车辆性质
      carType: "", //车辆类型
      carType2: "", //车辆类型2
      paramsType: 1,
      // SubDicForText: SubDicForText,
      che300List: [], // 车三百评估列表
      platformId: "" //
    };
  },
  methods: {
    pullCars() {
      this.$router.push("/vehicle");
    },
    // 字典获取数据
    loadList(state, title, field) {
      this.show3 = true;
      this.options = this.wordbook[state];
      this.selectName = title;
    },
    // 其他接口数据
    loadType() {

    }
  },
  mounted() {}
};
</script>

<style lang="scss">
.xh-card-user {
  .van-cell {
    background-color: transparent;
    color: #fff;
    padding: 10px 0;
    .van-field__control,
    .van-cell__right-icon {
      color: #fff;
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
}
// 滑动删除
.xh-swipe-button {
  .van-swipe-cell__right {
    padding-left: 5px;
  }
}
</style>

