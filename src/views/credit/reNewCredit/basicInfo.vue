<!--
 * @Description: 银行征信查询
 * @Author: mating
 * @Date: 2020-03-12
 -->
<template>
  <div :loading="loading">
    <NewCard 
    id="creditQueryBox"
    v-if="dataList"
    :label="cardLabel" 
    :showSign="dataList.status?true:false" 
    :showTime="dataList.createTime?true:false" 
    :sign="dataList.status?returnText(dataList.status,'standard_credit_status'):''"
    :signColor="returnColor(dataList.status)"
    :time="dataList.createTime?dataList.createTime:''"
    :isShowTitle='true'
    >
      <!-- 刷新、提示 -->
      <div>
        <!-- 查询中 -->
        <div v-if="dataList.status=='01'" class="loadText">
            <div>E分期征信结果查询中，请耐心等待</div>
            <van-icon @click.stop='clickrefreshIcon' name="replay" size="1.8rem" color='#000'/>
        </div>
        <!-- 退回 -->
        <div v-if="dataList.status=='02'" class="loadText">
            <div>退回原因：xxxx(以E分期接口返回为准)</div>
        </div>
      </div>
      <!-- 主借人信息 -->
      <div>
        <div class="subtitle">主借人信息</div>
        <van-cell title="客户姓名:" required :border="false" :value="form.creditPersonName" />
        <van-cell title="证件号码:" required :border="false" :value="form.cpCertificateNum" />
        <van-cell title="手机号码:" required :border="false" :value="form.telephone" />
        <van-field name="bankCardNum" :disabled="!edit" label="银行卡号：" :placeholder="!edit?'':'请输入'" label-width="110" input-align="right" clearable :border="false" required v-model="form.bankCardNum" @blur.prevent="ruleMessge" :error-message="errorMsg.bankCardNum" :right-icon="!edit ? '' : 'scan'" @click-right-icon="IdcardLoading('bankCodeOCR')"
        />
        <van-cell title="征信查询方式:" required :border="false" :value="creditSearchTypeDesc">
            <radio v-if="creditTypeList.length>1" v-model="dataList.creditSearchType">
                <radio-item
                    v-for="(item,index) in creditTypeList"
                    :key="index"
                >{{item.buttonName}}</radio-item>
            </radio>
        </van-cell>
        <van-cell title="征信签约方式:" required :border="false" :value="signModeDesc">
            <radio v-if="creditSignModeList.length>1" v-model="signMode" @change="changeSignMode">
                <radio-item
                    :label="item.buttonId"
                    v-for="(item,index) in creditSignModeList"
                    :key="index"
                >{{item.buttonName}}</radio-item>
            </radio>
        </van-cell>
        <!-- E分期 -->
        <van-cell v-if="!isPeople" label-class="labelClass" :label="errorMsg.intentionCarType" title="意向车辆性质：" :border="false" required
        >
            <radio v-model="form.intentionCarType" @change="changeNature">
            <radio-item
                :label="item.value"
                v-for="(item,index) in isQueryList"
                :key="index"
            >{{item.label}}</radio-item>
            </radio>
        </van-cell>
        <van-field v-if="!isPeople" class="label_plus" name="intentionPrice" @blur.prevent="ruleMessge" :error-message="errorMsg.intentionPrice" :disabled="!edit" :border="false" v-model="dataList.intentionPrice" type="tel" required clearable @blur="checkPrice" input-align="right" label="意向车辆价格：" placeholder="请输入"
        >
            <div slot="button">元</div>
        </van-field>
        <van-cell v-if="!isPeople" title="身份证签发机关:" required :border="false" :value="form.issueAuthority" />
        <van-cell v-if="!isPeople" title="身份证有效期:" required :border="false" :value="form.endDate" />
        <van-cell v-if="!isPeople" title="身份证住址:" required :border="false" :value="form.idcardAddress" />

        <!-- 人工 -->
        <van-field v-if="isPeople" class="label_plus" name="intentionPrice" @blur.prevent="ruleMessge" :error-message="errorMsg.intentionPrice" :disabled="!edit" :border="false" v-model="dataList.intentionPrice" type="tel" required clearable @blur="checkPrice" input-align="right" label="意向贷款价格：" placeholder="请输入"
        >
            <div slot="button">元</div>
        </van-field>
        <van-cell
            v-if="isPeople"
            title="银行："
            label-class="labelClass"
            :label="errorMsg.investigateBankName"
            value-class='rightClass'
            :disabled="!edit"
            :border="false"
            required
            :is-link="edit"
            :value="dataList.investigateBankName"
            @click="showPickerFn('bankName')"
        />
        <!-- 征信授权电子签 -->
        <!-- labelClass -->
        <van-cell 
            title="征信授权电子签" 
            required 
            label-class="labelClassNew"
            :disabled="!edit"
            :border="false" 
            :value="form.electronicSignResult ? form.electronicSignResult: '待签约'"
            :value-class="form.electronicSignResult ?'signModeClassGreen':'signModeClassRed'"
            :right-icon="!edit ? '' : 'scan'" 
            is-link
            v-if="isElectronic"
            />
            <!-- @click="showPickerFn" -->
        <!-- 相关文档--图片 -->
        <van-cell title="相关文档" :border="false" :required="isPeople"/>
        <imageList :dataList="mainImg"></imageList>
      </div>
      <!-- 关联人信息 -->
      <div v-if='perInfoList.length > 0'>
        <van-swipe-cell :disabled="!edit" v-for="(item, index) in perInfoList" :key="index">
            <div class="subtitle">{{returnText(item.creditObjectType, 'credit_object_type')}}信息</div>
            <van-field disabled label="姓名"  label-width="110" input-align="right" clearable :border="false" required v-model="item.creditPersonName" />
            <van-field label="证件号码:" disabled label-width="110" input-align="right" clearable
                :border="false"
                required
                :value="item.cpCertificateNum" />
            <van-field 
                label="手机号码:" 
                required 
                :border="false" 
                :value="item.telephone" 
                name="telephone"
                disabled
                label-width="110"
                input-align="right"
                clearable/>
            <van-field
                disabled
                label="银行卡号："
                label-width="110"
                input-align="right"
                clearable
                :border="false"
                required
                :value="item.bankCardNum"
            />
            <van-cell 
                title="征信对象关系:" 
                required 
                :border="false" 
                :value="returnText(item.creditObjectType, 'credit_object_type')"/>
            <van-cell
                label-class="labelClass"
                :label="errorMsg.carNature"
                title="是否查询征信："
                :border="false"
                required
                :value="item.isPeopleBankCredit=='0'?'是':'否'"
            >
            </van-cell>
            <van-cell v-if="!isPeople" title="身份证签发机关:" required :border="false" :value="item.issueAuthority" />
            <van-cell v-if="isPeople" title="身份证有效期:" required :border="false" :value="item.endDate" />
            <van-cell v-if="isPeople" title="身份证住址:" required :border="false" :value="item.familyAddress" />
            <!-- 征信授权电子签 -->
            <van-cell 
                title="征信授权电子签" 
                required 
                label-class="labelClass"
                :disabled="!edit"
                :border="false" 
                :value="item.electronicSignResult ? item.electronicSignResult: '待签约'"
                :right-icon="!edit ? '' : 'scan'" 
                is-link
                v-if="isElectronic"
                />
                <!-- @click="showPickerFn" -->
            <!-- 相关文档--图片 -->
            <van-cell title="相关文档" :border="false" :required="isPeople" />
            <imageList :dataList="mainImg"></imageList>

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
      <div class="subtitle" style="display:flex;align-items:center;">
        <div>{{perInfoList.length > 0 || edit ? '新增' : ''}}关联人</div>
        <van-icon style="margin-left:1rem;" name="add-o" size="1.8rem" @click="addPer" v-if="edit" color="#000"/>
      </div>
      <!-- 备注说明 -->
      <div v-if="isPeople">
        <div class="subtitle">备注说明</div>
        <van-field
            v-model="dataList.remarks"
            :border="false"
            :disabled="!edit"
            type="textarea"
            placeholder="请输入"
            rows="1"
            :autosize="autosize"
            class="zh-textarea"
        />
      </div>
      <div style="margin-top:45px;" name='footer'>
        <div v-if="tip" style="font-size:10px;text-align:center;padding:0 1.2rem;letter-spacing: 1.2px;">
            <span>若以上信息有误,</span>
            <van-button type="text" size="mini" class="modifyText" @click="modifyInfo">点击进行修改</van-button>
            <span>,修改后须重新推送至E分期</span>
        </div>
        <div>
            <div class="xh-submit-box" v-if="isPeople">
                <van-button
                    v-if="dataList.status=='01'|| dataList.status=='02'"
                    size="large"
                    style="width: 25%; flex: none"
                    class="xh-btn xh-primary"
                    @click="stopTask"
                >终止查询</van-button>
                <van-button
                    size="large"
                    @click="nextStepFn"
                    class="xh-btn"
                    :loading='submitloading'
                    :disabled="Boolean(errorMsg.intentionPrice)"
                >提交征信查询</van-button>
            </div>
            <div class="xh-submit-box" v-if="!isPeople && edit && !hiddenHandle" style="margin-top:15px;">
                <van-button
                    v-if="dataList.status=='01'|| dataList.status=='02'"
                    size="large"
                    style="width: 25%; flex: none"
                    class="xh-btn xh-primary"
                    @click="stopTask"
                >终止查询</van-button>
                <van-button
                    size="large"
                    style="width: 25%; flex: none"
                    class="xh-btn xh-primary"
                    @click="nextStepFn"
                >提交征信查询</van-button>
                <van-button
                    size="large"
                    @click="nextStepFn"
                    :disabled="Boolean(errorMsg.intentionPrice)"
                    class="xh-btn"
                >推送至E分期</van-button>
            </div>
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
  </div>
