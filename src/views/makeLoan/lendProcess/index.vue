<template>
    <ViewPage :rightFn='rightFn' :backFn='backFn' :loading="listLoading" v-if="projectForm.projectInfo" id="lendProcess">
        <van-tabs v-model="activeName">
            <van-tab title="做单基本信息" name="1" class="tabBox">
                <div v-show="stepIndex==1" style="margin-top:10px;">
                    <Card>
                        <template v-slot:header>
                            项目信息
                        </template>
                        <div>
                            <van-cell title="业务员：" v-model="projectForm.projectInfo.clientManager.name" :border="false"/>
                            <van-cell title="报单时间：" v-model="projectForm.projectInfo.createTime" :border="false"/>
                            <van-cell title="垫款编号：" v-model="projectForm.projectInfo.projectNo" :border="false"/>
                            <van-cell title="制单人员：" :border="false"/>
                            <van-cell title="走款模式：" value-class='rightClass' is-link v-model="projectForm.projectInfo.payType"
                            @click="showPopupType('payType')" :border="false"/>
                        </div>
                    </Card>
                    <Card style="margin-top:15px;">
                        <template v-slot:header>
                            借款人信息
                        </template>
                        <div>
                            <van-field label="主借人姓名：" placeholder="请输入" :border="false" label-width='150' input-align="right" required v-model="form.borrowerInfo.mainBorrowerName"/>
                            <van-field label="主借人身份证：" placeholder="请输入" :border="false" label-width='150' input-align="right" required v-model="form.borrowerInfo.mainBorrowerId" @blur.click="getIdcard" />
                            <van-field label="主借人电话：" placeholder="请输入" :border="false" label-width='150' input-align="right" required v-model="form.borrowerInfo.mainBorrowerPhone" />
                            <van-cell title="主借人性别：" :border="false" value-class='rightClass' is-link v-model="form.borrowerInfo.customerSex"
                            @click="showPopupType('customerSex')" />
                            <van-field label="主借人年龄：" placeholder="请输入" :border="false" label-width='150' input-align="right" v-model="form.borrowerInfo.customerAge"/>
                            <van-field label="主借人月收入（元）：" placeholder="请输入" :border="false" label-width='160' input-align="right" v-model="form.borrowerInfo.mainLoanWage"/>
                            <van-field label="主借人家庭人数：" placeholder="请输入" :border="false" label-width='150' input-align="right" v-model="form.borrowerInfo.fiexdNo" />
                            <van-cell title="还款来源：" :border="false" is-link value-class='rightClass' :value="form.borrowerInfo.paymentSourceDesc"
                            @click="showPopupType('payment_source')" />
                            <van-cell title="职务：" is-link :border="false" value-class='rightClass' :value="form.borrowerInfo.postDesc"
                            @click="showPopupType('OccupationalStatus')" />
                            <van-cell title="户籍地址：" :border="false" value-class='rightClass' is-link v-model="form.borrowerInfo.registerProvCityZon" @click="showMapMethod('registerProvCityZon')"/>
                            <van-field label="户籍详细地址：" placeholder="请输入" :border="false" label-width='150' input-align="right" v-model="form.borrowerInfo.registerAddressDetail" />
                            <van-cell title="家庭地址：" :border="false" value-class='rightClass' is-link v-model="form.borrowerInfo.familyAddressProvCityZon" @click="showMapMethod('familyAddressProvCityZon')"/>
                            <van-field label="家庭详细地址：" placeholder="请输入" :border="false" label-width='150' input-align="right" v-model="form.borrowerInfo.familyAddressDetail" />
                            <van-field label="工作单位名称：" placeholder="请输入" :border="false" label-width='150' input-align="right" v-model="form.borrowerInfo.customerCo" />
                            <van-cell title="工作单位地址：" :border="false" value-class='rightClass' is-link v-model="form.borrowerInfo.customerCoProvCityZon" @click="showMapMethod('customerCoProvCityZon')" />
                            <van-field label="工作单位详细地址：" placeholder="请输入" :border="false" label-width='150' input-align="right" v-model="form.borrowerInfo.customerCoAddDetail" />
                        </div>
                    </Card>
                    <van-button round type="danger" style="width:100%;margin:30px 0;" @click="nextStep">下一步</van-button>
                </div>
                <div v-show="stepIndex==2" style="margin-top:10px;">
                    <Card style="margin-top:15px;" v-for="(item,index) in form.carInfos" :key="item.id">
                        <template v-slot:header>
                            {{'车辆信息'+(index+1)}}
                        </template>
                        <div>
                            <van-cell title="车辆类别：" :border="false" is-link required :value="item.carTypeDesc"
                            @click="showPopupType('carType',index)" value-class='rightClass'/>
                            <van-cell title="车辆性质：" :border="false" is-link value-class='rightClass' required :value="item.carNatureDesc"
                            @click="showPopupType('car_nature',index)" />
                            <van-cell title="车辆规格：" :border="false" is-link value-class='rightClass' required :value="item.carSpecificationsDesc"
                            @click="showPopupType('vehicle_specifications',index)" />
                            <van-cell title="车辆来源" :border="false" is-link value-class='rightClass' required :value="item.customerSexDesc"
                            @click="showPopupType('CAR_SOURCE',index)" />
                            <van-cell title="品牌型号：" :border="false" is-link value-class='rightClass' required :value="item.brndNmId" @click="selectBrand(index)"/>
                            <van-field label="实际开票价（元）：" placeholder="请输入" :border="false" label-width='150' input-align="right" required v-model="item.actualInvoicedPrice" />
                            <van-field label="送行车价（元）：" placeholder="请输入" :border="false" label-width='150' input-align="right" required v-model="item.seeingCarPrice"/>
                        </div>
                    </Card>
                    <Card>
                        <template v-slot:header>
                            贷款信息
                        </template>
                        <div>
                            <van-field label="贷款金额（元）：" placeholder="请输入" label-width='150' input-align="right" :border="false" required v-model="form.loanInfo.loanAmt" />
                            <van-field label="刷卡金额（元）：" placeholder="请输入" label-width='150' input-align="right" :border="false" required v-model="form.loanInfo.floatRate" />
                            <van-field label="评估金额（元）：" placeholder="请输入" label-width='150' input-align="right" :border="false" required required v-model="form.loanInfo.assessmentPrice" />
                            <van-cell title="贷款产品：" :border="false" required v-model="form.loanInfo.loanProductName" />
                            <van-cell title="贷款银行：" :border="false" required :value="form.loanInfo.payPlatformName" />
                            <van-field label="贷款年限：" label-width='150' placeholder="请输入" input-align="right" :border="false" required :value="form.loanInfo.loanYear" />
                            <van-cell title="贷款期数：" value-class='rightClass' :border="false" required is-link :value="form.loanInfo.loanTermDesc"
                            @click="showPopupType('period_number')" />
                            <van-field label="贷款成数：" label-width='150' placeholder="请输入" input-align="right" :border="false" required v-model="form.loanInfo.loanProportion" />
                            <van-field label="客户利率：" label-width='150' placeholder="请输入" input-align="right" :border="false" required v-model="form.loanInfo.loanRate" />
                            <van-field label="浮息利率：" label-width='150' placeholder="请输入" input-align="right" :border="false" v-model="form.loanInfo.floatRate" />
                            <van-field label="公司收费利率：" label-width='150' placeholder="请输入" input-align="right" :border="false" required v-model="form.loanInfo.companyChargeRate" />
                            <van-field label="保费金额（元）：" placeholder="请输入" label-width='150' input-align="right" :border="false" v-model="form.loanInfo.premiumPrice" />
                            <van-field label="业务选融费用（元）：" placeholder="请输入" label-width='150' input-align="right" :border="false" required v-model="form.loanInfo.businessPrice" />
                            <van-field label="资料费（元）：" placeholder="请输入" label-width='150' input-align="right" :border="false" required v-model="form.loanInfo.informationPrice" />
                            <van-field label="车款金额合计（元）：" placeholder="请输入" label-width='150' input-align="right" :border="false" required v-model="form.loanInfo.carTotalPrice" />
                        </div>
                    </Card>
                    <Card style="margin-top:15px;">
                        <template v-slot:header>
                            收款人信息
                        </template>
                        <div>
                            <van-field label="收款人姓名：" placeholder="请输入" label-width='150' input-align="right" :border="false" required v-model="form.receiptInfo.receiptName" />
                            <van-field label="收款人账号：" placeholder="请输入"  label-width='150' input-align="right" :border="false" required v-model="form.receiptInfo.receiptAccount" />
                            <van-field label="收款人银行：" placeholder="请输入"  label-width='150' input-align="right" :border="false" required v-model="form.receiptInfo.receiptBank"/>
                        </div>
                    </Card>
                    <van-button round type="danger" style="width:100%;margin:30px 0;" @click="updateInfo" :loading='updateLoading'>下一步</van-button>
                </div> 
                <div v-show="stepIndex==3" style="margin-top:10px;">
                    <Card style="margin-top:15px;">
                        <template v-slot:header>
                            意见描述
                        </template>
                        <div>
                            <van-field required :border="false" v-model="message" rows="2" autosize type="textarea" maxlength="200" placeholder="请输入留言" show-word-limit/>
                        </div>
                    </Card>
                    <Card style="margin-top:15px;">
                        <template v-slot:header>
                            <div class="notice">
                                <p>通知业务员补充资料</p>
                                <van-checkbox slot="right-icon" shape="square" label-position='left' v-model="checked" style="line-height: inherit;">{{projectForm.projectInfo.clientManager.name}}</van-checkbox>
                            </div>
                        </template>
                    </Card>
                    <van-button round type="danger" style="width:100%;margin:30px 0;" :loading='submitLoading' @click="submit">提交</van-button>
                </div> 
            </van-tab>
            <van-tab title="征信信息" name="2" class="tabBox">
                
            </van-tab>
            <van-tab title="审批记录" name="3" class="tabBox">
                <ApprovalRecord :recordList='recordList'></ApprovalRecord>
            </van-tab>
        </van-tabs>

        <!-- piker选择器 -->
        <van-popup position="bottom" :overlay="true" v-model="popupShow">
            <van-picker show-toolbar :title="title1" :value-key="'label'" :columns="columns" :loading="loading" @cancel="onCancel"
            @confirm="onConfirm" />
        </van-popup>
        <!-- 导航栏右上角按钮 -->
        <div v-if="rightBoxShow" ref="box" class="rightButtonBox" name="rightButtonBox">
            <div class="sanjiao"></div>
            <div v-for="(item,index) in rightBoxList" :key="index">
                <van-button style='text-align:center;width:100%;border:0;' type="default" @click="handleDetailInfo(item.value)">{{item.label}}</van-button>
            </div>
        </div>
        <!-- 地图弹框 -->
        <MapSheet :showMap.sync="mapShow" @getProvince="getProvince" :manualClose='false'></MapSheet>
        <!-- 品牌型号 -->
        <transition name="page-move">
            <brand :visible.sync="showBrand" v-if="showBrand" @change="changeBrand"></brand>
        </transition>
        
    </ViewPage>
