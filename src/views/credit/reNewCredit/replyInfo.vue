<!--
 * @Description: 银行征信回复
 * @Author: mating
 * @Date: 2020-03-17
 * @upData: 2020-05-19
 -->
<template>
  <div :loading="loading">
    <NewCard 
      v-if="dataList"
      :label='cardLabel'
      :showSign="sign?true:false" 
      :showTime="true" 
      :sign='sign'
      :signColor='signColor'
      :time="time"
      :isShowTitle="isShowTitle"
    >
      <div class="loadText">
        <!-- 人工 -->
        <div v-if="isPeople">请及时回复征信结果，上传征信报告</div>
        <!-- E分期 -->
        <div v-else>E分期综合征信结果为通过，暂无法获知单人征信结果</div>
      </div>
      <div>
        <div class="subtitle">主借人信息</div>
        <van-cell title="客户姓名" :border="false" :value="form.creditPersonName"/>
        <van-cell title="证件号码" :border="false" :value="form.cpCertificateNum"/>
        <van-cell title="手机号码" :border="false" :value="form.telephone"/>
        <van-cell title="银行卡号" :border="false" :value="form.bankCardNum"/>
        <van-cell title="征信查询方式" :border="false" :value='dataList.creditSearchTypeDesc'/>
        <van-cell title="征信签约方式" :border="false" :value="signModeDesc" />
        <!-- E分期 -->
        <div v-if="!isPeople">
          <van-cell title="意向车辆性质" :border="false" :value="returnText(dataList.intentionCarType,'E_CAR_TYPE')"/>
          <van-cell title="意向车辆价格" :border="false" :value="dataList.intentionPrice+' 元'"/>
          <van-cell title="身份证签发机关" :border="false" :value="form.issueAuthority" />
          <van-cell title="身份证有效期:" :border="false" :value="form.startDate+' ~ '+form.endDate"/>
          <van-cell title="身份证住址" :border="false" :value="form.familyAddress"/>
          <!-- 征信授权电子签 -->
          <van-cell 
            title="征信授权电子签" 
            :border="false" 
            right-icon="scan" 
            is-link 
            @click="electronicFn(form.electronicSignResult)"
            :value="form.electronicSignResult ? form.electronicSignResult: '待签约'" 
            :value-class="form.electronicSignResult ?'signModeClassGreen':'signModeClassRed'"
          />
        </div>
        <!-- 人工-->
        <div v-if="isPeople">
          <van-cell title="意向贷款价格" :border="false" :value="dataList.intentionPrice+' 元'"/>
          <van-cell title="银行" :border="false" :value="returnBankName(dataList.investigateBank)"/>
          <van-cell title="征信结果" :border="false" required
          >
            <radio v-model="form.creditResult" @change="changeCreditResult(form.creditResult,dataList.creditResult,-1)">
              <radio-item
                  :label="item.value"
                  v-for="(item,index) in isQueryList"
                  :key="index"
              >{{item.label}}</radio-item>
            </radio>
          </van-cell>
          <van-cell 
            title="征信结果时间" 
            :border="false" 
            required
            is-link
            v-model="form.investigateDate"
            @click="showPopupTime('borrower')"
            />
        </div>
        <!-- 相关文档--图片 -->
        <van-cell title="相关文档" :border="false"/>
        <imageList :dataList="mainImg" :view="true"></imageList>
        <!-- 征信报告--图片 -->
        <van-cell title="征信报告" required :border="false"/>
        <imageList :dataList="mainCreditImg"></imageList>
      </div>
      <!-- 关联人信息 -->
      <div v-if='perInfoList.length > 0'>
        <van-swipe-cell :disabled="dataList.standardCreditStatus?true:false" v-for="(item, index) in perInfoList" :key="index">
            <div class="subtitle">{{returnText(item.creditObjectType, 'credit_object_type')}}信息</div>
            <van-cell title="姓名" :border="false" :value="item.creditPersonName"/>
            <van-cell title="证件号码" :border="false" :value="item.cpCertificateNum"/>
            <van-cell title="手机号码" :border="false" :value="item.telephone"/>
            <van-cell title="银行卡号" :border="false" :value="item.bankCardNum"/>
            <van-cell 
              title="征信对象关系" 
              :border="false" 
              :value="returnText(item.creditObjectRelation, 'CREDIT_OBJECT_RELATION')"/>
            <van-cell
              title="是否查询征信"
              :border="false"
              :value="item.isPeopleBankCredit?(item.isPeopleBankCredit == '1'?'是':'否'):''"
            />
            <!-- E分期 -->
            <div v-if="!isPeople">
              <van-cell title="身份证签发机关" :border="false" :value="item.issueAuthority" />
              <van-cell title="身份证有效期:" :border="false" :value="item.startDate+' ~ '+form.endDate"/>
              <van-cell title="身份证住址" :border="false" :value="item.familyAddress"/>
              <!-- 征信授权电子签 -->
              <van-cell 
                title="征信授权电子签" 
                :border="false" 
                right-icon="scan" 
                is-link 
                @click="electronicFn(item.electronicSignResult)"
                :value="item.electronicSignResult ? item.electronicSignResult: '待签约'" 
                :value-class="item.electronicSignResult ?'signModeClassGreen':'signModeClassRed'"
              />
            </div>
            <!-- 人工-->
            <div v-if="isPeople">
              <van-cell label-class="labelClass" :label="errorMsg.carNature" title="征信结果" :border="false" required
              >
                  <radio @change="changeCreditResult(item.creditResult,item.id,index)" v-model="item.creditResult" >
                    <radio-item
                        :label="item.value"
                        v-for="(item,i) in isQueryList"
                        :key="i"
                    >{{item.label}}</radio-item>
                  </radio>
              </van-cell>
              <van-cell 
                label-class="labelClass" 
                :label="errorMsg.investigateDate" 
                title="征信结果时间" 
                :border="false" 
                required
                is-link
                v-model="item.investigateDate"
                @click="showPopupTime('')"
              >
              </van-cell>
            </div>
            <!-- 相关文档--图片 -->
            <van-cell title="相关文档" :border="false"/>
            <imageList :dataList="item.dataList" :view="true"></imageList>
            <!-- 征信报告--图片 -->
            <van-cell title="征信报告" required :border="false"/>
            <imageList :dataList="item.creditList"></imageList>
        </van-swipe-cell>
      </div>
      <!-- 备注说明 -->
      <div>
        <div>
          <div class="subtitle">备注说明</div>
          <van-field
              v-model="remarks"
              :border="false"
              type="textarea"
              placeholder="请输入"
              rows="1"
              :autosize="autosize"
              class="zh-textarea"
          />
        </div>
      </div>
        <div style="margin-top:45px;" name='footer'>
          <div class="xh-submit-box" style="margin-top:15px;">
            <van-button
                v-if="isPeople"
                size="large"
                style="width: 16%; flex: none"
                class="xh-btn xh-primary"
                @click="back"
            >退回</van-button>
            <van-button
                v-if="isPeople"
                size="large"
                style="width: 40%; flex: none"
                class="xh-btn"
                @click="showResult"
            >提前告知征信结果</van-button>
            <van-button
                size="large"
                @click="submit"
                class="xh-btn"
            >提交</van-button>
          </div>
        </div>
    </NewCard>

    <!-- 弹框 -->
    <dialogBox
      :title="dialogObj.title"
      :showDialog="showDialog"
      :onConfirm="confirmFn"
      :onCancel="cancelFn"
    >
      <template>
        <div v-if="dialogObj.state=='submit'" style="text-align:center;padding:10px 0;">提交后不可再次修改</div>
        <div v-if="dialogObj.state=='change'" style="display:flex;justify-content:space-around;padding:10px 0;">
          <div>变更前：{{dialogObj.oldVal}}</div>
          <div>变更后：{{dialogObj.newVal}}</div>
        </div>
      </template>
    </dialogBox>

    <!-- 时间选择器 -->
    <van-popup position="bottom" :overlay="true" v-model="popupShow">
      <van-datetime-picker
        title="征信结果时间"
        type="datetime"
        :max-date="maxDate"
        v-model="currentDate"
        @confirm="confirmTime"
        @cancel="popupShow = false"
      />
    </van-popup>

  </div>
