<template>
    <ViewPage>
        <van-tabs v-model="activeName">
            <van-tab title="做单基本信息" name="1" class="tabBox">
                <div v-show="stepIndex==1">
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
                                <van-cell title="走款模式：" is-link v-model="projectForm.payType"
                                @click="showPopupType('payType')" />
                            </van-cell-group>
                        </div>
                    </Card>
                    
                    <Card style="margin-top:15px;">
                        <template v-slot:header>
                            借款人信息
                        </template>
                        <div>
                            <van-cell-group>
                                <van-cell title="主借人姓名：" required value="张三" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="主借人身份证：" required value="2019-12-03 10:30:30" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="主借人电话：" required value="XH20191203001" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="主借人性别：" is-link v-model="projectForm.payType"
                                @click="showPopupType('payType')" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="主借人年龄：" value="王丹" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="主借人月收入（元）：" value="王丹" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="主借人家庭人数：" value="王丹" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="还款来源：" is-link v-model="projectForm.payType"
                                @click="showPopupType('payType')" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="职务：" is-link v-model="projectForm.payType"
                                @click="showPopupType('payType')" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="户籍地址：" value="王丹" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="户籍详细地址：" value="王丹" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="家庭地址：" value="王丹" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="家庭详细地址：" value="王丹" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="工作单位名称：" value="王丹" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="工作单位地址：" value="王丹" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="工作单位详细地址：" value="王丹" />
                            </van-cell-group>
                        </div>
                    </Card>
                    <Card style="margin-top:15px;">
                        <template v-slot:header>
                            车辆信息
                        </template>
                        <div>
                            <van-cell-group>
                                <van-cell title="车辆类别：" is-link required v-model="projectForm.payType"
                                @click="showPopupType('payType')" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="车辆性质：" is-link required v-model="projectForm.payType"
                                @click="showPopupType('payType')" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="车辆规格：" is-link required v-model="projectForm.payType"
                                @click="showPopupType('payType')" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="车辆来源" is-link required v-model="projectForm.payType"
                                @click="showPopupType('payType')" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="品牌型号：" is-link required v-model="projectForm.payType"
                                @click="showPopupType('payType')" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="实际开票价（元）：" required value="XH20191203001" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="送行车价（元）：" required value="王丹" />
                            </van-cell-group>
                        </div>
                    </Card>
                    <van-button round type="danger" style="width:100%;margin:30px 0;" @click="nextStep">下一步</van-button>
                </div>
                <div v-show="stepIndex==2">
                     <Card>
                        <template v-slot:header>
                            贷款信息
                        </template>
                        <div>
                            <van-cell-group>
                                <van-cell title="贷款金额（元）：" required value="张三" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="刷卡金额（元）：" required value="2019-12-03 10:30:30" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="评估金额（元）：" required required value="XH20191203001" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="贷款产品：" required value="王丹" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="贷款银行：" required value="张三" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="贷款年限：" required value="2019-12-03 10:30:30" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="贷款期数：" required is-link v-model="projectForm.payType"
                                @click="showPopupType('payType')" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="贷款成数：" required value="王丹" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="客户利率：" required value="张三" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="浮息利率：" value="2019-12-03 10:30:30" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="公司收费利率：" required value="XH20191203001" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="保费金额（元）：" value="王丹" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="业务选融费用（元）：" required value="张三" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="资料费（元）：" required value="2019-12-03 10:30:30" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="车款金额合计（元）：" required value="XH20191203001" />
                            </van-cell-group>
                        </div>
                    </Card>
                    <Card style="margin-top:15px;">
                        <template v-slot:header>
                            收款人信息
                        </template>
                        <div>
                            <van-cell-group>
                                <van-cell title="收款人姓名：" required value="刘才军" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="收款人账号：" required value="61201531321453612315" />
                            </van-cell-group>
                            <van-cell-group>
                                <van-cell title="收款人银行：" required value="中国工商银行" />
                            </van-cell-group>
                        </div>
                    </Card>
                    <Card style="margin-top:15px;">
                        <template v-slot:header>
                            意见描述
                        </template>
                        <div>
                            <van-cell-group>
                                <van-field v-model="message" rows="2" autosize type="textarea" maxlength="200" placeholder="请输入留言" show-word-limit/>
                            </van-cell-group>
                        </div>
                    </Card>
                    <Card style="margin-top:15px;">
                        <template v-slot:header>
                            <div style="display:flex;justify-content:space-between;">
                                <p>通知业务员补充资料</p>
                            </div>
                        </template>
                        <!-- title="通知业务员补充资料" -->
                        <van-cell v-model="noticeName" is-link @click="showPopupType('notice')" />
                    </Card>
                    <van-button round type="danger" style="width:100%;margin:30px 0;" @click="nextStep">提交</van-button>
                </div> 
            </van-tab>
            <van-tab title="征信信息" name="2">
                
            </van-tab>
            <van-tab title="审批记录" name="3">
                
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
  import Card from '@/components/card/index';
  import { Tab, Tabs, Row, Col, Cell, CellGroup,Popup,Picker,Button,Field } from 'vant';

  const Components = [Tab, Tabs, Row, Col, Cell, CellGroup,Popup,Picker,Button,Field ]

  Components.forEach(item => {
    Vue.use(item)
  })

  export default {
    name: 'lendProcess',
    components: {
      ViewPage,
      Card,
    },
    computed: {
      ...mapGetters([
        'name'
      ])
    },
    data() {
        return {
            //---tab:0--项目信息
            activeName: "1",
            columns: [],
            projectForm:{},//项目信息
            borrowerForm: {},//借款人信息
            popupShow: false,
            title1:'',
            loading: false,
            payTypeShow: false,//走款模式判断显示，
            stepIndex:1,
            message:'',
            noticeName:'王力-业务员'
        };
    },
    methods: {
        //显示选择弹框
        showPopupType(type) {
            this.popupShow = true
            this.popupSign = type
            switch (type) {
            case 'payType':
                this.title1 = '请选择走款模式'
                this.columns = [
                { text: '快垫', key: '1' },
                { text: '传统', key: '2' }
                ]
                break;
            case 'notice':
                this.title1 = '请选择业务员补充资料'
                this.columns = [
                { text: '张三', key: '1' },
                { text: '李四', key: '2' },
                { text: '王五', key: '3' }
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
        onConfirm(value) {
            this.popupShow = false
            switch (this.popupSign) {
                case 'payType':
                    this.projectForm.payType = value.text;
                    break;
                case 'notice':
                    this.noticeName = value.text;
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
        //下一步
        nextStep(){
            this.stepIndex=2;
        },
        //改变接收人
        changePeople(val){
            console.log(val,'val')

        }
      
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
