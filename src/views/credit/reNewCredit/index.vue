<template>
    <ViewPage :loading="loading">
        <Card>
            <template v-slot:header>
                客户信息
            </template>
            <van-cell title="客户名称:" required :border="false" :value="form.creditPersonName"/>
            <van-cell title="证件号码:" required :border="false" :value="form.cpCertificateNum"/>
            <van-cell title="电话号码:" required :border="false" :value="form.telephone"/>
            <van-cell title="征信对象类型:" required :border="false" value="借款人"/>
            <van-cell title="银行：" :disabled="!edit" :border="false" required :is-link="edit" v-model="dataList.investigateBankName" @click="showPickerFn"/>
            <van-field class="label_plus" :disabled="!edit" :border="false" v-model="dataList.intentionPrice" type="tel" required clearable input-align="right" label="意向贷款金额(元)："
                       placeholder="请输入"/>
            <van-field v-model="dataList.remarks" :border="false" :disabled="!edit" type="textarea" placeholder="输入说明" rows="1"
                       :autosize='autosize' class="zh-textarea"/>
        </Card>

        <Card style="margin-top: 1rem;">
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
                    <van-cell v-if="item.carNature === 'new_car'" title="销售价(元):" :border="false" :value="item.salePrice"/>
                    <template v-else-if="item.carNature === 'old_car'">
                        <van-cell title="车牌所在地:" :border="false" :value="item.carLicenseLocation"/>
                        <van-cell title="首次上牌日:" :border="false" :value="item.plateDate"/>
                        <van-cell title="行驶里程（万公里）:" :border="false" :value="item.roadHaul"/>
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
        </Card>


        <Card style="margin-top: 1rem;">
            <template v-slot:header>
                征信客户
                <div class="card-icon" @click="addPer" v-if="edit">
                    <van-icon name="add-o"/>
                </div>
            </template>
            <div>
                <van-swipe-cell :disabled="!edit" v-for="(item, index) in perInfoList" :key="index">
                    <van-cell title="客户名称:" required :border="false" :value="item.creditPersonName"/>
                    <van-cell title="证件号码:" required :border="false" :value="item.cpCertificateNum"/>
                    <van-cell title="电话号码:" required :border="false" :value="item.telephone"/>
                    <van-cell title="征信对象类型:" required :value="returnText(item.creditObjectType, 'credit_object_type')"/>
                    <div slot="right" style="height: 100%">
                        <van-button
                                type="warning"
                                style="height:100%;border-radius: 0;"
                                @click="editPer(item, index)"
                        >修改
                        </van-button>
                        <van-button
                                type="danger"
                                style="height:100%;border-radius: 0;"
                                @click="removePer(index)"
                        >删除
                        </van-button>
                    </div>
                </van-swipe-cell>
            </div>
        </Card>
        <!-- 提交按钮 -->
        <div class="xh-submit-box" v-if="edit">
            <van-button v-show="canTermin" size="large" style="width: 20%;" class="xh-btn"
            >终止
            </van-button>
            <van-button size="large" @click="nextStep"
                        class="xh-btn"
            >下一步
            </van-button>
        </div>

        <van-popup v-model="showPicker" position="bottom" get-container="#app">
            <van-picker
                    show-toolbar
                    :columns="columns"
                    @cancel="showPicker = false"
                    @confirm="onConfirm"
                    @change="onChange"
            />
        </van-popup>
    </ViewPage>
</template>