</template>

<script>
import ViewPage from "@/layout/components/ViewPage";
import NewCard from "@/components/card/newCard";
import radio from "@/components/radio";
import radioItem from "@/components/radio/radioItem";
import dialogBox from '@/components/dialogBox/index'
import imageList from "@/components/imageList";
import Vue from "vue";
import { format } from "@/utils/format";
import { getDocumentByType } from "@/api/document";

import {
  getByServer,
  returnTask,

  getBank,
  saveCreditInfo,
  orderStatusQuery
} from "@/api/credit";
import { bankReply,informInAdvanceResult } from '@/api/bigData'
import { getValue, setValue, removeValue } from "@/utils/session";
import {
  Cell,
  CellGroup,
  Field,
  Icon,
  Button,
  Picker,
  Popup,
  Toast,
  Notify,
  SwipeCell,
  Dialog,
  ActionSheet,
  DatetimePicker 
} from "vant";
import formValidator from "@/mixins/formValidator";
import Bus from "@/utils/bus";

const Components = [
  Cell,
  CellGroup,
  Field,
  Icon,
  Button,
  Picker,
  Popup,
  Toast,
  Notify,
  SwipeCell,
  Dialog,
  ActionSheet,
  DatetimePicker 
];
Components.forEach(item => {
  Vue.use(item);
});

