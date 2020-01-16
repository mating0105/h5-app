<template>
    <div>
        <Card>
            <template v-slot:header>
                客户信息
            </template>
            <van-cell title="客户名称:" :border="false" :value="form.creditPersonName"/>
            <van-cell title="证件号码:" :border="false" :value="form.cpCertificateNum"/>
            <van-cell title="电话号码:" :border="false" :value="form.telephone"/>
            <van-cell title="征信对象类型:" :border="false" value="借款人"/>
            <van-cell title="银行：" :border="false" :is-link="edit" v-model="dataList.investigateBankName"/>
            <van-field class="label_plus" :disabled="!edit" :border="false" v-model="dataList.intentionPrice" type="tel" clearable input-align="right"
                       label="意向贷款金额："
                       placeholder="请输入">
                <div slot="button">元</div>
            </van-field>
        </Card>

        <Card style="margin-top: 1rem;" v-if="dataList.carInfos && dataList.carInfos.length">
            <template v-slot:header>
                车辆信息
            </template>
            <div>
                <div class="xh-table-border" v-for="(item, index) in dataList.carInfos" :key="index">
                    <van-cell title="车辆类别:" :border="false"
                              :value="nameToString(returnText(item.carType, 'car_type'), returnText(item.carType2, 'car_type2'))"/>
                    <van-cell title="车辆性质:" :border="false" :value="returnText(item.carNature, 'car_nature')"/>
                    <van-cell title="车辆规格:" :border="false" :value="returnText(item.carSpecifications, 'vehicle_specifications')"/>
                    <van-cell title="车辆来源:" :border="false" :value="returnText(item.carSource, 'CAR_SOURCE')"/>
                    <van-cell title="车辆品牌型号:" :border="false" :value="nameToString(item.brndNm, item.carSeries, item.carModel)"/>
                    <van-cell v-if="item.carNature === 'old_car'" title="车架号:" :border="false" :value="item.chassisNumber"/>
                    <van-cell title="销售价:" v-if="item.carNature === 'new_car'" :border="false" :value="item.salePrice">
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
                </div>
            </div>
        </Card>


        <Card style="margin-top: 1rem;" v-if="perInfoList.length">
            <template v-slot:header>
                征信客户
            </template>
            <div>
                <div class="xh-table-border" v-for="(item, index) in perInfoList" :key="index">
                    <van-cell title="客户名称:" :border="false" :value="item.creditPersonName"/>
                    <van-cell title="证件号码:" :border="false" :value="item.cpCertificateNum"/>
                    <van-cell title="电话号码:" :border="false" :value="item.telephone"/>
                    <van-cell title="征信对象类型:" :value="returnText(item.creditObjectType, 'credit_object_type')"/>
                </div>
            </div>
        </Card>
    </div>
</template>

<script>
  import ViewPage from '@/layout/components/ViewPage';
  import Card from '@/components/card'
  import Vue from 'vue';
  import { Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast, Notify, SwipeCell, Dialog } from 'vant';

  const Components = [Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast, Notify, SwipeCell, Dialog]
  Components.forEach(item => {
    Vue.use(item)
  })

  export default {
    name: "basicInfo",
    components: {
      ViewPage,
      Card
    },
    props: {
      perInfoList: Array,
      form: Object,
      dataList: Object
    },
    data () {
      return {
        edit: false
      }
    },
    computed: {
      // 所有字典
      wordbook () {
        return this.$store.state.user.wordbook
      }
    },
    methods: {
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
      nameToString () {
        return [...arguments].map(item => item).join(' ')
      }
    }
  }
</script>

<style>

</style>
