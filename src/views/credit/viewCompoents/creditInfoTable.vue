<template>
    <Card>
        <template v-slot:header>
            {{title}}
        </template>
        <div v-for="(item, index) in dataList" :key="index" class="xh-table-border">
            <van-cell title="客户姓名:" :border="false" :value="item.creditPersonName"/>
            <van-cell title="征信结果:" :border="false" :class="[item[type] === 'pass' ? 'xh-pass': 'xh-no-pass']"
                      :value="item.creditResult === 'pass' ? '通过' : '不通过'"/>
            <van-cell title="对象类型:" :border="false" :value="returnText(item.creditObjectType, 'credit_object_type')"/>
            <van-cell title="身份证号:" :border="false" :value="item.cpCertificateNum"/>
            <van-cell title="电话号码:" :border="false" :value="item.telephone"/>
            <van-cell title="征信时间:" :border="false" :value="item.investigateDate"/>
            <!--        <van-cell title="原因:" :value="item.telephone"/>-->
        </div>
    </Card>
</template>

<script>

  import Card from '@/components/card'
  import Vue from 'vue';
  import { getBank, getCreditInfo, saveCreditInfo } from '@/api/credit'
  import { Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast, Notify, SwipeCell, Dialog, Tab, Tabs } from 'vant';

  const Components = [Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast, Notify, SwipeCell, Dialog, Tab, Tabs]
  Components.forEach(item => {
    Vue.use(item)
  })

  export default {
    name: "creditInfoTable",
    components: {
      Card
    },
    props: {
      title: String,
      dataList: {
        default () {
          return []
        }
      },
      type: String
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
    }
  }
</script>

<style>

    .xh-pass .van-cell__value {
        color: #3ECE73;
    }

    .xh-no-pass .van-cell__value {
        color: #C4252A;
    }

</style>