export default {
  name: "reNewCredit",
  mixins: [formValidator],
  components: {
    ViewPage,
    NewCard,
    radio,
    radioItem,
    imageList,
    dialogBox
  },
  props: {
    dataList: Object,
    form: Object,
    query: Object,
    perInfoList: Array, //客户下面的其他客户数据
    edit: Boolean,
    hiddenHandle: {
      default: false,
      type: Boolean
    },
    isShowTitle: Boolean,
    isPeople:Boolean,//是否是人工
  },
  data() {
    return {
        // --------header------------
        cardLabel:this.isPeople?'银行征信查询信息':'银行征信查询信息 ( E分期 ) ',//标题

        sign:'查询中',//标签标记内容  （查询中、被退回）
        time:'',
        signColor:'red',//标签标记颜色
        signModeList:[],
        isQueryList:[
          {value:'not_pass',label:'拒绝'},
          {value:'pass',label:'通过'},
        ],
        mainImg: [], //主借人相关文档
        mainCreditImg: [], //主借人征信报告
        obj: {
          borrower: ["CUIDA01", "CUIDB01", "CUCARD01","CRDPBOCA01"], //主借人
          borrowerSpouse: ["CUIDA02", "CUIDB02", "CUCARD02", "CRDPBOCA02"], //借款人配偶
          joiDebtor: ["CUIDA03", "CUIDB03", "CUCARD03", "CRDPBOCA03"], //共债人
          joiDebtorSpouse: ["CUIDA04", "CUIDB04", "CUCARD04", "CRDPBOCA04"], //共债人配偶
          security: ["CUIDB05", "CUIDA05", "CUCARD05", "CRDPBOCA05"], //担保人
        },
        creditReport:{
          borrower: ["CRDPBOCB01"], //主借人
          borrowerSpouse: ["CRDPBOCB02"], //主借人配偶
          joiDebtor: ["CRDPBOCB03"], //共债人
          joiDebtorSpouse: ["CRDPBOCB04"], //共债人配偶
          security: ["CRDPBOCB05"], //担保人
        },
        whiteList: ["CRDPBOCB01", "CRDPBOCB02", "CRDPBOCB03", "CRDPBOCB04", "CRDPBOCB05"],
        remarks:'',//备注说明：退回时必填

        maxDate: new Date(),
        currentDate: new Date(),//当前时间
        popupShow: false, //时间选择器
        popTimeType: "", //时间类型

        signModeDesc:'',//征信签约方式
        isElectronic:null,//征信查询模式  true--电子签 false--影像签

        imageListData:[],//相关文档
        showDialog:false,
        dialogObj:{
          title:'',//弹框标题
          newVal:'',
          oldVal:'',
          state:'submit',//submit----提交  change---变更征信结果
        },
        loading: false,
        autosize: {
          maxHeight: 100,
          minHeight: 20
        },
      canTermin: false,

        bankArr: [], //银行数组
        bankList: {},
        errorMsg: {
          creditResult: "",
          investigateDate: ""
        },
    };
  },
  computed: {
    // 所有字典
    wordbook() {
      return this.$store.state.user.wordbook;
    },
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
  methods: {
    async getDocumentByType(documentType, obj) {
      try {
        const params = {
          customerNum: this.dataList.perInfo.customerNum,
          documentType: documentType
        };
        const declare = this.documentType[documentType]
          ? this.documentType[documentType].label
          : "图片描述";
        const isRequire = this.whiteList.includes(documentType);
        const imgdata = {
          declare: declare, //图片描述
          isRequire: isRequire, //*是否必须
          deletable: isRequire, //是否可以操作-上传和删除
          documentType: documentType,
          customerNum: this.dataList.perInfo.customerNum,
          customerId: this.dataList.perInfo.id,
          kind: "1",
          fileList: []
        };
        if (obj.creditObjectType == "borrower") {
          if (this.whiteList.includes(documentType)) {
            this.mainCreditImg.push(imgdata);
          } else {
            this.mainImg.push(imgdata);
          }
        } else {
          if (this.whiteList.includes(documentType)) {
            obj.creditList.push(imgdata);
          } else {
            obj.dataList.push(imgdata);
          }
        }
        const { data } = await getDocumentByType(params);
        data.forEach(item => {
          item.declare = declare;
        });
        imgdata.fileList = data;
      } catch (e) {}
    },
    async getQueryType(serverName,signMode){
      try{
        let para={
          serverName:serverName
        }
        const {data,code}=await getByServer(para);
        if(code==200){
          this.signModeList=data;
          this.signModeDesc=this.returnSignMode(signMode);
          if(this.signModeDesc=='电子签'){
            this.isElectronic=true;
            this.obj = {//电子签
              borrower: ["CUIDA01", "CUIDB01", "CUCARD01"], //主借人
              borrowerSpouse: ["CUIDA02", "CUIDB02", "CUCARD02"], //借款人配偶
              joiDebtor: ["CUIDA03", "CUIDB03", "CUCARD03",], //共债人
              joiDebtorSpouse: ["CUIDA04", "CUIDB04", "CUCARD04"], //共债人配偶
              security: ["CUIDB05", "CUIDA05", "CUCARD05"], //担保人
            };
            this.creditReport={
              borrower: ["CRDPBOCB01"], //主借人
              borrowerSpouse: ["CRDPBOCB02"], //主借人配偶
              joiDebtor: ["CRDPBOCB03"], //共债人
              joiDebtorSpouse: ["CRDPBOCB04"], //共债人配偶
              security: ["CRDPBOCB05"], //担保人
            },
            this.dataList.surDtlList.forEach(e => {
              e.dataList = [];
              e.creditList = [];
              const arr = this.obj[e.creditObjectType];
              arr.forEach(item => {
                this.getDocumentByType(item, e); //相关文档
              });
              const arr2 = this.creditReport[e.creditObjectType];
              arr2.forEach(i => {
                this.getDocumentByType(i, e); //征信报告
              });
            });
          }else{//影像签
            this.isElectronic=false;
            this.obj = {
              borrower: ["CUIDA01", "CUIDB01", "CUCARD01","CRDPBOCA01"], //主借人
              borrowerSpouse: ["CUIDA02", "CUIDB02", "CUCARD02", "CRDPBOCA02"], //借款人配偶
              joiDebtor: ["CUIDA03", "CUIDB03", "CUCARD03", "CRDPBOCA03"], //共债人
              joiDebtorSpouse: ["CUIDA04", "CUIDB04", "CUCARD04", "CRDPBOCA04"], //共债人配偶
              security: ["CUIDB05", "CUIDA05", "CUCARD05", "CRDPBOCA05"], //担保人
            };
            this.creditReport={
              borrower: ["CRDPBOCB01"], //主借人
              borrowerSpouse: ["CRDPBOCB02"], //主借人配偶
              joiDebtor: ["CRDPBOCB03"], //共债人
              joiDebtorSpouse: ["CRDPBOCB04"], //共债人配偶
              security: ["CRDPBOCB05"], //担保人
            },
            this.dataList.surDtlList.forEach(e => {
              e.dataList = [];
              e.creditList = [];
              const arr = this.obj[e.creditObjectType];
              arr.forEach(item => {
                this.getDocumentByType(item, e);//相关文档
              });
              const arr2 = this.creditReport[e.creditObjectType];
              arr2.forEach(i => {
                this.getDocumentByType(i, e); //征信报告
              });
            });
          }
        }
      }catch(err){
        console.log(err)
      }
    },
    returnSignMode(signMode){
      let name=""
      this.signModeList.forEach((item,index)=>{
        if(signMode==item.buttonId){
          name=item.buttonName;
        }
      })
      return name;
    },
    //弹框-确认
    confirmFn(){
      this.showDialog = false;
      switch(this.dialogObj.state){
        case "change":
          // this.dataList.creditResult=this.form.creditResult;
          this.showSign();
          break;
        case 'submit':
          this.nextStep().then(async(query) => {
            try {
              this.loading = true
              const params = {
                wfBizComments: {
                  commentsDesc: this.remarks,
                  conclusionCode: "01",
                  businessKey: this.dataList.id
                },
                cuCreditRegister: this.dataList
              };
              const { data,code,msg } = await bankReply(params);
              if(code==200){
                this.loading = false;
                this.$nextTick(() => {
                  Toast.success(data.retMsg);
                  setTimeout(()=>{
                    this.$emit("viewRecord");
                  },1000)
                });
              }
            } catch (e) {
              this.loading = false;
              console.log(e)
            }
          });
          break;
      }
    },
    //弹框-取消
    cancelFn(value){
      this.showDialog=false;
      switch(this.dialogObj.state){
        case "change":
          this.form.creditResult=this.dataList.creditResult;
          break;
        case 'submit':
          break;
      }
    },
    returnCreResultName(value){
      let name='';
      this.isQueryList.forEach((item,index)=>{
        if(item.value==value){
          name=item.label
        }
      })
      return name;
    },
    changeCreditResult(newVal,oldVal,index) {
      if(index==-1){//主借人
        if(!oldVal) return;
        if(newVal!=oldVal){
          this.showDialog=true;
          this.dialogObj={
            title:'确认提交吗？',//弹框标题
            state:'change',
            newVal:this.returnCreResultName(newVal),
            oldVal:this.returnCreResultName(oldVal),
          }
        }
      }else{//关联人
        this.dataList.surDtlList.forEach((item,index)=>{
          if(item.id==oldVal){
            if(!item.creditResult) return;
            // if(newVal!=item.creditResult){
            //   this.showDialog=true;
            //   this.dialogObj={
            //     title:'确认提交吗？',//弹框标题
            //     state:'change',
            //     newVal:this.returnCreResultName(newVal),
            //     oldVal:this.returnCreResultName(oldVal),
            //   }
            // }
          }
        })
        this.showSign();
      }
    },
    // 字典转换
    returnText(val, key) {
      let name = "";
      if (this.wordbook[key]) {
        this.wordbook[key].forEach(e => {
          if (e.value === val) {
            name = e.label;
          }
        });
      }
      return name;
    },
    /**
     * 下一步
     **/
    async nextStep() {
      try {
        Toast.loading({
          message: "加载中...",
          forbidClick: true,
          loadingType: "spinner",
          overlay: true
        });
        this.dataList.surDtlList = [this.form, ...this.perInfoList];
        this.dataList.creditResult=this.form.creditResult;
        const { data } = await saveCreditInfo(this.dataList);

        const query = {
          customerId: data.customerId,
          customerNum: data.customerNum,
          creditRegisterId: data.creditRegisterId,
          ...this.query
        };
        if (this.canTermin) {
          query.canTermin = this.canTermin;
        }
        this.loading = false;
        Toast.clear();
        this.$nextTick(() => {
          Toast.success("保存成功");
        });
        return query;
      } catch (e) {
        this.loading = false;
        console.log(e);
        return Promise.reject(e)
      }
    },
    //退回
    async back() {
      if (!this.remarks) {
        Toast.fail("请在备注说明里填写退回原因");
        return;
      }
      this.loading = true;
      this.dataList.remarks = this.remarks;
      const params = {
          commentsDesc: '退回',
          conclusionCode: "02",
          businessKey: this.dataList.id,
          remarks:this.remarks
      };
      await returnTask(params);
      this.loading = false;
      this.$nextTick(() => {
        Toast.success("回退成功");
        setTimeout(() => {
          this.$router.push("/lendProcessList");
        }, 1000);
      });
    },
    //提前告知征信结果
    async showResult() {
      if (!this.verifyForm()) {
        return;
      }
      this.loading = true;
      const { code }=await informInAdvanceResult(this.dataList);
      this.loading = false;
      if(code==200){
        this.$nextTick(() => {
          Toast.success("告知成功");
          setTimeout(() => {
            this.$router.push("/lendProcessList");
          }, 1000);
        });
      }
    },
    //提交
    submit(){
      if(this.isPeople){
        if (!this.verifyForm() || !this.verifyFormReport()) {
          return;
        }
        this.showDialog=true;
        this.dialogObj={
          title:'确认提交吗？',//弹框标题
          state:'submit',
        }
      }else{
        if (!this.verifyFormReport()) {
          return;
        }
        this.showDialog=true;
        this.dialogObj={
          title:'确认提交吗？',//弹框标题
          state:'submit',
        }
      }
    },
    verifyForm() {
      let sign = true;
      if (!this.form.creditResult) {
        Toast.fail("请选择征信结果");
        sign = false;
        return;
      }
      this.perInfoList.forEach(e => {
        if (!e.creditResult && e.isPeopleBankCredit == '1') {
          Toast.fail("请选择征信结果");
          sign = false;
          return;
        }
      });
      return sign;
    },
    //验证征信报告
    verifyFormReport() {
      let sign = true;
      if (this.mainCreditImg[0].fileList.length<1) {
        Toast.fail("请上传主借人征信报告");
        sign = false;
        return;
      }
      for(let i = 0;i<this.perInfoList.length;i++){
         if(this.perInfoList[i].creditList[0].fileList.length<1 && this.perInfoList[i].isPeopleBankCredit == '1'){
            Toast.fail("请上传关联人征信报告");
            sign = false;
            break;
         }
       }
      return sign;
    },
    //点击授权电子签
    electronicFn(value){
      console.log(value,'value')
    },
    //获取银行列表
    async getBankList(){
      try{
        const data=await getBank();
        if(data.code==200){
          this.bankArr = data.data;
          this.bankArr.forEach((item, index) => {
            this.bankList[item.orgName] = item.children.map(e => {
              return e.dsbrPltfrmNm;
            });
          });
        }
      }catch(err){
          console.log(err)
      }
    },
    //返回银行名称
    returnBankName(id){
      for(var i=0;i<this.bankArr.length;i++){
        var item=this.bankArr[i];
        for(var j=0;j<item.children.length;j++){
          if(this.bankArr[i].children[j].id==id){
            return this.bankArr[i].orgName+'-'+this.bankArr[i].children[j].dsbrPltfrmNm;
          }
        }
      }
    },
    //显示时间弹框
    showPopupTime(type) {
      this.popTimeType = type;
      this.popupShow = true;
    },
    //时间选择-确定
    confirmTime(value){
      this.popupShow = false;
      if (this.popTimeType == "borrower") {
        this.form.investigateDate = format(value, "yyyyMMdd hh:mm");
      } else {
      }
    },
    //获取最新的征信结果---E分期
    async getCreditResult(){
      try{
          Toast.loading({
            message: "加载中...",
            forbidClick: true,
            loadingType: "spinner",
            overlay: true
          });
          let para={
            creditId: this.dataList.id,
          }
          const {data,code} =await orderStatusQuery(para)
          console.log(data,'data')
          Toast.clear();
          if(code==200){
            //重置标题的sign和signColor
          }
        }catch(err){
          console.log(err)
          Toast.clear();
        }
    },
    showSign(){
      console.log(5555555)
      let arr=[],arr1=[];
      arr.push(this.form.creditResult);
      this.perInfoList.forEach((item,index)=>{
        arr1.push(item.creditResult)
      })
      var newArr=arr.concat(arr1);
      if(newArr.indexOf('not_pass') > -1){
        this.sign='拒绝';
        this.signColor='red';
      }else{
        this.sign='通过'
        this.signColor='green';
      }
    }
  },
  mounted() {
    this.time = this.dataList.registerDate;
    //判断电子签、影像签
    this.getQueryType('electronic-visa-model',this.dataList.signMode);
    if(this.isPeople){
      this.getBankList();
      this.showSign();
    }else{
      //获取最新的征信结果
      // this.getCreditResult()
    }
  },
};
</script>

<style lang="scss">
.loadText{
    padding: 1rem 1rem;
    margin:1rem 1rem 0 1rem;
    display:flex;
    justify-content: space-between;
    font-size:1.4rem;
    align-items: center;
    color:red;
    border-radius: 6px;
    background-color: rgba(236,25,31,0.05);
    line-height: 26px;
}
.subtitle{
    padding: 1rem;
    font-size: 1.4rem;
    color:red;
    font-weight: Bold;
    margin-top: 0.8rem;
}

.xh-submit-box>button{
    margin:0 0.2rem;
}

.labelClass {
  left: 1.33333rem;
}

.xh-credit-picker {
  .column1 {
    flex: none;
    min-width: 25%;
  }

  .column2 {
    text-align: left;
  }
}
.dialogBox{
    .van-cell{
        border:1px solid;
        border-radius: 6px;
        .van-cell__label{
            border:none;
            border-top:1px solid;
            .van-cell{
                border:none;
            }
        }
    }
}
.signModeClassGreen{
    color: #00c67c;
}
.signModeClassRed{
    color: red;
}
</style>
