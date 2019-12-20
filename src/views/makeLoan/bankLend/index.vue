<template>
    <ViewPage :loading='listLoading'>
        <van-tabs v-model="activeName" v-if="form.projectInfo">
            <van-tab title="银行审批信息" name="1" class="tabBox">
                <!-- 客户基本信息 -->
                <red-card label="客户基本信息">
                    <template slot="cardBody">
                        <div>
                            <van-row>
                                <van-col span="12" class="xh-top-10 xh-ellipsis">
                                    客户姓名：{{form.projectInfo.customerName}}
                                </van-col>
                                <van-col span="12" class="xh-top-10 xh-text-right" >
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
                        <van-field label="主借人还款卡号：" :border="false" label-width='150' input-align="right" required v-model="bankLoanInfo.repaymentBankCardNo" />
                        <van-cell title="还款卡银行：" :border='false' value-class='rightClass' :value="bankLoanInfo.accountBank" is-link  @click="showPopupType('accountBank')"/>
                        <van-cell title="录机时间：" :border='false' required is-link :value="bankLoanInfo.advanceInstitutionDate" value-class='rightClass' @click="showPopupTime('recordTime')"/>
                        <div v-if="approvalConclusionDesc=='已放款'">
                            <van-field :border="false" label-width='150' input-align="right" label="实际放款金额（元）：" required placeholder="请输入" v-model="bankLoanInfo.factLoanAmt"/>
                            <van-cell :border='false' title="实际放款时间：" value-class='rightClass' v-model="bankLoanInfo.factLoanDate" @click="showPopupTime('actualLendTime')" is-link value="请选择"/>
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
                        意见描述
                    </template>
                    <div>
                        <van-field required :border="false" v-model="commentsDesc" rows="2" autosize type="textarea" maxlength="200" placeholder="请输入留言" show-word-limit />
                    </div>
                </Card>
                <!-- 通知业务员 -->
                <Card style="margin-top:15px;" v-if="approvalConclusionDesc=='退回'">
                    <template v-slot:header>
                        <div class="notice">
                            <p>通知业务员</p>
                            <van-checkbox slot="right-icon" shape="square" label-position='left' v-model="salesmanChecked" style="line-height: inherit;">{{form.projectInfo.customerName}}</van-checkbox>
                        </div>
                    </template>
                </Card>
                <!-- 通知财务 -->
                <Card style="margin-top:15px;" v-if="approvalConclusionDesc=='拒绝放款'">
                    <template v-slot:header>
                        <div class="notice">
                            <p>通知财务</p>
                            <van-cell>
                                <span @click="showPopupType('FinanceCashier')">{{FinanceCashierDesc}}</span>
                                <van-checkbox slot="right-icon" label-disabled shape="square" v-model="cashierChecked" style="line-height: inherit;margin-left:10px;"></van-checkbox>
                            </van-cell>
                        </div>
                    </template>
                </Card>
                <!-- 提交按钮 -->
                <div class="xh-submit" style="padding: 0 10px;">
                    <van-button :disabled="approvalConclusionDesc=='请选择'" size="large" class="xh-bg-main" @click="submit" :loading="submitloading">提 交</van-button>
                </div>
            </van-tab>
            </van-tab>
            <van-tab title="征信信息" name="2"></van-tab>
            <van-tab title="审批记录" name="3"></van-tab>
        </van-tabs>

        <!-- 图片 -->
        <van-dialog v-model="showQRCode" 
        :show-confirm-button="false" 
        :show-cancel-button="false" 
        :close-on-popstate="true"
        :close-on-click-overlay="true">
            <img width="100%" height="100%" :src="qrCodeUrl" />
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
            @confirm="onConfirm" />
        </van-popup>
        <!-- 日期选择器 -->
        <van-popup position="bottom" :overlay="true" v-model="popupShowTime">
            <van-datetime-picker 
                v-model="currentDate" 
                type="date" 
                :title='title2'
                @change="changeDate" 
                @confirm="confirmTime"
                @cancel="cancelTime"/>
        </van-popup>
    </ViewPage>
