<template>
    <ViewPage :loading="loading">
        <Card>
            <template v-slot:header>
                客户信息
            </template>
            <van-field v-model="form.creditPersonName" :border="false" required clearable input-align="right" label="客户名称："
                       placeholder="请输入客户名称"/>
            <van-field v-model="form.cpCertificateNum" :border="false" required clearable input-align="right" label="证件号码："
                       placeholder="请输入证件号码"/>
            <van-field v-model="form.telephone" :border="false" type="tel" required clearable input-align="right" label="电话号码："
                       placeholder="请输入电话号码"/>
            <van-cell title="征信对象类型:" :border="false" value="借款人"/>
            <van-cell title="银行：" :border="false" required is-link v-model="dataList.investigateBankName" @click="showPickerFn"/>
            <van-field class="label_plus" :border="false" v-model="dataList.intentionPrice" type="tel" required clearable input-align="right" label="意向贷款金额(元)："
                       placeholder="请输入"/>
            <van-field v-model="dataList.remarks" :border="false" type="textarea" placeholder="输入说明" rows="1"
                       :autosize='autosize' class="zh-textarea"/>
        </Card>

        <Card style="margin-top: 10px;" @click.native="addVehicle" v-if="vehicle">
            <template v-slot:header>
                新增车辆信息
                <div class="card-icon">
                    <van-icon name="add-o"/>
                </div>
            </template>
        </Card>
        <Card style="margin-top: 10px;" v-else>
            <template v-slot:header>
                车辆信息
                <div class="card-icon">
                    <van-icon name="add-o"/>
                </div>
            </template>
            <van-cell title="车辆类别:" :border="false" :value="vehicleForm.type"/>
            <van-cell title="车辆性质:" :border="false" :value="vehicleForm.type"/>
            <van-cell title="车辆规格:" :border="false" :value="vehicleForm.type"/>
            <van-cell title="车辆来源:" :border="false" :value="vehicleForm.type"/>
            <van-cell title="车辆品牌型号:" :border="false" :value="vehicleForm.type"/>
            <van-cell title="销售价(元):" :border="false" :value="vehicleForm.type"/>
            <van-cell title="备注:" :border="false" :value="vehicleForm.type"/>
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
  import { getBank, getCreditInfo } from '@/api/credit'
  import { Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast, Notify, SwipeCell } from 'vant';

  const Components = [Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast, Notify, SwipeCell]
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
        },
        vehicleForm: {
          type: '测试数据'
        },
        vehicle: false,
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
        isInternet: '',//是否为人行征信（0：人行征信；1：互联网征信；2：E分期（对应iSiSBC=1）；3：T+0（对应iSiSBC=2）
        perInfoList: [], //客户下面的其他客户数据
        errorMsg: { //必填list
          loanPersonName: '',
          telephone: '',// 手机号码验证
          lpCertificateNum: '',
        },
      }
    },
    methods: {
      selectList () {

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
      showPickerFn () {
        this.showPicker = true;
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
          console.log(this.columns)
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
          const res = await getCreditInfo()
          this.loading = false
          this.dataList = res.data.cuCreditRegister;
          // 判断征信终止按钮隐藏和显示
          if (this.isInternet == '0' && this.dataList.status == "05") {
            this.canTermin = true
          } else {
            this.canTermin = false
          }

          if (this.isInternet != '1') {
            if (this.dataList.isSCICBC == '1') {
              this.isInternet = '2'
            } else if (this.dataList.isSCICBC == '2') {
              this.isInternet = '3'
            }
          }

          if (!this.dataList.isSCICBC) {
            this.dataList.isSCICBC = '0';
          }

          res.data.cuCreditRegister.surDtlList.forEach(e => {
            if (e.creditObjectType == 'borrower') {
              this.form = e;
            } else {
              this.perInfoList.push(e);
            }
          })
          if (!this.form.relation) {
            this.form.relation = '1';
          }
          if (this.form.isSupplement == null || this.form.isSupplement == undefined || this.form.isSupplement == 'undefined') {
            this.form.isSupplement = '0'
          }

        } catch (e) {
          this.loading = false
          console.log(e)
        }
      },
      addVehicle () {
        this.$router.push({
          path: '/vehicle'
        })
      },
      nextStep () {
        this.$router.push({
          path: '/creditNextStep'
        })
      }
    },
    mounted () {
      this.getBank()
      this.getCreditInfo()
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
