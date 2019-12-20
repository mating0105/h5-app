<template>
    <ViewPage :rightMenuList='rightBoxList' :goPage='goPage' :iconClass="iconClass" :backFn='backFn' :loading="listLoading" id="lendProcess">
        <van-tabs v-model="activeName" v-if="projectForm.projectInfo">
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
                            <van-field label="主借人姓名：" placeholder="请输入" :border="false" label-width='150' input-align="right" required v-model="form.borrowerInfo.mainBorrowerName" @blur.prevent="ruleMessge"/>
                            <van-field label="主借人身份证：" placeholder="请输入" :border="false" label-width='150' input-align="right" required v-model="form.borrowerInfo.mainBorrowerId" @blur.click="getIdcard" @blur.prevent="ruleMessge" />
                            <van-field label="主借人电话：" placeholder="请输入" :border="false" label-width='150' input-align="right" required v-model="form.borrowerInfo.mainBorrowerPhone" @blur.prevent="ruleMessge"/>
                            <van-cell title="主借人性别：" :border="false" value-class='rightClass' is-link v-model="form.borrowerInfo.customerSexDesc"
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
                            @click="showPopupType('car_type',index)" value-class='rightClass' @blur.prevent="ruleMessge"/>
                            <van-cell title="车辆性质：" :border="false" is-link value-class='rightClass' required :value="item.carNatureDesc"
                            @click="showPopupType('car_nature',index)" @blur.prevent="ruleMessge"/>
                            <van-cell title="车辆规格：" :border="false" is-link value-class='rightClass' required :value="item.carSpecificationsDesc"
                            @click="showPopupType('vehicle_specifications',index)" @blur.prevent="ruleMessge"/>
                            <van-cell title="车辆来源" :border="false" is-link value-class='rightClass' required :value="item.carSourceDesc"
                            @click="showPopupType('CAR_SOURCE',index)" @blur.prevent="ruleMessge"/>
                            <van-cell title="品牌型号：" :border="false" is-link value-class='rightClass' required :value="item.brandModel" @click="selectBrand(index)" @blur.prevent="ruleMessge"/>
                            <van-field label="实际开票价（元）：" placeholder="请输入" :border="false" label-width='150' input-align="right" required v-model="item.actualInvoicedPrice" @blur.prevent="ruleMessge"/>
                            <van-field label="送行车价（元）：" placeholder="请输入" :border="false" label-width='150' input-align="right" required v-model="item.seeingCarPrice" @blur.prevent="ruleMessge"/>
                        </div>
                    </Card>
                    <Card>
                        <template v-slot:header>
                            贷款信息
                        </template>
                        <div>
                            <van-field label="贷款金额（元）：" placeholder="请输入" label-width='150' input-align="right" :border="false" required v-model="form.loanInfo.loanAmt" @blur.prevent="ruleMessge"/>
                            <van-field label="刷卡金额（元）：" placeholder="请输入" label-width='150' input-align="right" :border="false" required v-model="form.loanInfo.factCharges" @blur.prevent="ruleMessge"/>
                            <van-field label="评估金额（元）：" placeholder="请输入" label-width='150' input-align="right" :border="false" required v-model="form.loanInfo.assessmentPrice" @blur.prevent="ruleMessge"/>
                            <van-cell title="贷款产品：" :border="false" required @blur.prevent="ruleMessge" v-model="form.loanInfo.loanProductName" />
                            <van-cell title="贷款银行：" :border="false" required @blur.prevent="ruleMessge" :value="form.loanInfo.payPlatformName" />
                            <van-field label="贷款年限：" label-width='150' placeholder="请输入" input-align="right" :border="false" required :value="form.loanInfo.loanYear" @blur.prevent="ruleMessge"/>
                            <van-cell title="贷款期数：" value-class='rightClass' :border="false" required is-link :value="form.loanInfo.loanTermDesc"
                            @click="showPopupType('period_number')" @blur.prevent="ruleMessge"/>
                            <van-field label="贷款成数：" label-width='150' placeholder="请输入" input-align="right" :border="false" required v-model="form.loanInfo.loanProportion" @blur.prevent="ruleMessge"/>
                            <van-field label="客户利率：" label-width='150' placeholder="请输入" input-align="right" :border="false" required v-model="form.loanInfo.loanRate" @blur.prevent="ruleMessge"/>
                            <van-field label="浮息利率：" label-width='150' placeholder="请输入" input-align="right" :border="false" v-model="form.loanInfo.floatRate" />
                            <van-field label="公司收费利率：" label-width='150' placeholder="请输入" input-align="right" :border="false" required v-model="form.loanInfo.companyChargeRate" @blur.prevent="ruleMessge"/>
                            <van-field label="保费金额（元）：" placeholder="请输入" label-width='150' input-align="right" :border="false" v-model="form.loanInfo.premiumPrice" />
                            <van-field label="业务选融费用（元）：" placeholder="请输入" label-width='150' input-align="right" :border="false" required v-model="form.loanInfo.businessPrice" @blur.prevent="ruleMessge"/>
                            <van-field label="资料费（元）：" placeholder="请输入" label-width='150' input-align="right" :border="false" required v-model="form.loanInfo.informationPrice" @blur.prevent="ruleMessge"/>
                            <van-field label="车款金额合计（元）：" placeholder="请输入" label-width='150' input-align="right" :border="false" required v-model="form.loanInfo.carTotalPrice" @blur.prevent="ruleMessge"/>
                        </div>
                    </Card>
                    <Card style="margin-top:15px;">
                        <template v-slot:header>
                            收款人信息
                        </template>
                        <div>
                            <van-field label="收款人姓名：" placeholder="请输入" label-width='150' input-align="right" :border="false" required v-model="form.receiptInfo.receiptName" @blur.prevent="ruleMessge"/>
                            <van-field label="收款人账号：" placeholder="请输入"  label-width='150' input-align="right" :border="false" required v-model="form.receiptInfo.receiptAccount" @blur.prevent="ruleMessge"/>
                            <van-field label="收款人银行：" placeholder="请输入"  label-width='150' input-align="right" :border="false" required v-model="form.receiptInfo.receiptBank" @blur.prevent="ruleMessge"/>
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
                            <van-field required :border="false" v-model="commentsDesc" rows="2" autosize type="textarea" maxlength="200" placeholder="请输入留言" show-word-limit @blur.prevent="ruleMessge"/>
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
  import { Tab, Tabs, Row, Col, Cell, CellGroup,Popup,Picker,Button,Field,Checkbox,Notify} from 'vant';
  import {loanInfoDetail,getProjectInfo,updateLoanInfo,getPeople,submitProcess} from '@/api/makeLoan.js'

  const Components = [Tab, Tabs, Row, Col, Cell, CellGroup,Popup,Picker,Button,Field,Checkbox,Notify]

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
            iconClass:'ellipsis',
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
                { label: '男', value: '1' },
                { label: '女', value: '2' }
            ],
            columns: [],//选择项列表
            popupShow: false,
            title1:'',
            loading: false,
            payTypeShow: false,//走款模式判断显示，
            stepIndex:1,
            rightIcon:true,
            commentsDesc:'',//意见描述
            checked:false,//通知业务员补充资料 true:是  false：否
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
                {value:1,title:'项目基本信息'},
                {value:2,title:'客户及配偶'},
                {value:3,title:'紧急联系人'},
                {value:4,title:'房产信息'},
                {value:5,title:'家庭收入'},
                {value:6,title:'名下车辆'},
                {value:7,title:'担保人信息'},
                {value:8,title:'担保人房产'},
                {value:9,title:'担保人收入'},
                {value:10,title:'调查结论'},
                {value:11,title:'相关文档'},
                {value:12,title:'GPS安装信息'},
                {value:13,title:'合同照片'},
                {value:14,title:'申述意见'},
            ],
            businessKey:0,
        };
    },
    methods: {
        // ---------------------导航------------------------------
        //导航右上角的按钮
        goPage(val){
            console.log(val,'val')

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
            case 'car_type':
                this.title1='请选择车辆类型'
                this.columns = [
                    {
                        values: Object.values(this.dictionaryData.car_type),
                        className: 'column1'
                    },
                    {
                        values: this.dictionaryData.car_type2,
                        className: 'column2',
                        defaultIndex: 0
                    }
                ]
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
                    this.form.borrowerInfo.customerSexDesc=value.label;
                    this.form.borrowerInfo.customerSex=value.value;
                    break;
                case 'payment_source':
                    this.form.borrowerInfo.paymentSourceDesc=value.label;
                    this.form.borrowerInfo.paymentSource=value.value;
                    break;
                case 'OccupationalStatus':
                    this.form.borrowerInfo.postDesc=value.label;
                    this.form.borrowerInfo.post=value.value;
                    break;
                case 'car_type':
                    let desc=[]
                    value.forEach((item)=>{
                        desc.push(item.label);
                    })
                    this.form.carInfos[this.popupSign.value].carTypeDesc=desc.join('-');
                    this.form.carInfos[this.popupSign.value].carType=value[0].value;
                    this.form.carInfos[this.popupSign.value].carType2=value[1].value;
                    break;
                case 'car_nature':
                    this.form.carInfos[this.popupSign.value].carNatureDesc=value.label;
                    this.form.carInfos[this.popupSign.value].carNature = value.value;
                    break;
                case 'vehicle_specifications':
                    this.form.carInfos[this.popupSign.value].carSpecificationsDesc = value.label;
                    this.form.carInfos[this.popupSign.value].carSpecifications = value.value;
                    break;
                case 'CAR_SOURCE':
                    this.form.carInfos[this.popupSign.value].carSourceDesc = value.label;
                    this.form.carInfos[this.popupSign.value].carSource = value.value;
                    break;
                case 'period_number':
                    this.form.loanInfo.loanTermDesc = value.label;
                    this.form.loanInfo.loanTerm = value.value;
                    break;
                case 'submit':
                    this.submitProcess(value);
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
            switch(this.mapShowText){
                case 'registerProvCityZon':
                    this.form.borrowerInfo.registerProvCityZonCode=code;
                    break;
                case 'familyAddressProvCityZon':
                    this.form.borrowerInfo.familyAddProvCityZonCode=code;
                    break;
                case 'customerCoProvCityZon':
                    this.form.borrowerInfo.customerCoProvCityZonCode=code;
                    break;
            }
        },
        //通过身份证查性别和出生年月
        getIdcard(e) {
            let sex = getSex(e.target.value);
            let age = getAge(e.target.value);
            this.form.borrowerInfo.customerSex=sex;
            this.form.borrowerInfo.customerSexDesc=this.switchSex(sex);
            this.form.borrowerInfo.customerAge = age;
        },
        //转换性别
        switchSex(sex){
            let sexText='';
            this.customerSexList.forEach((item,index)=>{
                if(item.value==sex){
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
            this.form.carInfos[this.showBrandSign].carModelId=carBrand.model.id;
            this.form.carInfos[this.showBrandSign].brndNmId=carBrand.brand.id;
            this.form.carInfos[this.showBrandSign].carSeriesId=carBrand.series.id;
            this.form.carInfos[this.showBrandSign].carModel=carBrand.model.name;
            this.form.carInfos[this.showBrandSign].carBrand=carBrand.brand.name;
            this.form.carInfos[this.showBrandSign].carSeries=carBrand.series.name;
            this.form.carInfos[this.showBrandSign].brandModel =carBrand.brand.name+' '+carBrand.series.name;+' '+carBrand.model.name;
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
                    id:this.businessKey
                }
                const data=await loanInfoDetail(para);
                if(data.code==200){
                    this.form=data.data;
                    this.form.borrowerInfo.customerSexDesc=this.switchSex(data.data.borrowerInfo.customerSex);
                    this.form.borrowerInfo.paymentSourceDesc = this.returnText('payment_source', this.form.borrowerInfo.paymentSource);
                    this.form.borrowerInfo.postDesc = this.returnText('OccupationalStatus', this.form.borrowerInfo.post);
                    this.form.loanInfo.loanTermDesc=this.returnText('period_number', this.form.loanInfo.loanTerm);
                    this.form.carInfos.forEach((item,index)=>{
                        item.carNatureDesc=this.returnText('car_nature', item.carNature);
                        item.carSpecificationsDesc=this.returnText('vehicle_specifications', Number(item.carSpecifications));
                        item.carSourceDesc=this.returnText('CAR_SOURCE', item.carSource);
                        item.carTypeDesc=this.returnText('car_type', item.carType)+'-'+this.returnText('car_type2', item.carType2);
                        item.brandModel =item.carBrand+' '+item.carSeries+' '+item.carModel;
                    })
                    this.getProjectInfo(data.data.borrowerInfo.projectId);
                    // this.listLoading=false;
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
        //获取字典数据
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
            try{  
                this.updateLoading=true;
                let para=Object.assign({},this.form);
                const data=await updateLoanInfo(para);
                if(data.code==200){
                    this.updateLoading=false;
                    Notify({ type: 'success', message: '保存成功' });
                    this.stepIndex++;
                }
            }catch(err){
                console.log(err)
                this.updateLoading=false;
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
        async submitProcess(nextUserObj){
            try{  
                let para=Object.assign({},this.form);
                let params={
                    businessKey:this.businessKey,//Number(this.form.borrowerInfo.bankMakeLoanId),
                    nextUser:nextUserObj.id,
                    commentsDesc:this.commentsDesc,
                    isSendMsg:this.checked?1:0,
                    receiver:this.projectForm.projectInfo.clientManager.id,
                    msgType:'WF_BANK_MAKE_LOAN_YWY',
                    customerNum:this.projectForm.projectInfo.customerNum,
                    customerName:this.projectForm.projectInfo.customerName,
                }
                para.wfCommentInfo=params;
                this.listLoading=true;
                const data=await submitProcess(para);
                if(data.code==200&&data.status){
                    Notify({ type: 'success', message: '流程提交成功' });
                    setTimeout(()=>{
                        this.$router.push({ path:'/lendProcessList'});
                    },1000)
                    this.listLoading=false;
                }
            }catch(err){
                console.log(err)
                this.listLoading=false;
            }
        },
        //规则验证
        ruleMessge(e) {
            let name = e.target.name;
            let val = e.target.value;
            // this.errorMsg[name] = this.returnMsg(name, val);
        },
    },
    created(){
    },
    mounted () {
        this.businessKey=this.$route.query.id
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
#lendProcess .van-cell__right-icon{
    color: #323233;
}
</style>
