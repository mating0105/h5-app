<!--
 * @Description: 银行征信查询
 * @Author: mating
 * @Date: 2020-03-12
 * @UpDate: 2020-05-11
 -->
<template>
  <div :loading="loading">
    <NewCard 
      id="creditQueryBox"
      v-if="dataList"
      :label="cardLabel" 
      :showSign="dataList.standardCreditStatus?true:false" 
      :showTime="dataList.standardCreditStatus?true:false" 
      :sign="dataList.standardCreditStatus?returnText(dataList.standardCreditStatus,'standard_credit_status'):''"
      :signColor="returnColor(dataList.standardCreditStatus)"
      :time="dataList.registerDate"
      :isShowTitle='isShowTitle'
    >
      <!-- 刷新、提示 -->
      <div>
        <!-- 查询中 -->
        <div v-if="dataList.standardCreditStatus=='01'" class="loadText">
            <div>银行征信结果查询中，请耐心等待</div>
            <van-icon @click.stop='clickrefreshIcon(isPeople)' name="replay" size="1.8rem" color='#000'/>
        </div>
        <!-- 终止查询中 -->
        <!-- <div v-if="dataList.standardCreditStatus=='05'" class="loadText">
            <div>终止原因：{{dataList.remarks}}</div>
        </div> -->
        <!-- 退回 -->
        <div v-if="dataList.standardCreditStatus=='02'" class="loadText">
            <div>退回原因：{{dataList.remarks}}</div>
        </div>
      </div>
      <!-- 主借人信息 -->
      <div>
        <div class="subtitle">主借人信息</div>
        <van-cell title="客户姓名" required :border="false" :value="form.creditPersonName" />
        <van-cell title="证件号码" required :border="false" :value="form.cpCertificateNum" />
        <van-cell title="手机号码" required :border="false" :value="form.telephone" />
        <van-field 
          name="bankCardNum" 
          :disabled="!edit && dataList.standardCreditStatus || dataList.transType=='1'|| dataList.standardCreditStatus=='01'" 
          label="银行卡号" 
          :placeholder="!edit?'':'请输入'" 
          label-width="110" 
          input-align="right" 
          clearable 
          :border="false" 
          required 
          v-model="dataList.bankCardNum" 
          @blur.prevent="ruleMessge" 
          :error-message="errorMsg.bankCardNum" 
          :right-icon="!edit || dataList.standardCreditStatus=='01' ? '' : 'scan'" 
          @click-right-icon="IdcardLoading('bankCodeOCR')"
        />
        <van-cell 
          title="征信查询方式" 
          required 
          :border="false" 
          :value="creditSearchTypeDesc" 
          @change="changeSearchType"
        >
            <radio v-if="creditTypeList.length>1" v-model="creditSearchType">
                <radio-item
                    :label="item.buttonId"
                    v-for="(item,index) in creditTypeList"
                    :key="index"
                >{{item.buttonName}}</radio-item>
            </radio>
        </van-cell>
        <van-cell title="征信签约方式" required :border="false" :value="signModeDesc">
            <radio v-if="creditSignModeList.length>1" v-model="signMode" @change="changeSignMode">
                <radio-item
                    :label="item.buttonId"
                    v-for="(item,index) in creditSignModeList"
                    :key="index"
                >{{item.buttonName}}</radio-item>
            </radio>
        </van-cell>
        <!-- E分期 -->
        <div  v-if="!isPeople">
          <van-cell label-class="labelClass" :label="errorMsg.intentionCarType" title="意向车辆性质" :border="false" required
          >
              <radio v-if="dataList.transType!=='1'" v-model="dataList.intentionCarType">
                <radio-item
                    :label="item.value"
                    v-for="item in this.wordbook['E_CAR_TYPE']"
                    :key="item.value"
                >
                  {{item.label}}
                </radio-item>
              </radio>
              <div v-else>{{returnText(dataList.intentionCarType,'E_CAR_TYPE')}}</div>
          </van-cell>
          <van-field 
            class="label_plus" 
            name="intentionPrice" 
            @blur.prevent="ruleMessge" 
            :error-message="errorMsg.intentionPrice" 
            :disabled="!edit || dataList.transType=='1'" 
            :border="false" 
            v-model="dataList.intentionPrice" 
            type="tel" 
            required 
            clearable 
            input-align="right" 
            label="意向车辆价格" 
            placeholder="请输入"
          >
              <div slot="button">元</div>
          </van-field>
          <van-cell 
            title="身份证签发机关" 
            required 
            :border="false" 
            :value="form.issueAuthority" />
          <van-cell title="身份证有效期" required :border="false" >
            <div slot="default">
              <span>{{ form.startDate?form.startDate:'' }}</span>
              <span v-if="form.startDate&&form.endDate"> ~ </span>
              <span>{{ form.endDate?form.endDate:'' }}</span>
            </div>
          </van-cell>
          <van-cell title="身份证住址" required :border="false" :value="form.familyAddress" />
          <!-- 征信授权电子签 -->
          <van-cell 
              title="征信授权电子签" 
              required 
              label-class="labelClassNew"
              :disabled="!edit && dataList.standardCreditStatus"
              :border="false" 
              :value="form.electronicSignResult ? form.electronicSignResult: '待签约'"
              :value-class="form.electronicSignResult ?'signModeClassGreen':'signModeClassRed'"
              :right-icon="!edit ? '' : 'scan'" 
              is-link
              v-if="isElectronic && dataList.transType=='1'"
              @click="electronicFn(form.electronicSignResult)"
              />
        </div>

        <!-- 人工 -->
        <div v-if="isPeople">
          <van-field class="label_plus" name="intentionPrice" @blur.prevent="ruleMessge" :error-message="errorMsg.intentionPrice" :disabled="!edit ||dataList.standardCreditStatus=='01'" :border="false" v-model="dataList.intentionPrice" type="tel" required clearable input-align="right" label="意向贷款价格" placeholder="请输入"
          >
              <div slot="button">元</div>
          </van-field>
          <van-cell
              title="银行"
              label-class="labelClass"
              :label="errorMsg.investigateBankName"
              :value-class="dataList.standardCreditStatus=='01'?'rightClassDis':'rightClass'"
              :border="false"
              required
              :is-link="edit && dataList.standardCreditStatus!=='01'"
              @blur.prevent="ruleMessge"
              :value="returnBankName(dataList.investigateBank)"
              @click="showPickerFn('bankName')"
          />
          <!-- 征信授权电子签 -->
          <van-cell 
              title="征信授权电子签" 
              required 
              label-class="labelClassNew"
              :disabled="!edit && dataList.standardCreditStatus"
              :border="false" 
              :value="form.electronicSignResult ? form.electronicSignResult: '待签约'"
              :value-class="form.electronicSignResult ?'signModeClassGreen':'signModeClassRed'"
              :right-icon="!edit ? '' : 'scan'" 
              is-link
              v-if="isElectronic"
              @click="electronicFn(form.electronicSignResult)"
              />
        </div>
        
        <!-- 相关文档--图片 -->
        <van-cell title="相关文档" :border="false" :required="isPeople"/>
        <imageList :dataList="mainImg" :view="dataList.standardCreditStatus=='01'?true:false"></imageList>
      </div>
      <!-- 关联人信息 -->
      <div v-if='perInfoList.length > 0'>
        <van-swipe-cell :disabled="!edit && dataList.standardCreditStatus" v-for="(item, index) in perInfoList" :key="index">
            <div class="subtitle">{{returnText(item.creditObjectType, 'credit_object_type')}}信息</div>
            <van-field
              :disabled="isPeople"
              label="姓名"
              label-width="110"
              input-align="right"
              clearable
              :border="false"
              required
              :value="item.creditPersonName"
            />
            <van-field
              :disabled="isPeople"
              label="证件号码"
              label-width="110"
              input-align="right"
              clearable
              :border="false"
              required
              :value="item.cpCertificateNum"
            />
            <van-field
              :disabled="isPeople"
              label="手机号码"
              label-width="110"
              input-align="right"
              clearable
              :border="false"
              required
              :value="item.telephone"
            />
            <van-field
              :disabled="isPeople"
              label="银行卡号"
              label-width="110"
              input-align="right"
              clearable
              :border="false"
              required
              :value="item.bankCardNum"
            />
            <van-cell 
              title="征信对象关系" 
              required 
              :border="false" 
              :value="returnText(item.creditObjectRelation, 'CREDIT_OBJECT_RELATION')"/>
            <van-cell
              title="是否查询征信"
              :border="false"
              required
              :value="item.isPeopleBankCredit=='1'?'是':'否'"
            >
            </van-cell>
            <div v-if="!isPeople">
              <van-cell title="身份证签发机关" required :border="false" :value="item.issueAuthority" />
              <van-cell title="身份证有效期" required :border="false" :value="item.endDate" />
              <van-cell title="身份证住址" required :border="false" :value="item.familyAddress" />
            </div>
            
            <!-- 征信授权电子签 -->
            <van-cell 
                title="征信授权电子签" 
                required 
                label-class="labelClass"
                :disabled="!edit && dataList.standardCreditStatus"
                :border="false" 
                :value="item.electronicSignResult ? item.electronicSignResult: '待签约'"
                :right-icon="!edit ? '' : 'scan'" 
                is-link
                v-if="isElectronic"
                @click="electronicFn(item.electronicSignResult)"
                :value-class="form.electronicSignResult ?'signModeClassGreen':'signModeClassRed'"
                />
            <!-- 相关文档--图片 -->
            <van-cell title="相关文档" :border="false" :required="isPeople" />
            <imageList v-if="item.imgInfo && item.imgInfo.length>0" :dataList="item.imgInfo"  :view="dataList.standardCreditStatus=='01'?true:false"></imageList>

            <div slot="right" style="height: 100%">
                <van-button
                type="warning"
                style="height:100%;border-radius: 0;"
                @click="editPer(item, index)"
                >修改</van-button>
                <van-button
                type="danger"
                style="height:100%;border-radius: 0;"
                @click="removePer(index, item)"
                >删除</van-button>
            </div>
        </van-swipe-cell>
      </div>
      <!-- E分期 新增关联人-->
      <div v-if="!isPeople">
        <div class="subtitle" style="display:flex;align-items:center;" v-if="dataList.transType!=='1'&& dataList.standardCreditStatus!=='01'">
          <div>新增关联人信息</div>
          <van-icon style="margin-left:1rem;" name="add-o" size="1.8rem" @click="addPer" color="#000"/>
        </div>
      </div>
      <!-- 人工 -->
      <div v-if="isPeople">
        <div class="subtitle" style="display:flex;align-items:center;" v-if="!dataList.standardCreditStatus || dataList.standardCreditStatus=='02'">
          <div>新增关联人信息</div>
          <van-icon style="margin-left:1rem;" name="add-o" size="1.8rem" @click="addPer" color="#000"/>
        </div>
      </div>
      <!-- 备注说明 -->
      <div v-if="!isPeople">
        <!-- E分期 -->
        <div v-if="dataList.transType=='1' && !dataList.standardCreditStatus">
          <div class="subtitle">备注说明</div>
          <van-field
              v-model="dataList.remarks"
              :border="false"
              :disabled="!edit && dataList.standardCreditStatus"
              type="textarea"
              placeholder="请输入"
              rows="1"
              :autosize="autosize"
              class="zh-textarea"
          />
        </div>
      </div>
      <!-- 人工 备注说明-->
      <div v-if="isPeople">
        <div v-if="!dataList.standardCreditStatus || dataList.standardCreditStatus=='02'">
          <div class="subtitle">备注说明</div>
          <van-field
              v-model="dataList.remarks"
              :border="false"
              :disabled="!edit && dataList.standardCreditStatus"
              type="textarea"
              placeholder="请输入"
              rows="1"
              :autosize="autosize"
              class="zh-textarea"
          />
        </div>
      </div>
      <div style="margin-top:45px;" name='footer'>
        <div>
            <!-- 人工 -->
            <div class="xh-submit-box" v-if="isPeople">
                <van-button
                    v-if="dataList.standardCreditStatus=='01'"
                    size="large"
                    style="flex: none"
                    class="xh-btn xh-primary"
                    @click="stopTask('isPeople')"
                >终止查询</van-button>
                <van-button
                    v-if="dataList.standardCreditStatus=='02'"
                    size="large"
                    style="width: 25%; flex: none;margin-right:10px;"
                    class="xh-btn xh-primary"
                    @click="stopTask('isPeople')"
                >终止查询</van-button>
                <van-button
                    v-if="dataList.standardCreditStatus!=='01'&& dataList.standardCreditStatus!=='05'"
                    size="large"
                    @click="submitCreditFn"
                    class="xh-btn"
                    :loading='submitloading'
                    :disabled="dataList.bankCardNum==''||dataList.bankCardNum==undefined || dataList.intentionPrice=='' || dataList.intentionPrice==undefined || !dataList.investigateBank|| dataList.investigateBank==''"
                >提交征信查询</van-button>
            </div>
            <!-- E分期 -->
            <div class="xh-submit-box" v-if="!isPeople && edit && !hiddenHandle" style="margin-top:15px;">
                <div style="width:100%;" v-if="dataList.standardCreditStatus=='02'">
                  <van-button
                    size="large"
                    style="width:25%; flex: none"
                    class="xh-btn xh-primary"
                    @click="stopTask('isEfenqi')"
                  >终止查询</van-button>
                </div>
                <div style="width:100%;" v-else-if="dataList.standardCreditStatus=='01'">
                  <van-button
                    size="large"
                    style="width:100%;flex: none"
                    class="xh-btn xh-primary"
                    @click="stopTask('isEfenqi')"
                  >终止查询</van-button>
                </div>
                <!-- :disabled="!form.electronicSignResult||veriryEle(perInfoList)" -->
                <van-button
                  v-if="!dataList.standardCreditStatus && dataList.transType=='1'"
                  size="large"
                  style="flex: none"
                  class="xh-btn"
                  @click="submitCreditFn"
                >提交征信查询</van-button>
                <van-button
                  v-if="dataList.transType!=='1'"
                  size="large"
                  :disabled="dataList.bankCardNum==''||dataList.bankCardNum==undefined || dataList.intentionPrice=='' || dataList.intentionPrice==undefined || !dataList.intentionCarType"
                  @click="pushToEfenqi"
                  class="xh-btn"
                  :loading='E_loading'
                >推送至E分期</van-button>
            </div>
        </div>
        <div v-if="isElectronic && !dataList.standardCreditStatus && dataList.transType=='1'" style="font-size:10px;text-align:center;padding:0 1.2rem;letter-spacing: 1.2px;margin-bottom:20px;">
            <span>若以上信息有误,</span>
            <van-button type="text" size="mini" class="modifyText" @click="modifyInfo">点击进行修改</van-button>
            <span>,修改后须重新推送至E分期</span>
        </div>
      </div>
    </NewCard>
    

    <van-popup v-model="showPicker" position="bottom" get-container="#app">
      <van-picker
        class="xh-credit-picker"
        show-toolbar
        :columns="columns"
        :value-key="valueKey"
        @cancel="showPicker = false"
        @confirm="onConfirm"
        @change="onChange"
      />
    </van-popup>
    <!-- 身份证识别/银行卡识别 -->
    <van-action-sheet v-model="showScan" :actions="scanActions" @select="discern"/>
    <!-- 确认弹框 -->
    <dialogBox
      :title="'确认终止本次查询吗？'"
      :showDialog="showDialog"
      :onConfirm="confirmFn"
      :onCancel="cancelFn"
    >
      <template>
        <van-cell title="原因：" title-style="color:red;">
          <van-field
            slot="label"
            v-model="cause"
            placeholder="请输入"
            type="textarea"
            :autosize="autosize"
            maxlength="100"
            show-word-limit
          />
        </van-cell>
      </template>
    </dialogBox>
  </div>
