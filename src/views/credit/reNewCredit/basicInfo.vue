<template>
  <div :loading="loading">
    <Card>
      <template v-slot:header>客户信息</template>
      <van-cell title="客户名称:" required :border="false" :value="form.creditPersonName" />
      <van-cell title="证件号码:" required :border="false" :value="form.cpCertificateNum" />
      <van-cell title="电话号码:" required :border="false" :value="form.telephone" />
      <van-cell title="征信对象类型:" required :border="false" value="借款人" />
      <van-cell
        title="银行："
        label-class="labelClass"
        :label="errorMsg.investigateBankName"
        :disabled="!edit"
        :border="false"
        required
        :is-link="edit"
        :value="dataList.investigateBankName"
        @click="showPickerFn"
      />
      <van-field
            v-model="dataList.bankCardNum"
            required
            clearable
            name="bankCardNum"
            error-message-align="right"
            label="银行卡号："
            input-align="right"
            placeholder="请输入"
            :disabled="!edit"
            :border="false"
            @blur.prevent="ruleMessge"
            :error-message="errorMsg.bankCardNum"
            :right-icon="!edit ? '' : 'scan'"
            @click-right-icon="IdcardLoading('bankCodeOCR')"
          />
      <van-field
        class="label_plus"
        name="intentionPrice"
        @blur.prevent="ruleMessge"
        :error-message="errorMsg.intentionPrice"
        :disabled="!edit"
        :border="false"
        v-model="dataList.intentionPrice"
        type="tel"
        required
        clearable
        @blur="checkPrice"
        input-align="right"
        label="意向贷款金额："
        placeholder="请输入"
      >
        <div slot="button">元</div>
      </van-field>
      <van-field
        v-model="dataList.remarks"
        :border="false"
        :disabled="!edit"
        type="textarea"
        placeholder="输入说明"
        rows="1"
        :autosize="autosize"
        class="zh-textarea"
      />
    </Card>

    <!-- <Card style="margin-top: 1rem;">
            <template v-slot:header>
                {{dataList.carInfos.length === 0 ? '新增': ''}}车辆信息
                <div class="card-icon" @click="addVehicle" v-if="dataList.carInfos.length === 0 && edit">
                    <van-icon name="add-o"/>
                </div>
            </template>
            <div>
                <van-swipe-cell :disabled="!edit" v-for="(item, index) in dataList.carInfos" :key="index">
                    <van-cell title="车辆类别:" :border="false"
                              :value="nameToString(returnText(item.carType, 'car_type'), returnText(item.carType2, 'car_type2'))"/>
                    <van-cell title="车辆性质:" :border="false" :value="returnText(item.carNature, 'car_nature')"/>
                    <van-cell title="车辆规格:" :border="false" :value="returnText(item.carSpecifications, 'vehicle_specifications')"/>
                    <van-cell title="车辆来源:" :border="false" :value="returnText(item.carSource, 'CAR_SOURCE')"/>
                    <van-cell title="车辆品牌型号:" :border="false" :value="nameToString(item.brndNm, item.carSeries, item.carModel)"/>
                    <van-cell v-if="item.carNature === 'old_car'" title="车架号:" :border="false" :value="item.chassisNumber"/>
                    <van-cell title="销售价:" v-if="item.carNature === 'new_car'" :border="false" :value="item.salePriceDto">
                        <div slot="right-icon" class="xh-cell-right">元</div>
                    </van-cell>
                    <template v-else-if="item.carNature === 'old_car'">
                        <van-cell title="车牌所在地:" :border="false" :value="item.carLicenseLocation"/>
                        <van-cell title="首次上牌日:" :border="false" :value="item.plateDate"/>
                        <van-cell title="行驶里程:" :border="false" :value="item.roadHaul">
                            <div slot="right-icon" class="xh-cell-right">公里</div>
                        </van-cell>
                        <van-cell title="发动机号:" :border="false" :value="item.engineNum"/>
                    </template>
                    <van-cell title="备注:" :value="item.remark"/>
                    <div slot="right" style="height: 100%">
                        <van-button
                                type="warning"
                                style="height:100%;border-radius: 0;"
                                @click="editCar(item, index)"
                        >修改
                        </van-button>
                        <van-button
                                type="danger"
                                style="height:100%;border-radius: 0;"
                                @click="removeCar(index)"
                        >删除
                        </van-button>
                    </div>
                </van-swipe-cell>
            </div>
    </Card>-->

    <Card style="margin-top: 1rem;" v-if="perInfoList.length > 0 || edit">
      <template v-slot:header>
          {{perInfoList.length > 0 || edit ? '新增' : ''}}查询人
        <div class="card-icon" @click="addPer" v-if="edit">
          <van-icon name="add-o" />
        </div>
      </template>
      <div>
        <van-swipe-cell :disabled="!edit" v-for="(item, index) in perInfoList" :key="index">
          <van-cell title="客户名称:" required :border="false" :value="item.creditPersonName" />
          <van-cell title="证件号码:" required :border="false" :value="item.cpCertificateNum" />
          <van-cell title="电话号码:" required :border="false" :value="item.telephone" />
          <van-cell title="银行卡号:" :border="false" :value="item.bankCardNum" />
          <van-cell
            title="征信对象类型:"
            required
            :value="returnText(item.creditObjectType, 'credit_object_type')"
          />
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
    </Card>
    <!-- 提交按钮 -->
    <div class="xh-submit-box" v-if="edit && !hiddenHandle">
      <van-button
        v-show="canTermin"
        size="large"
        style="width: 25%; flex: none"
        class="xh-btn xh-primary"
        @click="stopTask"
      >终止</van-button>
      <van-button
        size="large"
        @click="nextStepFn"
        :disabled="Boolean(errorMsg.intentionPrice)"
        class="xh-btn"
      >下一步</van-button>
    </div>

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
  </div>
</template>

<script>
import ViewPage from "@/layout/components/ViewPage";
import Card from "@/components/card";
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
    Card
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
      vehicleForm: {
        type: "测试数据"
      },
      vehicle: true,
      loading: false,
      autosize: {
        maxHeight: 100,
        minHeight: 80
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
      this.nextStep().then(query => {
        if(query){
          this.$nextTick(() => {
            this.$router.push({
              path: "/creditNextStep",
              query
            });
          });
        }
      });
      
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
  },
  destroyed() {
    this.save();
  }
};
</script>

<style lang="scss">
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
</style>
