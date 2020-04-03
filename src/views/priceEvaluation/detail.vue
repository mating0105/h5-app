<template>
    <ViewPage :loading="loading">
        <Card style="margin-top: 1rem;">
            <template v-slot:header>
                车辆信息
            </template>
            <van-cell label-class='labelClass' :label="errorMsg.carNature" title="车辆性质：" :border="false" required>
                <radio v-model="carFrom.carNature" :disabled="true">
                    <radio-item :label="item.value" v-for="(item,index) in getTypeList('car_nature')" :key="index">{{item.label}}</radio-item>
                </radio>
            </van-cell>
            <van-cell label-class='labelClass' :label="errorMsg.carType" :required="isdetail == 0?true:false" :border="false"
                      :is-link="isdetail == 0?true:false" title="车辆类别："
                      :disabled="!edit"
                      :value="returnText(carFrom.carType, 'car_type') + ' ' + returnText(carFrom.carType2, 'car_type2')"
                      @click="loadList(9, '车辆类别', carFrom.carType)"/>
            <van-cell label-class='labelClass' :label="errorMsg.carSource" :disabled="!edit" title="车辆来源：" :border="false" required>
                <radio v-model="carFrom.carSource" :disabled="!edit">
                    <radio-item :label="item.value" v-for="(item,index) in getTypeList('CAR_SOURCE')" :key="index">{{item.label}}</radio-item>
                </radio>
            </van-cell>
            <van-cell label-class='labelClass' :label="errorMsg.carSpecifications" :disabled="!edit" :required="isdetail == 0?true:false"
                      :border="false" :is-link="isdetail == 0?true:false" title="车辆规格："
                      :value="returnText(carFrom.carSpecifications, 'vehicle_specifications')" @click="loadList(12, '车辆规格', carFrom.carSpecifications)"/>
            <van-cell title="车辆品牌型号:" :disabled="!edit" :border="false" :value="nameToString(carFrom.brndNm, carFrom.carSeries, carFrom.carModel)"/>
            <van-cell title="车架号:" :disabled="!edit" :border="false" :value="carFrom.chassisNumber"/>
            <template>
                <van-cell label-class='labelClass' :label="errorMsg.carLicenseLocation" title="车牌所在地：" :disabled="!edit" :border="false" @click="show2Fn" required :value="carFrom.carLicenseLocation"/>
                <van-cell label-class='labelClass' :label="errorMsg.plateDate" title=" 首次上牌日：" :disabled="!edit" :border="false" is-link :value="carFrom.plateDate" @click="showDateFn"/>
                <van-field v-model="carFrom.roadHaul" :border="false" clearable input-align="right" label="行驶里程："
                           :disabled="!edit"
                           required
                           :error-message="errorMsg.roadHaul"
                           name="roadHaul"
                           @blur.prevent="ruleMessge"
                           placeholder="请输入">
                    <div slot="button">公里</div>
                </van-field>
                <van-field :disabled="!edit" v-model="carFrom.engineNum" :border="false" clearable input-align="right" label="发动机号："
                           :error-message="errorMsg.engineNum"
                           @blur.prevent="ruleMessge"
                           name="engineNum"
                           placeholder="请输入"/>
            </template>
            <van-field v-model="carFrom.interestLoanAmount" :border="false" clearable input-align="right" label="贷款意向金额："
                        :disabled="!edit"
                        :error-message="errorMsg.interestLoanAmount"
                        name="interestLoanAmount"
                        @blur.prevent="ruleMessge"
                        placeholder="请输入">
                <div slot="button">元</div>
            </van-field>