</template>

<script>
  import Vue from 'vue';
  import { mapGetters } from 'vuex'
  import ViewPage from '@/layout/components/ViewPage';
  import Card from '@/components/card/index';
  import ApprovalRecord from '@/views/basicInfo/approvalRecord/index';
  import MapSheet from "@/components/provinces/index";
  import brand from '@/components/carBrand/brand'
  import { getSex,getAge} from "@/utils/customer";
  import { getDic } from "@/api/createCustomer";
  import { Tab, Tabs, Row, Col, Cell, CellGroup,Popup,Picker,Button,Field,Checkbox} from 'vant';
  import {loanInfoDetail,getProjectInfo,updateLoanInfo,getPeople} from '@/api/makeLoan.js'

  const Components = [Tab, Tabs, Row, Col, Cell, CellGroup,Popup,Picker,Button,Field,Checkbox]

  Components.forEach(item => {
    Vue.use(item)
  })

  export default {
    name: 'lendProcess',
    components: {
      ViewPage,
      Card,
      ApprovalRecord,
      MapSheet,
      brand
    },
    computed: {
      ...mapGetters([
        'name'
      ])
    },
    data() {
        return {
            //---tab:1--基本信息
            form:{},//车辆信息、贷款信息、收款人信息、借款人信息
            projectForm:{},//项目信息
            listLoading:false,//页面加载
            dictionaryData:{},//字典数据
            activeName: "1",
            mapShow:false,//地图组件显隐
            mapShowText:'',//触发map显示的字段
            popupSign:{},//
            showBrand: false,
            showBrandSign:null,
            customerSexList:[
                { label: '男', key: '1' },
                { label: '女', key: '2' }
            ],
            columns: [],//选择项列表
            popupShow: false,
            title1:'',
            loading: false,
            payTypeShow: false,//走款模式判断显示，
            stepIndex:1,
            rightIcon:true,
            message:'',
            checked:false,
            updateLoading:false,//更新
            submitLoading:false,//提交
            // ---tab:3--审批记录
            recordList:[{
                name:'名字',
                processedRole:'角色',
                createDate:'创建时间',
                businessType:'类型',
                commentsDesc:'描述'
            }],
            // -----右上角按钮-------
            rightBoxList:[
                {value:1,label:'项目基本信息'},
                {value:2,label:'客户及配偶'},
                {value:3,label:'紧急联系人'},
                {value:4,label:'房产信息'},
                {value:5,label:'家庭收入'},
                {value:6,label:'名下车辆'},
                {value:7,label:'担保人信息'},
                {value:8,label:'担保人房产'},
                {value:9,label:'担保人收入'},
                {value:10,label:'调查结论'},
                {value:11,label:'相关文档'},
                {value:12,label:'GPS安装信息'},
                {value:13,label:'合同照片'},
                {value:14,label:'申述意见'},
            ],
            rightBoxShow:false,
        };
    },
    methods: {
        // ---------------------导航------------------------------
        //导航右上角的按钮
        rightFn(){
            this.rightBoxShow=true;
        },
        //返回按钮
        backFn(){
            if(this.stepIndex==1){
                this.$router.back(-1)
            }else{
                this.stepIndex--;
            }
        },
        //点击按钮
        handleDetailInfo(value){
            console.log(value,'value')
        },
        //显示选择弹框
        showPopupType(type,index) {
            this.popupShow = true
            this.popupSign = {
                label:type,
                value:index
            }
            switch (type) {
            case 'payType':
                this.title1 = '请选择走款模式'
                this.columns = [
                { label: '快垫', key: '1' },
                { label: '传统', key: '2' }
                ]
                break;
            case 'customerSex':
                this.title1='请选择主借人的性别'
                this.columns = this.customerSexList
                break;
            case 'payment_source':
                this.title1='请选择还款来源'
                this.columns = this.dictionaryData.payment_source;
                break;
            case 'OccupationalStatus':
                this.title1='请选择职务'
                this.columns = this.dictionaryData.OccupationalStatus;
                break;
            case 'carType'://暂未完成
                this.title1='请选择车辆类型'
                this.columns = this.dictionaryData.carType;
                break;
            case 'car_nature':
                this.title1='请选择车辆性质'
                this.columns = this.dictionaryData.car_nature;
                break;
            case 'vehicle_specifications':
                this.title1='请选择车辆规格'
                this.columns = this.dictionaryData.vehicle_specifications;
                break;
            case 'CAR_SOURCE':
                this.title1='请选择车辆来源'
                this.columns = this.dictionaryData.CAR_SOURCE;
                break;
            case 'period_number':
                this.title1='请选择贷款期数'
                this.columns = this.dictionaryData.period_number;
                break;
            case 'submit':
                this.title1='请选择下节点审批人'
                this.columns = this.processHandlerList;
            }
        },
        onCancel() {
            this.popupShow = false
        },
        onConfirm(value) {
            this.popupShow = false
            switch (this.popupSign.label) {
                case 'payType':
                    this.projectForm.projectInfo.payType=value.label;
                    break;
                case 'customerSex':
                    this.form.borrowerInfo.customerSex=value.label;
                    break;
                case 'payment_source':
                    this.form.borrowerInfo.paymentSourceDesc=value.label;
                    this.form.borrowerInfo.paymentSource=value.id;
                    break;
                case 'OccupationalStatus':
                    this.form.borrowerInfo.postDesc=value.label;
                    this.form.borrowerInfo.post=value.id;
                    break;
                case 'carType'://暂未完成
                    // this.form.carInfos = this.dictionaryData.carType;
                    break;
                case 'car_nature':
                    this.form.carInfos[this.popupSign.value].carNatureDesc=value.label;
                    this.form.carInfos[this.popupSign.value].carNature = value.id;
                    break;
                case 'vehicle_specifications':
                    this.form.carInfos[this.popupSign.value].carSpecificationsDesc = value.label;
                    this.form.carInfos[this.popupSign.value].carSpecifications = value.id;
                    break;
                case 'CAR_SOURCE':
                    this.form.carInfos[this.popupSign.value].customerSexDesc = value.label;
                    this.form.carInfos[this.popupSign.value].customerSex = value.id;
                    break;
                case 'period_number':
                    this.form.loanInfo.loanTermDesc = value.label;
                    this.form.loanInfo.loanTerm = value.id;
                    break;
                case 'submit':
                    this.form.loanInfo.loanTermDesc = value.label;
                    this.form.loanInfo.loanTerm = value.id;
                    this.submitProcess();
                }
        },
        //-----------省市区----------------
        showMapMethod(name) {
            this.mapShow = true;
            this.mapShowText=name;
        },
        getProvince(code,name){
            this.form.borrowerInfo[this.mapShowText]=name;
            this.mapShow = false;
        },
        //通过身份证查性别和出生年月
        getIdcard(e) {
            let sex = getSex(e.target.value);
            let age = getAge(e.target.value);
            this.form.borrowerInfo.customerSex=this.switchSex(sex);
            this.form.borrowerInfo.customerAge = age;
        },
        //转换性别
        switchSex(sex){
            let sexText='';
            this.customerSexList.forEach((item,index)=>{
                if(item.key==sex){
                    sexText=item.label;
                }
            })
            return sexText;
        },
        //-----------品牌型号--------------------
        selectBrand (index) {
            this.showBrand = true;
            this.showBrandSign=index;
        },
        changeBrand (carBrand) {
            this.form.carInfos[this.showBrandSign].brndNmId = carBrand.model.name; 
            // carBrand.brand.name+carBrand.series.name+carBrand.model.name
        },
        //下一步
        nextStep(){
            this.stepIndex++
        },
        //改变接收人
        changePeople(val){
            console.log(val,'val')
        },
        //获取放款信息详情
        async getDetailsInfo(){
            try{
                this.listLoading=true;
                let para={
                    id:36
                }
                const data=await loanInfoDetail(para);
                if(data.code==200){
                    this.form=data.data;
                    this.form.borrowerInfo.customerSex=this.switchSex(data.data.borrowerInfo.customerSex);
                    this.form.borrowerInfo.paymentSourceDesc = this.returnText('payment_source', this.form.borrowerInfo.paymentSource);
                    this.form.borrowerInfo.postDesc = this.returnText('OccupationalStatus', this.form.borrowerInfo.post);
                    this.form.loanInfo.loanTermDesc=this.returnText('period_number', this.form.loanInfo.loanTerm);
                    this.form.carInfos.forEach((item,index)=>{
                        item.carNatureDesc=this.returnText('car_nature', item.carNature);
                        item.carSpecificationsDesc=this.returnText('vehicle_specifications', item.carSpecifications);
                        item.customerSexDesc=this.returnText('CAR_SOURCE', item.customerSex);
                        item.carTypeDesc=this.returnText('car_type', item.carType);
                    })
                    this.getProjectInfo(data.data.borrowerInfo.projectId);
                    this.listLoading=false;
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
                    this.projectForm=data.data;
                    this.listLoading=false;
                }
            }catch(err){
                console.log(err)
                this.listLoading=false;
            }
        },
        //-------------------字典数据请求-------------------
        //获取还款来源
        async getDictionaryData () {
            try {
                let arr = [
                    "payment_source",//还款来源
                    "OccupationalStatus",//职务
                    "car_type",//车辆类别
                    "car_type2",//车辆类别2 
                    "car_nature",//车辆性质
                    "vehicle_specifications",//车辆规格
                    "CAR_SOURCE",//车辆来源
                    "period_number",//贷款期数
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
        //----------------更新放款结果---------------
        async updateInfo(){
            console.log('更新');
            try{  
                this.updateLoading=true;
                let para={}
                const data=await updateLoanInfo(para);
                if(data.code==200){
                    console.log(data.data,'dayta')
                    this.updateLoading=false;
                    this.stepIndex++;
                }
            }catch(err){
                console.log(err)
                this.updateLoading=false;
                this.stepIndex++;
            }
            
        },
        //-----------提交流程--------------------
        submit(){
            //获取流程处理人
            let para={
                name:'BankInside'
            }
            this.submitLoading=true;
            getPeople(para).then((data)=>{
                if(data.code==200){
                    let arr=[];
                    data.data.forEach((item,index)=>{
                        let obj={}
                        obj.label=item.companyName+'-'+item.name;
                        obj.id=item.id;
                        arr.push(obj);
                    })
                    this.processHandlerList=arr;
                    this.showPopupType('submit');
                    this.submitLoading=false;
                }
            }).catch((err)=>{
                console.log(err)
                this.submitLoading=false;
            })
        },
        //提交流程
        submitProcess(){
            console.log(this.form,this.projectForm,'2222222222222')
            console.log(1111111,'1111111')

        },
    },
    created(){
        this.$nextTick(()=>{
            document.addEventListener('click',(e)=>{
                if(this.rightBoxShow==true&&!this.$refs.box.contains(e.target)){
                    this.rightBoxShow=false
                }
            })
        })
    },
    mounted () {
        this.getDictionaryData();
    }
  }
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
    align-items: baseline;
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
.rightButtonBox{
    position: fixed;
    top: 52px;
    right: 10px;
    width:160px;
    padding: 10px;
    background-color:#fff;
    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, .2);
    z-index: 999;
    border-radius: 10px;
}
.sanjiao{
    position:absolute;
    top:-18px;
    right:12px;
    width:0; 
    height:0;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
    border-color:transparent;
    border-bottom-color: #fff;
    border-style:solid;
    border-width:10px;

}
.rightClass{
    color: #323233;
}
#lendProcess .van-cell__right-icon{
    color: #323233;
}
</style>
