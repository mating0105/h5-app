<template>
    <ViewPage :loading='listLoading' :rightMenuList='rightBoxList' :goPage='goPage' :iconClass="iconClass">
        <van-tabs v-model="activeName" v-if="form.projectInfo" @change='changeTab'>
            <van-tab title="银行审批信息" name="1" class="tabBox">
                <!-- 客户基本信息 -->
                <red-card label="客户基本信息">
                    <template slot="cardBody">
                        <div>
                            <van-row>
                                <van-col span="12" class="xh-top-10 xh-ellipsis">
                                    客户姓名：{{form.projectInfo.customerName}}
                                </van-col>
                                <van-col span="12" class="xh-top-10 xh-text-right">
                                    联系电话：{{form.projectInfo.contactPhone}}
                                </van-col>
                            </van-row>
                            <van-row>
                                <van-col span="24" class="xh-top-10 xh-ellipsis">
                                    证件号码：{{form.projectInfo.certificateNum}} | 身份证
                                </van-col>
                            </van-row>
                        </div>
                    </template>
                </red-card>
                <!-- 审批结论 -->
                <Card style="margin-top:15px;">
                    <template v-slot:header>
                        <div class="notice">
                            <p>审批结论</p>
                            <van-cell v-model="approvalConclusionDesc" is-link @click="showPopupType('approvalConclusion')"/>
                        </div>
                    </template>
                </Card>
                <!-- 银行放款信息 -->
                <Card style="margin-top:15px;" id="bankLend">
                    <template v-slot:header>
                        银行放款信息
                    </template>
                    <div>
                        <van-field
                                label="主借人还款卡号："
                                :border="false"
                                label-width='130'
                                input-align="right"
                                :required="approvalConclusionDesc=='通过'||approvalConclusionDesc=='已放款'"
                                v-model="bankLoanInfo.repaymentBankCardNo"
                                placeholder="请输入"
                                name="repaymentBankCardNo"
                                @blur.prevent="ruleMessge($event,null,ruleMsg)"
                                :error-message="errorMsg.repaymentBankCardNo"
                                right-icon="scan"
                                @click-right-icon="IdcardLoading"/>
                        <van-cell title="还款卡银行：" :border='false' value-class='rightClass' :value="bankLoanInfo.accountBank" is-link
                                  @click="showPopupType('accountBank')"/>
                        <van-cell title="录机时间：" :border='false' required is-link :value="dayjs(bankLoanInfo.advanceInstitutionDate).format('YYYY-MM-DD HH:mm')"
                                  value-class='rightClass' @click="showPopupTime('recordTime')" @blur.prevent="ruleMessge" label-class='labelClass'
                                  :label="errorMsg.advanceInstitutionDate"/>
                        <div v-if="approvalConclusionDesc=='已放款'">
                            <van-field :border="false" label-width='150' input-align="right" label="实际放款金额：" required placeholder="请输入"
                                       v-model="bankLoanInfo.factLoanAmt" name='factLoanAmt' @blur.prevent="priceFloat(bankLoanInfo, 'factLoanAmt')"
                                       :error-message="errorMsg.factLoanAmt">
                                <div slot="button">元</div>
                            </van-field>
                            <van-cell :border='false' title="实际放款时间：" value-class='rightClass' required
                                      :value="bankLoanInfo.factLoanDate?dayjs(bankLoanInfo.factLoanDate).format('YYYY-MM-DD HH:mm'):''"
                                      @blur.prevent="ruleMessge"
                                      label-class='labelClassNew'
                                      @click="showPopupTime('actualLendTime')" is-link
                                      :label="errorMsg.factLoanDate"/>
                        </div>
                    </div>
                </Card>
                <!-- 放款凭证 -->
                <Card style="margin-top: 10px;" v-if="approvalConclusionDesc=='已放款'">
                    <template v-slot:header>
                        放款凭证
                    </template>
                    <imageList :dataList="dataList"></imageList>
                </Card>
                <!-- 意见描述 -->
                <Card style="margin-top:15px;">
                    <template v-slot:header>
                        <van-cell required style="color:#C4252A" title="意见描述"></van-cell>
                    </template>
                    <div>
                        <van-field :border="false" v-model="commentsDesc" rows="2" autosize type="textarea" maxlength="200" placeholder="请输入留言"
                                   show-word-limit @blur.prevent="verifyComments" :error-message='errMsg'/>
                    </div>
                </Card>
                <!-- 通知业务员 -->
