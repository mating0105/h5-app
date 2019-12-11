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
                           placeholder="请输入证件号码" disabled/>
            </van-cell-group>
        </Card>
    </ViewPage>
</template>

<script>
  import ViewPage from '@/layout/components/ViewPage';
  import Card from '@/components/card'
  import Vue from 'vue';
  import { Cell, CellGroup, Field } from 'vant';

  Vue.use(Cell).use(CellGroup).use(Field);

  let SubDicForText = function (type, judgeItem) {
    var list = creditTypeList;
    if (judgeItem == '' || judgeItem == undefined || judgeItem == null) {
      return;
    }
    for (var i = 0; i < list.length; i++) {
      if (judgeItem.toString() == list[i].key) {
        return list[i].text;
      }
    }
  }

  let creditTypeList = [
    {text: '担保人', key: 'security'},
    {text: '借款人', key: 'borrower'},
    {text: '借款人配偶', key: 'borrowerSpouse'},
    {text: '共债人', key: 'joiDebtor'},
    {text: '共债人配偶', key: 'joiDebtorSpouse'}
  ]
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
        SubDicForText,
        isInternet: '0',//是否为人行征信（0：人行征信；1：互联网征信；2：E分期（对应iSiSBC=1）；3：T+0（对应iSiSBC=2）

      }
    },
    methods: {
      selectList () {

      }
    }
  }
</script>

<style scoped>

</style>