</template>

<script>
import ViewPage from "@/layout/components/ViewPage";
import NewCard from "@/components/card/newCard";
import radio from "@/components/radio";
import radioItem from "@/components/radio/radioItem";
import imageList from "@/components/imageList";
import dialogBox from "@/components/dialogBox/index";

import { getDocumentByType } from "@/api/document";

import Vue from "vue";
import {
    getByServer,
    createTask,
    getUsers,
    submitCredit,
    getBank,
    pushToEfenqi,
    stopTask_E,
    stopTask,
    updateEStageStatus,
    orderStatusQuery,

  getCreditInfo,
  saveCreditInfo,
  
  
  creditSaveOf100
} from "@/api/credit";
import { getValue, setValue, removeValue } from "@/utils/session";
import { getDic } from "@/api/createCustomer";
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
  ActionSheet
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
  ActionSheet
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
    buttonId:String,
  },
  data() {
    return {
        // --------header------------
        cardLabel:'银行征信查询信息',//标题
        isShowTitle:true,

        creditTypeList: Array, //征信查询方式列表
        pickerSign:"",//弹框标识
        valueKey:"",
        creditSearchType:'',//征信查询方式 buttonID
        creditSearchTypeDesc:'',//征信查询方式文本
        isElectronic:null,//征信查询模式  true--电子签 false--影像签
        creditSignModeList:[],//征信签约方式列表
        signMode:'',//征信签约方式 buttonID
        signModeDesc:'',//征信签约方式文本
        mainImg: [], //主借人相关文档
        obj: {//影像签
            joiDebtorSpouse: ["CUIDA04", "CUIDB04", "CUCARD04", "CRDPBOCA04"], //共债人配偶
            borrowerSpouse: ["CUIDA02", "CUIDB02", "CUCARD02", "CRDPBOCA02"], //借款人配偶
            security: ["CUIDB05", "CUIDA05", "CUCARD05", "CRDPBOCA05"], //担保人
            joiDebtor: ["CUIDA03", "CUIDB03", "CUCARD03", "CRDPBOCA03"], //共债人
            borrower: ["CUIDA01", "CUIDB01", "CUCARD01","CRDPBOCA01"] //主借人
        },
        objEle: {//电子签
            joiDebtorSpouse: ["CUIDA04", "CUIDB04", "CUCARD04"], //共债人配偶
            borrowerSpouse: ["CUIDA02","CUIDB02","CUCARD02"], //借款人配偶
            security: ["CUIDB05", "CUIDA05", "CUCARD05"], //担保人
            joiDebtor: ["CUIDA03", "CUIDB03", "CUCARD03"], //共债人
            borrower: ["CUIDA01", "CUIDB01", "CUCARD01"] //主借人
        },
        changeUserList: [],//下节点处理人
        taskData: {},
        isPeople:false,//是否是人工
        tip:true,//E分期-提交征信时显示
        processedBy: "", //提交人id

      loading: false,
      submitloading:false,
      autosize: {
        maxHeight: 100,
        minHeight: 20
      },
      canTermin: false,
      showPicker: false,
      bankArr: [], //银行数组
      bankList: {},
      columns: [],

      errorMsg: {
        intentionPrice: "",//征信意向价格
        bankCardNum: "",//银行卡号
        // cpCertificateNum:'',//征信证件号码
        // creditPersonName:'',//征信客户名称
        // investigateBankName:'',//征信银行
        // telephone:'',//征信电话号码
      },
      recordParams: {
        businessKey: "",
        businessType: "07"
      },
      showScan: false,
      scanActions: [
        {name: "相机扫描识别", value: "scan"},
        {name: "相册导入识别", value: "album"}
      ],
      dictionaryData:[],
      E_loading:false,//推送至E分期，
      //终止查询
      cause: "",//终止原因
      showDialog: false,
      dialogType:"",//弹框类型
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
    async getDocumentByType(documentType, obj,) {
      try {
        const params = {
          customerNum: this.dataList.perInfo.customerNum,
          documentType: documentType
        };
        const declare = this.documentType[documentType]
          ? this.documentType[documentType].label
          : "图片描述";
        const imgdata = {
          declare: declare, //图片描述
          isRequire: true, //*是否必须
          deletable: true, //是否可以操作-上传和删除
          documentType: documentType,
          customerNum: this.dataList.perInfo.customerNum,
          customerId: this.dataList.perInfo.id,
          kind: "1",
          fileList: []
        };
        const { data } = await getDocumentByType(params);
        data.forEach(item => {
          item.declare = declare;
        });
        imgdata.fileList = data;
        this.$set(imgdata,'fileList',data);
        if (obj.creditObjectType == "borrower") {
          this.mainImg.push(imgdata);
        }else{
          obj.imgInfo.push(imgdata);
        }
      } catch (e) {}
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
    //标签转变颜色
    returnColor(status) {
      let color;
      switch (status) {
        case "01":
          color = "#999";
          break;
        case "02":
          color = "#E60000";
          break;
        case "03":
          color = "#E60000";
          break;
        case "04":
          color = "#00C67C";
          break;
        case "05":
          color = "#E60000";
          break;
        case "06":
          color = "#E60000";
          break;
      }
      return color;
    },
    //改变征信查询方式
    changeSearchType(val){
      this.creditTypeList.forEach((item,index)=>{
        if(item.buttonId==val){
            this.creditSearchTypeDesc=item.buttonName;
        }
      })
    },
    //改变签约方式
    changeSignMode(val){
        this.signMode=val;
        this.creditSignModeList.forEach((item,index)=>{
            if(item.buttonId==val){
                this.signModeDesc=item.buttonName;
            }
        })
        this.dealsignMode(this.signModeDesc);
    },
    //获取征信查询方式
    async getQueryType(serverName){
      try{
        let para={
            serverName:serverName
        }
        const data=await getByServer(para);
        if(data.code==200){
          switch(serverName){
            case 'credit-search-type':
              this.creditTypeList=data.data;
              if(this.creditTypeList.length==1){
                  this.creditSearchType=this.creditTypeList[0].buttonId;
                  this.creditSearchTypeDesc=this.creditTypeList[0].buttonName;
                  if(this.creditSearchTypeDesc=='人工'){
                      this.isPeople=true;
                      this.cardLabel='银行征信查询信息'
                      this.getBankList();
                  }else{
                      this.isPeople=false;
                      this.cardLabel='银行征信查询信息 ( E分期 ) ';
                  }
              };
              break;
            case 'electronic-visa-model':
              if(data.data.length > 1){
                this.creditSignModeList=data.data;
              }else{
                this.creditSignModeList=data.data;
                this.signMode=data.data[0].buttonId;
                this.signModeDesc=data.data[0].buttonName;
                this.dealsignMode(data.data[0].buttonName);
              }
              break;
          }
        }
      }catch(err){
        console.log(err)
      }
    },
    //电子签与影像签切换
    async dealsignMode(desc){
        if(desc=='电子签'){
          this.isElectronic=true;//电子签
          this.dataList.surDtlList.forEach(e => {
            e.imgInfo = [];
            const arr = this.objEle[e.creditObjectType];
            arr.forEach(i => {
                this.getDocumentByType(i, e);
            });
          });
        }else{
          this.isElectronic=false;//影像签
          this.dataList.surDtlList.forEach(e => {
            e.imgInfo = [];
            const arr = this.obj[e.creditObjectType];
            arr.forEach(i => {
                this.getDocumentByType(i, e);
            });
          });
        };

    },
    /*----------第三步------------------- */
    //点击刷新按钮
    async clickrefreshIcon(isPeople){
      //E分期
      if(!isPeople){
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
            Toast.success('查询成功')
          }
        }catch(err){
          console.log(err)
          Toast.clear();
        }
      }else{//人工
        this.$nextTick(() => {
          this.$emit("reLoad");
        });
      }
    },
    /*----------第二步------------------- */
    //点击授权电子签
    electronicFn(val) {
      console.log(val, 9999);
    },
    //修改信息
    modifyInfo(){
      Dialog.confirm({
        title: "确认",
        message: "确认修改信息，修改后须重新推送至E分期"
      })
      .then(async () => {
        try{
          Toast.loading({
            message: "加载中...",
            forbidClick: true,
            loadingType: "spinner",
            overlay: true
          });
          let para={
            creditId:this.dataList.id
          }
          const {data,code} = await updateEStageStatus(para);
          if(code==200){
            Toast.clear();
            this.$emit("reLoad");
          }
        }catch(err){
          Toast.clear();
          console.log(er)
        }
      })
      .catch(() => {
      });
    },
    
    onConfirm(value) {
        this.showPicker = false;
        switch (this.pickerSign) {
            case "bankName":
                let tempcompany = this.bankArr.filter(e => {
                    if (e.orgName == value[0]) {
                    return e;
                    }
                })[0];
                let tempBank = tempcompany.children.filter(e => {
                    if (e.dsbrPltfrmNm == value[1]) {
                    return e;
                    }
                })[0];
                this.dataList.investigateBank = tempBank.id;
                this.dataList.investigateBankName = value[0] + "-" + value[1];
                this.dataList.bankCode = tempBank.bankCode;
                this.errorMsg.investigateBankName = "";
                break;
            case "user":
                this.processedBy = value.id;
                this.submitCredit();
                break;
            default:
                break;
        }
    },
    async submitCredit () {
        try {
          this.submitloading = true
          const params = {
            "ids": this.processedBy,
            "taskBean": this.taskData.taskBean,
            "wfBizComments": this.taskData.wfBizComments
          }
          await submitCredit(params)
          this.submitloading = false
          this.$nextTick(() => {
            Toast.success('征信提交成功!')
            this.$emit("reLoad");
            this.dealsignMode(this.signModeDesc)
          })
        } catch (e) {
          this.submitloading = false
          console.log(e)
        }
    },
    onChange(picker, values) {
      picker.setColumnValues(1, this.bankList[values[0]]);
    },
    async showPickerFn(type) {
      if(type=='bankName'&&this.dataList.standardCreditStatus=='01'){
        return;
      }
      if (!this.edit) {
        return;
      }
      this.showPicker = true;
      this.pickerSign = type;
      switch (type) {
        case "bankName":
            await this.getBankList();
            if (this.bankArr.length) {
                this.columns = [
                    {
                        values: Object.keys(this.bankList),
                        className: "column1"
                    },
                    {
                        values: this.bankList[this.bankArr[0].orgName],
                        className: "column2",
                        defaultIndex: 0
                    }
                ];
            }
            break;
        case "user":
            if (this.changeUserList.length == 0) {
                return;
            }
            this.valueKey = "label";
            this.columns = this.changeUserList;
            break;
        default:
            break;
      }
    },
    veriryEle(array){
      if(array.length<=0){
        return;
      }
      let num=0;
      array.forEach((item,index)=>{
        if(!item.electronicSignResult||item.electronicSignResult==''){
          num++;
        }
      })
      return num===0
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
        this.form.bankCardNum = this.dataList.bankCardNum;
        this.dataList.surDtlList = [this.form, ...this.perInfoList];
        this.dataList.creditSearchType=this.creditSearchType;
        this.dataList.creditSearchTypeDesc=this.creditSearchTypeDesc;
        this.dataList.signMode=this.signMode;
        this.dataList.signModeDesc=this.signModeDesc;
        this.dataList.creditType=this.buttonId;
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
        Toast.clear();
        this.$nextTick(() => {
          Toast.success("保存成功");
        });
        return query;
      } catch (e) {
        Toast.clear();
        console.log(e);
        return Promise.reject(e)
      }
    },
    //提交征信查询
    submitCreditFn(){
      if(this.isElectronic){//电子签
        if (!this.verifyForm()) {
          return;
        }
        this.nextStep().then(query => {
          this.submit(query);
        });
      }else{//影像签
        if (!this.verifyForm() || !this.verifyImg()) {
          return;
        }
        this.nextStep().then(query => {
          this.submit(query);
        });
      }
    },
    //推送至E分期
    async pushToEfenqi(){
      try{
        if (!this.verifyForm()) {
          return;
        }
        if(!this.dataList.intentionCarType ||this.dataList.intentionCarType==undefined){
          Toast("请选择意向车辆性质");
          return;
        }
        this.E_loading = true;
        this.form.bankCardNum = this.dataList.bankCardNum ;
        this.dataList.surDtlList = [this.form, ...this.perInfoList];
        this.dataList.creditSearchType=this.creditSearchType;
        this.dataList.creditSearchTypeDesc=this.creditSearchTypeDesc;
        this.dataList.signMode=this.signMode;
        this.dataList.signModeDesc=this.signModeDesc;
        this.dataList.creditType=this.buttonId;
        const { code } = await saveCreditInfo(this.dataList);
        if(code==200){
          Toast.success("保存成功");
          const data = await pushToEfenqi(this.dataList);
          if(data.code==200){
            Toast.success("征信进件成功！");
          }
        }
        this.E_loading = false;
        this.$emit("reLoad");
      }catch(err){
        console.log(err)
      }
    },
    /**
       * 提交
       * @return {Promise<void>}
    */
    async submit (query) {
        try {
          this.loading = true
          const params = {
            businessKey: query.creditRegisterId,
            businessType: "07",
            commentsDesc: "同意",
            conclusionCode: "01",
            processDefineKey: "WF_CU_CREDIT_001"
          }
          //创建流程
          const {data} = await createTask(params)

          this.taskData = data;

          const userParams = {
            businessKey: query.creditRegisterId,
            commentsDesc: this.dataList.remarks?this.dataList.remarks:'同意',
            conclusionCode: "01"
          }
          //获取下个节点处理人
          const res = await getUsers(userParams)
          let objArr = [];
          res.data.list.forEach(t => {
            objArr.push({
                ...t,
                label: t.companyName + "-" + t.name
            });
          });
          this.changeUserList = objArr;
          this.loading = false
          this.showPickerFn('user');
        } catch (e) {
          this.loading = false
          console.log(e)
        }
    },
    //新增联系人
    addPer() {
      const query = {
        customerId: this.dataList.customerId,
        customerNum: this.dataList.perInfo
          ? this.dataList.perInfo.customerNum
          : "",
        credit: true
      };
      this.$router.push({
        path: "/creatCustomer",
        query
      });
    },
    /**
     *  编辑人员
     *  @param per
     *  @param index
     **/
    editPer(per, index) {
      const query = {
        customerId: this.dataList.customerId,
        customerNum: this.dataList.perInfo
          ? this.dataList.perInfo.customerNum
          : "",
        index: index,
        credit: true,
        ...this.unFormatter(per)
      };
      this.$router.push({
        path: "/creatCustomer",
        query
      });
    },
    /**
     *  删除关联人
     **/
    removePer(index, item) {
      if (!item.canDel) {
        Notify({ type: "danger", message: "该客户已有征信记录，无法删除" });
        return;
      }
      Dialog.confirm({
        title: "删除",
        message: "确定删除该客户"
      })
        .then(() => {
          this.perInfoList.splice(index, 1);
          this.save();
          // on confirm
        })
        .catch(() => {
          // on cancel
        });
    },
    /**
     * 保存数据到本地
     */
    save() {
      this.form.bankCardNum = this.dataList.bankCardNum;
      this.dataList.surDtlList = [this.form, ...this.perInfoList];
      setValue("credit", JSON.stringify(this.dataList));
    },
    unFormatter(beanData) {
      const perInfo = beanData.perInfo || {};
      return {
        sex: beanData.sex, //性别
        birthday: perInfo.birthday, //出生日期
        customerName: beanData.creditPersonName, //客户姓名
        certificateNum: beanData.cpCertificateNum, //身份证号码
        age: beanData.age, //年龄
        creditObjectType: beanData.creditObjectType, //征信对象类型
        creditObjectRelation: beanData.creditObjectRelation, //征信对象类型
        nationName: perInfo.nationName, //民族
        nation: perInfo.nation, //
        familyAddress: beanData.familyAddress, //身份证住址
        signOrg: perInfo.signOrg, //身份证签发机关
        startDate: beanData.startDate, //起始日
        endDate: beanData.endDate, //截止日
        contactPhone: beanData.telephone, //手机号码
        bankCardNum: beanData.bankCardNum, //银行卡号
        isPeopleBankCredit: beanData.isPeopleBankCredit //是否查询征信
      };
    },
    verifyForm() {
      let num = 0;
      for (let item in this.errorMsg) {
        this.errorMsg[item] = this.returnMsg(item, this.dataList[item]);
        if (this.errorMsg[item]) {
          num++;
        }
      }
      return num === 0;
    },
    //验证征信授权书图片
    verifyImg(){
      let borrowerImg = false,otherImg = false;
      for(let i = 0;i<this.mainImg.length;i++){
        if(this.mainImg[i].documentType== 'CRDPBOCA01'){
          if(this.mainImg[i].fileList.length<1){
            Toast("请上传主借人银行征信授权书");
            break;
          }else{
            borrowerImg = true;
          }
        }
      }
      let imgArr = [];
      this.dataList.surDtlList.forEach(e =>{
        if(e.isPeopleBankCredit  == "1"){
          e.dataList.forEach(i =>{
            if(i.documentType == 'CRDPBOCA01' || i.documentType == 'CRDPBOCA02' || i.documentType == 'CRDPBOCA03' || i.documentType =='CRDPBOCA04'||i.documentType == 'CRDPBOCA05'){
              if(i.fileList.length<1){
                console.log(e.creditObjectType);
                imgArr.push(this.returnText(e.creditObjectType,'credit_object_type'));
              }
            }
          })
        }
      })
      if(imgArr.length>0){
        let nameString = imgArr.join('、');
        Toast(`请上传${nameString}银行征信授权书`);
        return;
      }else{
        otherImg = true;
      }
      console.log(borrowerImg,otherImg)
      return borrowerImg && otherImg;
    },
    /**
     * 终止查询
     */
    stopTask(type) {
      this.showDialog = true;
      this.cause='';
      this.dialogType= type;
    },
    async confirmFn() {
        if(this.dialogType=='isPeople'){
          if (!this.cause||this.cause=="") {
            this.showDialog = false;
            Toast("请输入终止原因");
            return;
          }
          Toast.loading({
            message: "加载中...",
            forbidClick: true,
            loadingType: "spinner",
            overlay: true
          });
          let recordParams = {
            businessKey: this.dataList.id,
            businessType: "07"
          };
          await stopTask(recordParams);
          Toast.clear();
          this.$nextTick(() => {
            Toast.success("终止成功");
          });
          this.showDialog = false;
          this.$router.go(-1);
        }else{
          if (!this.cause||this.cause=="") {
            this.showDialog = false;
            Toast("请输入终止原因");
            return;
          }
          Toast.loading({
            message: "加载中...",
            forbidClick: true,
            loadingType: "spinner",
            overlay: true
          });
          let params = {
            creditId: this.dataList.id,
          };
          const { data,code }=await stopTask_E(params);
          console.log(data,'data')
          Toast.clear();
          this.$nextTick(() => {
            Toast.success("终止成功");
          });
          this.showDialog = false;
          this.$router.go(-1);
        }
    },
    cancelFn() {
      this.showDialog = false;
    },
    /**
     * 识别
     */
    IdcardLoading () {
      if(this.dataList.transType=='1'){
        return;
      }
      this.showScan = true;
    },
    //银行卡
    discern (e) {
      this.$bridge.callHandler('bankCodeOCR', e.value, (res) => {
        this.$set(this.dataList, "bankCardNum", res.BANK_NUM);
      })
      this.showScan = false;
    }
  },
  mounted() {
    //征信查询方式
    this.getQueryType('credit-search-type');
    //判断电子签、影像签
    this.getQueryType('electronic-visa-model');
  },
  destroyed() {
    this.save();
  }
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
    // border:1px solid red;
}
.subtitle{
    padding: 1rem;
    font-size: 1.4rem;
    color:red;
    font-weight: Bold;
    margin-top: 0.8rem;
}

.modifyText{
    padding:0;
    margin:0;
    border:0;
    color:#07c160;
    background-color: transparent;
}

.labelClass {
  left: 1.33333rem;
  color:#000;
}
.rightClass {
    color: #323233;
}
.rightClassDis{
    color:#969799;
}
#creditQueryBox .van-cell__right-icon{
    color: #323233;
}
.signModeClassGreen{
    color: #00c67c;
}
.signModeClassRed{
    color: red;
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
</style>