<!--                <Card style="margin-top:15px;" v-if="approvalConclusionDesc=='退回'">-->
<!--                    <template v-slot:header>-->
<!--                        <div class="notice">-->
<!--                            <p>通知业务员</p>-->
<!--                            <van-checkbox slot="right-icon" shape="square" label-position='left' v-model="salesmanChecked" style="line-height: inherit;">-->
<!--                                {{form.projectInfo.clientManager.name}}-->
<!--                            </van-checkbox>-->
<!--                        </div>-->
<!--                    </template>-->
<!--                </Card>-->
                <!-- 通知财务 -->
<!--                <Card style="margin-top:15px;" v-if="approvalConclusionDesc=='拒绝放款'">-->
<!--                    <template v-slot:header>-->
<!--                        <div class="notice">-->
<!--                            <p>通知财务</p>-->
<!--                            <van-cell>-->
<!--                                <span @click="showPopupType('FinanceCashier')">{{FinanceCashierDesc}}</span>-->
<!--                                <van-checkbox slot="right-icon" label-disabled shape="square" v-model="cashierChecked"-->
<!--                                              style="line-height: inherit;margin-left:10px;"></van-checkbox>-->
<!--                            </van-cell>-->
<!--                        </div>-->
<!--                    </template>-->
<!--                </Card>-->
                <!-- 提交按钮 -->
                <div class="xh-submit" style="padding: 0 10px;">
                    <van-button :disabled="approvalConclusionDesc=='请选择'" size="large" class="xh-bg-main" @click="submit" :loading="submitloading">提 交
                    </van-button>
                </div>
            </van-tab>
            <van-tab title="征信信息" name="2">
               <creditInfoTable title="银行征信" :dataList="creditList.surDtlList" type="creditResult" dateType="investigateDate"></creditInfoTable>
              <creditQueryInfo v-if="TYPE == 'bairong' && brdataList.surDtlList.length >0" @lookDocs="lookDocs" title="大数据征信" :credit100Result="brdataList.credit100Result" :dataList="brdataList.surDtlList" type="bigDataResult"></creditQueryInfo>
              <creditInfoTable v-else title="大数据征信" :dataList="creditList.surDtlList" type="bigDataResult" dateType="bigDataDate"></creditInfoTable>
              <creditInfoTable v-if="rg" title="人工征信" :dataList="creditList.surDtlList" type="artificialCreditResult" dateType="investigateDate"></creditInfoTable>
              <creditInfoTable v-if="!rg"title="人保征信" :dataList="creditList.surDtlList" type="personalGuaResult" dateType="peopleBankDate"></creditInfoTable>
            </van-tab>
            <van-tab title="审批记录" name="3">
                <ApprovalRecord></ApprovalRecord>
            </van-tab>
        </van-tabs>

        <!-- 图片 -->
        <van-dialog v-model="showQRCode"
                    :show-confirm-button="false"
                    :show-cancel-button="false"
                    :close-on-popstate="true"
                    :close-on-click-overlay="true">
            <img width="100%" height="100%" :src="qrCodeUrl"/>
        </van-dialog>

        <!-- piker选择器 -->
        <van-popup position="bottom" :overlay="true" v-model="popupShow">
            <van-picker
                    show-toolbar
                    :title="title1"
                    :value-key="'label'"
                    :columns="columns"
                    :loading="loading"
                    @cancel="onCancel"
                    @confirm="onConfirm"/>
        </van-popup>
        <!-- 日期选择器 -->
        <van-popup position="bottom" :overlay="true" v-model="popupShowTime">
            <van-datetime-picker
                    v-model="currentDate"
                    type="datetime"
                    :title='title2'
                    @change="changeDate"
                    @confirm="confirmTime"
                    @cancel="cancelTime"/>
        </van-popup>
        <!-- 身份证识别/银行卡识别 -->
        <van-action-sheet v-model="showScan" :actions="actions" @select="discern"/>
    </ViewPage>
</template>