<script>
  import ViewPage from '@/layout/components/ViewPage';
  import Card from '@/components/card'
  import Vue from 'vue';
  import { getBank, getCreditInfo, saveCreditInfo, createTask } from '@/api/credit'
  import { getValue, setValue, removeValue } from '@/utils/session'
  import { Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast, Notify, SwipeCell, Dialog } from 'vant';

  const Components = [Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast, Notify, SwipeCell, Dialog]
  Components.forEach(item => {
    Vue.use(item)
  })

  export default {
    name: "reNewCredit",
    components: {
      ViewPage,
      Card
    },
    data () {
      return {
        dataList: {
          investigateBank: '',
          investigateBankName: '',
          isInternetCredit: '',
          carInfos: [],
          surDtlList: []
        },
        vehicleForm: {
          type: '测试数据'
        },
        vehicle: true,
        loading: false,
        form: {},
        autosize: {
          maxHeight: 100,
          minHeight: 80
        },
        canTermin: false,
        showPicker: false,
        bankArr: [],//银行数组
        bankList: {},
        columns: [],
        // isInternet: '',//是否为人行征信（0：人行征信；1：互联网征信；2：E分期（对应iSiSBC=1）；3：T+0（对应iSiSBC=2）
        perInfoList: [], //客户下面的其他客户数据
        // errorMsg: { //必填list
        //   loanPersonName: '',
        //   telephone: '',// 手机号码验证
        //   lpCertificateNum: '',
        // },
        rules: {
          intentionPrice: [
            {
              required: true,
              msg: '意向贷款金额未填'
            }
          ],
          investigateBankName: [
            {
              required: true,
              msg: '银行未选'
            }
          ],
        },
        edit: false,
        query: {}
      }
    },
    computed: {
      // 所有字典
      wordbook () {
        return this.$store.state.user.wordbook
      }
    },
    methods: {
      selectList () {

      },
      // 字典转换
      returnText (val, key) {
        let name = '';
        if (this.wordbook[key]) {
          this.wordbook[key].forEach(e => {
            if (e.value === val) {
              name = e.label;
            }
          });
        }
        return name;
      },
      onConfirm (value) {
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
        this.dataList.investigateBank = tempBank.id
        this.dataList.investigateBankName = value[0] + '-' + value[1];
        this.dataList.bankCode = tempBank.bankCode;
      },
      onChange (picker, values) {
        picker.setColumnValues(1, this.bankList[values[0]]);
      },
      async showPickerFn () {
        if(!this.edit) {
          return
        }
        this.showPicker = true;
        try {
          await this.getBank()
          if (this.bankArr.length) {
            this.columns = [
              {
                values: Object.keys(this.bankList),
                className: 'column1'
              },
              {
                values: this.bankList[this.bankArr[0].orgName],
                className: 'column2',
                defaultIndex: 0
              }
            ]
          }
        } catch (e) {
          console.log(e)
        }
      },
      async getBank () {
        try {
          //银行列表
          const res = await getBank()
          this.bankArr = res.data;
          this.bankArr.forEach((item, index) => {
            this.bankList[item.orgName] = item.children.map(e => {
              return e.dsbrPltfrmNm
            })
          })
        } catch (e) {
          console.log(e)
        }
      },
      async getCreditInfo () {
        try {
          this.loading = true
          if (getValue("credit")) {
            this.dataList = JSON.parse(getValue("credit"))
          } else {
            const params = {
              lpCertificateNum: this.query.lpCertificateNum,
              id: this.query.id
            }
            if(this.query.again) {
              params.reRegister = 1
            }
            const res = await getCreditInfo(params)
            this.dataList = res.data.cuCreditRegister;
          }
          this.loading = false

          this.dataList.surDtlList.forEach(e => {
            if (e.creditObjectType === 'borrower') {
              this.form = e;
            } else {
              this.perInfoList.push(e);
            }
          })

          this.initCar()
          this.initCustomerData()

          // 判断征信终止按钮隐藏和显示
          // if (this.isInternet == '0' && this.dataList.status == "05") {
          //   this.canTermin = true
          // } else {
          //   this.canTermin = false
          // }
          //
          // if (this.isInternet != '1') {
          //   if (this.dataList.isSCICBC == '1') {
          //     this.isInternet = '2'
          //   } else if (this.dataList.isSCICBC == '2') {
          //     this.isInternet = '3'
          //   }
          // }
          //
          // if (!this.dataList.isSCICBC) {
          //   this.dataList.isSCICBC = '0';
          // }
          // if (!this.form.relation) {
          //   this.form.relation = '1';
          // }
          // if (this.form.isSupplement == null || this.form.isSupplement == undefined || this.form.isSupplement == 'undefined') {
          //   this.form.isSupplement = '0'
          // }
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      },
      initCar () {
        const carData = this.$store.state.credit.carData
        if (carData) {
          const index = this.$store.state.credit.index
          if (index === -1) {
            this.dataList.carInfos.push(carData)
          } else {
            const carInfo = this.dataList.carInfos[index]
            if (carInfo) {
              for (let key in carData) {
                if (carData.hasOwnProperty(key)) {
                  carInfo[key] = carData[key] || carInfo[key]
                }
              }
            }
          }
          this.$store.dispatch('credit/removeCarData')
        }
      },
      addVehicle () {
        if(!this.edit) {
          return
        }
        const query = {
          customerId: this.dataList.customerId,
          customerNum: this.dataList.perInfo ? this.dataList.perInfo.customerNum : ''
        }
        this.$router.push({
          path: '/vehicle',
          query
        })
      },
      /**
       * 下一步
       **/
      async nextStep () {
        try {
          if (!this.verifyForm()) {
            return
          }
          this.loading = true
          const {data} = await saveCreditInfo(this.dataList)

          const query = {
            customerId: data.customerId,
            customerNum: data.customerNum,
            creditRegisterId: data.creditRegisterId,
            ...this.query
          }
          this.loading = false
          this.$nextTick(() => {
            Toast.success('保存成功')
          })
          this.$nextTick(() => {
            this.$router.push({
              path: '/creditNextStep',
              query
            })
          })
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      },
      /**
       *  删除车
       **/
      removeCar (index) {
        Dialog.confirm({
          title: '标题',
          message: '弹窗内容'
        }).then(() => {
          this.dataList.carInfos.splice(index, 1)
          this.save()
          // on confirm
        }).catch(() => {
          // on cancel
        });
      },
      /**
       *  编辑车辆
       *  @param car
       *  @param index
       **/
      editCar (car, index) {
        const query = {
          customerId: this.dataList.customerId,
          customerNum: this.dataList.perInfo ? this.dataList.perInfo.customerNum : '',
          index: index,
          ...car
        }
        this.$router.push({
          path: '/vehicle',
          query
        })
      },
      addPer () {
        const query = {
          customerId: this.dataList.customerId,
          customerNum: this.dataList.perInfo ? this.dataList.perInfo.customerNum : '',
          credit: true,
        }
        this.$router.push({
          path: '/creatCustomer',
          query
        })
      },
      /**
       *  编辑人员
       *  @param per
       *  @param index
       **/
      editPer (per, index) {
        const query = {
          customerId: this.dataList.customerId,
          customerNum: this.dataList.perInfo ? this.dataList.perInfo.customerNum : '',
          index: index,
          credit: true,
          ...this.unFormatter(per)
        }
        this.$router.push({
          path: '/creatCustomer',
          query
        })
      },
      /**
       *  删除人
       **/
      removePer (index) {
        Dialog.confirm({
          title: '标题',
          message: '弹窗内容'
        }).then(() => {
          this.perInfoList.splice(index, 1)
          // this.save()
          // on confirm
        }).catch(() => {
          // on cancel
        });
      },
      nameToString () {
        return [...arguments].map(item => item).join(' ')
      },
      /**
       * 保存数据到本地
       */
      save () {
        this.dataList.surDtlList = [this.form, ...this.perInfoList]
        setValue("credit", JSON.stringify(this.dataList));
      },
      initCustomerData () {
        let customerData = this.$store.state.credit.customerData
        if (customerData) {
          const index = this.$store.state.credit.index
          customerData = this.enFormatter(customerData)
          if (index === -1) {
            this.perInfoList.push(customerData)
          } else {
            const perInfo = this.perInfoList[index]
            if (perInfo) {
              for (let key in customerData) {
                if (customerData.hasOwnProperty(key)) {
                  perInfo[key] = customerData[key] || perInfo[key]
                }
              }
            }
          }
          this.$store.dispatch('credit/removeCustomerData')
        }
      },
      enFormatter (beanData) {
        return {
          "sex": beanData.sex, //性别
          "creditPersonName": beanData.customerName,//客户姓名
          "cpCertificateNum": beanData.certificateNum,//身份证号码
          "age": beanData.age,//年龄
          "creditObjectType": beanData.creditObjectType,//征信对象类型
          "perInfo": {
            "nationName": beanData.nationName,//民族
            "nation": beanData.nation,//民族
            "birthday": beanData.birthday,//出生日期
            "signOrg": beanData.signOrg//身份证签发机关
          },
          "familyAddress": beanData.familyAddress,//身份证住址
          "startDate": beanData.startDate,//起始日
          "endDate": beanData.endDate,//截止日
          "telephone": beanData.contactPhone//手机号码
        }
      },
      unFormatter (beanData) {
        const perInfo = beanData.perInfo || {}
        return {
          "sex": beanData.sex, //性别
          "birthday": perInfo.birthday,//出生日期
          "customerName": beanData.creditPersonName,//客户姓名
          "certificateNum": beanData.cpCertificateNum,//身份证号码
          "age": beanData.age,//年龄
          "creditObjectType": beanData.creditObjectType,//征信对象类型
          "nationName": perInfo.nationName,//民族
          "nation": perInfo.nation,//
          "familyAddress": beanData.familyAddress,//身份证住址
          "signOrg": perInfo.signOrg,//身份证签发机关
          "startDate": beanData.startDate,//起始日
          "endDate": beanData.endDate,//截止日
          "contactPhone": beanData.telephone//手机号码
        }
      },
      verifyForm () {
        let flag = true
        for (let key in this.rules) {
          if (this.rules.hasOwnProperty(key)) {
            try {
              this.rules[key].forEach(item => {
                if (item.required) {
                  if (!this.dataList[key]) {
                    this.$toast(item.msg || '提示');
                    flag = false
                    throw Error();
                  }
                }
              })
            } catch (e) {
            }
          }
        }
        return flag
      },
    },
    mounted () {
      if(this.$route.query.info && this.$route.query.dealState) {
        this.query = {
          lpCertificateNum: this.$route.query.info.certificateNum,
          id: this.$route.query.info.businesskey
        }
        if(this.$route.query.dealState == 3) {
          this.edit = false
        }
        if(this.$route.query.dealState == 1) {
          this.edit = true
        }
        removeValue("credit");
      } else {
        this.query = this.$route.query
        this.edit = Boolean(this.$route.query.edit) && this.$route.query.edit !== 'false'
      }
      console.log(this.query)
      this.getCreditInfo()
    },
    destroyed () {
      this.save()
    }
  }
</script>

<style>

    .label_plus .van-field__label {
        width: 9rem;
    }

</style>
