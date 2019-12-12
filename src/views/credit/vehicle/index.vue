<template>
    <ViewPage>
        <Card>
            <van-cell-group>
                <van-cell title="车辆类别：" required is-link value="" />
            </van-cell-group>
            <van-cell-group>
                <van-cell title="车辆性质：" required>
                    <radio v-model="form.property">
                        <radio-item :label="1">新车</radio-item>
                        <radio-item :label="2">二手车</radio-item>
                    </radio>
                </van-cell>
            </van-cell-group>
            <van-cell-group>
                <van-cell title="车辆来源：" required>
                    <radio></radio>
                </van-cell>
            </van-cell-group>
            <van-cell-group>
                <van-cell title="车辆规格：" required is-link value="" />
            </van-cell-group>
            <van-cell-group>
                <van-cell title="车辆品牌型号：" required is-link value="" />
            </van-cell-group>
            <van-cell-group>
                <van-field v-model="form.creditPersonName" required clearable input-align="right" label="销售价(元)："
                           placeholder="请输入"/>
            </van-cell-group>
            <van-cell-group>
                <van-field v-model="form.remarks" required clearable input-align="right" label="备注："
                           placeholder="请输入"/>
            </van-cell-group>
        </Card>
    </ViewPage>
</template>

<script>
  import ViewPage from '@/layout/components/ViewPage';
  import Card from '@/components/card'
  import radio from '@/components/radio'
  import radioItem from '@/components/radio/radioItem'
  import Vue from 'vue';
  import { Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast, Notify } from 'vant';

  const Components = [Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast, Notify]
  Components.forEach(item => {
    Vue.use(item)
  })

  export default {
    name: "vehicle",
    components: {
      ViewPage,
      Card,
      radio,
      radioItem
    },
    data () {
      return {
        form: {
          property: 1
        }
      }
    }
  }
</script>

<style scoped>

</style>