<script>
  import Vue from 'vue';
  import { mapGetters } from 'vuex'
  import dayjs from 'dayjs'
  import request from '@/utils/request';
  import ViewPage from '@/layout/components/ViewPage';
  import Card from '@/components/card/index';
  import redCard from "@/components/redCard/index";
  import imageList from '@/components/imageList';
  import ApprovalRecord from '@/views/basicInfo/approvalRecord/index';
  import creditInfoTable from '@/views/credit/viewCompoents/creditInfoTable';
  import creditQueryInfo from '@/views/credit/viewCompoents/creditQueryInfo'
  import Cookies from "js-cookie";
  import { getDocumentByType } from '@/api/document'
  import { getCreditInfo,getCompanyName,getCreditType,creditQueryOf100 } from '@/api/credit'
  import { getProjectInfo, getPeople, submitProcess, loanInfoDetail, fieldRules } from '@/api/makeLoan.js';
  import { getDic } from "@/api/createCustomer";
  import { Dialog, Button, Row, Col, Tab, Tabs, Cell, CellGroup, Picker, Popup, Field, DatetimePicker, Checkbox, Notify, Toast, ActionSheet } from 'vant';
  import formValidator from '@/mixins/formValidator'

  const Components = [Dialog, Button, Row, Col, Tab, Tabs, Cell, CellGroup, Picker, Popup, Field, DatetimePicker, Checkbox, Notify, Toast, ActionSheet];
  Components.forEach(item => {
    Vue.use(item);
  });

  export default {
    name: 'bakLend',
    mixins: [formValidator],
    components: {
      redCard,
      Card,
      ViewPage,
      imageList,
      ApprovalRecord,
      creditInfoTable,
      creditQueryInfo
    },
    computed: {},
    data () {
      return {
        activeName: "1",
        listLoading: false,
        dayjs: dayjs,
        params: {},//跳转接收的数据
        columns: [],
        imgWalkList: [],//图片
        popupShow: false,
        title1: '',
        approvalConclusion: '',//审批结论code
        approvalConclusionDesc: '请选择',
        financeCashierList: [],//财务人员列表
        salesmanChecked: false,
        cashierChecked: false,//财务人员勾选
        form: {},
        bankLoanInfo: {
          repaymentBankCardNo: '',
          accountBank: '',
          advanceInstitutionDate: null,
          factLoanAmt: '',
          factLoanDate: null
        },//放款信息
        commentsDesc: '',//意见描述
        FinanceCashier: '',
        FinanceCashierDesc: '请选择',//财务人员
        showQRCode: false,
        qrCodeUrl: "",
        loading: false,
        title2: '',
        popupShowTime: false,
        popupShowTimeSign: '',
        currentDate: new Date(),
        dictionaryData: {},//字典数据
        submitloading: false,
        businessKey: 0,
        dealState: false,//false:'待办'  true:'已办'
        dataList: [],
        iconClass: 'ellipsis',
        rightBoxList: [
          {value: 1, title: '项目基本信息', url: "/projectInfo"},
          {value: 2, title: '做单基本信息', url: "/lendProcess"},
          {value: 3, title: '客户及配偶', url: "/clientIndex"},
          {value: 4, title: '紧急联系人', url: "/contactPerson"},
          {value: 5, title: '房产信息', url: "/houseUser"},
          {value: 6, title: '家庭收入', url: "/incomeFamily"},
          {value: 7, title: '名下车辆', url: "/vehicleList"},
          {value: 8, title: '担保人信息', url: "/guarantor"},
          {value: 9, title: '担保人房产', url: "/houseGuarantor"},
          {value: 10, title: '担保人收入', url: "/incomeGuarantor"},
          {value: 11, title: '调查结论', url: "/survey"},
          {value: 12, title: '相关文档', url: "/proDocument"},
          {value: 13, title: 'GPS安装信息', url: "/gps"},
          {value: 14, title: '合同照片', url: "/contractUpload"},
        ],
        //----tab:2--征信信息
        creditList: {
          investigateBank: '',
          investigateBankName: '',
          isInternetCredit: '',
          carInfos: [],
          surDtlList: []
        },
        //验证字段规则
        ruleData: [],
        errorMsg: {
          factLoanAmt: '',//实际放款金额
          factLoanDate:'',//实际放款时间
          advanceInstitutionDate: '',//录机时间
          repaymentBankCardNo: '',//主借人还款卡号
        },
        formData: {},
        errMsg: '',
        //识别
        showScan: false,
        actions: [
          {name: "相机扫描识别", value: "scan"},
          {name: "相册导入识别", value: "album"}
        ],
        accout: '',
        phone: '',
        TYPE:'',
        rg:false,
        brdataList:{},//百融数据
      };
    },
    watch: {
      activeName(val) {
        console.log(val)
        if (val == '2') {
          this.loadBigDataType();
        }
      }
    },
    methods: {
      ruleMsg () {
        if (this.approvalConclusionDesc == '通过' || this.approvalConclusionDesc == '已放款') {
          this.errorMsg.repaymentBankCardNo = this.returnMsg(
            "repaymentBankCardNo",
            this.bankLoanInfo.repaymentBankCardNo
          );
        } else {
          this.errorMsg.repaymentBankCardNo = '';
        }
      },
      //----------导航----------------
      goPage (val) {
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
          console.log(this.projectForm,222)
          let queryData = {
            customerId: this.projectForm.projectInfo.customerId,
            customerNum: this.projectForm.projectInfo.customerNum,
            projectId: this.projectForm.projectInfo.projectId,
            remark: this.params.info.remark,
            lpCertificateNum: this.projectForm.projectInfo.certificateNum,
            isView: 1,//  0:修改  1：查看
            projectNo: this.projectForm.projectInfo.projectNo,
          }
          // this.$router.push({path: val.url, query: item.value == 2 ? this.$route.query : queryData});
          this.$router.push({ path: val.url, query: queryData });
        }
      },
      //-----------显示选择弹框--------------
      showPopupType (type) {
        this.popupShow = true
        this.popupSign = type
        switch (type) {
          case 'approvalConclusion':
            this.title1 = '请选择审批结论'
            this.columns = [
              {label: '通过', value: '01'},
              {label: '退回', value: '02'},
              {label: '拒绝放款', value: '04'},
              {label: '已放款', value: '10'}
            ]
            break;
          case 'accountBank':
            this.title2 = '请选择还款卡银行';
            this.columns = this.dictionaryData.BANK_TYPE_JYR
            break;
          case 'FinanceCashier':
            this.title2 = '请选择财务人员';
            this.columns = this.financeCashierList;
            break;
        }
      },
      onConfirm (value) {
        this.popupShow = false
        switch (this.popupSign) {
          case 'approvalConclusion':
            this.approvalConclusion = value.value;
            this.approvalConclusionDesc = value.label;
            if (this.approvalConclusion == '02' || this.approvalConclusion == '04') {
              this.errorMsg.repaymentBankCardNo = '';
            }
            if (this.approvalConclusion !== '10') {
              this.bankLoanInfo.factLoanAmt = '';
              this.bankLoanInfo.factLoanDate = '';
            }
            break;
          case 'accountBank':
            this.bankLoanInfo.accountBank = value.label
            break;
          case 'FinanceCashier':
            this.FinanceCashierDesc = value.label;
            this.FinanceCashier = value.value;
            break;
        }
      },
      onCancel () {
        this.popupShow = false
      },
      //获取财务人员
      getFinanceCashier () {
        let para = {
          name: 'BankInside'
        }
        getPeople(para).then((data) => {
          if (data.code == 200) {
            let arr = [];
            data.data.forEach((item, index) => {
              let obj = {}
              obj.label = item.companyName + '-' + item.name;
              obj.value = item.id;
              arr.push(obj);
            })
            this.financeCashierList = arr;
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      //-------------显示选择日期弹框------------
      showPopupTime (type) {
        this.popupShowTime = true;
        this.popupShowTimeSign = type;
        switch (type) {
          case 'recordTime':
            this.title2 = '请选择录机时间'
            break;
          case 'actualLendTime':
            this.title2 = '请选择实际放款时间'
            break;
        }
      },
      changeDate (value) {
        switch (this.popupShowTimeSign) {
          case 'recordTime':
            this.bankLoanInfo.advanceInstitutionDate = (new Date(this.currentDate)).getTime();
            this.errorMsg.advanceInstitutionDate = '';
            break;
          case 'actualLendTime':
            this.bankLoanInfo.factLoanDate = (new Date(this.currentDate)).getTime();
            this.errorMsg.factLoanDate = '';
            break;
        }
      },
      confirmTime (value) {
        this.popupShowTime = false;
        this.changeDate(value)
      },
      cancelTime () {
        this.popupShowTime = false;
      },
      //获取项目id
      async getDetailsInfo () {
        try {
          this.listLoading = true;
          let para = {
            id: this.businessKey
          }
          const data = await loanInfoDetail(para);
          if (data.code == 200) {
            this.bankLoanInfo = data.data.bankLoanInfo;
            this.bankLoanInfo.advanceInstitutionDate = data.data.bankLoanInfo.advanceInstitutionDate ? data.data.bankLoanInfo.advanceInstitutionDate : new Date().getTime();
            this.bankLoanInfo.factLoanDate= data.data.bankLoanInfo.factLoanDate ? data.data.bankLoanInfo.factLoanDate : null;
            this.getProjectInfo(data.data.borrowerInfo.projectId);
          }
        } catch (err) {
          console.log(err)
          this.listLoading = false;
        }
      },
      //获取项目信息
      async getProjectInfo (projectId) {
        try {
          let para = {
            id: projectId
          }
          this.listLoading = true;
          const data = await getProjectInfo(para);
          if (data.code == 200) {
            this.form = data.data;
            this.projectForm = data.data;
            this.initImage();
            this.listLoading = false;
          }
        } catch (err) {
          console.log(err)
          this.listLoading = false;
        }
      },
      //---------获取字典数据------------------
      async getDictionaryData () {
        try {
          let arr = [
            "BANK_TYPE_JYR",//银行

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
      returnText (n, val) {
        let name;
        this.dictionaryData[n].forEach(e => {
          if (e.value == val) {
            name = e.label;
          }
        });
        return name;
      },
      verifyComments () {
        if (this.commentsDesc == '') {
          this.errMsg = '请输入意见描述!'
        } else {
          this.errMsg = ''
        }
        return this.errMsg;
      },
      //--------------提交-------------
      async submit () {
        let num = 0;
        for (let item in this.errorMsg) {
          if (this.approvalConclusionDesc == '已放款') {
            this.errorMsg[item] = this.returnMsg(item, this.bankLoanInfo[item]);
            if (this.errorMsg[item] !== '') {
              num++;
            }
          } else if (this.approvalConclusionDesc == '通过') {
            if (item !== 'factLoanAmt'&&item !=='factLoanDate') {
              this.errorMsg[item] = this.returnMsg(item, this.bankLoanInfo[item]);
              if (this.errorMsg[item] !== '') {
                num++;
              }
            }
          } else {
            if (item == 'advanceInstitutionDate') {
              this.errorMsg[item] = this.returnMsg(item, this.bankLoanInfo[item]);
              if (this.errorMsg[item] !== '') {
                num++;
              }
            }
          }
        }
        var verify = this.verifyComments();
        if (num !== 0) {
          return;
        }
        if (verify !== '') {
          return;
        }
        try {
          let para = {};
          let wfCommentInfo = {};
          if (this.approvalConclusion == '01') {
            wfCommentInfo = {
              businessKey: this.businessKey,
              commentsDesc: this.commentsDesc,
              conclusionCode: this.approvalConclusion,
              customerNum: this.form.projectInfo.customerNum,
              customerName: this.form.projectInfo.customerName,
              msgType: 'WF_BANK_MAKE_LOAN_CW',
              isSendMsg: 1,
              receiver: this.form.projectInfo.clientManager.id,
              projectNo: this.salesmanChecked ? this.form.projectInfo.projectNo : '',
            }
          }
          if (this.approvalConclusion == '02') {
            wfCommentInfo = {
              businessKey: this.businessKey,
              commentsDesc: this.commentsDesc,
              conclusionCode: this.approvalConclusion,
              customerNum: this.form.projectInfo.customerNum,
              customerName: this.form.projectInfo.customerName,
              msgType: 'WF_BANK_MAKE_LOAN_CW',
              isSendMsg: this.salesmanChecked ? 1 : 0,
              receiver: this.form.projectInfo.clientManager.id,
              projectNo: this.salesmanChecked ? this.form.projectInfo.projectNo : '',
            }
          }
          if (this.approvalConclusion == '04') {
            wfCommentInfo = {
              businessKey: this.businessKey,
              commentsDesc: this.commentsDesc,
              conclusionCode: this.approvalConclusion,
              customerNum: this.form.projectInfo.customerNum,
              customerName: this.form.projectInfo.customerName,
              msgType: 'WF_BANK_MAKE_LOAN_CW',
              isSendMsg: this.cashierChecked ? 1 : 0,
              receiver: this.FinanceCashier,
              projectNo: this.cashierChecked ? this.form.projectInfo.projectNo : '',
            }
          }
          if (this.approvalConclusion == '10') {
            wfCommentInfo = {
              businessKey: this.businessKey,
              commentsDesc: this.commentsDesc,
              conclusionCode: this.approvalConclusion,
              customerNum: this.form.projectInfo.customerNum,
              customerName: this.form.projectInfo.customerName,
            }
          }
          let bankLoanInfo = Object.assign({}, this.bankLoanInfo);
          bankLoanInfo.id = this.businessKey;
          para.wfCommentInfo = wfCommentInfo;
          para.bankLoanInfo = bankLoanInfo;
          this.submitloading = true;
          const data = await submitProcess(para);
          if (data.code == 200 && data.status) {
            Notify({type: 'success', message: '流程提交成功'});
            setTimeout(() => {
              this.$router.go(-1);
            }, 1000)
            this.submitloading = false;
          }
        } catch (err) {
          console.log(err)
          this.submitloading = false;
        }
      },
      // -------------图片------------
      async initImage () {
        try {
          await this.getDocumentByType('RECBANK03')//凭证图片
        } catch (e) {
          console.log(e)
        }
      },
      async getDocumentByType (documentType) {
        try {
          const params = {
            customerNum: this.form.projectInfo.customerNum,
            documentType: documentType
          }
          const {data} = await getDocumentByType(params)
          const declare = '放款凭证'
          data.forEach(item => {
            item.declare = declare;
          })
          this.dataList.push({
            declare: declare,//图片描述
            isRequire: true,//*是否必须
            deletable: true,//是否可以操作-上传和删除
            documentType: documentType,
            customerNum: this.form.projectInfo.customerNum,
            customerId: this.form.projectInfo.customerId,
            kind: '1',
            fileList: data || []
          })
        } catch (e) {
          console.log(e)
        }
      },
      //tab:2--征信信息
      changeTab (e) {
        if (e == 2) {
          this.getCreditInfo();
        }
      },
      //获取征信信息
      async getCreditInfo () {
        try {
          this.listLoading = true
          const params = {
            lpCertificateNum: this.form.projectInfo.certificateNum,
          }
          const res = await getCreditInfo(params)
          this.creditList = res.data.cuCreditRegister;
          this.listLoading = false
        } catch (e) {
          this.listLoading = false
          console.log(e)
        }
      },
      /**
       * 识别
       */
      IdcardLoading () {
        this.showScan = true;
      },
      //银行卡
      discern (e) {
        this.$bridge.callHandler('bankCodeOCR', e.value, (res) => {
          this.bankLoanInfo.repaymentBankCardNo = res.BANK_NUM || ''
        })
        this.showScan = false;
      },
      async getCompany(){
        const res = await getCompanyName();
        //鑫弘 显示人工，其他不显示
         if(res.data.companySchemaName == 'xh-vloan' || res.data.companySchemaName == 'ww-vloan'){
          this.rg = true;
        }else{
          this.rg = false;
        }
      },
      //获取该公司的大数据征信类型
      async loadBigDataType(){
        const {data} = await getCreditType();
        // 征信回复：:5/百融征信查询：6
        let buttonId = data[0].buttonId
        if(buttonId){
          this.TYPE = buttonId == 6 ? 'bairong' : '';
          const params = {
            lpCertificateNum: this.params.info.certificateNum
          }
          const res = await creditQueryOf100(params);
          this.brdataList = res.data.cuCreditRegister;
        }else{
          this.TYPE =  ''
        }
      },
      lookDocs(){
        this.activeName = '2';
      }
    },
    mounted () {
      this.params = {
        info: this.getStringToObj(this.$route.query.info),
        dealState: this.$route.query.dealState
      };
      this.businessKey = Number(this.params.info.businesskey);
      this.dealState = this.params.dealState == 1 ? false : true;
      this.getDictionaryData();
      this.getFinanceCashier();
      this.getCompany();
      if (!this.dealState) {
        this.rulesForm("order-bankloan-zh");
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

    #bankLend .van-cell__right-icon {
        color: #323233;
    }
    .van-cell__title .labelClassNew{
        color: #ee0a24;
        text-align: right;
        position: relative;
        left: calc(100% + 1.33333rem);
    }
</style>
