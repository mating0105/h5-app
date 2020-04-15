<template>
    <div>
<!--        <Card>-->
<!--            <template v-slot:header>-->
<!--                客户信息-->
<!--            </template>-->
<!--            <van-cell title="客户名称:" :border="false" :value="form.creditPersonName"/>-->
<!--            <van-cell title="证件号码:" :border="false" :value="form.cpCertificateNum"/>-->
<!--            <van-cell title="电话号码:" :border="false" :value="form.telephone"/>-->
<!--            <van-cell title="征信对象类型:" :border="false" value="借款人"/>-->
<!--            <van-cell title="银行：" :border="false" :is-link="edit" v-model="dataList.investigateBankName"/>-->
<!--            <van-cell title="银行卡号：" :border="false" :is-link="edit" v-model="form.bankCardNum"/>-->
<!--            <van-field class="label_plus" :disabled="edit" :border="false" v-model="dataList.intentionPrice" type="tel" clearable input-align="right"-->
<!--                       label="意向贷款金额："-->
<!--                       placeholder="请输入">-->
<!--                <div slot="button">元</div>-->
<!--            </van-field>-->
<!--        </Card>-->

<!--        &lt;!&ndash; <Card style="margin-top: 1rem;" v-if="dataList.carInfos && dataList.carInfos.length">-->
<!--            <template v-slot:header>-->
<!--                车辆信息-->
<!--            </template>-->
<!--            <div>-->
<!--                <div class="xh-table-border" v-for="(item, index) in dataList.carInfos" :key="index">-->
<!--                    <van-cell title="车辆类别:" :border="false"-->
<!--                              :value="nameToString(returnText(item.carType, 'car_type'), returnText(item.carType2, 'car_type2'))"/>-->
<!--                    <van-cell title="车辆性质:" :border="false" :value="returnText(item.carNature, 'car_nature')"/>-->
<!--                    <van-cell title="车辆规格:" :border="false" :value="returnText(item.carSpecifications, 'vehicle_specifications')"/>-->
<!--                    <van-cell title="车辆来源:" :border="false" :value="returnText(item.carSource, 'CAR_SOURCE')"/>-->
<!--                    <van-cell title="车辆品牌型号:" :border="false" :value="nameToString(item.brndNm, item.carSeries, item.carModel)"/>-->
<!--                    <van-cell v-if="item.carNature === 'old_car'" title="车架号:" :border="false" :value="item.chassisNumber"/>-->
<!--                    <van-cell title="销售价:" v-if="item.carNature === 'new_car'" :border="false" :value="item.salePriceDto">-->
<!--                        <div slot="right-icon" class="xh-cell-right">元</div>-->
<!--                    </van-cell>-->
<!--                    <template v-else-if="item.carNature === 'old_car'">-->
<!--                        <van-cell title="车牌所在地:" :border="false" :value="item.carLicenseLocation"/>-->
<!--                        <van-cell title="首次上牌日:" :border="false" :value="item.plateDate"/>-->
<!--                        <van-cell title="行驶里程:" :border="false" :value="item.roadHaul">-->
<!--                            <div slot="right-icon" class="xh-cell-right">公里</div>-->
<!--                        </van-cell>-->
<!--                        <van-cell title="发动机号:" :border="false" :value="item.engineNum"/>-->
<!--                    </template>-->
<!--                    <van-cell title="备注:" :value="item.remark"/>-->
<!--                </div>-->
<!--            </div>-->
<!--        </Card> &ndash;&gt;-->


