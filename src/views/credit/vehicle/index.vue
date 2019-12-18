<template>
    <ViewPage :loading="loading">
        <Card>
            <van-cell title="车辆类别：" :border="false" required is-link value="" @click="showTypePickerFn"/>
            <van-cell title="车辆性质：" :border="false" required>
                <radio v-model="form.property" disabled>
                    <radio-item :label="1">新车</radio-item>
                    <radio-item :label="2">二手车</radio-item>
                </radio>
            </van-cell>
            <van-cell title="车辆来源：" :border="false" required>
                <radio v-model="form.source">
                    <radio-item :label="1">中规车</radio-item>
                    <radio-item :label="2">平行进口车</radio-item>
                </radio>
            </van-cell>
            <van-cell title="车辆规格：" :border="false" required is-link value=""/>
            <van-cell v-if="form.property === 2" title="车架号：" :border="false" required is-link value=""/>
            <van-cell title="车辆品牌型号：" @click="selectBrand" :border="false" required is-link :value="form.brand"/>
            <van-field v-if="form.property === 1" :border="false" v-model="form.creditPersonName" required clearable input-align="right" label="销售价(元)："
                       placeholder="请输入"/>
            <template v-else>
                <van-cell title="车牌所在地：" :border="false" is-link value=""/>
                <van-cell title=" 首次上牌日：" :border="false" is-link value=""/>
                <van-field v-model="form.remarks" :border="false" clearable input-align="right" label="行驶里程（万公里）："
                           placeholder="请输入"/>
                <van-field v-model="form.remarks" :border="false" clearable input-align="right" label="发动机号："
                           placeholder="请输入"/>
            </template>
            <van-field v-model="form.remarks" :border="false" clearable input-align="right" label="备注："
                       placeholder="请输入"/>
        </Card>
        <Card style="margin-top: 10px;" v-if="form.property === 2">
            <template v-slot:header>
                车辆照片
            </template>
            <imageList :dataList="dataList"></imageList>
        </Card>
        <!-- 提交按钮 -->
        <div style="margin-top: 45px; margin-bottom: 30px; display: flex; flex-direction: row;">
            <van-button size="large"
                        style="background-color: #C4252A; color: white;margin-left: 3px;border-radius: 8px;flex:1;"
            >保存
            </van-button>
        </div>
        <transition name="page-move">
            <brand :visible.sync="showBrand" v-if="showBrand" @change="changeBrand"></brand>
        </transition>

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
  import radio from '@/components/radio'
  import imageList from '@/components/imageList'
  import radioItem from '@/components/radio/radioItem'
  import brand from '@/components/carBrand/brand'
  import Vue from 'vue';
  import { getDocumentByType } from '@/api/document'
  import { Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast, Notify } from 'vant';

  const Components = [Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast, Notify]
  Components.forEach(item => {
    Vue.use(item)
  })

  const citys = {
    '浙江': ['杭州', '宁波', '温州', '嘉兴', '湖州'],
    '福建': ['福州', '厦门', '莆田', '三明', '泉州']
  };

  export default {
    name: "vehicle",
    components: {
      ViewPage,
      Card,
      radio,
      radioItem,
      brand,
      imageList
    },
    data () {
      return {
        form: {
          property: 1,
          source: 1,
          brand: ''
        },
        showBrand: false,
        loading: false,
        dataList: [],
        showPicker: false,
        columns: [],
        type2: []
      }
    },
    computed: {
      wordbook () {
        return this.$store.state.user.wordbook
      },
      documentType () {
        let obj = {}
        if (this.wordbook.document_type && this.wordbook.document_type.length) {
          this.wordbook.document_type.forEach(item => {
            obj[item.value] = item
          })
        }
        return obj
      }
    },
    methods: {
      selectBrand () {
        this.showBrand = true
      },
      changeBrand (carBrand) {
        this.form.brand = carBrand.model.name
      },
      async getDocumentByType (documentType) {
        try {
          const params = {
            customerNum: 'KH190531250007',
            documentType: documentType
          }
          const {data} = await getDocumentByType(params)
          const declare = this.documentType[documentType] ? this.documentType[documentType].label : '图片描述'
          data.forEach(item => {
            item.declare = declare;
          })
          this.dataList.push({
            declare: declare,//图片描述
            isRequire: true,//*是否必须
            deletable: true,//是否可以操作-上传和删除
            documentType: documentType,
            customerNum: 'KH190531250007',
            customerId: '190531250007',
            kind: '1',
            fileList: data
          })
        } catch (e) {
          console.log(e)
        }
      },
      async initImage () {
        try {
          await this.getDocumentByType('7777')
          this.getDocumentByType('8888')
          this.getDocumentByType('9999')
        } catch (e) {
          console.log(e)
        }
      },
      onConfirm (value) {
        this.showPicker = false
      },
      onChange (picker, values) {
        picker.setColumnValues(1, this.type2);
      },
      showTypePickerFn() {
        this.showPicker = true
        const keys = this.wordbook.car_type.map(item => item.label)
        this.type2 = this.wordbook.car_type2.map(item => item.label)

        this.columns = [
          {
            values: keys,
            className: 'column1'
          },
          {
            values: this.type2,
            className: 'column2',
            defaultIndex: 0
          }
        ]
      },
      showPickerFn () {
        this.showPicker = true
        this.columns = [
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
    mounted () {
      this.initImage()
      // this.loading = true
    }
  }
</script>

<style scoped>

</style>
