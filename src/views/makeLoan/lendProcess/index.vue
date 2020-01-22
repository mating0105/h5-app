<template>
  <ViewPage
    :rightMenuList="rightBoxList"
    :goPage="goPage"
    :iconClass="iconClass"
    :backFn="backFn"
    :loading="listLoading"
    :class="dealState?'lendProcessAlready':'lendProcess'"
  >
    <van-tabs v-model="activeName" v-if="projectForm.projectInfo" @change="changeTab">
      <van-tab title="做单基本信息" name="1" class="tabBox">
        <div v-show="stepIndex==1" style="margin-top:10px;">
          <Card>
            <template v-slot:header>项目信息</template>
            <div>
              <van-cell
                title="业务员："
                v-model="projectForm.projectInfo.clientManager.name"
                :border="false"
              />
              <van-cell title="报单时间：" v-model="projectForm.projectInfo.createTime" :border="false" />
              <van-cell title="垫款编号：" v-model="projectForm.projectInfo.projectNo" :border="false" />
              <van-cell title="制单人员：" :border="false" :value="userName" />
              <!--                            <van-cell title="走款模式：" :value-class="dealState?'':'rightClass'" :is-link='!dealState' v-model="projectForm.projectInfo.payType"-->
              <!--                                      @click="showPopupType('payType')" :border="false"/>-->
            </div>
          </Card>
          <div v-if="dealState">
            <!-- 已办显示 -->
            <!-- 银行放款信息 -->
            <Card style="margin-top:15px;" id="bankLend">
              <template v-slot:header>银行放款信息</template>
              <div>
                <van-field
                  label="主借人还款卡号："
                  disabled
                  :border="false"
                  label-width="150"
                  input-align="right"
                  v-model="form.loanInfo.repaymentBankCardNo"
                />
                <van-cell title="还款卡银行：" :border="false" :value="form.loanInfo.accountBank" />
                <van-cell
                  title="录机时间："
                  :border="false"
                  :value="form.loanInfo.advanceInstitutionDate?dayjs(form.loanInfo.advanceInstitutionDate).format('YYYY-MM-DD HH:mm'):''"
                />
                <van-field
                  :border="false"
                  disabled
                  label-width="150"
                  input-align="right"
                  label="实际放款金额："
                  @blur.prevent="priceFloat(form.loanInfo, 'factLoanAmt')"
                  v-model="form.loanInfo.factLoanAmt"
                >
                  <div slot="button">元</div>
                </van-field>
                <van-cell
                  :border="false"
                  disabled
                  title="实际放款时间："
                  :value="form.loanInfo.factLoanDate?dayjs(form.loanInfo.factLoanDate).format('YYYY-MM-DD HH:mm'):''"
                />
              </div>
            </Card>
            <!-- 放款凭证 -->
            <Card style="margin-top: 10px;" v-if="dataList && dataList.length>0">
              <template v-slot:header>放款凭证</template>
              <imageList :dataList="dataList" :view="true"></imageList>
            </Card>
          </div>
          <Card style="margin-top:15px;">
            <template v-slot:header>借款人信息</template>
            <div>
              <van-field
                name="mainBorrowerName"
                disabled
                label="主借人姓名："
                placeholder
                :border="false"
                label-width="150"
                input-align="right"
                required
                v-model="form.borrowerInfo.mainBorrowerName"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.mainBorrowerName"
              />
              <van-field
                name="mainBorrowerId"
                disabled
                label="主借人身份证："
                placeholder
                :border="false"
                label-width="150"
                input-align="right"
                required
                v-model="form.borrowerInfo.mainBorrowerId"
                @blur.click="getIdcard"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.mainBorrowerId"
              />
              <van-field
                name="mainBorrowerPhone"
                disabled
                label="主借人电话："
                placeholder
                :border="false"
                label-width="150"
                input-align="right"
                required
                v-model="form.borrowerInfo.mainBorrowerPhone"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.mainBorrowerPhone"
              />
              <van-cell
                title="主借人性别："
                :border="false"
                :value-class="dealState?'':'rightClass'"
                :is-link="!dealState"
                v-model="form.borrowerInfo.customerSexDesc"
                @click="showPopupType('customerSex')"
              />
              <van-field
                :disabled="dealState"
                label="主借人年龄："
                :placeholder="dealState?'':'请输入'"
                :border="false"
                label-width="150"
                input-align="right"
                v-model="form.borrowerInfo.customerAge"
              />
              <van-field
                :disabled="dealState"
                label="主借人月收入："
                :placeholder="dealState?'':'请输入'"
                :border="false"
                label-width="160"
                input-align="right"
                v-model="form.borrowerInfo.mainLoanWage"
                @blur.prevent="priceFloat(form.borrowerInfo, 'mainLoanWage')"
              >
                <div slot="button">元</div>
              </van-field>
              <van-field
                :disabled="dealState"
                label="主借人家庭人数："
                :placeholder="dealState?'':'请输入'"
                :border="false"
                label-width="150"
                input-align="right"
                v-model="form.borrowerInfo.fiexdNo"
              />
              <van-cell
                title="还款来源："
                :border="false"
                :is-link="!dealState"
                :value-class="dealState?'':'rightClass'"
                :value="form.borrowerInfo.paymentSourceDesc"
                @click="showPopupType('payment_source')"
              />
              <van-cell
                title="职务："
                :is-link="!dealState"
                :border="false"
                :value-class="dealState?'':'rightClass'"
                :value="form.borrowerInfo.postDesc"
                @click="showPopupType('OccupationalStatus')"
              />
              <van-cell
                title="户籍地址："
                :border="false"
                :value-class="dealState?'':'rightClass'"
                :is-link="!dealState"
                v-model="form.borrowerInfo.registerProvCityZon"
                @click="showMapMethod('registerProvCityZon')"
              />
              <van-field
                :disabled="dealState"
                label="户籍详细地址："
                :placeholder="dealState?'':'请输入'"
                :border="false"
                label-width="150"
                input-align="right"
                v-model="form.borrowerInfo.registerAddressDetail"
              />
              <van-cell
                title="家庭地址："
                :border="false"
                :value-class="dealState?'':'rightClass'"
                :is-link="!dealState"
                v-model="form.borrowerInfo.familyAddressProvCityZon"
                @click="showMapMethod('familyAddressProvCityZon')"
              />
              <van-field
                :disabled="dealState"
                label="家庭详细地址："
                :placeholder="dealState?'':'请输入'"
                :border="false"
                label-width="150"
                input-align="right"
                v-model="form.borrowerInfo.familyAddressDetail"
              />
              <van-field
                :disabled="dealState"
                label="工作单位名称："
                :placeholder="dealState?'':'请输入'"
                :border="false"
                label-width="150"
                input-align="right"
                v-model="form.borrowerInfo.customerCo"
              />
              <van-cell
                title="工作单位地址："
                :border="false"
                :value-class="dealState?'':'rightClass'"
                :is-link="!dealState"
                v-model="form.borrowerInfo.customerCoProvCityZon"
                @click="showMapMethod('customerCoProvCityZon')"
              />
              <van-field
                :disabled="dealState"
                label="工作单位详细地址："
                :placeholder="dealState?'':'请输入'"
                :border="false"
                label-width="150"
                input-align="right"
                v-model="form.borrowerInfo.customerCoAddDetail"
              />
            </div>
          </Card>
          <van-button round type="danger" style="width:100%;margin:30px 0;" @click="nextStep">下一步</van-button>
        </div>
        <div v-show="stepIndex==2" style="margin-top:10px;">
          <Card style="margin-top:15px;" v-for="(item,index) in form.carInfos" :key="item.id">
            <template v-slot:header>{{'车辆信息'+(index+1)}}</template>
            <div>
              <van-cell
                title="车辆类别："
                :border="false"
                :is-link="!dealState"
                required
                :value="item.carTypeDesc"
                @click="showPopupType('car_type',index)"
                :value-class="dealState?'':'rightClass'"
                label-class="labelClass"
                @blur.prevent="ruleMessge($event,index)"
                :label="errorMsg.carType[index]"
              />
              <van-cell title="车辆性质：" :border="false" required :value="item.carNatureDesc" />
              <van-cell
                title="车辆规格："
                :border="false"
                :is-link="!dealState"
                :value-class="dealState?'':'rightClass'"
                required
                :value="item.carSpecificationsDesc"
                @click="showPopupType('vehicle_specifications',index)"
                label-class="labelClass"
                @blur.prevent="ruleMessge($event,index)"
                :label="errorMsg.carSpecifications[index]"
              />
              <van-cell
                title="车辆来源"
                :border="false"
                :is-link="!dealState"
                :value-class="dealState?'':'rightClass'"
                required
                :value="item.carSourceDesc"
                @click="showPopupType('CAR_SOURCE',index)"
                label-class="labelClass"
                @blur.prevent="ruleMessge($event,index)"
                :label="errorMsg.carSource[index]"
              />
              <van-cell
                title="品牌型号："
                :border="false"
                :is-link="!dealState"
                label-class="labelClass"
                :value-class="dealState?'':'rightClass'"
                required
                :value="item.brandModel"
                @click="selectBrand(index)"
                @blur.prevent="ruleMessge($event,index)"
                :label="errorMsg.brndNmId[index]"
              />
              <van-field
                name="actualInvoicedPrice"
                :disabled="dealState"
                label="实际开票价："
                :placeholder="dealState?'':'请输入'"
                :border="false"
                label-width="150"
                input-align="right"
                required
                v-model="item.actualInvoicedPrice"
                @blur.prevent="priceFloat(item, 'actualInvoicedPrice'); ruleMessge($event,index)"
                :error-message="errorMsg.actualInvoicedPrice[index]"
              >
                <div slot="button">元</div>
              </van-field>
              <van-field
                name="seeingCarPrice"
                :disabled="dealState"
                label="送行车价："
                :placeholder="dealState?'':'请输入'"
                :border="false"
                label-width="150"
                input-align="right"
                required
                v-model="item.seeingCarPrice"
                @blur.prevent="priceFloat(item, 'seeingCarPrice'); ruleMessge($event,index)"
                :error-message="errorMsg.seeingCarPrice[index]"
              >
                <div slot="button">元</div>
              </van-field>
            </div>
          </Card>
          <Card>
            <template v-slot:header>贷款信息</template>
            <div>
              <van-field
                name="loanAmt"
                :disabled="dealState"
                label="贷款金额："
                :placeholder="dealState?'':'请输入'"
                label-width="150"
                input-align="right"
                :border="false"
                required
                v-model="form.loanInfo.loanAmt"
                @blur.prevent="priceFloat(form.loanInfo, 'loanAmt');ruleMessge($event)"
                :error-message="errorMsg.loanAmt"
              >
                <div slot="button">元</div>
              </van-field>
              <van-field
                name="factCharges"
                :disabled="dealState"
                label="刷卡金额："
                :placeholder="dealState?'':'请输入'"
                label-width="150"
                input-align="right"
                :border="false"
                required
                v-model="form.loanInfo.factCharges"
                @blur.prevent="priceFloat(form.loanInfo, 'factCharges');ruleMessge($event)"
                :error-message="errorMsg.factCharges"
              >
                <div slot="button">元</div>
              </van-field>
              <van-field
                name="assessmentPrice"
                :disabled="dealState"
                label="评估金额："
                :placeholder="dealState?'':'请输入'"
                label-width="150"
                input-align="right"
                :border="false"
                required
                v-model="form.loanInfo.assessmentPrice"
                @blur.prevent="priceFloat(form.loanInfo, 'assessmentPrice');ruleMessge($event)"
                :error-message="errorMsg.assessmentPrice"
              >
                <div slot="button">元</div>
              </van-field>
              <van-cell
                title="贷款产品："
                :border="false"
                required
                v-model="form.loanInfo.loanProductName"
              />
              <van-cell
                title="贷款银行："
                :border="false"
                required
                @blur.prevent="ruleMessge"
                :value="form.loanInfo.payPlatformName"
              />
              <van-field
                name="loanYear"
                :disabled="dealState"
                label="贷款年限："
                label-width="150"
                :placeholder="dealState?'':'请输入'"
                input-align="right"
                :border="false"
                required
                v-model="form.loanInfo.loanYear"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.loanYear"
              />
              <van-cell
                @blur.prevent="ruleMessge"
                label-class="labelClass"
                :label="errorMsg.loanTerm"
                title="贷款期数："
                :value-class="dealState?'':'rightClass'"
                :border="false"
                required
                :is-link="!dealState"
                :value="form.loanInfo.loanTermDesc"
                @click="showPopupType('period_number')"
              />
              <van-field
                name="loanProportion"
                :disabled="dealState"
                label="贷款成数："
                label-width="150"
                :placeholder="dealState?'':'请输入'"
                input-align="right"
                :border="false"
                required
                v-model="form.loanInfo.loanProportion"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.loanProportion"
              />
              <van-field
                name="loanRate"
                :disabled="dealState"
                label="客户利率："
                label-width="150"
                :placeholder="dealState?'':'请输入'"
                input-align="right"
                :border="false"
                required
                v-model="form.loanInfo.loanRate"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.loanRate"
              >
                <div slot="button">%</div>
              </van-field>
              <van-field
                :disabled="dealState"
                label="浮息利率："
                label-width="150"
                :placeholder="dealState?'':'请输入'"
                input-align="right"
                :border="false"
                v-model="form.loanInfo.floatRate"
              >
                <div slot="button">%</div>
              </van-field>
              <van-field
                name="companyChargeRate"
                :disabled="dealState"
                label="公司收费利率："
                label-width="150"
                :placeholder="dealState?'':'请输入'"
                input-align="right"
                :border="false"
                required
                v-model="form.loanInfo.companyChargeRate"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.companyChargeRate"
              >
                <div slot="button">%</div>
              </van-field>
              <van-field
                name="premiumPrice"
                :disabled="dealState"
                label="保费金额："
                :placeholder="dealState?'':'请输入'"
                label-width="150"
                input-align="right"
                :border="false"
                v-model="form.loanInfo.premiumPrice"
                @blur.prevent="priceFloat(form.loanInfo, 'premiumPrice');ruleMessge($event)"
                :error-message="errorMsg.premiumPrice"
              >
                <div slot="button">元</div>
              </van-field>
              <van-field
                name="businessPrice"
                :disabled="dealState"
                label="业务选融费用："
                :placeholder="dealState?'':'请输入'"
                label-width="150"
                input-align="right"
                :border="false"
                required
                v-model="form.loanInfo.businessPrice"
                @blur.prevent="priceFloat(form.loanInfo, 'businessPrice');ruleMessge($event)"
                :error-message="errorMsg.businessPrice"
              >
                <div slot="button">元</div>
              </van-field>
              <van-field
                name="informationPrice"
                :disabled="dealState"
                label="资料费："
                :placeholder="dealState?'':'请输入'"
                label-width="150"
                input-align="right"
                :border="false"
                required
                v-model="form.loanInfo.informationPrice"
                @blur.prevent="priceFloat(form.loanInfo, 'informationPrice');ruleMessge($event)"
                :error-message="errorMsg.informationPrice"
              >
                <div slot="button">元</div>
              </van-field>
              <van-field
                name="carTotalPrice"
                :disabled="dealState"
                label="车款金额合计："
                :placeholder="dealState?'':'请输入'"
                label-width="150"
                input-align="right"
                :border="false"
                required
                v-model="form.loanInfo.carTotalPrice"
                @blur.prevent="priceFloat(form.loanInfo, 'carTotalPrice');ruleMessge($event)"
                :error-message="errorMsg.carTotalPrice"
              >
                <div slot="button">元</div>
              </van-field>
            </div>
          </Card>
          <Card style="margin-top:15px;">
            <template v-slot:header>收款人信息</template>
            <div>
              <van-field
                name="receiptName"
                :disabled="dealState"
                label="收款人姓名："
                :placeholder="dealState?'':'请输入'"
                label-width="150"
                input-align="right"
                :border="false"
                required
                v-model="form.receiptInfo.receiptName"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.receiptName"
              />
              <van-field
                name="receiptAccount"
                :disabled="dealState"
                label="收款人账号："
                :placeholder="dealState?'':'请输入'"
                label-width="110"
                input-align="right"
                :border="false"
                required
                v-model="form.receiptInfo.receiptAccount"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.receiptAccount"
                :right-icon="dealState ? '' : 'scan'"
                @click-right-icon="IdcardLoading('bankCodeOCR')"
              />
              <!-- <van-field
                name="receiptBank"
                :disabled="dealState"
                label="收款人银行："
                :placeholder="dealState?'':'请输入'"
                label-width="150"
                input-align="right"
                :border="false"
                required
                v-model="form.receiptInfo.receiptBank"
                @blur.prevent="ruleMessge"
                :error-message="errorMsg.receiptBank"
              /> -->
              <van-cell
                @blur.prevent="ruleMessge"
                label-class="labelClass"
                :label="errorMsg.receiptBank"
                title="收款人银行："
                :value-class="dealState?'':'rightClass'"
                :border="false"
                required
                :is-link="!dealState"
                :value="form.receiptInfo.receiptBank"
                @click="showPopupType('BANK_TYPE_JYR')"
              />
            </div>
          </Card>
          <van-button
            v-if="!dealState"
            round
            type="danger"
            style="width:100%;margin:30px 0;"
            @click="updateInfo"
            :loading="updateLoading"
          >下一步</van-button>
        </div>
        <div v-show="stepIndex==3" style="margin-top:10px;">
          <Card style="margin-top:15px;">
            <template v-slot:header>
                <van-cell required style="color:#C4252A" title="意见描述"></van-cell>
            </template>
            <div>
              <van-field
                :disabled="dealState"
                required
                :border="false"
                v-model="commentsDesc"
                rows="2"
                autosize
                type="textarea"
                maxlength="200"
                placeholder="请输入留言"
                show-word-limit
                @blur.prevent="verifyComments"
                :error-message="errMsg"
              />
            </div>
          </Card>
          <Card style="margin-top:15px;">
            <template v-slot:header>
              <div class="notice">
                <p>通知业务员补充资料</p>
                <van-checkbox
                  slot="right-icon"
                  shape="square"
                  label-position="left"
                  v-model="checked"
                  style="line-height: inherit;"
                >{{projectForm.projectInfo.clientManager.name}}</van-checkbox>
              </div>
            </template>
          </Card>
          <van-button
            round
            type="danger"
            style="width:100%;margin:30px 0;"
            :loading="submitLoading"
            @click="submit"
          >提交</van-button>
        </div>
      </van-tab>
      <van-tab title="征信信息" name="2" class="tabBox">
        <creditInfoTable title="人行征信" :dataList="creditList.surDtlList" type="creditResult"></creditInfoTable>
        <creditInfoTable title="互联网查询" :dataList="creditList.surDtlList" type="bigDataResult"></creditInfoTable>
      </van-tab>
      <van-tab title="审批记录" name="3" class="tabBox">
        <ApprovalRecord></ApprovalRecord>
      </van-tab>
    </van-tabs>

    <!-- piker选择器 -->
    <van-popup position="bottom" :overlay="true" v-model="popupShow">
      <van-picker
        show-toolbar
        :title="title1"
        :value-key="'label'"
        :columns="columns"
        :loading="loading"
        @cancel="onCancel"
        @confirm="onConfirm"
      />
    </van-popup>
    <!-- 地图弹框 -->
    <MapSheet :showMap.sync="mapShow" @getProvince="getProvince" :manualClose="false"></MapSheet>
    <!-- 品牌型号 -->
    <transition name="page-move">
      <brand :visible.sync="showBrand" v-if="showBrand" @change="changeBrand"></brand>
    </transition>

    <!-- 身份证识别/银行卡识别 -->
    <van-action-sheet v-model="showScan" :actions="actions" @select="discern" />
  </ViewPage>
