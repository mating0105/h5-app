<template>
  <div class="xh-page-body">
    <redCard label="客户基本信息">
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
              <van-field
                v-model="projProjectInfo.customerName"
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
                v-model="projProjectInfo.contactPhone"
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
                :value="projProjectInfo.unitCharName"
                @click="params.activityId == 'WF_PROJ_APPR_01_T12'?true:loadList('unit_Property','单位性质', 'unitChar')"
              />
            </section>
            <section>
              <van-cell
                title="文化程度:"
                :required="params.activityId == 'WF_PROJ_APPR_01_T12'?false:true"
                :is-link="params.activityId == 'WF_PROJ_APPR_01_T12'?false:true"
                :value="projProjectInfo.levelEducationName"
                @click="params.activityId == 'WF_PROJ_APPR_01_T12'?true:loadList('DegreeOfEducation','文化程度', 'levelEducation')"
              />
            </section>
            <section>
              <van-cell
                title="婚姻状况:"
                :required="params.activityId == 'WF_PROJ_APPR_01_T12'?false:true"
                :is-link="params.activityId == 'WF_PROJ_APPR_01_T12'?false:true"
                :value="projProjectInfo.marriageName"
                @click="params.activityId == 'WF_PROJ_APPR_01_T12'?true:loadList('marriage_type','婚姻状况', 'marriage')"
              />
            </section>
          </van-row>
          <!-- 配偶信息 -->
          <div class="xh-card-head" v-if="projProjectInfo.marriage == '2' || projProjectInfo.marriage == '4'">
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
                v-model="projProjectInfo.spsNm"
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
                v-model="projProjectInfo.spsCtcTel"
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
                v-model="projProjectInfo.spsCrdtNo"
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
                :value="projProjectInfo.spsUnitCharName"
                @click="params.activityId == 'WF_PROJ_APPR_01_T12'?true:loadList('unit_Property','配偶单位性质', 'spsUnitChar')"
              />
            </section>
            <section>
              <van-cell
                title="文化程度:"
                :required="params.activityId == 'WF_PROJ_APPR_01_T12'?false:true"
                :is-link="params.activityId == 'WF_PROJ_APPR_01_T12'?false:true"
                :value="projProjectInfo.spsCltrDgrName"
                @click="params.activityId == 'WF_PROJ_APPR_01_T12'?true:loadList('DegreeOfEducation','配偶文化程度', 'spsCltrDgr')"
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
              :value="(projProjectInfo.bsnSrcName?projProjectInfo.bsnSrcName:'') + (projProjectInfo.isAccessCarName?' | '+projProjectInfo.isAccessCarName:'')"
              @click="loadList('business_origin','业务来源','bsnSrc')"
            />
          </section>
          <!-- 接口请求 -->
          <section>
            <van-cell
              title="车商:"
              required
              is-link
              :value="projProjectInfo.carDealersName"
              @click="loadType('车商', 'carDealerId')"
            />
          </section>
          <section>
            <van-cell
              title="反担保状况:"
              required
              is-link
              :value="projProjectInfo.counterGuaranteeStatusName"
              @click="loadList('counter_Guarantee_Status','反担保状况', 'counterGuaranteeStatus')"
            />
          </section>
          <section>
            <van-cell
              title="是否拆单:"
              required
              is-link
              :value="projProjectInfo.wthrBlName"
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
              :value="projProjectInfo.wbtProvCityZonName"
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
          <van-swipe-cell :right-width="130" :disabled="i.isCreditAdd == '1'?true:false">
            <section>
              <van-cell title="车辆类别:" :value="returnText('car_type',i.carType)+' '+returnText('car_type2',i.carType2)" />
            </section>
            <section>
              <van-cell title="车辆性质:" :value="returnText('car_nature',i.carNature)" />
            </section>
            <section>
              <van-cell title="车辆规格:" :value="returnText('vehicle_specifications',i.carSpecifications)" />
            </section>
            <section>
              <van-cell title="车辆来源:" :value="returnText('CAR_SOURCE',i.carSource)" />
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
              @click="loadType('业务模式','businessModel')"
            />
          </section>
          <section>
            <van-cell
              title="贷款期限:"
              required
              is-link
              :value="projProjectInfo.loanTerm"
              @click="loadType('贷款期限','loanTerm')"
            />
          </section>
          <!-- 请求接口 -->
          <section>
            <van-cell
              title="放款平台:"
              required
              is-link
              :value="projProjectInfo.dsbrPltfrmNm"
              @click="loadType('放款平台','platform')"
            />
          </section>
          <section>
            <van-cell
              title="产品类别:"
              required
              is-link
              :value="projProjectInfo.productCategoryIdName"
              @click="loadType('产品类别','productCategoryId')"
            />
          </section>
          <section>
            <van-cell
              title="产品名称:"
              required
              is-link
              :value="projProjectInfo.productName"
              @click="loadType('产品名称','productId')"
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
          <div v-if="projProjectInfo.businessModel==4">
            <section>
              <van-cell title="客户首付成数:" :value="projProjectInfo.paymentNumberName" />
            </section>
            <section>
              <van-cell title="客户保证金(%):" :value="projProjectInfo.customerBond" />
            </section>
          </div>
          <div v-if="projProjectInfo.businessModel != 4">
            <section>
              <van-cell
                title="盗抢险:"
                required
                is-link
                :value="projProjectInfo.thiefRescueName"
                @click="loadType('盗抢险','thiefRescue')"
              />
            </section>
            <section>
              <van-cell
                title="盗抢险购买平台:"
                required
                is-link
                :value="projProjectInfo.rbrinsPltfrmNmName"
                @click="loadType('盗抢险购买平台', 'rbrinsPltfrmNmId')"
              />
            </section>
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
          <div v-if="projProjectInfo.businessModel==2">
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
          <section v-if="projProjectInfo.isQuickadjust=='1'">
            <van-cell
              title="是否t+0:"
              is-link
              required
              :value="projProjectInfo.isTandzeroName"
              @click="loadList('yes_no','是否t+0','isTandzero')"
            />
          </section>
          <section>
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
            v-if="projProjectInfo.businessModel==1 || projProjectInfo.businessModel==2 || projProjectInfo.businessModel==3"
          >
            <section>
              <van-cell
                is-link
                :value="projProjectInfo.marginRatioName"
                title="保证金比例(%):"
                @click="loadList('Margin_Ratio','保证金比例','marginRatio')"
                :disabled="projProjectInfo.businessModel==2?true:false"
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
                :disabled="projProjectInfo.businessModel=='2'?true:false"
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
      <van-button size="large" class="xh-bg-main" @click="submitProject" :loading="loading">保 存</van-button>
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
import { getProjectInfo, getProjectCustomer, getProductTypeList, getLoanPlatformTree } from "@/api/project";
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
  SwipeCell,
  Toast
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
      params: {}, // 传过来的数据
      show3: false, //弹框选择
      show2: false, //地址选择
      loading: false,
      options: [], // 字典集合
      valueKey: 'label', // 下拉选择取的哪个描述值
      valueId: '', // 下拉选择取的哪个value值
      thiefRescueList: [], // 盗抢险组数
      isWordbook: true, // 是否从字典获取
      businessModellist: [], //业务模式
      termList: [], //贷款期限
      platform: [], //放款平台

      isNum: "",
      isVal: "",
      selectName: "",
      fieldName: "", // 选择字段名
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
      certificateTypeName: "", // 客户证件描述
      spsNm: "", // 客户配偶名字
      spsCtcTel: "", // 客户配偶电话
      spsCrdtNo: "", // 客户配偶证件号码
      spsCrdtTpName: "", // 客户配偶证件描述
      selectType: "", //选择的类别
      projProjectInfo: {
        loanPlatfomrs: [],
        companyName: '',
        officeName: '',
        groupName: '',
        businessGroupIds: '',
        contactPhone: '',
        levelEducation: '',
        unitChar: '',
        marriage: '',
        customerName: '',
        certificateNum: '',
        spsCltrDgr: '',
        spsUnitChar: '',
        bsnSrc: '',
        isAccessCar: '',
        carDealersId: '',
        counterGuaranteeStatus: '',
        wthrBl: '',
        blRsn: '',
        addressDetail: '',
        sngldayPrd: '',
        productCategoryId: '',
        loanPlatfomrId: '',
        productId: '',
        thiefRescue: '',
        businessModel: '',
        businessModelName: '',
        rbrinsPltfrmNmId: '',
        rbrinsPltfrmNmName: '', // 盗抢险购买平台
        loanTerm: '',
        loanAmt: '',
        isQuickadjust: '',
        isTandzero: '',
        guaranteeRate: '',
        bankNewRate: '',
        rebateStandard: '',
        loanRegion: '',
        rentingAmtGps: '',
        rentingCarRatio: '',
        rentingServiceFee: '',
        rentingAmt: '',
        marginRatio: '',
        keepPrice: '',
        concactNum: '',
        accountNum: '',
        accountName: '',
        accountBank: '',
        spsNm: '',
        spsCrdtNo: '',
        spsCtcTel: '',
        wbtProvCityId: [],
        wbtProvCityZonName: '',
        productName: '',
        customerBond: '',
        paymentNumber: '',
        paymentNumberName: '',
        ruleFlag: '',
        cars: [],
      },
      lpmsBusinessSource: [], //业务来源
      getProductCategory: [], //产品类别
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
    // 字典转换
    returnText(n, val) {
      let name;
      this.wordbook[n].forEach(e => {
        if(e.value == val) {
          name = e.label;
        }
      });
      return name;
    },
    // 获取车商
    getCustomer() {
      if(this.projProjectInfo.businessGroupIds && this.projProjectInfo.isAccessCar) {
        let list = {
          belongGroupId: this.projProjectInfo.businessGroupIds,
          state: this.projProjectInfo.isAccessCar
        }
        getProjectCustomer(list)
          .then(res => {
            if (res.code == 200) {
              this.customerList = res.data.data;
            } else {
              this.$notify({ type: 'danger', message: res.msg });
            }
          })
      }
    },
    // 字典获取数据
    loadList(state, title, field) {
      this.valueKey = 'label';
      this.show3 = true;
      this.isWordbook = true;
      this.options = this.wordbook[state];
      this.selectName = title;
      this.fieldName = field;
    },
    // 省市区选择
    confirmSelect() {
      
    },
    // 省市区取消
    cancelSelect() {
      
    },
    // 其他接口数据
    loadType(title, field) {
      this.selectName = title;
      this.isWordbook = false;
      this.fieldName = field;
      switch (title) {
        case '车商':
          this.getCustomer();
          break;
        case '贷款期限':
          if(this.termList == 0) {
            return
          }
          this.valueKey = 'loanCount';
          this.valueId = 'loanCount';
          this.fieldName = 'loanTerm';
          this.options = this.termList;
          this.show3 = true;
          break;
        case '放款平台':
          if(this.platform.length == 0) {
            return
          }
          console.log(this.platform);
          this.valueKey = 'orgName';
          this.valueId = 'id';
          this.fieldName = 'isRoot';
          this.options = this.platform;
          this.show3 = true;
          break;
        case '业务模式':
          this.valueKey = 'businessModeDesc';
          this.valueId = 'businessMode';
          this.fieldName = 'businessModel';
          this.options = this.businessModellist;
          this.show3 = true;
          break;
        case '产品类别':
          
          break;
        case '产品名称':
          
          break;
        case '盗抢险':
          this.valueKey = 'name';
          this.valueId = 'id';
          this.fieldName = 'thiefRescue';
          this.options = this.thiefRescueList;
          this.show3 = true;
          break;
        case '盗抢险购买平台':
          
          break;
      
        default:
          break;
      }
    },
    // 字典选择确认
    confirm(row) {
      console.log(row);
      if(this.isWordbook) {
        this.projProjectInfo[this.fieldName] = row.value;
        this.projProjectInfo[this.fieldName+'Name'] = row.label;
      } else {
        this.projProjectInfo[this.fieldName] = row[this.valueId];
        this.projProjectInfo[this.fieldName+'Name'] = row[this.valueKey];
      }
      switch (this.selectName) {
        case '业务来源':
          if(this.fieldName == 'bsnSrc') {
            this.fieldName = 'isAccessCar';
            this.options = this.wordbook.is_Access_Car;
            return
          }
          break;
        case '业务模式':
          this.productTypeList({
            type: 2,
            carType: this.carType,
            carNature: this.carNature,
            companyId: this.projProjectInfo.companyId,
            businessMode: this.projProjectInfo.businessModel
          });
          break;
        case '贷款期限':
          this.loanPlatformTree();
          break;
        case '放款平台':
          if(this.fieldName == 'isRoot') {
            this.valueKey = 'dsbrPltfrmNm';
            this.valueId = 'id';
            this.fieldName = 'loanPlatfomrId';
            this.options = row.children;
            return
          } else {
            this.bankRate = row.intrt;
            this.projProjectInfo.bankNewRate = row.intrt;
            this.projProjectInfo.dsbrPltfrmNm = row.dsbrPltfrmNm;
            this.projProjectInfo.loanPlatfomrId = row.id;
          }
          break;
        case '产品类别':
          
          break;
        case '产品名称':
          
          break;
      
        default:
          break;
      }
      this.show3 = false;
    },
    // 字典选择取消
    cancel() {
      this.show3 = false;
    },
    returnVal(val, type) {
      switch (type) {
        case 'array':
          val = val === null ? [] : val;
          break;
        case 'number':
          val = val === null ? '' : Number(val);
          break;
        case 'obj':
          val = val === null ? {} : val;
          break;
        default:
          val = val === null ? '' : val;
          break;
      }
      return val;
    },
    // 放款平台转换
    loanPlatfomrsReturn(t, f) {
      let ar = [];
      if (t && f) {
        ar = [t, f];
      }
      return ar;
    },
    // 获取报单数据
    loanData() {
      this.loading = true;
      // const toast = Toast.loading({
      //   duration: 0, // 持续展示 toast
      //   forbidClick: true,
      //   overlay: true,
      //   message: '加载中...'
      // });
      getProjectInfo({
        id: this.params.id
      }).then(res => {
        const { code, data, msg } = res;
        if(code == 200) {
          setTimeout(() => {
            // Toast.clear();
            const { projectInfo, courseMap, thiefRescue, lpmsBusinessSource, ruleFlag } = data;
            let row = projectInfo;
            this.courseMap = courseMap;
            this.thiefRescueList = thiefRescue; // 获取盗抢险
            this.businessList = lpmsBusinessSource;

            let loanPlatfomr = row.loanPlatfomr ? row.loanPlatfomr : {
              id: '',
              blngInstid: null,
              dsbrPltfrmNm: ''
            };
            let carDealer = row.carDealer ? row.carDealer : {
              id: ''
            };
            let customer = row.customer ? row.customer : {
              levelEducation: '',
              unitChar: '',
              marriage: '',
              customerName: '',
              certificateNum: '',
              contactPhone: '',
              spsNm: '',
              spsCrdtNo: '',
              spsCtcTel: '',
              spsCltrDgr: '',
              spsUnitChar: '',
            };
            
            let clientManager = row.clientManager ? row.clientManager : {
              groupName: '',
              businessGroupIds: ''
            };
            let loanProductModel = row.loanProductModel ? row.loanProductModel : {
              id: '',
              isAccessCar: ''
            };
            let cars = row.cars ? row.cars : [];
            let proPat = row.proPat ? row.proPat : {
              id: ''
            };
            let riskMeasure = row.riskMeasure ? row.riskMeasure : {};

            if (Array.isArray(cars) && cars.length > 0) {
              this.carType = cars[0].carType + '-' + cars[0].carType2;
              this.carNature = cars[0].carNature;
              this.productTypeList({
                type: 1,
                carType: cars[0].carType + '-' + cars[0].carType2,
                carNature: cars[0].carNature,
                companyId: row.companyId
              });
            }

            this.projProjectInfo = {
              loanPlatfomr: loanPlatfomr,
              carDealer: carDealer,
              customer: customer,
              cars: cars,
              clientManager: clientManager,
              loanProductModel: loanProductModel,
              proPat: proPat,
              riskMeasure: riskMeasure,
              wbtProvCityId: row.wbtProvCityZonCode == null ? [] : row.wbtProvCityZonCode.split('-'),
              groupName: this.returnVal(clientManager.groupName),
              dsbrPltfrmNm: this.returnVal(loanPlatfomr.dsbrPltfrmNm),
              thiefRescue: this.returnVal(row.thiefRescue),
              carDealersId: carDealer.id,
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
              rbrinsPltfrmNmId: this.returnVal(row.rbrinsPltfrmNmId, 'number'),
              productCategoryId: this.returnVal(row.productCategoryId),
              loanPlatfomrId: this.returnVal(loanPlatfomr.id),
              loanPlatfomrs: this.returnVal(row.loanPlatId, 'number') ? this.loanPlatfomrsReturn(this.returnVal(loanPlatfomr.blngInstid, 'number'), this.returnVal(row.loanPlatId, 'number')) : [],
              companyName: this.returnVal(row.companyName),
              officeName: this.returnVal(row.officeName),
              counterGuaranteeStatus: this.returnVal(row.counterGuaranteeStatus),
              wthrBl: this.returnVal(row.wthrBl),
              blRsn: this.returnVal(row.blRsn),
              addressDetail: this.returnVal(row.addressDetail),
              // sngldayPrd: this.custData.type === 'NEWOBL' ? utils.formatDate.format(new Date(), 'yyyyMMdd') : this.returnVal(row.sngldayPrd),
              businessModel: this.returnVal(row.businessModelId),
              businessModelName: this.returnVal(row.businessModelName),
              rbrinsPltfrmNmName: this.returnVal(row.rbrinsPltfrmNmName), // 盗抢险购买平台
              loanTerm: this.returnVal(row.loanTerm),
              loanAmt: this.returnVal(row.loanAmt),
              isQuickadjust: this.returnVal(row.isQuickadjust),
              isTandzero: this.returnVal(row.isTandzero),
              guaranteeRate: this.returnVal(row.guaranteeRate),
              bankNewRate: this.returnVal(row.bankNewRate),
              rebateStandard: this.returnVal(row.rebateStandard),
              loanRegion: this.returnVal(row.loanRegion),
              rentingAmtGps: this.returnVal(row.rentingAmtGps),
              rentingCarRatio: this.returnVal(row.rentingCarRatio),
              rentingServiceFee: this.returnVal(row.rentingServiceFee),
              rentingAmt: this.returnVal(row.rentingAmt),
              marginRatio: this.returnVal(row.marginRatio),
              keepPrice: this.returnVal(row.keepPrice),
              concactNum: this.returnVal(row.concactNum),
              accountNum: this.returnVal(row.accountNum),
              accountName: this.returnVal(row.accountName),
              accountBank: this.returnVal(row.accountBank),
              wbtProvCityZonName: this.returnVal(row.wbtProvCityZonName),
              paymentNumber: this.returnVal(row.paymentNumber),
              paymentNumberName: this.returnVal(row.paymentNumberName),
              customerBond: this.returnVal(row.customerBond),
              projectId: row.projectId,
              projectNo: row.projectNo,
              id: row.projectId,
              customerNum: row.customerNum,
              customerRate: row.customerRate,
              loanPercentage: row.loanPercentage,
              productCategoryName: row.productCategoryName,
              bankGuaranteeRate: row.bankGuaranteeRate,
              wbtProvCityZon: row.wbtProvCityZon,
              companyId: row.companyId,
              isChange: row.isChange,
              isChangeProj: row.isChangeProj,
              ruleFlag: ruleFlag,
              // 字典转换 --------------
              unitCharName: this.returnText('unit_Property', customer.unitChar),
              levelEducationName: this.returnText('DegreeOfEducation', customer.levelEducation),
              marriageName: this.returnText('marriage_type', customer.marriage),
              spsUnitCharName: this.returnText('unit_Property', customer.spsUnitChar),
              spsCltrDgrName: this.returnText('DegreeOfEducation', customer.spsCltrDgr),
              bsnSrcName: this.returnText('business_origin', customer.bsnSrc),
              isAccessCarName: this.returnText('is_Access_Car', customer.isAccessCar),
              counterGuaranteeStatusName: this.returnText('counter_Guarantee_Status', customer.counterGuaranteeStatus),
              wthrBlName: this.returnText('yes_no', customer.wthrBl),
              businessModelName: this.returnText('business_mode', customer.businessModel),
              onHouseTypeName: this.returnText('ON_HOUSE_TYPE', customer.onHouseType),
              isTandzeroName: this.returnText('yes_no', customer.isTandzero),
              marginRatioName: this.returnText('Margin_Ratio', customer.marginRatio)
            }
            this.getCustomer();
          }, 500);
        } else {
          this.$notify({ type: 'danger', message: msg });
          this.loading = false;
          // Toast.clear();
        }
      });
    },
    // 查询放款平台
    loanPlatformTree() {
      let obj = {
        loanCount: this.projProjectInfo.loanTerm,
        businessMode: this.projProjectInfo.businessModel
      }
      getLoanPlatformTree()
        .then(res => {
          if (res.code == 200) {
            this.platform = res.data;
          } else {
            this.$notify({ type: 'danger', message: res.msg });
          }
        })
    },
    // 查询产品类别、名称、放款平台
    productTypeList(dataList) {
      getProductTypeList(dataList)
        .then(res => {
          if (res.code == 200) {
            let list = res.data;
            // 1-查询业务模式，2-查询贷款期限，3-查询产品类别，4-查询产品列表，5-查询产品详细信息
            switch (dataList.type) {
              case 1:
                this.businessModellist = list;
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
                this.projProjectInfo.loanRegion = datas.businessMode === 1 || datas.businessMode === 3 ? datas.loanRegionForUnion : datas.loanRegion;
                this.projProjectInfo.customerRate = datas.customerRate;
                this.projProjectInfo.bankGuaranteeRate = datas.bankGuaranteeRate;
                this.bankGuaranteeRate = datas.bankGuaranteeRate;
                if (this.projProjectInfo.businessModel == '4') {
                  this.projProjectInfo.paymentNumber = datas.paymentNumber;
                  this.projProjectInfo.paymentNumberDesc = datas.paymentNumberDesc;
                  this.projProjectInfo.customerBond = datas.customerBond;
                }
                let n = datas.thiefRescue.split(',');
                let p = datas.thiefRescueDesc.split(',');
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
                this.dataList.guaranteeRate = this.bankTotal.toFixed(2); // 
                break;

              default:
                break;
            }
          }
        })
    },
    // 保存信息
    submitProject() {

    }
  },
  mounted() {
    this.params = this.$route.query;
    this.loanData();
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