<!--        <Card style="margin-top: 1rem;" v-if="perInfoList.length">-->
<!--            <template v-slot:header>-->
<!--                征信客户-->
<!--            </template>-->
<!--            <div>-->
<!--                <div class="xh-table-border" v-for="(item, index) in perInfoList" :key="index">-->
<!--                    <van-cell title="客户名称:" :border="false" :value="item.creditPersonName"/>-->
<!--                    <van-cell title="证件号码:" :border="false" :value="item.cpCertificateNum"/>-->
<!--                    <van-cell title="电话号码:" :border="false" :value="item.telephone"/>-->
<!--                    <van-cell title="征信对象类型:" :value="returnText(item.creditObjectType, 'credit_object_type')"/>-->
<!--                </div>-->
<!--            </div>-->
<!--        </Card>-->

        <Card v-if="showImage">
            <template v-slot:header>
                {{nameFormatter()}}征信查询照片
            </template>
            <div v-for="(item, index) in dataList.surDtlList" :key="index">
                <div class="xh-image-box">
                    <div class="xh-box-item">
                        <svg-icon icon-class="user"/>
                        <span>{{item.creditPersonName}}</span>
                        <span class="xh-danger-tag">{{returnText(item.creditObjectType, 'credit_object_type')}}</span>
                    </div>
                </div>
                <imageList :dataList="item.dataList" :view="!edit" :isGroup="true"></imageList>
            </div>
        </Card>
    </div>
</template>