</template>

<script>
import Vue from "vue";
import { mapGetters, mapState } from "vuex";
import Cookies from "js-cookie";
import ViewPage from "@/layout/components/ViewPage";
import Card from "@/components/card/index";
import ApprovalRecord from "@/views/basicInfo/approvalRecord/index";
import MapSheet from "@/components/provinces/index";
import brand from "@/components/carBrand/brand";
import creditInfoTable from "@/views/credit/viewCompoents/creditInfoTable";
import imageList from "@/components/imageList";
import dayjs from "dayjs";
import { getSex, getAge } from "@/utils/customer";
import { getDic } from "@/api/createCustomer";
import { getCreditInfo } from "@/api/credit";
import { getDocumentByType } from "@/api/document";
import { getValue } from "@/utils/session";
import {
  Tab,
  Tabs,
  Row,
  Col,
  Cell,
  CellGroup,
  Popup,
  Picker,
  Button,
  Field,
  Checkbox,
  Notify,
  ActionSheet
} from "vant";
import {
  loanInfoDetail,
  getProjectInfo,
  updateLoanInfo,
  getPeople,
  submitProcess,
  fieldRules
} from "@/api/makeLoan.js";
import formValidator from "@/mixins/formValidator";
import Bridge from "@/utils/JSbridge";

