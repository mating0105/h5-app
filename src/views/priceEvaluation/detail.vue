<template>
    <ViewPage :loading="loading">
        <Card style="margin-top: 1rem;">
            <template v-slot:header>
                车辆信息
                <div class="card-icon">
                    <van-icon v-if="showMore" name="arrow-up" @click="showMore = !showMore"/>
                    <van-icon v-else name="arrow-down" @click="showMore = !showMore"/>
                </div>
            </template>
            <van-cell v-if="showMore" title="车辆类别:" :border="false"
                      :value="nameToString(returnText(carData.carType, 'car_type'), returnText(carData.carType2, 'car_type2'))"/>
            <van-cell title="车辆性质:" :border="false" :value="returnText(carData.carNature, 'car_nature')"/>
            <van-cell v-if="showMore" title="车辆规格:" :border="false" :value="returnText(carData.carSpecifications, 'vehicle_specifications')"/>
            <van-cell v-if="showMore" title="车辆来源:" :border="false" :value="returnText(carData.carSource, 'CAR_SOURCE')"/>
            <van-cell title="车辆品牌型号:" :border="false" :value="nameToString(carData.brndNm, carData.carSeries, carData.carModel)"/>
            <van-cell title="车架号:" :border="false" :value="carData.chassisNumber"/>
            <van-cell title="车牌所在地:" :border="false" :value="carData.carLicenseLocation"/>
            <van-cell title="首次上牌日:" :border="false" :value="carData.plateDate"/>
            <van-cell title="行驶里程（万公里）:" :border="false" :value="carData.roadHaul"/>
            <van-cell v-if="showMore" title="发动机号:" :border="false" :value="carData.engineNum"/>
            <van-cell v-if="showMore" title="备注:" :value="carData.remark"/>
            <van-field v-model="carData.evaluatingPrice" :disabled="!edit" :border="false" required clearable input-align="right" label="评估价（元）："
                       @blur="checkAssessmentCar"
                       :error-message="isError ? '贷款金额不能高于评估价7成！' : ''"
                       placeholder="请输入"/>
        </Card>

        <Card style="margin-top: 1rem;">
            <template v-slot:header>
                车辆照片
            </template>
            <imageList :dataList="dataList" :view="true"></imageList>
        </Card>

        <!--        <Card style="margin-top: 1rem;" v-if="edit">-->
        <!--            <template v-slot:header>-->
        <!--                意见描述-->
        <!--            </template>-->
        <!--            <van-field v-model="carData.evaluatingComm" :border="false" type="textarea" placeholder="输入说明" rows="1"-->
        <!--                       :autosize='autosize' class="zh-textarea"/>-->
        <!--        </Card>-->

        <!-- 提交按钮 -->
        <div class="xh-submit-box" v-if="edit">
            <van-button class="xh-btn" size="large" :disabled="!carData.evaluatingPrice || Boolean(isError)"
                        @click="save"
            >保存
            </van-button>
        </div>
    </ViewPage>
</template>

<script>
  import ViewPage from '@/layout/components/ViewPage';
  import Card from '@/components/card'
  import imageList from '@/components/imageList'
  import { getDocumentByType } from '@/api/document'
  import { save, checkAssessmentCar } from "@/api/priceEvaluation";
  import Vue from 'vue';
  import { Cell, CellGroup, Field, Icon, Button, Toast, Notify } from 'vant';

  const Components = [Cell, CellGroup, Field, Icon, Button, Toast, Notify]
  Components.forEach(item => {
    Vue.use(item)
  })
  export default {
    name: "priceEvaluationDetail",
    components: {
      ViewPage,
      Card,
      imageList
    },
    data () {
      return {
        loading: false,
        carData: {},
        showMore: false,
        autosize: {
          maxHeight: 100,
          minHeight: 80
        },
        dataList: [],
        edit: false,
        isError: 0
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
        this.carData = {...this.carData, ...this.$route.query}
      },
      async getDocumentByType (documentType) {
        try {
          const params = {
            customerNum: this.$route.query.customerNum,
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
            deletable: false,//是否可以操作-上传和删除
            documentType: documentType,
            customerNum: this.$route.query.customerNum,
            customerId: this.$route.query.customerId,
            kind: '1',
            fileList: data
          })
        } catch (e) {
          console.log(e)
        }
      },
      /**
       * 获取图片
       **/
      async initImage () {
        try {
          await this.getDocumentByType('7777')//发动机细节
          this.getDocumentByType('8888')//车辆内饰
          this.getDocumentByType('9999')//车辆外观
        } catch (e) {
          console.log(e)
        }
      },
      /**
       * 保存详情
       * @return {Promise<void>}
       */
      async save () {
        try {
          if (!this.carData.evaluatingPrice) {
            this.$toast('车辆评估价未填');
            return
          }
          this.loading = true
          await save(this.carData)
          this.loading = false
          this.$nextTick(() => {
            Toast.success('保存成功')
          })
          this.$nextTick(() => {
            this.$router.push('/priceEvaluationList')
          })
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      },
      async checkAssessmentCar () {
        try {
          let params = {
            id: this.carData.id,
            salePrice: '',
            evaluatingPrice: ''
          }
          if (this.carData.carNature === 'old_car') {
            params.evaluatingPrice = this.carData.evaluatingPrice
          } else {
            params.salePrice = this.carData.salePrice
          }
          if(!params.evaluatingPrice && params.evaluatingPrice !== 0) {
            return
          }
          const {data} = await checkAssessmentCar(params)
          this.isError = data
        } catch (e) {
          console.log(e)
        }
      }
    },
    mounted () {
      this.initData()
      this.initImage()
      this.edit = Boolean(this.$route.query.edit) && this.$route.query.edit !== 'false'
    }
  }
</script>

<style scoped>


</style>