</template>

<script>
  import Vue from 'vue';
  import { mapGetters } from 'vuex'
  import dayjs from 'dayjs'
  import ViewPage from '@/layout/components/ViewPage';
  import Card from '@/components/card/index';
  import redCard from "@/components/redCard/index";
  import imageList from '@/components/imageList';
  import { getDocumentByType } from '@/api/document'
  import {getProjectInfo,getPeople,submitProcess,loanInfoDetail} from '@/api/makeLoan.js';
  import { getDic } from "@/api/createCustomer";
  import { Dialog, Button, Row, Col, Tab, Tabs, Cell, CellGroup,Picker,Popup,Field,DatetimePicker,Checkbox,Notify } from 'vant';

  const Components = [Dialog, Button, Row, Col, Tab, Tabs, Cell, CellGroup,Picker,Popup,Field,DatetimePicker,Checkbox,Notify];
  Components.forEach(item => {
  Vue.use(item);
});

export default {
  name:'bakLend',
  components: {
    redCard,
    Card,
    ViewPage,
    imageList
  },
  data() {
    return {
        activeName: "1",
        listLoading:false,
        columns: [],
        imgWalkList: [],//图片
        popupShow: false,
        title1:'',
        approvalConclusion:'',//审批结论code
        approvalConclusionDesc:'请选择',
        financeCashierList:[],//财务人员列表
        salesmanChecked: false,
        cashierChecked:false,//财务人员勾选
        form:{},
        bankLoanInfo:{},//放款信息
        commentsDesc:'',//意见描述
        FinanceCashier:'',
        FinanceCashierDesc:'请选择',//财务人员
        showQRCode: false,
        qrCodeUrl: "",
        loading: false,
        title2:'',
        popupShowTime:false,
        popupShowTimeSign:'',
        currentDate: new Date(),
        dictionaryData:{},//字典数据
        submitloading:false,
        businessKey:47,
        projectId:0,
        dataList: [],
    };
  },
  methods: {
    //-----------显示选择弹框--------------
    showPopupType(type) {
        this.popupShow = true
        this.popupSign = type
        switch (type) {
        case 'approvalConclusion':
            this.title1 = '请选择审批结论'
            this.columns = [
            { label: '通过', value: '01' },
            { label: '退回', value: '02' },
            { label: '拒绝放款', value: '03' },
            { label: '已放款', value: '04' }
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
    onConfirm(value) {
        this.popupShow = false
        switch (this.popupSign) {
            case 'approvalConclusion':
                this.approvalConclusion=value.value;
                this.approvalConclusionDesc=value.label;
                if(this.approvalConclusion!=='04'){
                    this.bankLoanInfo.factLoanAmt='';
                    this.bankLoanInfo.factLoanDate='';
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
    onCancel() {
        this.popupShow = false
    },
    //获取财务人员
    getFinanceCashier(){
        let para={
            name:'BankInside'
        }
        getPeople(para).then((data)=>{
            if(data.code==200){
                let arr=[];
                data.data.forEach((item,index)=>{
                    let obj={}
                    obj.label=item.companyName+'-'+item.name;
                    obj.value=item.id;
                    arr.push(obj);
                })
                this.financeCashierList=arr;
            }
        }).catch((err)=>{
            console.log(err)
        })
    },
    //-------------显示选择日期弹框------------
    showPopupTime(type){
        this.popupShowTime=true;
        this.popupShowTimeSign=type;
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
        switch(this.popupShowTimeSign){
            case 'recordTime':
                this.bankLoanInfo.advanceInstitutionDate=dayjs(this.currentDate).format('YYYY-MM-DD');
                break;
            case 'actualLendTime':
                this.bankLoanInfo.factLoanDate=dayjs(this.currentDate).format('YYYY-MM-DD');
                break;
            }
    },
    confirmTime (value) {
        this.popupShowTime=false;
        this.changeDate(value)
    },
    cancelTime(){
        this.popupShowTime=false;
    },
    //获取项目id
    async getDetailsInfo(){
        try{
            this.listLoading=true;
            let para={
                id:this.businessKey
            }
            const data=await loanInfoDetail(para);
            if(data.code==200){
                this.projectId=data.data.borrowerInfo.projectId;
                this.getProjectInfo(this.projectId);
            }
        }catch(err){
            console.log(err)
            this.listLoading=false;
        }
    },
    //获取项目信息
    async getProjectInfo(projectId){
        try{
            let para={
                id:projectId
            }
            this.listLoading=true;
            const data=await getProjectInfo(para);
            if(data.code==200){
                this.form=data.data;
                this.initImage();
                this.listLoading=false;
            }
        }catch(err){
            console.log(err)
            this.listLoading=false;
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
                this.dictionaryData=data.data;
                this.getDetailsInfo();
            }
        } catch (err) {
            console.log(err);
        }
    },
    // 字典转换
    returnText(n, val) {
        let name;
        this.dictionaryData[n].forEach(e => {
            if (e.value == val) {
                name = e.label;
            }
        });
        return name;
    },
    //--------------提交-------------
    async submit() {
        try{  
            let para={};
            let wfCommentInfo={};
            if(this.approvalConclusion=='01'||this.approvalConclusion=='04'){
                wfCommentInfo={
                    businessKey:this.businessKey,
                    commentsDesc:this.commentsDesc,
                    conclusionCode:this.approvalConclusion,
                    customerNum:this.form.projectInfo.customerNum,
                    customerName:this.form.projectInfo.customerName,
                }
            }
            if(this.approvalConclusion=='02'){
                wfCommentInfo={
                    businessKey:this.businessKey,
                    commentsDesc:this.commentsDesc,
                    conclusionCode:this.approvalConclusion,
                    customerNum:this.form.projectInfo.customerNum,
                    customerName:this.form.projectInfo.customerName,
                    msgType:'WF_BANK_MAKE_LOAN_YWY',
                    isSendMsg:this.salesmanChecked?1:0,
                    receiver:this.form.projectInfo.clientManager.id,
                    projectNo:this.salesmanChecked?this.form.projectInfo.projectNo:'',
                }
            }
            if(this.approvalConclusion=='03'){
                wfCommentInfo={
                    businessKey:this.businessKey,
                    commentsDesc:this.commentsDesc,
                    conclusionCode:this.approvalConclusion,
                    customerNum:this.form.projectInfo.customerNum,
                    customerName:this.form.projectInfo.customerName,
                    msgType:'WF_BANK_MAKE_LOAN_CW',
                    isSendMsg:this.cashierChecked?1:0,
                    receiver:this.FinanceCashier,
                    projectNo:this.cashierChecked?this.form.projectInfo.projectNo:'',
                }
            }
            let bankLoanInfo=Object.assign({},this.bankLoanInfo);
            bankLoanInfo.id=this.businessKey;
            para.wfCommentInfo=wfCommentInfo;
            para.bankLoanInfo=bankLoanInfo;
            this.submitloading=true;
            const data=await submitProcess(para);
            if(data.code==200&&data.status){
                Notify({ type: 'success', message: '流程提交成功' });
                setTimeout(()=>{
                    this.$router.push({ path:'/lendProcessList'});
                },1000)
                this.submitloading=false;
            }
        }catch(err){
            console.log(err)
            this.submitloading=false;
        }
    },
    // -------------图片------------
    async initImage () {
        try {
            await this.getDocumentByType('7776')//凭证图片
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
  },
  mounted() {
    this.getDictionaryData();
    this.getFinanceCashier();
    
  }
};
</script>

<style scoped>
.tabBox{
    padding: 10px 10px;
}
.rowBox{
    margin: 10px 0;
}
.notice{
    display:flex;
    justify-content: space-between;
    align-items: center;
}
.notice>p{
    margin:0;
    width:70%;
}
.notice>.van-cell{
    padding: 0;
}
.van-cell__value--alone{
    text-align: right;
}
.rightClass{
    color: #323233;
}
#bankLend .van-cell__right-icon{
    color: #323233;
}
</style>