<script>
  import ViewPage from '@/layout/components/ViewPage';
  import Card from '@/components/card'
  import Vue from 'vue';
  import { getDocumentByType } from '@/api/document'
  import imageList from '@/components/imageList'
  import { Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast, Notify, SwipeCell, Dialog } from 'vant';

  const Components = [Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast, Notify, SwipeCell, Dialog]
  Components.forEach(item => {
    Vue.use(item)
  })

  const bigData = {
    joiDebtorSpouse: ['CUIDA04', 'CUIDB04', 'CRDBIGA04', 'CUDRV04', 'CUCARD14', 'CRDOTH04'],//共债人配偶
    borrowerSpouse: ['CUIDA02', 'CUIDB02', 'CRDBIGA02', 'CUDRV02', 'CUCARD12', 'CRDOTH02'],//借款人配偶
    security: ['CUIDA05', 'CUIDB05', 'CRDBIGA05', 'CUDRV05', 'CUCARD15', 'CRDOTH05'],//担保人
    borrower: ['CUIDA01', 'CUIDB01', 'CRDBIGA01', 'CUDRV01', 'CUCARD11', 'CRDOTH01'],//借款人
    joiDebtor: ['CUIDA03', 'CUIDB03', 'CRDBIGA03', 'CUDRV03', 'CUCARD13', 'CRDOTH03'],//共债人
  }
  const rb = {
    joiDebtorSpouse: ['CUIDA04', 'CUIDB04', 'CRDPICCA04', 'CUDRV04', 'CUCARD14', 'CRDOTH04'],//共债人配偶
    borrowerSpouse: ['CUIDA02', 'CUIDB02', 'CRDPICCA02', 'CUDRV02', 'CUCARD12', 'CRDOTH02'],//借款人配偶
    security: ['CUIDA05', 'CUIDB05', 'CRDPICCA05', 'CUDRV05', 'CUCARD15', 'CRDOTH05'],//担保人
    borrower: ['CUIDA01', 'CUIDB01', 'CRDPICCA01', 'CUDRV01', 'CUCARD11', 'CRDOTH01'],//借款人
    joiDebtor: ['CUIDA03', 'CUIDB03', 'CRDPICCA03', 'CUDRV03', 'CUCARD13', 'CRDOTH03'],//共债人
  }
  const rg = {
    joiDebtorSpouse: ['CUIDA04', 'CUIDB04', 'CRDMANA04', 'CUDRV04', 'CUCARD14', 'CRDOTH04'],//共债人配偶
    borrowerSpouse: ['CUIDA02', 'CUIDB02', 'CRDMANA02', 'CUDRV02', 'CUCARD12', 'CRDOTH02'],//借款人配偶
    security: ['CUIDA05', 'CUIDB05', 'CRDMANA05', 'CUDRV05', 'CUCARD15', 'CRDOTH05'],//担保人
    borrower: ['CUIDA01', 'CUIDB01', 'CRDMANA01', 'CUDRV01', 'CUCARD11', 'CRDOTH01'],//借款人
    joiDebtor: ['CUIDA03', 'CUIDB03', 'CRDMANA03', 'CUDRV03', 'CUCARD13', 'CRDOTH03'],//共债人
  }

  export default {
    name: "basicInfo",
    components: {
      ViewPage,
      Card,
      imageList
    },
    props: {
      perInfoList: Array,
      form: Object,
      dataList: Object,
      edit: Boolean,
      bigData: Boolean,
      rbCredit: Boolean,
      rgCredit:Boolean,
      showImage: {
        default: true,
        type: Boolean
      }
    },
    data () {
      return {
        users: [],
        obj: {
          joiDebtorSpouse: ['CRDPICCA04', 'CUDRV04', 'CUCARD14', 'CRDOTH04'],//共债人配偶
          borrowerSpouse: ['CRDPICCA02', 'CUDRV02', 'CUCARD12', 'CRDOTH02'],//借款人配偶
          security: ['CRDPICCA05', 'CUDRV05', 'CUCARD15', 'CRDOTH05'],//担保人
          borrower: ['CRDPICCA01', 'CUDRV01', 'CUCARD11', 'CRDOTH01'],//借款人
          joiDebtor: ['CRDPICCA03', 'CUDRV03', 'CUCARD13', 'CRDOTH03'],//共债人
        },
        whiteList: ['CRDPICCA01', 'CUIDA04', 'CUIDA02', 'CUIDA05', 'CUIDA01', 'CUIDA03', 'CRDBIGA01', 'CUIDB04', 'CUIDB02', 'CUIDB05', 'CUIDB01', 'CUIDB03','CRDMANA01','CRDMANA02','CRDMANA03','CRDMANA04','CRDMANA05'],
        surDtlList: [],
        isIdCard: ['CUIDA01', 'CUIDB01', 'CUIDA02', 'CUIDB02', 'CUIDB05', 'CUIDA05', 'CUIDA03', 'CUIDB03', 'CUIDA04', 'CUIDB04']//身份证分类
      }
    },
    watch: {
      dataList (val) {
        this.$nextTick(() => {
          this.initData()
        })
      }
    },
    computed: {
      // 所有字典
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
      nameFormatter() {
        let name = '';
        if(this.bigData) {
          name = '大数据'
        } else if (this.rbCredit) {
          name = '人保'
        }else if(this.rgCredit){
           name = '人工'
        }
        return name
      },
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
      },
      initData () {
        if (this.dataList && this.dataList.surDtlList) {
          if (this.bigData) {
            this.obj = bigData
          } else if(this.rbCredit){
            this.obj = rb
          }else if(this.rgCredit){
            this.obj = rg
          }
          this.dataList.surDtlList.forEach(item => {
            const arr = this.obj[item.creditObjectType]
            arr.forEach(i => {
              this.getDocumentByType(i, item, this.dataList)
            })
          })
        }
      },
      /**
       * 获取文档
       */
      async getDocumentByType (documentType, obj, dataList) {
        try {
          const customerNum = dataList.perInfo ? dataList.perInfo.customerNum : ''
          const params = {
            customerNum,
            documentType: documentType
          }
          const declare = this.documentType[documentType] ? this.documentType[documentType].label : '图片描述'

          const isRequire = this.whiteList.includes(documentType)
          const beanData = {
            declare: declare,//图片描述
            isRequire: isRequire,//*是否必须
            deletable: true,//是否可以操作-上传和删除
            documentType: documentType,
            customerNum,
            customerId: dataList.customerId,
            kind: '1',
            fileList: [],
            title: this.isIdCard.includes(documentType) ? '身份证': '其他'
          }
          obj.dataList.push(beanData)
          const {data} = await getDocumentByType(params)
          data.forEach(item => {
            item.declare = declare;
          })
          beanData.fileList = data
        } catch (e) {
          console.log(e)
        }
      },
    }
  }
</script>

<style scoped lang="scss">

    .xh-image-box {
        padding: 0 1rem 0 1rem;

        &:first-child {
            padding-top: 1rem;
        }

        .xh-box-item {
            margin-bottom: .5rem;

            &:last-child {
                margin-bottom: 0;
            }

            span {
                display: inline-block;
            }

            span:nth-of-type(1) {
                margin: 0 .5rem;
            }
        }
    }

</style>
