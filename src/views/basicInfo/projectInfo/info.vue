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
          <div
            class="xh-card-head"
            v-if="projProjectInfo.marriage == '2' || projProjectInfo.marriage == '4'"
          >
            配偶基本信息
            <img
              :src="require('./../../../assets/old_images/icon-ocr2.png')"
              class="xh-OCR"
              @click="OCRScan('1');"
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
              @click="loadType('业务来源','bsnSrc')"
            />
          </section>
          <!-- 接口请求 -->
          <section>
            <van-cell
              title="车商:"
              required
              is-link
              :value="projProjectInfo.carDealersIdName"
              @click="loadType('车商', 'carDealersId')"
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
              <van-cell
                title="车辆类别:"
                :value="returnText('car_type',i.carType)+' '+returnText('car_type2',i.carType2)"
              />
            </section>
            <section>
              <van-cell title="车辆性质:" :value="returnText('car_nature',i.carNature)" />
            </section>
            <section>
              <van-cell
                title="车辆规格:"
                :value="returnText('vehicle_specifications',i.carSpecifications)"
              />
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
              :value="projProjectInfo.productIdName"
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
              :required="projProjectInfo.thiefRescue == 0?true:false"
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
import {
  getProjectInfo,
  getProjectCustomer,
  getProductTypeList,
  getLoanPlatformTree,
  getAllTpBuyPlatform,
  setProjectInfo
} from "@/api/project";
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
    bankTotal() {
      return this.bankGuaranteeRate - this.bankRate;
    },
    // 所有字典
    ...mapState({
      wordbook: state => state.user.wordbook
    })
  },
  watch: {
    // 获取贷款期限
    "projProjectInfo.businessModel"(val) {
      if (val) {
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
        this.loanPlatformTree();
      }
    },
    // 获取放款平台name 和 产品类别
    "projProjectInfo.loanPlatfomrs"(val) {
      if (Array.isArray(val) && val.length > 0) {
        if (val[1] != "") {
          let ids = val[1];
          this.platformId = ids;
          this.platform.forEach(t => {
            if (t.children) {
              t.children.forEach(f => {
                if (f.value == ids) {
                  this.bankRate = f.intrt;
                  this.projProjectInfo.bankNewRate = f.intrt;
                  this.projProjectInfo.dsbrPltfrmNm = f.label;
                  this.projProjectInfo.loanPlatfomrId = f.value;
                }
              });
            }
          });
          this.productTypeList({
            type: 3,
            carType: this.carType,
            carNature: this.carNature,
            companyId: this.projProjectInfo.companyId,
            businessMode: this.projProjectInfo.businessModel,
            platformId: ids
          });
        }
      }
    },
    // 获取产品list
    "projProjectInfo.productCategoryId"(val) {
      if (val) {
        this.productTypeList({
          type: 4,
          companyId: this.projProjectInfo.companyId,
          productCategoryId: val
        });
      }
    },
    // 获取产品详情
    "dataList.productId"(val) {
      if (val) {
        this.productTypeList({
          type: 5,
          productId: val
        });
      }
    }
  },
  data() {
    return {
      params: {}, // 传过来的数据
      show3: false, //弹框选择
      show2: false, //地址选择
      loading: false,
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
      bankGuaranteeRate: "",
      bankRate: "",
      businessList: [], //业务来源

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
        companyName: "",
        officeName: "",
        groupName: "",
        businessGroupIds: "",
        contactPhone: "",
        levelEducation: "",
        unitChar: "",
        marriage: "",
        customerName: "",
        certificateNum: "",
        spsCltrDgr: "",
        spsUnitChar: "",
        bsnSrc: "",
        isAccessCar: "",
        carDealersId: "",
        counterGuaranteeStatus: "",
        wthrBl: "",
        blRsn: "",
        addressDetail: "",
        sngldayPrd: "",
        productCategoryId: "",
        productCategoryIdName: "",
        loanPlatfomrId: "",
        productId: "",
        thiefRescue: "",
        businessModel: "",
        businessModelName: "",
        rbrinsPltfrmNmId: "",
        rbrinsPltfrmNmName: "", // 盗抢险购买平台
        loanTerm: "",
        loanAmt: "",
        isQuickadjust: "",
        isTandzero: "",
        guaranteeRate: "",
        bankNewRate: "",
        rebateStandard: "",
        loanRegion: "",
        rentingAmtGps: "",
        rentingCarRatio: "",
        rentingServiceFee: "",
        rentingAmt: "",
        marginRatio: "",
        keepPrice: "",
        concactNum: "",
        accountNum: "",
        accountName: "",
        accountBank: "",
        spsNm: "",
        spsCrdtNo: "",
        spsCtcTel: "",
        wbtProvCityId: [],
        wbtProvCityZonName: "",
        productIdName: "",
        customerBond: "",
        paymentNumber: "",
        paymentNumberName: "",
        ruleFlag: "",
        cars: []
      },
      getProductCategory: [], //产品类别
      pattern: [], //产品名称
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
        carDealersIdName: "",
        counterGuaranteeStatus: "",
        wthrBl: "",
        wthrDcn: "",
        wbtProvCityZon: "",
        addressDetail: "",
        productCategoryId: "",
        dsbrPltfrmNm: "",
        productIdName: "",
        loanAmt: "" //银行贷款金额
      },
      carNature: "", //车辆性质
      carType: "", //车辆类型
      carType2: "", //车辆类型2
      platformId: "" //
    };
  },
  methods: {
    pullCars() {
      this.$router.push("/vehicle");
    },
    //
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
      console.log(val, list);
      let name;
      list.forEach(e => {
        e.children.forEach(i => {
          if (i.id == val) {
            name = i.dsbrPltfrmNm;
          }
        });
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
      this.$set(this.projProjectInfo, "productId", ids);
    },
    // 省市区选择
    confirmSelect() {},
    // 省市区取消
    cancelSelect() {},
    // 其他接口数据
    loadType(title, field) {
      this.selectName = title;
      this.isWordbook = false;
      switch (title) {
        case "业务来源":
          if (this.businessList.length == 0) {
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
          this.valueKey = "orgName";
          this.valueId = "id";
          this.fieldName = "isRoot";
          this.options = this.platform;
          this.show3 = true;
          break;
        case "业务模式":
          if (this.businessModellist.length == 0) {
            return;
          }
          this.valueKey = "businessModeDesc";
          this.valueId = "businessMode";
          this.fieldName = "businessModel";
          this.options = this.businessModellist;
          this.show3 = true;
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
          if (this.platformList.length == 0) {
            return;
          }
          this.valueKey = "rbrinsPltfrmNm";
          this.valueId = "id";
          this.fieldName = "rbrinsPltfrmNmId";
          this.options = this.platformList;
          this.show3 = true;
          break;

        default:
          break;
      }
    },
    // 字典选择确认
    confirm(row) {
      if (this.isWordbook) {
        this.projProjectInfo[this.fieldName] = row.value;
        this.projProjectInfo[this.fieldName + "Name"] = row.label;
        if (this.selectName == "业务来源") {
          this.getCustomer();
        }
      } else {
        this.projProjectInfo[this.fieldName] = row[this.valueId];
        this.projProjectInfo[this.fieldName + "Name"] = row[this.valueKey];
        switch (this.selectName) {
          case "业务来源":
            if (this.fieldName == "bsnSrc") {
              this.valueKey = "label";
              this.isWordbook = true;
              this.fieldName = "isAccessCar";
              this.options = this.wordbook.is_Access_Car;
              return;
            }
            break;
          case "业务模式":
            this.productTypeList({
              type: 2,
              carType: this.carType,
              carNature: this.carNature,
              companyId: this.projProjectInfo.companyId,
              businessMode: this.projProjectInfo.businessModel
            });
            break;
          case "贷款期限":
            this.loanPlatformTree();
            break;
          case "放款平台":
            if (this.fieldName == "isRoot") {
              this.valueKey = "dsbrPltfrmNm";
              this.valueId = "id";
              this.fieldName = "loanPlatfomrId";
              this.options = row.children;
              return;
            } else {
              this.bankRate = row.intrt;
              this.projProjectInfo.bankNewRate = row.intrt;
              this.projProjectInfo.dsbrPltfrmNm = row.dsbrPltfrmNm;
              this.projProjectInfo.loanPlatfomrId = row.id;
              this.productTypeList({
                type: 3,
                carType: this.carType,
                carNature: this.carNature,
                companyId: this.projProjectInfo.companyId,
                businessMode: this.projProjectInfo.businessModelId,
                platformId: row.id
              });
            }
            break;
          case "产品类别":
            this.productTypeList({
              type: 4,
              companyId: this.projProjectInfo.companyId,
              productCategoryId: row.id
            });
            break;
          case "产品名称":
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
      this.show3 = false;
    },
    // 字典选择取消
    cancel() {
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
        if (code == 200) {
          // Toast.clear();
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
          this.businessList = lpmsBusinessSource;

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
            loanPlatfomrs: this.returnVal(row.loanPlatId, "number")
              ? this.loanPlatfomrsReturn(
                  this.returnVal(loanPlatfomr.blngInstid, "number"),
                  this.returnVal(row.loanPlatId, "number")
                )
              : [],
            companyName: this.returnVal(row.companyName),
            officeName: this.returnVal(row.officeName),
            counterGuaranteeStatus: this.returnVal(row.counterGuaranteeStatus),
            wthrBl: this.returnVal(row.wthrBl),
            blRsn: this.returnVal(row.blRsn),
            addressDetail: this.returnVal(row.addressDetail),
            // sngldayPrd: this.custData.type === 'NEWOBL' ? utils.formatDate.format(new Date(), 'yyyyMMdd') : this.returnVal(row.sngldayPrd),
            businessModel: this.returnVal(row.businessModelId),
            rbrinsPltfrmNmName: this.returnVal(row.rbrinsPltfrmNmName), // 盗抢险购买平台
            loanTerm: this.returnVal(row.loanTerm),
            loanAmt: this.returnVal(row.loanAmt),
            isQuickadjust: "0",
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
            productCategoryIdName: row.productCategoryName,
            bankGuaranteeRate: row.bankGuaranteeRate,
            wbtProvCityZon: row.wbtProvCityZon,
            companyId: row.companyId,
            isChange: row.isChange,
            isChangeProj: row.isChangeProj,
            ruleFlag: ruleFlag,
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
            counterGuaranteeStatusName: this.returnText(
              "counter_Guarantee_Status",
              row.counterGuaranteeStatus
            ),
            wthrBlName: this.returnText("yes_no", row.wthrBl),
            onHouseTypeName: this.returnText("ON_HOUSE_TYPE", row.onHouseType),
            isTandzeroName: this.returnText("yes_no", row.isTandzero),
            marginRatioName: this.returnText("Margin_Ratio", row.marginRatio),
            productIdName: proPat.productName,
            thiefRescueName: this.returnText("", row.thiefRescue, thiefRescue, 'id','name')
          };

          setTimeout(() => {
            // 处理产品破数据
            this.changeRows(row);

            this.getCustomer();
            this.getPlatform();
            this.loading = false;
          }, 500);
        } else {
          this.$notify({ type: "danger", message: msg });
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
      };
      getLoanPlatformTree().then(res => {
        if (res.code == 200) {
          this.platform = res.data;
          console.log(this.projProjectInfo.loanPlatfomrId);
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
        // this.loading = true;
        for (let i = 0; i < this.projProjectInfo.cars.length; i++) {
          if (!this.projProjectInfo.cars[i].salePrice) {
            yanzheng = false;
            break;
          }
        }
        if (yanzheng) {
          if (this.projProjectInfo.isChangeProj == "1") {
            [this.projProjectInfo.customerName, this.projProjectInfo.spsNm] = [
              this.projProjectInfo.spsNm,
              this.projProjectInfo.customerName
            ];
            [
              this.projProjectInfo.certificateNum,
              this.projProjectInfo.spsCrdtNo
            ] = [
              this.projProjectInfo.spsCrdtNo,
              this.projProjectInfo.certificateNum
            ];
            [
              this.projProjectInfo.contactPhone,
              this.projProjectInfo.spsCtcTel
            ] = [
              this.projProjectInfo.spsCtcTel,
              this.projProjectInfo.contactPhone
            ];
            [
              this.projProjectInfo.levelEducation,
              this.projProjectInfo.spsCltrDgr
            ] = [
              this.projProjectInfo.spsCltrDgr,
              this.projProjectInfo.levelEducation
            ];
            [
              this.projProjectInfo.unitChar,
              this.projProjectInfo.spsUnitChar
            ] = [
              this.projProjectInfo.spsUnitChar,
              this.projProjectInfo.unitChar
            ];
          }

          // let wbtProvCityName = this.$refs.cascader.currentLabels?this.$refs.cascader.currentLabels:this.$refs.cascader.inputValue;
          // if(Array.isArray(wbtProvCityName)) {
          //   wbtProvCityName = wbtProvCityName.join('-');
          // }
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
            wbtProvCityZonCode: "120000-120100-120101",
            wbtProvCityZon: "天津市-市辖区-和平区",
            wbtProvCityZonDesc: "天津市-市辖区-和平区",
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
            purchaseTaxCharge: formList.purchaseTaxCharge
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
          this.postProject(dataList);
        } else {
          this.loading = false;
          this.$notify({
            type: "danger",
            message: "保存失败,请检查车辆信息填写是否完整"
          });
        }
      }
    },
    // 提交数据
    postProject(dataList) {
      setProjectInfo(dataList).then(res => {
        if (res.code == 200) {
          this.loanData();
          this.$notify({ type: "success", message: res.msg });
        } else {
          this.$notify({ type: "danger", message: res.msg });
        }
      });
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
</style>