</template>

<script>
import ViewPage from "@/layout/components/ViewPage";
import NewCard from "@/components/card/newCard";
import radio from "@/components/radio";
import radioItem from "@/components/radio/radioItem";
import imageList from "@/components/imageList";

import { getDocumentByType } from "@/api/document";

import Vue from "vue";
import {
    getByServer,
    createTask,
    getUsers,
    submitCredit,
    getBankList,

  getBank,
  getCreditInfo,
  saveCreditInfo,
  
  stopTask,
  creditSaveOf100
} from "@/api/credit";
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

        isQueryList:[{
            value:'01',
            label:'是'
        },{
            value:'02',
            label:'否'
        }],
        imageListData:[],//相关文档
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
        obj: {
            joiDebtorSpouse: ["0113", "0114", "2004", "6604"], //共债人配偶
            borrowerSpouse: ["0105", "0106", "2002", "6691"], //借款人配偶
            security: ["0120", "0117", "2005", "6692"], //担保人
            joiDebtor: ["0109", "0110", "2003", "6693"], //共债人
            borrower: ["0101", "0102", "2001", "6690"] //主借人
        },
        changeUserList: [],//下节点处理人
        taskData: {},
        isPeople:false,//是否是人工
        tip:false,//E分期-提交征信时显示
        processedBy: "", //提交人id

      vehicleForm: {
        type: "测试数据"
      },
      vehicle: true,
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
      // isInternet: '',//是否为银行征信（0：银行征信；1：大数据征信；2：E分期（对应iSiSBC=1）；3：T+0（对应iSiSBC=2）
      errorMsg: {
        //必填list
        investigateBankName: "",
        intentionPrice: "",
        bankCardNum: ""
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
        if (obj.creditObjectType == "borrower") {
          this.mainImg.push(imgdata);
        }
        obj.dataList.push(imgdata);
        const { data } = await getDocumentByType(params);
        data.forEach(item => {
          item.declare = declare;
        });
        imgdata.fileList = data;
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
         const data=await getBankList();
         console.log(data,'dta')
        }catch(err){
            console.log(err)
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
    //改变签约方式
    changeSignMode(val){
        this.signMode=val;
        this.creditSignModeList.forEach((item,index)=>{
            if(item.buttonId==val){
                this.signModeDesc=item.buttonName;
            }
        })
        this.dealsignMode();
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
                                this.isPeople=true
                                this.getBankList();
                            }else{
                                this.isPeople=false
                            }
                       };
                       break;
                    case 'electronic-visa-model':
                        this.creditSignModeList=data.data;
                        if(data.data.length==1){
                            this.signMode=data.data[0].buttonId;
                            this.signModeDesc=data.data[0].buttonName;
                        }
                        this.dealsignMode();
                        break;
                }
            }
        }catch(err){
            console.log(err)
        }

    },
    //电子签与影像签切换
    dealsignMode(){
        if(this.signModeDesc=='电子签'){
            this.isElectronic=true;//电子签
            this.obj = {
                joiDebtorSpouse: ["0113", "0114", "2004"], //共债人配偶
                borrowerSpouse: ["0105", "0106", "2002"], //借款人配偶
                security: ["0120", "0117", "2005"], //担保人
                joiDebtor: ["0109", "0110", "2003"], //共债人
                borrower: ["0101", "0102", "2001"] //主借人
            };
            this.dataList.surDtlList.forEach(item => {
                const arr = this.obj[item.creditObjectType];
                arr.forEach(i => {
                    this.getDocumentByType(i, item);
                });
            });
        }else{
            this.isElectronic=false;//影像签
            this.obj = {
                joiDebtorSpouse: ["0113", "0114", "2004", "6604"], //共债人配偶
                borrowerSpouse: ["0105", "0106", "2002", "6691"], //借款人配偶
                security: ["0120", "0117", "2005", "6692"], //担保人
                joiDebtor: ["0109", "0110", "2003", "6693"], //共债人
                borrower: ["0101", "0102", "2001", "6690"] //主借人
            };
            this.dataList.surDtlList.forEach(e => {
                const arr = this.obj[e.creditObjectType];
                arr.forEach(i => {
                    this.getDocumentByType(i, e);
                });
            });
        };

    },
    /*----------第三步------------------- */
    //点击刷新按钮
    clickrefreshIcon(){
        console.log(1111)

    },
    changeNature(val) {
      console.log(val);
      return ;
      if (val === "new_car") {
        this.rulesForm("order-credit-car-xh");
        delete this.errorMsg.chassisNumber;
      } else {
        this.$router.push({
          path: "/priceEvaluationChoose",
          query: {
            type:2,
            projectId:this.params.projectId
          }
        });
      }
    },
    /*----------第二步------------------- */
    //修改信息
    modifyInfo(){
        console.log('点击修改信息')

    },
    getTypeList(key) {
      return this.$store.state.user.wordbook[key] || [];
    },
    selectList() {},
    
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
          })
        //   if(this.$route.query.canTermin) {
        //     this.$nextTick(() => {
        //       this.$router.push('/lendProcessList')
        //     })
        //   } else {
        //     this.$nextTick(() => {
        //       this.$router.push('/creditList')
        //     })
        //   }
        } catch (e) {
          this.submitloading = false
          console.log(e)
        }
    },
    onChange(picker, values) {
      picker.setColumnValues(1, this.bankList[values[0]]);
    },
    async showPickerFn(type) {
      if (!this.edit) {
        return;
      }
      this.showPicker = true;
      this.pickerSign = type;
      switch (type) {
        case "bankName":
            await this.getBank();
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
    async getBank() {
      try {
        //银行列表
        const res = await getBankList();
        this.bankArr = res.data;
        this.bankArr.forEach((item, index) => {
          this.bankList[item.orgName] = item.children.map(e => {
            return e.dsbrPltfrmNm;
          });
        });
      } catch (e) {
        console.log(e);
      }
    },
    // 百融大数据征信授权书提示
    async bigDataTipOfBr(){
      try {
        this.checkPrice();
        if (!this.verifyForm()) {
          return;
        }
        // this.dataList.creditTypeFlag = 1
        this.form.bankCardNum = this.dataList.bankCardNum;
        this.dataList.surDtlList = [this.form, ...this.perInfoList];
      
        let _arr = []
        const _itemList = this.dataList.surDtlList.filter(item => item.dataList && item.dataList.length > 0)
        let _promise = new Promise((resolve,reject) => {
          if(_itemList.length > 0){
            _itemList.forEach((item,index) => {
              item.dataList.forEach((ele)=> {
                if (ele.documentType === "CRDBIGA01" && ele.fileList.length <= 0) {
                  _arr.push(item.creditPersonName)
                }
                resolve(true)
              })
            })
          }else{
            resolve(true)
          }
        })

        _promise.then(async (resolve,reject) => {
          Bus.$emit("queryStart", 'bairong');
          if(_arr.length > 0){
            Dialog.confirm({
              message: `${_arr.join('、')}没有上传征信查询授权书，无法查询征信，确定吗？`
            }).then(() => {
              creditSaveOf100(this.dataList).then(() => {
                this.$nextTick(() => {
                  Toast.success("查询成功");
                  Bus.$emit("querySuccess", 'bairong');
                });
              }).catch(() => {
                Bus.$emit("queryFaile", 'bairong');
              })
            }).catch(() => {
                Bus.$emit("queryFaile", 'bairong');
            })
          }else{
            creditSaveOf100(this.dataList).then(() => {
              this.$nextTick(() => {
                Toast.success("查询成功");
                Bus.$emit("querySuccess", 'bairong');
              });
            }).catch(() => {
              Bus.$emit("queryFaile", 'bairong');
            })
          }
        }).catch((error) => {
            Bus.$emit("queryFaile", 'bairong');
            console.log(error)
        })
      } catch (error) {
        Bus.$emit("queryFaile", 'bairong');
        console.log(error)
      }
    },
    /**
     * 下一步
     **/
    async nextStep(TYPE) {
      try {
        this.checkPrice();
        if (!this.verifyForm()) {
          return;
        }
        this.loading = true;
        this.form.bankCardNum = this.dataList.bankCardNum;
        this.dataList.surDtlList = [this.form, ...this.perInfoList];
        this.dataList.creditSearchType=this.creditSearchType;
        this.dataList.creditSearchTypeDesc=this.creditSearchTypeDesc;
        this.dataList.signMode=this.signMode;
        this.dataList.signModeDesc=this.signModeDesc;
        this.dataList.creditType=this.buttonId;
        if(TYPE !== 'bairong' && TYPE) {
          this.dataList.creditTypeFlag = TYPE
        }
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
    nextStepFn() {
      this.nextStep().then(query => {
        // this.$nextTick(() => {
        //   this.$router.push({
        //     path: "/creditNextStep",
        //     query
        //   });
        // });
        this.submit(query);
      });
      
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
    /**
     *  删除车
     **/
    removeCar(index) {
      Dialog.confirm({
        title: "删除",
        message: "确定删除该车"
      })
        .then(() => {
          this.dataList.carInfos.splice(index, 1);
          this.save();
          // on confirm
        })
        .catch(() => {
          // on cancel
        });
    },
    /**
     *  编辑车辆
     *  @param car
     *  @param index
     **/
    editCar(car, index) {
      const query = {
        customerId: this.dataList.customerId,
        index: index,
        ...car,
        customerNum: this.dataList.perInfo
          ? this.dataList.perInfo.customerNum
          : ""
      };
      this.$router.push({
        path: "/vehicle",
        query
      });
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
    nameToString() {
      return [...arguments].map(item => item).join(" ");
    },
    /**
     * 保存数据到本地
     */
    save() {
      this.form.bankCardNum = this.dataList.bankCardNum;
      this.dataList.surDtlList = [this.form, ...this.perInfoList];
      setValue("credit", JSON.stringify(this.dataList));
    },
    enFormatter(beanData) {
      return {
        sex: beanData.sex, //性别
        creditPersonName: beanData.customerName, //客户姓名
        cpCertificateNum: beanData.certificateNum, //身份证号码
        age: beanData.age, //年龄
        creditObjectType: beanData.creditObjectType, //征信对象类型
        perInfo: {
          nationName: beanData.nationName, //民族
          nation: beanData.nation, //民族
          birthday: beanData.birthday, //出生日期
          signOrg: beanData.signOrg //身份证签发机关
        },
        familyAddress: beanData.familyAddress, //身份证住址
        startDate: beanData.startDate, //起始日
        endDate: beanData.endDate, //截止日
        telephone: beanData.contactPhone, //手机号码
        bankCardNum: beanData.bankCardNum //银行卡号
      };
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
        nationName: perInfo.nationName, //民族
        nation: perInfo.nation, //
        familyAddress: beanData.familyAddress, //身份证住址
        signOrg: perInfo.signOrg, //身份证签发机关
        startDate: beanData.startDate, //起始日
        endDate: beanData.endDate, //截止日
        contactPhone: beanData.telephone, //手机号码
        bankCardNum: beanData.bankCardNum //银行卡号
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
    /**
     * 终止代办
     */
    stopTask() {
      Dialog.confirm({
        title: "终止",
        message: "确定终止该流程"
      })
        .then(async () => {
          try {
            this.loading = true;
            await stopTask(this.recordParams);
            this.loading = false;
            this.$nextTick(() => {
              Toast.success("终止成功");
            });
            this.$nextTick(() => {
              this.$router.push({
                path: "/lendProcessList"
              });
            });
          } catch (e) {
            console.log(e);
          }
          // on confirm
        })
        .catch(() => {
          // on cancel
        });
    },
    /**
     * 贷款金额与销售价
     */
    checkPrice() {
      this.priceFloat(this.dataList, "intentionPrice");
      return; //没有车辆所以没有销售价了
      const investigateBankName = this.dataList.investigateBankName || "";
      const intentionPrice = this.dataList.intentionPrice || 0;
      let price = 0;
      const carInfos = this.dataList.carInfos;
      this.errorMsg.intentionPrice = "";

      if (!carInfos.length) return;

      carInfos.forEach(item => {
        if (item.carNature === "new_car") {
          price += item.salePriceDto;
        }
      });

      if (!price) return;

      if (investigateBankName.includes("中国银行")) {
        if (intentionPrice >= price * 0.7) {
          this.errorMsg.intentionPrice = "贷款金额不能高于销售价7成！";
        }
      } else if (investigateBankName.includes("农业银行")) {
        if (intentionPrice >= price * 0.88) {
          this.errorMsg.intentionPrice = "贷款金额不能超过销售价的8.8成";
        }
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
        this.$set(this.dataList, "bankCardNum", res.BANK_NUM);
      })
      this.showScan = false;
    }
  },
  mounted() {
    Bus.$off('creditSave')
    Bus.$on("creditSave", TYPE => {
      TYPE === 'bairong' ? this.bigDataTipOfBr() : this.nextStep(TYPE);
    });
    this.rulesForm("order-credit-xh"); //新车
    
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
