<template>
    <ViewPage>
        <Card>
            <template v-slot:header>
                客户信息
            </template>
            <van-cell-group>
                <van-field v-model="form.creditPersonName" required clearable input-align="right" label="客户名称："
                           placeholder="请输入客户名称"/>
            </van-cell-group>
            <van-cell-group>
                <van-field v-model="form.cpCertificateNum" required clearable input-align="right" label="证件号码："
                           placeholder="请输入证件号码"/>
            </van-cell-group>
            <van-cell-group>
                <van-field v-model="form.telephone" type="tel" required clearable input-align="right" label="电话号码："
                           placeholder="请输入电话号码"/>
            </van-cell-group>
            <van-cell-group>
                <van-cell title="征信对象类型:" value="借款人"/>
            </van-cell-group>
            <van-cell-group>
                <van-cell title="银行：" required is-link v-model="form.bank" @click="showPickerFn"/>
            </van-cell-group>
            <van-cell-group>
                <van-field class="label_plus" v-model="form.telephone" type="tel" required clearable input-align="right" label="意向贷款金额(元)："
                           placeholder="请输入"/>
            </van-cell-group>
            <van-cell-group>
                <van-field v-model="dataList.remarks" type="textarea" placeholder="输入说明" rows="1"
                           :autosize='autosize' class="zh-textarea"/>
            </van-cell-group>
        </Card>
        <Card style="margin-top: 10px;">
            <template v-slot:header>
                新增车辆信息
                <div class="card-icon">
                    <van-icon name="add-o"/>
                </div>
            </template>
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
        <div style="margin-top: 45px;display: flex; flex-direction: row;">
            <van-button v-show="canTermin == 'true'" size="large" style="margin-right: 3px;border-radius: 8px;width: 20%;"
            >终止
            </van-button>
            <van-button size="large"
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
            />
        </van-popup>
    </ViewPage>
</template>

<script>
  import ViewPage from '@/layout/components/ViewPage';
  import Card from '@/components/card'
  import Vue from 'vue';
  import { getBank } from '@/api/credit'
  import { Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast } from 'vant';

  const Components = [Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast]
  Components.forEach(item => {
    Vue.use(item)
  })

  const citys = {
    '浙江': ['杭州', '宁波', '温州', '嘉兴', '湖州'],
    '福建': ['福州', '厦门', '莆田', '三明', '泉州']
  };

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
        form: {},
        autosize: {
          maxHeight: 100,
          minHeight: 80
        },
        canTermin: false,
        showPicker: false,
        bankArr: [],//银行数组
        bankList: {},
        columns: [
          {
            values: Object.keys(citys),
            className: 'column1'
          },
          {
            values: citys['浙江'],
            className: 'column2',
            defaultIndex: 2
          }
        ]
      }
    },
    methods: {
      selectList () {

      },
      onConfirm () {
        this.showPicker = false;
      },
      showPickerFn() {
        this.showPicker = true;
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
      },
      async getBank () {
        try {
          //银行列表
          const res = await getBank()
          this.bankArr = res.data.data;
          this.bankArr.forEach((item, index) => {
            this.bankList[item.orgName] = item.children.map(e => {
              return e.dsbrPltfrmNm
            })
          })
        } catch (e) {
          console.log(e)
        }
      }
    },
    mounted () {
        // this.getBank()
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
