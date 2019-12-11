<template>
    <ViewPage>
        <van-tabs v-model="active">
            <van-tab title="做单基本信息" class="tabBox">
                <Card>
                    <template v-slot:header>
                        项目信息
                    </template>
                    <div>
                        <van-cell-group>
                            <van-cell title="业务员：" value="张三" />
                        </van-cell-group>
                        <van-cell-group>
                            <van-cell title="报单时间：" value="2019-12-03 10:30:30" />
                        </van-cell-group>
                        <van-cell-group>
                            <van-cell title="垫款编号：" value="XH20191203001" />
                        </van-cell-group>
                        <van-cell-group>
                            <van-cell title="制单人员：" value="王丹" />
                        </van-cell-group>
                        <van-cell-group>
                            <van-cell title="走款模式：" is-link v-model="chineseForm.pyfMod"
                            @click="showPopupType('pyfMod')" />
                        </van-cell-group>
                    </div>
                </Card>
            </van-tab>
            <van-tab title="征信信息">
                
            </van-tab>
            <van-tab title="审批记录">
                
            </van-tab>
        </van-tabs>

        <!-- piker选择器 -->
        <van-popup position="bottom" :overlay="true" v-model="popupShow">
            <van-picker show-toolbar :title="title1" :columns="columns" :loading="loading" @cancel="onCancel"
            @confirm="onConfirm" />
        </van-popup>
    </ViewPage>
</template>

<script>
  import Vue from 'vue';
  import { mapGetters } from 'vuex'
  import ViewPage from '@/layout/components/ViewPage';
  import Card from '@/components/card/index'
  import { Tab, Tabs, Row, Col, Cell, CellGroup,Popup,Picker  } from 'vant';

  const Components = [Tab, Tabs, Row, Col, Cell, CellGroup,Popup,Picker ]

  Components.forEach(item => {
    Vue.use(item)
  })

  export default {
    name: 'lendProcess',
    components: {
      ViewPage,
      Card
    },
    computed: {
      ...mapGetters([
        'name'
      ])
    },
    data() {
        return {
            active: 0,
            columns: [],
            show:1,
            chineseForm: {},
            popupShow: false,
            title1:'',
            loading: false,
        };
    },
    methods: {
        //显示选择弹框
        showPopupType(type) {
            this.popupShow = true
            this.popupSign = type
            switch (type) {
            case 'pyfMod':
                this.title1 = '请选择缴费方式'
                this.columns = [
                { text: '现金', key: '1' },
                { text: '转账', key: '2' }
                ]
                break;
            case 'payType':
                this.title1 = '请选择走款模式'
                this.columns = [
                { text: '刷卡', key: '1' },
                { text: '转账', key: '2' }
                ]
                break;
            case 'payWay':
                this.title1 = '请选择走款类型'
                this.columns = [
                { text: '对私账户', key: '1' },
                { text: '对公账户', key: '0' }
                ]
                break;
            case 'payeeFullName':
                this.title1 = '请选择收款人名称'
                this.columns = [];
                console.log(this.form.cost.payWay);
                if (this.form.cost.payWay == 1) {
                this.payee.forEach(e => {
                    this.columns.push({
                    text: e.rcvpymtpsNm,
                    rcvpymtpsAcc: e.rcvpymtpsAcc,
                    rppdbnk: e.rppdbnk
                    })
                })
                } else {
                this.payeePublic.forEach(e => {
                    this.columns.push({
                    text: e.rcvpymtpsNm,
                    rcvpymtpsAcc: e.rcvpymtpsAcc,
                    rppdbnk: e.rppdbnk
                    })
                })
                }
            }
        },
        onCancel() {
            this.popupShow = false
        },
        // 费用合计=实收车商+上户保证金+履约保证金+异地上户费+公证费+综合服务费+调查费+评估费+GPS费用
        addCount() {
            let estimateCharges = parseFloat(this.form.cost.estimateCharges) || 0 // 评估费
            let investigateCharges = parseFloat(this.form.cost.investigateCharges) || 0 //调查费
            let gpsCharges = parseFloat(this.form.cost.gpsCharges) || 0 //GPS费用
            let agreeBail = parseFloat(this.form.cost.agreeBail) || 0//履约保证金
            let collectCarDealer = parseFloat(this.form.cost.collectCarDealer) || 0//实收车商
            let notarialFees = parseFloat(this.form.cost.notarialFees) || 0//公证费
            let allopatryCharges = parseFloat(this.form.cost.allopatryCharges) || 0//异地上户费
            let colligateCharges = parseFloat(this.form.cost.colligateCharges) || 0//综合服务费
            // let srchrgUse = parseFloat(this.form.cost.srchrgUse) || 0//附加费用
            let doolBail = parseFloat(this.form.cost.doolBail) || 0//上户保证金
            // let rentingAmtGps = parseFloat(this.form.proj.rentingAmtGps) || 0//加融金额(含GPS加融费用)
            return estimateCharges + investigateCharges + agreeBail + collectCarDealer + notarialFees + allopatryCharges + colligateCharges + doolBail + gpsCharges;
        },
        actualCount() {
            let dcnAmt = parseFloat(this.form.cost.dcnAmt) || 0
            return this.addCount - dcnAmt;
        },
        onConfirm(value) {
            this.popupShow = false
            switch (this.popupSign) {
            case 'pyfMod':
                this.form.cost.pyfMod = value.key;
                this.chineseForm.pyfMod = value.text
                break;
            case 'payType':
                this.form.cost.payType = value.key;
                this.chineseForm.payType = value.text
                if (this.form.cost.payType == '1') {
                this.payTypeShow = false
                } else {
                this.payTypeShow = true
                }
                break;
            case 'payWay':
                this.form.cost.payWay = value.key;
                this.chineseForm.payWay = value.text
                this.form.cost.payeeFullName = '';
                this.form.cost.payeeBank = '';
                this.form.cost.payeeAccount = '';
                break;
            case 'payeeFullName':
                this.form.cost.payeeFullName = value.text;
                this.form.cost.payeeBank = value.rppdbnk;
                this.form.cost.payeeAccount = value.rcvpymtpsAcc
            }
        },
      
    },
    mounted () {
    }
  }
</script>

<style scoped>
.tabBox{
    padding: 10px 10px;
}
.rowBox{
    margin: 10px 0;
}
   
</style>
