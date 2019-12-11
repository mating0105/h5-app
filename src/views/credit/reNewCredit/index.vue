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
                <van-cell title="银行：" required is-link v-model="form.bank"/>
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
    </ViewPage>
</template>

<script>
  import ViewPage from '@/layout/components/ViewPage';
  import Card from '@/components/card'
  import Vue from 'vue';
  import { Cell, CellGroup, Field, Icon, Button } from 'vant';

  Vue.use(Cell).use(CellGroup).use(Field).use(Icon).use(Button);

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
        canTermin: false
      }
    },
    methods: {
      selectList () {

      }
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