const Components = [
  Tab,
  Tabs,
  Row,
  Col,
  Cell,
  CellGroup,
  Popup,
  Picker,
  Button,
  Field,
  Checkbox,
  Notify,
  ActionSheet
];

Components.forEach(item => {
  Vue.use(item);
});

export default {
  name: "lendProcess",
  mixins: [formValidator],
  components: {
    ViewPage,
    Card,
    ApprovalRecord,
    MapSheet,
    brand,
    creditInfoTable,
    imageList
  },
  computed: {
    ...mapGetters(["name"]),
    ...mapState({
      name: state => state.user.name,
      wordbook: state => state.user.wordbook
    })
  },
  data() {
    return {
      iconClass: "ellipsis",
      userName: "",
      params: {}, //传过来额数据
      dayjs: dayjs,
      //---tab:1--基本信息
      form: {}, //车辆信息、贷款信息、收款人信息、借款人信息
      projectForm: {}, //项目信息
      listLoading: false, //页面加载
      dictionaryData: {}, //字典数据
      activeName: "1",
      mapShow: false, //地图组件显隐
      mapShowText: "", //触发map显示的字段
      popupSign: {}, //
      showBrand: false,
      showBrandSign: null,
      customerSexList: [
        { label: "男", value: "1" },
        { label: "女", value: "2" }
      ],
      columns: [], //选择项列表
      popupShow: false,
      title1: "",
      loading: false,
      payTypeShow: false, //走款模式判断显示，
      stepIndex: 1,
      rightIcon: true,
      commentsDesc: "", //意见描述
      checked: false, //通知业务员补充资料 true:是  false：否
      updateLoading: false, //更新
      submitLoading: false, //提交
      //----tab:2--征信信息
      creditList: {
        investigateBank: "",
        investigateBankName: "",
        isInternetCredit: "",
        carInfos: [],
        surDtlList: []
      },
      // -----右上角按钮-------
      rightBoxList: [
        { value: 1, title: "项目基本信息", url: "/projectInfo" },
        { value: 2, title: "客户及配偶", url: "/clientIndex" },
        { value: 3, title: "紧急联系人", url: "/contactPerson" },
        { value: 4, title: "房产信息", url: "/houseUser" },
        { value: 5, title: "家庭收入", url: "/incomeFamily" },
        { value: 6, title: "名下车辆", url: "/vehicleList" },
        { value: 7, title: "担保人信息", url: "/guarantor" },
        { value: 8, title: "担保人房产", url: "/houseGuarantor" },
        { value: 9, title: "担保人收入", url: "/incomeGuarantor" },
        { value: 10, title: "调查结论", url: "/survey" },
        { value: 11, title: "相关文档", url: "/proDocument" },
        { value: 12, title: "GPS安装信息", url: "/gps" },
        { value: 13, title: "合同照片", url: "/contractUpload" }
      ],
      businessKey: 0,
      //---已办
      dealState: false, //false:'待办'  true:'已办'
      dataList: [],
      //验证字段规则
      ruleData: [],
      errorMsg: {
        mainBorrowerName: "", //主借人姓名
        mainBorrowerId: "", //主借人身份证
        mainBorrowerPhone: "", //主借人手机号

        assessmentPrice: "", //评估金额
        factCharges: "", //刷卡金额
        loanProportion: "", //贷款成数
        businessPrice: "", //业务选融费用
        loanYear: "", //贷款年限
        carTotalPrice: "", //车款金额合计
        companyChargeRate: "", //公司收费利率
        informationPrice: "", //资料费
        premiumPrice: "", //保费金额
        loanAmt: "", //贷款金额
        loanRate: "", //客户利率
        loanTerm: "", //贷款期数

        seeingCarPrice: [], //送行车价
        actualInvoicedPrice: [], //实际开票价
        carSource: [], //车辆来源
        brndNmId: [], //品牌id
        carSeriesId: [], //车系id
        carModelId: [], //车型id
        carSpecifications: [], //车辆规格
        carType: [], //车辆类别
        carType2: [], //车辆类别

        receiptBank: "", //收款人银行
        receiptName: "", //收款人姓名
        receiptAccount: "" //收款人账号
      },
      formData: {},
      errMsg: "", //意见描述报错信息
      //扫描
      showScan: false,
      scanName: "",
      actions: [
        { name: "相机扫描识别", value: "scan" },
        { name: "相册导入识别", value: "album" }
      ],
      accout: "",
      phone: ""
    };
  },
  methods: {
    // ---------------------导航------------------------------
    //导航右上角的按钮
    goPage(val) {
      if (val.title === "GPS安装信息") {
        let gpsInfo = this.projectForm.gpsInfo[0];
        if (!gpsInfo || !gpsInfo.orderId) {
          this.$notify({
            type: "danger",
            message: "未安装 GPS!"
          });
          return false;
        } else {
          let url = `${this.$prefixurl}orderDetail?id=${gpsInfo.orderId}&showTitle=false&externalid=${this.projectForm.projectInfo.projectNo}&externalcustnum=${this.projectForm.projectInfo.customNum}&externalvehicleid=${this.projectForm.projectInfo.cars[0].id}&username=${this.projectForm.projectInfo.clientManager.name}&xhphonenum=${this.projectForm.projectInfo.clientManager.mobile}&type=xh_h5`;
          //通知移动端加载gps安装页面
          Bridge.callHandler("loadUrl", url, data => {
            this.onLoad();
          });
          // location.href = url
        }
      } else {
        let queryData = {
          customerId: this.projectForm.projectInfo.customerId,
          customerNum: this.projectForm.projectInfo.customerNum,
          projectId: this.projectForm.projectInfo.projectId,
          remark: this.params.info.remark,
          lpCertificateNum: this.projectForm.projectInfo.certificateNum,
          isView: 1, //  0:修改  1：查看
          projectNo: this.projectForm.projectInfo.projectNo
        };
        this.$router.push({ path: val.url, query: queryData });
      }
    },
    //返回按钮
    backFn() {
      if (this.stepIndex == 1) {
        this.$router.back(-1);
      } else {
        this.stepIndex--;
      }
    },
    //显示选择弹框
    showPopupType(type, index) {
      if (this.dealState) {
        return;
      }
      this.popupShow = true;
      this.popupSign = {
        label: type,
        value: index
      };
      switch (type) {
        case "payType":
          this.title1 = "请选择走款模式";
          this.columns = [
            { label: "快垫", key: "1" },
            { label: "传统", key: "2" }
          ];
          break;
        case "customerSex":
          this.title1 = "请选择主借人的性别";
          this.columns = this.customerSexList;
          break;
        case "payment_source":
          this.title1 = "请选择还款来源";
          this.columns = this.dictionaryData.payment_source;
          break;
        case "OccupationalStatus":
          this.title1 = "请选择职务";
          this.columns = this.dictionaryData.OccupationalStatus;
          break;
        case "car_type":
          this.title1 = "请选择车辆类型";
          this.columns = [
            {
              values: Object.values(this.dictionaryData.car_type),
              className: "column1"
            },
            {
              values: this.dictionaryData.car_type2,
              className: "column2",
              defaultIndex: 0
            }
          ];
          break;
        case "vehicle_specifications":
          this.title1 = "请选择车辆规格";
          this.columns = this.dictionaryData.vehicle_specifications;
          break;
        case "CAR_SOURCE":
          this.title1 = "请选择车辆来源";
          this.columns = this.dictionaryData.CAR_SOURCE;
          break;
        case "period_number":
          this.title1 = "请选择贷款期数";
          this.columns = this.dictionaryData.period_number;
          break;
        case "submit":
          this.title1 = "请选择下节点审批人";
          this.columns = this.processHandlerList;
          break;
        case "BANK_TYPE_JYR":
          this.title1 = "银行";
          this.columns = this.wordbook.BANK_TYPE_JYR;
          break;
      }
    },
    onCancel() {
      this.popupShow = false;
    },
    onConfirm(value) {
      this.popupShow = false;
      switch (this.popupSign.label) {
        case "payType":
          this.projectForm.projectInfo.payType = value.label;
          break;
        case "customerSex":
          this.form.borrowerInfo.customerSexDesc = value.label;
          this.form.borrowerInfo.customerSex = value.value;
          break;
        case "payment_source":
          this.form.borrowerInfo.paymentSourceDesc = value.label;
          this.form.borrowerInfo.paymentSource = value.value;
          break;
        case "OccupationalStatus":
          this.form.borrowerInfo.postDesc = value.label;
          this.form.borrowerInfo.post = value.value;
          break;
        case "car_type":
          let desc = [];
          value.forEach(item => {
            desc.push(item.label);
          });
          this.form.carInfos[this.popupSign.value].carTypeDesc = desc.join("-");
          this.form.carInfos[this.popupSign.value].carType = value[0].value;
          this.form.carInfos[this.popupSign.value].carType2 = value[1].value;
          this.errorMsg.carType[this.popupSign.value] = "";
          break;
        case "vehicle_specifications":
          this.form.carInfos[this.popupSign.value].carSpecificationsDesc =
            value.label;
          this.form.carInfos[this.popupSign.value].carSpecifications =
            value.value;
          this.errorMsg.carSpecifications[this.popupSign.value] = "";
          break;
        case "CAR_SOURCE":
          this.form.carInfos[this.popupSign.value].carSourceDesc = value.label;
          this.form.carInfos[this.popupSign.value].carSource = value.value;
          this.errorMsg.carSource[this.popupSign.value] = "";
          break;
        case "period_number":
          this.form.loanInfo.loanTermDesc = value.label;
          this.form.loanInfo.loanTerm = value.value;
          this.errorMsg.loanTerm = "";
          break;
        case "BANK_TYPE_JYR":
          this.form.receiptInfo.receiptBank = value.label;
          break;
        case "submit":
          this.submitProcess(value);
          break;
      }
    },
    //-----------省市区----------------
    showMapMethod(name) {
      if (this.dealState) {
        return;
      }
      this.mapShow = true;
      this.mapShowText = name;
    },
    getProvince(code, name) {
      this.form.borrowerInfo[this.mapShowText] = name;
      this.mapShow = false;
      switch (this.mapShowText) {
        case "registerProvCityZon":
          this.form.borrowerInfo.registerProvCityZonCode = code;
          break;
        case "familyAddressProvCityZon":
          this.form.borrowerInfo.familyAddProvCityZonCode = code;
          break;
        case "customerCoProvCityZon":
          this.form.borrowerInfo.customerCoProvCityZonCode = code;
          break;
      }
    },
    //通过身份证查性别和出生年月
    getIdcard(e) {
      let sex = getSex(e.target.value);
      let age = getAge(e.target.value);
      this.form.borrowerInfo.customerSex = sex;
      this.form.borrowerInfo.customerSexDesc = this.switchSex(sex);
      this.form.borrowerInfo.customerAge = age;
    },
    //转换性别
    switchSex(sex) {
      let sexText = "";
      this.customerSexList.forEach((item, index) => {
        if (item.value == sex) {
          sexText = item.label;
        }
      });
      return sexText;
    },
    //-----------品牌型号--------------------
    selectBrand(index) {
      if (this.dealState) {
        return;
      }
      this.showBrand = true;
      this.showBrandSign = index;
    },
    changeBrand(carBrand) {
      this.form.carInfos[this.showBrandSign].carModelId = carBrand.model.id;
      this.form.carInfos[this.showBrandSign].brndNmId = carBrand.brand.id;
      this.form.carInfos[this.showBrandSign].carSeriesId = carBrand.series.id;
      this.form.carInfos[this.showBrandSign].carModel = carBrand.model.name;
      this.form.carInfos[this.showBrandSign].carBrand = carBrand.brand.name;
      this.form.carInfos[this.showBrandSign].carSeries = carBrand.series.name;
      this.form.carInfos[this.showBrandSign].brandModel =
        carBrand.brand.name +
        " " +
        carBrand.series.name +
        " " +
        carBrand.model.name;
      this.errorMsg.brndNmId[this.showBrandSign] = "";
    },
    //下一步
    nextStep() {
      if (this.dealState) {
        this.stepIndex++;
        return;
      }
      let num = 0;
      for (let item in this.errorMsg) {
        if (
          item == "mainBorrowerName" ||
          item == "mainBorrowerId" ||
          item == "mainBorrowerPhone"
        ) {
          //借款人信息-borrowerInfo
          this.errorMsg[item] = this.returnMsg(
            item,
            this.form.borrowerInfo[item]
          );
          if (this.errorMsg[item] !== "") {
            num++;
          }
        }
      }
      if (num !== 0) {
        return;
      }
      this.stepIndex++;
    },
    //获取放款信息详情
    async getDetailsInfo() {
      try {
        this.listLoading = true;
        let para = {
          id: this.businessKey
        };
        const data = await loanInfoDetail(para);
        if (data.code == 200) {
          this.form = data.data;
          this.form.borrowerInfo.customerSexDesc = this.switchSex(
            data.data.borrowerInfo.customerSex
          );
          this.form.borrowerInfo.paymentSourceDesc = this.returnText(
            "payment_source",
            this.form.borrowerInfo.paymentSource
          );
          this.form.borrowerInfo.postDesc = this.returnText(
            "OccupationalStatus",
            this.form.borrowerInfo.post
          );
          this.form.loanInfo.loanTermDesc = this.form.loanInfo.loanTerm
            ? this.returnText("period_number", this.form.loanInfo.loanTerm)
            : null;
          this.form.carInfos.forEach((item, index) => {
            item.carNatureDesc = this.returnText("car_nature", item.carNature);
            item.carSpecificationsDesc = item.carSpecifications
              ? this.returnText(
                  "vehicle_specifications",
                  Number(item.carSpecifications)
                )
              : null;
            item.carSourceDesc = this.returnText("CAR_SOURCE", item.carSource);
            item.carTypeDesc =
              item.carType && item.carType2
                ? this.returnText("car_type", item.carType) +
                  "-" +
                  this.returnText("car_type2", item.carType2)
                : null;
            item.brandModel = item.carBrand
              ? item.carBrand + " " + item.carSeries + " " + item.carModel
              : "";
          });
          this.getProjectInfo(data.data.borrowerInfo.projectId);
          // this.listLoading=false;
        }
      } catch (err) {
        console.log(err);
        this.listLoading = false;
      }
    },
    //获取项目信息
    async getProjectInfo(projectId) {
      try {
        let para = {
          id: projectId
        };
        this.listLoading = true;
        const data = await getProjectInfo(para);
        if (data.code == 200) {
          this.projectForm = data.data;
          if (this.dealState) {
            this.initImage();
          }
          this.listLoading = false;
        }
      } catch (err) {
        console.log(err);
        this.listLoading = false;
      }
    },
    //-------------------字典数据请求-------------------
    //获取字典数据
    async getDictionaryData() {
      try {
        let arr = [
          "payment_source", //还款来源
          "OccupationalStatus", //职务
          "car_type", //车辆类别
          "car_type2", //车辆类别2
          "car_nature", //车辆性质
          "vehicle_specifications", //车辆规格
          "CAR_SOURCE", //车辆来源
          "period_number" //贷款期数
        ];
        const data = await getDic(arr);
        if (data.code == 200) {
          this.dictionaryData = data.data;
          this.getDetailsInfo();
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 字典转换
    returnText(n, val) {
      if (!val) {
        return val;
      }
      let name;
      this.dictionaryData[n].forEach(e => {
        if (e.value == val) {
          name = e.label;
        }
      });
      return name;
    },
    verifyComments() {
      if (this.commentsDesc == "") {
        this.errMsg = "请输入意见描述!";
      } else {
        this.errMsg = "";
      }
      return this.errMsg;
    },
    //----------------更新放款结果---------------
    async updateInfo() {
      let num = 0;
      for (let item in this.errorMsg) {
        if (
          item == "mainBorrowerName" ||
          item == "mainBorrowerId" ||
          item == "mainBorrowerPhone"
        ) {
          //借款人信息-borrowerInfo
          //不做验证
        } else if (
          item == "seeingCarPrice" ||
          item == "actualInvoicedPrice" ||
          item == "carSource" ||
          item == "brndNmId" ||
          item == "carSeriesId" ||
          item == "carModelId" ||
          item == "carSpecifications" ||
          item == "carType" ||
          item == "carType2"
        ) {
          //车辆信息-carInfos
          this.form.carInfos.forEach((i, index) => {
            var arr = [];
            arr[index] = this.returnMsg(item, this.form.carInfos[index][item]);
            this.errorMsg[item] = arr;
            if (this.errorMsg[item][index] !== "") {
              num++;
            }
          });
        } else if (
          item == "receiptName" ||
          item == "receiptAccount" ||
          item == "receiptBank"
        ) {
          //收款人信息-receiptInfo
          this.errorMsg[item] = this.returnMsg(
            item,
            this.form.receiptInfo[item]
          );
          if (this.errorMsg[item] !== "") {
            num++;
          }
        } else {
          //贷款信息-loanInfo
          this.errorMsg[item] = this.returnMsg(item, this.form.loanInfo[item]);
          if (this.errorMsg[item] !== "") {
            num++;
          }
        }
      }
      if (num !== 0) {
        return;
      }
      try {
        this.updateLoading = true;
        let para = Object.assign({}, this.form);
        const data = await updateLoanInfo(para);
        if (data.code == 200) {
          this.updateLoading = false;
          Notify({ type: "success", message: "保存成功" });
          this.stepIndex++;
        }
      } catch (err) {
        console.log(err);
        this.updateLoading = false;
      }
    },
    //-----------提交流程--------------------
    submit() {
      var verify = this.verifyComments();
      if (verify !== "") {
        return;
      }
      //获取流程处理人
      let para = {
        name: "BankInside"
      };
      this.submitLoading = true;
      getPeople(para)
        .then(data => {
          if (data.code == 200) {
            let arr = [];
            data.data.forEach((item, index) => {
              let obj = {};
              obj.label = item.companyName + "-" + item.name;
              obj.id = item.id;
              arr.push(obj);
            });
            this.processHandlerList = arr;
            this.showPopupType("submit");
            this.submitLoading = false;
          }
        })
        .catch(err => {
          console.log(err);
          this.submitLoading = false;
        });
    },
    //提交流程
    async submitProcess(nextUserObj) {
      try {
        let para = Object.assign({}, this.form);
        let params = {
          businessKey: this.businessKey,
          nextUser: nextUserObj.id,
          commentsDesc: this.commentsDesc,
          isSendMsg: this.checked ? 1 : 0,
          receiver: this.projectForm.projectInfo.clientManager.id,
          msgType: "WF_BANK_MAKE_LOAN_YWY",
          customerNum: this.projectForm.projectInfo.customerNum,
          customerName: this.projectForm.projectInfo.customerName,
          projectNo: this.checked ? this.projectForm.projectInfo.projectNo : "",
          conclusionCode: "01"
        };
        para.wfCommentInfo = params;
        this.listLoading = true;
        const data = await submitProcess(para);
        if (data.code == 200 && data.status) {
          Notify({ type: "success", message: "流程提交成功" });
          setTimeout(() => {
            this.$router.go(-1);
          }, 1000);
          this.listLoading = false;
        }
      } catch (err) {
        console.log(err);
        this.listLoading = false;
      }
    },
    changeTab(e) {
      if (e == 2) {
        this.getCreditInfo();
      }
    },
    //获取征信信息
    async getCreditInfo() {
      try {
        this.listLoading = true;
        const params = {
          lpCertificateNum: this.projectForm.projectInfo.certificateNum
        };
        const res = await getCreditInfo(params);
        this.creditList = res.data.cuCreditRegister;
        this.listLoading = false;
      } catch (e) {
        this.listLoading = false;
        console.log(e);
      }
    },
    //------------已办--图片----------------------
    async initImage() {
      try {
        await this.getDocumentByType("7776"); //凭证图片
      } catch (e) {
        console.log(e);
      }
    },
    async getDocumentByType(documentType) {
      try {
        const params = {
          customerNum: this.projectForm.projectInfo.customerNum,
          documentType: documentType
        };
        const { data } = await getDocumentByType(params);
        const declare = "放款凭证";
        data.forEach(item => {
          item.declare = declare;
        });
        this.dataList.push({
          declare: declare, //图片描述
          isRequire: true, //*是否必须
          deletable: false, //是否可以操作-上传和删除
          documentType: documentType,
          customerNum: this.projectForm.projectInfo.customerNum,
          customerId: this.projectForm.projectInfo.customerId,
          kind: "1",
          fileList: data || []
        });
      } catch (e) {
        console.log(e);
      }
    },
    /**
     * 识别   idCardOCR:身份证    bankCodeOCR：银行卡
     */
    IdcardLoading(name) {
      this.showScan = true;
      this.scanName = name;
    },
    //身份证号/银行卡
    discern(e) {
      this.$bridge.callHandler(this.scanName, e.value, res => {
        if (this.scanName == "idCardOCR") {
          this.$set(this.form.borrowerInfo, "mainBorrowerId", res.ID_NUM);
        } else {
          this.$set(this.form.receiptInfo, "receiptAccount", res.BANK_NUM);
        }
      });
      this.showScan = false;
    }
  },
  created() {},
  mounted() {
    this.params = {
      info: this.getStringToObj(this.$route.query.info),
      dealState: this.$route.query.dealState
    };
    this.businessKey = Number(this.params.info.businesskey);
    this.dealState = this.params.dealState == 1 ? false : true;
    this.userName = Cookies.get("name");
    this.getDictionaryData();
    if (!this.dealState) {
      this.rulesForm("order-bankloan-zd");
    }
    this.accout = Cookies.get("loginName");
    this.phone = Cookies.get("phone");
  }
};
</script>

<style scoped>
.tabBox {
  padding: 10px 10px;
}

.rowBox {
  margin: 10px 0;
}

.notice {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notice > p {
  margin: 0;
  width: 70%;
}

.notice > .van-cell {
  padding: 0;
}

.van-cell__value--alone {
  text-align: right;
}

.rightClass {
  color: #323233;
}

.lendProcess .van-cell__right-icon {
  color: #323233;
}

.lendProcessAlready .van-cell__value--alone {
  color: #969799;
}
</style>