<!--            <van-field :disabled="!edit" v-model="carFrom.remark" :border="false" clearable input-align="right" label="备注："-->
<!--                       placeholder="请输入"/>-->
            <!--            <van-field class="label_plus" v-model="carFrom.evaluatingPriceDot" :disabled="!edit" :border="false" required clearable input-align="right"-->
            <!--                       label="评估价："-->
            <!--                       @blur="checkAssessmentCar"-->
            <!--                       :error-message="isError ? '贷款金额不能高于评估价7成！' : ''"-->
            <!--                       placeholder="请输入">-->
            <!--                <div slot="button">元</div>-->
            <!--            </van-field>-->
        </Card>

        <Card style="margin-top: 1rem;">
            <template v-slot:header>
                车辆照片
            </template>
            <imageList :dataList="dataList" :view="!edit"></imageList>
        </Card>

        <Card style="margin-top: 1rem;" v-if="isReply">
            <template v-slot:header>
                车辆评估信息
            </template>
            <van-field class="label_plus" v-model="carFrom.evaluatingPriceDot" :disabled="isReplyView" :border="false" required clearable input-align="right"
                       label="评估价："
                       @blur="checkAssessmentCar"
                       placeholder="请输入">
                <div slot="button">元</div>
            </van-field>
            <van-cell title="二手车评估报告：" :border="false"></van-cell>
            <imageList :dataList="dataListReply" :view="isReplyView"></imageList>
        </Card>

        <Card style="margin-top: 1rem;">
            <template v-slot:header>
                备注说明
            </template>
            <van-field :disabled="remarkDisabled()"  v-model="carFrom.remark" :border="false" type="textarea" placeholder="输入说明" rows="1"
                       :autosize='autosize' class="zh-textarea"/>
        </Card>

        <!-- 提交按钮 -->
        <div class="xh-submit-box" v-if="edit">
            <van-button class="xh-btn xh-primary" size="large" style="width: 25%; flex: none"
                        @click="save"
            >保存
            </van-button>
            <van-button size="large" @click="startEvaluate"
                        class="xh-btn"
            >发起二手车评估
            </van-button>
        </div>

        <!-- 提交按钮 -->
        <div class="xh-submit-box" v-if="isReply && !isReplyView">
            <van-button size="large" @click="presentUserCar"
                        class="xh-btn"
            >提交评估结果
            </van-button>
        </div>

        <!-- 弹出选项 -->
        <van-action-sheet v-model="show3" :title="selectName" class="zh-list">
            <div class="zh-list-body">
                <van-button size="large" v-for="i in actions" :key="i.key" class="zh-list-index"
                            :class="isVal == i.key?'zh-main':''" @click="onSelect(i)">{{ i.name }}
                </van-button>
            </div>
        </van-action-sheet>
        <!-- 地图弹框 -->
        <MapSheet :showMap.sync="show2" @getProvince="getProvince"></MapSheet>
        <van-popup v-model="showDate" position="bottom" get-container="#app">
            <van-datetime-picker
                    v-model="currentDate"
                    type="date"
                    @change="changeDate"
                    @confirm="confirm"
                    @cancel="carFrom.plateDate = ''; showDate = false"
            />
        </van-popup>
    </ViewPage>
</template>

