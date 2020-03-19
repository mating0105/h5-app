<!--
 * @Description: 银行征信回复
 * @Author: mating
 * @Date: 2020-03-17
 -->
<template>
  <div :loading="loading">
    <NewCard label="银行征信查询信息" :showSign="showSign" :showTime="showTime" :sign='sign' :signColor='signColor'>
      <div class="loadText">
        <div>请及时回复征信结果，上传征信报告</div>
      </div>
      <!-- <div class="loadText">
        <div>E分期综合征信结果为通过，暂无法获知单人征信结果</div>
      </div> -->
      <div>
        <div class="subtitle">主借人信息</div>
        <van-cell title="客户姓名:" required :border="false" />
        <van-cell title="证件号码:" required :border="false"/>
        <van-cell title="手机号码:" required :border="false"/>
        <van-field name="bankCardNum" :disabled="!edit" label="银行卡号：" :placeholder="!edit?'':'请输入'" label-width="110" input-align="right" clearable :border="false" required @blur.prevent="ruleMessge" :error-message="errorMsg.bankCardNum" :right-icon="!edit ? '' : 'scan'" @click-right-icon="IdcardLoading('bankCodeOCR')"
        />
        <van-cell title="征信查询方式:" required :border="false" :right-icon="!edit ? '' : 'scan'" is-link='edit' @click="showPickerFn"/>
        <van-cell label-class="labelClass" :label="errorMsg.carNature" title="意向车辆性质：" :border="false" required
        >
            <radio @change="changeNature">
            <radio-item
                :label="item.value"
                v-for="(item,index) in isQueryList"
                :key="index"
            >{{item.label}}</radio-item>
            </radio>
        </van-cell>
        <van-field class="label_plus" name="intentionPrice" @blur.prevent="ruleMessge" :error-message="errorMsg.intentionPrice" :disabled="!edit" :border="false" type="tel" required clearable @blur="checkPrice" input-align="right" label="意向车辆价格：" placeholder="请输入"
        >
            <div slot="button">元</div>
        </van-field>
        <!-- 人工 start-->
        <van-field class="label_plus" name="intentionPrice" @blur.prevent="ruleMessge" :error-message="errorMsg.intentionPrice" :disabled="!edit" :border="false" type="tel" required clearable @blur="checkPrice" input-align="right" label="意向贷款价格：" placeholder="请输入"
        >
            <div slot="button">元</div>
        </van-field>
        <van-cell title="银行:" required :border="false" :right-icon="!edit ? '' : 'scan'" is-link='edit' @click="showPickerFn"/>
        <van-cell label-class="labelClass" :label="errorMsg.carNature" title="征信结果：" :border="false" required
        >
            <radio @change="changeNature">
            <radio-item
                :label="item.value"
                v-for="(item,index) in isQueryList"
                :key="index"
            >{{item.label}}</radio-item>
            </radio>
        </van-cell>
        <van-cell label-class="labelClass" :label="errorMsg.carNature" title="征信结果时间：" :border="false" required
        >
            <radio @change="changeNature">
            <radio-item
                :label="item.value"
                v-for="(item,index) in isQueryList"
                :key="index"
            >{{item.label}}</radio-item>
            </radio>
        </van-cell>
         <!-- 人工 end-->

        <van-cell title="身份证签发机关:" required :border="false" />
        <van-cell title="身份证有效期:" required :border="false" />
        <van-cell title="身份证住址:" required :border="false" />
        <!-- 征信授权电子签 -->
        <van-cell title="征信授权电子签" required :border="false" :right-icon="!edit ? '' : 'scan'" is-link='edit' @click="showPickerFn"/>
        <!-- 相关文档--图片 -->
        <van-cell title="相关文档：" required 
            :border="false" 
            :right-icon="!edit ? '' : 'scan'"
            >
            <imageList slot="label" :dataList="imageListData"></imageList>
        </van-cell>
        <!-- 征信报告--图片 -->
        <van-cell title="征信报告：" required 
            :border="false" 
            :right-icon="!edit ? '' : 'scan'"
            >
            <imageList slot="label" :dataList="imageListData"></imageList>
        </van-cell>
      </div>
      <!-- 关联人 -->
      <div>
        <div class="subtitle">配偶信息</div>
        <van-field name="bankCardNum" :disabled="!edit" label="姓名" :placeholder="!edit?'':'请输入'" label-width="110" input-align="right" clearable :border="false" required @blur.prevent="ruleMessge" :error-message="errorMsg.bankCardNum"/>
        <van-field name="cpCertificateNum" label="证件号码:" :disabled="!edit" :placeholder="!edit?'':'请输入'" label-width="110" input-align="right" clearable
            :border="false"
            required
            @blur.prevent="ruleMessge"
            :error-message="errorMsg.cpCertificateNum" />
        <van-field 
            label="手机号码:" 
            required 
            :border="false" 
            name="telephone"
            :disabled="!edit"
            :placeholder="!edit?'':'请输入'"
            label-width="110"
            input-align="right"
            clearable
            @blur.prevent="ruleMessge"
            :error-message="errorMsg.telephone"/>
        <van-field
            name="bankCardNum"
            :disabled="!edit"
            label="银行卡号："
            :placeholder="!edit?'':'请输入'"
            label-width="110"
            input-align="right"
            clearable
            :border="false"
            required
            @blur.prevent="ruleMessge"
            :error-message="errorMsg.bankCardNum"
            :right-icon="!edit ? '' : 'scan'"
            @click-right-icon="IdcardLoading('bankCodeOCR')"
        />
        <van-cell 
            title="征信对象关系:" 
            required 
            :border="false" 
            :right-icon="!edit ? '' : 'scan'"
            is-link='edit'
            @click="showPickerFn"/>
        <van-cell
            label-class="labelClass"
            :label="errorMsg.carNature"
            title="是否查询征信："
            :border="false"
            required
        >
            <radio @change="changeNature">
            <radio-item
                :label="item.label"
                v-for="(item,index) in isQueryList"
                :key="index"
            >{{item.label}}</radio-item>
            </radio>
        </van-cell>
        <!-- 人工 start -->
        <van-cell label-class="labelClass" :label="errorMsg.carNature" title="征信结果：" :border="false" required
        >
            <radio @change="changeNature">
            <radio-item
                :label="item.value"
                v-for="(item,index) in isQueryList"
                :key="index"
            >{{item.label}}</radio-item>
            </radio>
        </van-cell>
        <van-cell label-class="labelClass" :label="errorMsg.carNature" title="征信结果时间：" :border="false" required
        >
            <radio @change="changeNature">
            <radio-item
                :label="item.value"
                v-for="(item,index) in isQueryList"
                :key="index"
            >{{item.label}}</radio-item>
            </radio>
        </van-cell>
        <!-- 人工 end -->

        <van-cell title="身份证签发机关:" required :border="false" />
        <van-cell title="身份证有效期:" required :border="false" />
        <van-cell title="身份证住址:" required :border="false" />
        <!-- 征信授权电子签 -->
        <van-cell 
            title="征信授权电子签" 
            required 
            :border="false" 
            :right-icon="!edit ? '' : 'scan'"
            is-link='edit'
            @click="showPickerFn"/>
        <!-- 相关文档 -->
        <van-cell title="相关文档：" required 
            :border="false" 
            :right-icon="!edit ? '' : 'scan'"
            >
            <imageList slot="label" :dataList="imageListData"></imageList>
        </van-cell>
        <!-- 征信报告 -->
        <van-cell title="征信报告：" required 
            :border="false" 
            :right-icon="!edit ? '' : 'scan'"
            >
            <imageList slot="label" :dataList="imageListData"></imageList>
        </van-cell>
        
      </div>
      <!-- 备注说明 -->
      <div>
        <div class="subtitle">备注说明</div>
        <van-field
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
            <!--  v-if="edit && !hiddenHandle"  -->
            <div class="xh-submit-box" style="margin-top:15px;">
                <van-button
                    size="large"
                    style="width: 16%; flex: none"
                    class="xh-btn xh-primary"
                    @click="nextStepFn"
                >退回</van-button>
                <van-button
                    size="large"
                    style="width: 40%; flex: none"
                    class="xh-btn"
                    @click="nextStepFn"
                >提前告知征信结果</van-button>
                <van-button
                    size="large"
                    @click="nextStepFn"
                    :disabled="Boolean(errorMsg.intentionPrice)"
                    class="xh-btn"
                >提交</van-button>
            </div>
        </div>
    </NewCard>


    <van-popup v-model="showPicker" position="bottom" get-container="#app">
      <van-picker
        class="xh-credit-picker"
        show-toolbar
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="onConfirm"
        @change="onChange"
      />
    </van-popup>
    <!-- 身份证识别/银行卡识别 -->
    <van-action-sheet v-model="showScan" :actions="scanActions" @select="discern"/>
    
    <!-- 弹框 -->
    <dialogBox class="dialogBox" :title="'确认终止本次查询吗？'" :showDialog='showDialog' :onConfirm='confirmFn' :onCancel='cancelFn'>
        <template>
            <van-cell title="原因：" title-style='color:red;'>
                <van-field slot="label" v-model="cause" placeholder="请输入" type="textarea" :autosize="autosize" maxlength="100" show-word-limit />
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
import dialogBox from '@/components/dialogBox/index'
import imageList from "@/components/imageList";
import Vue from "vue";
import {
  getBank,
  getCreditInfo,
  saveCreditInfo,
  createTask,
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
    }
  },
  data() {
    return {
        showTime:true,//卡片（显示时间）
        showSign:true,//卡片（显示标签）
        sign:'通过',//标签标记内容  （查询中、被退回）
        signColor:'green',//标签标记颜色
        isQueryList:[{
            value:'01',
            label:'是'
        },{
            value:'02',
            label:'否'
        }],
        imageListData:[],//相关文档
        showDialog:false,
        cause:'',//原因
      vehicleForm: {
        type: "测试数据"
      },
      vehicle: true,
      loading: false,
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
    }
  },
  methods: {
      confirmFn(){
          this.showDialog=false;
          console.log(11111)

      },
      cancelFn(){
          this.showDialog=false;
          console.log(2222)
      },
    /*----------第三步------------------- */
    //点击刷新按钮
    clickrefreshIcon(){
        console.log(1111)

    },
    changeNature(val) {
      console.log(val);
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
    onConfirm(value) {
      this.showPicker = false;
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
      this.checkPrice();
    },
    onChange(picker, values) {
      picker.setColumnValues(1, this.bankList[values[0]]);
    },
    async showPickerFn() {
      if (!this.edit) {
        return;
      }
      this.showPicker = true;
      try {
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
      } catch (e) {
        console.log(e);
      }
    },
    async getBank() {
      try {
        //银行列表
        const res = await getBank();
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
    addVehicle() {
      if (!this.edit) {
        return;
      }
      const query = {
        customerId: this.dataList.customerId,
        customerNum: this.dataList.perInfo
          ? this.dataList.perInfo.customerNum
          : ""
      };
      this.$router.push({
        path: "/vehicle",
        query
      });
    },
    // 百融大数据征信授权书提示
    async bigDataTipOfBr(){
      try {
        this.checkPrice();
        if (!this.verifyForm()) {
          return;
        }
        this.dataList.creditTypeFlag = 1
        this.dataList.surDtlList = [this.form, ...this.perInfoList];
      
        let _arr = []
        const _itemList = this.dataList.surDtlList.filter(item => item.dataList && item.dataList.length > 0)
        let _promise = new Promise((resolve,reject) => {
          if(_itemList.length > 0){
            _itemList.forEach((item,index) => {
              item.dataList.forEach((ele)=> {
                if (ele.documentType === "6690" && ele.fileList.length <= 0) {
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
        this.dataList.surDtlList = [this.form, ...this.perInfoList];
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
          Bus.$emit("creditSaveSuccess", query);
        });
        return query;
        // this.$nextTick(() => {
        //   this.$router.push({
        //     path: '/creditNextStep',
        //     query
        //   })
        // })
      } catch (e) {
        this.loading = false;
        console.log(e);
        return Promise.reject(e)
      }
    },
    nextStepFn() {
        this.showDialog=true;

    //   this.nextStep().then(query => {
    //     this.$nextTick(() => {
    //       this.$router.push({
    //         path: "/creditNextStep",
    //         query
    //       });
    //     });
    //   });
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
     *  删除人
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
        this.form.bankCardNum = res.BANK_NUM || ''
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
</style>
