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
            <van-cell title="银行：" :border="false" required is-link v-model="dataList.investigateBankName" @click="showPickerFn"/>
            <van-field class="label_plus" :border="false" v-model="dataList.intentionPrice" type="tel" required clearable input-align="right" label="意向贷款金额(元)："
                       placeholder="请输入"/>
            <van-field v-model="dataList.remarks" :border="false" type="textarea" placeholder="输入说明" rows="1"
                       :autosize='autosize' class="zh-textarea"/>
        </Card>

        <Card style="margin-top: 10px;">
            <template v-slot:header>
                车辆信息
                <div class="card-icon" @click="addVehicle" v-if="dataList.carInfos.length === 0">
                    <van-icon name="add-o"/>
                </div>
            </template>
            <div>
                <van-swipe-cell v-for="(item, index) in dataList.carInfos" :key="index">
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


        <Card style="margin-top: 10px;">
            <template v-slot:header>
                新增征信客户
                <div class="card-icon">
                    <van-icon name="add-o"/>
                </div>
            </template>
        </Card>
        <!-- 提交按钮 -->
        <div style="margin: 45px 10px 30px 10px; display: flex; flex-direction: row;">
            <van-button v-show="canTermin" size="large" style="margin-right: 3px;border-radius: 8px;width: 20%;"
            >终止
            </van-button>
            <van-button size="large" @click="nextStep"
                        style="background-color: #C4252A; color: white;margin-left: 3px;border-radius: 8px;flex:1;"
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
  import { getValue, setValue } from '@/utils/session'
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
        // perInfoList: [], //客户下面的其他客户数据
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
        }
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
              lpCertificateNum: this.$route.query.lpCertificateNum,
              id: this.$route.query.id
            }
            const res = await getCreditInfo(params)
            this.dataList = res.data.cuCreditRegister;
          }
          this.loading = false

          this.initCar()

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
          this.dataList.surDtlList.forEach(e => {
            if (e.creditObjectType == 'borrower') {
              this.form = e;
            } else {
              // this.perInfoList.push(e);
            }
          })
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
        if (this.$store.state.credit.carData) {
          const index = this.$store.state.credit.index
          const carData = this.$store.state.credit.carData
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
            ...this.$route.query
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
      nameToString () {
        return [...arguments].map(item => item).join(' ')
      },
      /**
       * 保存数据到本地
       */
      save () {
        setValue("credit", JSON.stringify(this.dataList));
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

    .card-icon {
        color: rgb(196, 37, 42);
        text-align: right;
        float: right;
    }

</style>