<script>
  import ViewPage from '@/layout/components/ViewPage';
  import Card from '@/components/card'
  import imageList from '@/components/imageList'
  import radio from '@/components/radio'
  import radioItem from '@/components/radio/radioItem'
  import MapSheet from "@/components/provinces/index";
  import { getDocumentByType } from '@/api/document'
  import { save, checkAssessmentCar, saveUsedCar, startUserCar, presentUserCar } from "@/api/priceEvaluation";
  import Vue from 'vue';
  import dayjs from 'dayjs'
  import formValidator from '@/mixins/formValidator'
  import { Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast, Notify, ActionSheet, DatetimePicker } from 'vant';

  const Components = [Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast, Notify, ActionSheet, DatetimePicker]
  Components.forEach(item => {
    Vue.use(item)
  })
  export default {
    name: "priceEvaluationDetail",
    mixins: [formValidator],
    components: {
      ViewPage,
      Card,
      imageList,
      radio,
      radioItem,
      MapSheet
    },
    data () {
      return {
        loading: false,
        carFrom: {},
        showMore: false,
        autosize: {
          maxHeight: 100,
          minHeight: 80
        },
        dataList: [],
        dataListReply: [],
        edit: false,
        isError: 0,
        errorMsg: {
          carType: '',//车辆类别
          carType2: '',//车辆类别子项
          carNature: '',//车辆性质未选
          chassisNumber: '',//车辆车架号
          carSource: '',//车辆来源
          carSpecifications: '',//车辆规格
          brndNm: '',//车辆品牌
          engineNum: '',//发动机号
          roadHaul: '',//行驶里程
          plateDate: '',//首次上牌日
          carLicenseLocation: '',//车牌所在地
        },
        isNum: '',
        isVal: '',
        isSelected: false,
        showDate: false,
        currentDate: new Date(),
        show3: false,
        show2: false,
        actions: [],
        selectName: '',
        isdetail: 0,
        isReply: false,
        isReplyView: false,
        imageTypeList: ['6700', '6701', '6702', '6703', '6704', '6705', '6706', '6707', '6708', '6709', '6710', '6711', '6712', '6713', '6714', '6715', '6716', '6717', '6718', '6719', '6720', '6721', '6722', '6723']
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
        this.carFrom = {...this.carFrom, ...this.$route.query}
      },
      async getDocumentByType (documentType, arr) {
        try {
          const params = {
            customerNum: this.$route.query.id,
            documentType: documentType
          }
          const {data} = await getDocumentByType(params)
          const declare = this.documentType[documentType] ? this.documentType[documentType].label : '图片描述'
          data.forEach(item => {
            item.declare = declare;
          })
          let deletable = documentType === '6666' && this.edit
          arr.push({
            declare: declare,//图片描述
            isRequire: documentType === '6666',//*是否必须
            deletable: deletable,//是否可以操作-上传和删除
            documentType: documentType,
            customerNum: this.$route.query.id,
            customerId: this.$route.query.id,
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
          this.imageTypeList.forEach(item => {
            this.getDocumentByType(item, this.dataList)
          })
          // await this.getDocumentByType('7777', this.dataList)//发动机细节
          // await this.getDocumentByType('8888', this.dataList)//车辆内饰
          // await this.getDocumentByType('9999', this.dataList)//车辆外观
          if(this.isReply) {
            this.getDocumentByType('6666', this.dataListReply)//二手车评估报告
          }
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

          this.loading = true
          // await save(this.carFrom)
          await saveUsedCar(this.carFrom)
          this.loading = false
          this.$nextTick(() => {
            Toast.success('保存成功')
          })
          // this.$nextTick(() => {
          //   this.$router.push('/priceEvaluationList')
          // })
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      },
      async checkAssessmentCar () {
        this.priceFloat(this.carFrom, 'evaluatingPriceDot')
        // try {
        //   let params = {
        //     id: this.carFrom.id,
        //     salePriceDto: '',
        //     evaluatingPriceDot: ''
        //   }
        //   if (this.carFrom.carNature === 'old_car') {
        //     params.evaluatingPriceDot = this.carFrom.evaluatingPriceDot
        //   } else {
        //     params.salePriceDto = this.carFrom.salePriceDto
        //   }
        //   if(!params.evaluatingPriceDot && params.evaluatingPriceDot !== 0) {
        //     return
        //   }
        //   const {data} = await checkAssessmentCar(params)
        //   this.isError = data
        // } catch (e) {
        //   console.log(e)
        // }
      },
      loadList (num, name, id) {
        if (!this.edit) {
          return;
        }
        this.isNum = num;
        this.isVal = id;
        this.selectName = name;
        if (!this.isSelected) {
          switch (this.isNum) {
            case 9:
              this.getDicTypes('car_type')
              break;
            case 12:
              this.getDicTypes('vehicle_specifications')
              break
            case 13:
              this.getDicTypes('car_type2')
              break
            default:
              return;
          }
          this.show3 = true;
        }
      },
      getTypeList (key) {
        return this.$store.state.user.wordbook[key] || []
      },
      getDicTypes (key) {
        this.show3 = true
        this.actions = []
        for (let i = 0; i < this.wordbook[key].length; i++) {
          let obj = {};
          obj.name = this.wordbook[key][i].label;
          obj.key = this.wordbook[key][i].value;
          this.actions.push(obj)
        }
      },
      onSelect (item) {
        this.isVal = item.key;
        switch (this.isNum) {
          case 9:
            this.carFrom.carType = item.key;
            this.errorMsg.carType = ''
            break;
          case 12:
            this.carFrom.carSpecifications = item.key;
            this.errorMsg.carSpecifications = ''
            break;
          case 13:
            this.carFrom.carType2 = item.key;
            this.errorMsg.carType2 = ''
            break;
          default:
            return;
        }
        this.show3 = false;
        if (this.isNum == 9) {
          this.loadList(13, '车辆类别', this.carFrom.carType2)
        }
      },
      getProvince (code, name) {
        this.show2 = false
        this.carFrom.carLicenseLocation = name
        this.carFrom.areaCode = code
        this.errorMsg.carLicenseLocation = ''
      },
      changeDate (value) {
        this.carFrom.plateDate = dayjs(this.currentDate).format('YYYY-MM-DD')
        this.errorMsg.plateDate = ''
      },
      confirm (value) {
        this.showDate = false
        this.changeDate(value)
      },
      showDateFn () {
        if (!this.edit) {
          return;
        }
        this.showDate = true
        if (this.carFrom.plateDate) {
          this.currentDate = dayjs(this.carFrom.plateDate).toDate()
        } else {
          this.currentDate = new Date()
        }
      },
      show2Fn () {
        if (!this.edit) {
          return;
        }
        this.show2 = true
      },
      //发起评估
      async startEvaluate(){
        try {
          this.loading = true;
          await saveUsedCar(this.carFrom);
          await startUserCar({id: this.carFrom.id, status: this.carFrom.status})
          this.loading = false
          this.$nextTick(() => {
            Toast.success('发起评估成功')
          })
          this.$nextTick(() => {
            this.$router.push('/priceEvaluationList')
          })
        }catch (e) {
          this.loading = false
          console.log(e)
        }
      },
      async presentUserCar() {
        try {
          if (!this.carFrom.evaluatingPriceDot) {
            this.$toast('车辆评估价未填');
            return
          }
          this.loading = true
          await presentUserCar({id: this.carFrom.id, remark: this.carFrom.remark, evaluatingPriceDot: this.carFrom.evaluatingPriceDot})
          this.loading = false
          this.$nextTick(() => {
            Toast.success('提交评估结果成功')
          })
          this.$nextTick(() => {
            this.$router.push('/priceEvaluationList')
          })
        }catch (e) {
          this.loading = false
          console.log(e)
        }
      },
      remarkDisabled() {
        let flag = false
        if(!this.edit) {
          flag = true
        }

        if(this.isReply) {
          flag = false
        }

        if(this.isReplyView) {
          flag = true
        }
        return flag
      }
    },
    mounted () {
      this.edit = Boolean(this.$route.query.edit) && this.$route.query.edit !== 'false'
      this.isReply = Boolean(this.$route.query.isReply) && this.$route.query.isReply !== 'false'
      this.isReplyView = Boolean(this.$route.query.isReplyView) && this.$route.query.isReplyView !== 'false'
      this.initData()
      this.initImage()
      this.rulesForm("order-credit-old-car-xh")
    }
  }
</script>

<style>
</style>
