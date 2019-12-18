<template>
    <ViewPage :loading="loading">
        <!--        <Card>-->
        <!--            <template v-slot:header>-->
        <!--                电子签约-->
        <!--            </template>-->
        <!--            <electronicContract></electronicContract>-->
        <!--            <electronicContract></electronicContract>-->
        <!--        </Card>-->
        <Card>
            <template v-slot:header>
                征信查询照片
            </template>
            <div class="xh-image-box">
                <div class="xh-box-item">
                    <svg-icon icon-class="user"/>
                    <span>{{mainUser.username}}</span>
                    <span class="xh-user-tag">主借人</span>
                </div>
            </div>
            <imageList :dataList="mainUser.dataList"></imageList>
            <div class="xh-image-box">
                <div class="xh-box-item">
                    <svg-icon icon-class="user"/>
                    <span>{{spouse.username}}</span>
                    <span class="xh-user-tag">主借人配偶</span>
                </div>
            </div>
            <imageList :dataList="spouse.dataList"></imageList>
        </Card>

        <Card style="margin-top: 10px;">
            <template v-slot:header>
                意见描述
            </template>
            <van-field v-model="remarks" :border="false" type="textarea" placeholder="输入说明" rows="1"
                       :autosize='autosize' class="zh-textarea"/>
        </Card>

        <!-- 提交按钮 -->
        <div style="margin: 45px 10px 30px 10px; display: flex; flex-direction: row;">
            <van-button size="large"
                        style="background-color: #C4252A; color: white;margin-left: 3px;border-radius: 8px;flex:1;"
            >提交
            </van-button>
        </div>
    </ViewPage>
</template>

<script>

  import ViewPage from '@/layout/components/ViewPage';
  import Card from '@/components/card';
  import electronicContract from './electronicContract'
  import imageList from '@/components/imageList'
  import { Field, Button } from 'vant'
  import Vue from 'vue'
  import { getDocumentByType } from '@/api/document'

  Vue.use(Field).use(Button)

  export default {
    name: "creditNextStep",
    components: {
      ViewPage,
      Card,
      electronicContract,
      imageList
    },
    data () {
      return {
        loading: false,
        remarks: "",
        autosize: {
          maxHeight: 100,
          minHeight: 80
        },
        mainUser: {
          username: '张三',
          dataList: []
        },
        spouse: {
          username: '李四',
          dataList: []
        },

        dataList: []
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
      async getDocumentByType (documentType, obj) {
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
          obj.dataList.push({
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
          await this.getDocumentByType('0103', this.mainUser)// 主借人授权书
          this.getDocumentByType('0104', this.mainUser)//主借人银行征信授权书
          this.getDocumentByType('2001', this.mainUser)//主借人银行卡正反面

          this.getDocumentByType('0105', this.spouse)//主借人配偶身份证正面
          this.getDocumentByType('0106', this.spouse)//主借人配偶身份证反面
          this.getDocumentByType('0107', this.spouse)//主借人配偶授权书
          this.getDocumentByType('0108', this.spouse)//主借人配偶银行征信授权书
          this.getDocumentByType('2002', this.spouse)//主借人配偶银行卡正反面

          //0120   担保人身份证反面
          //0117   担保人身份证
          //0118   担保人授权书
          //0119   担保人银行征信授权书
          //2005   担保人银行卡正反面

          //2003   共债人银行卡正反面
          //2004   共债人配偶英航卡正反面
          // this.getDocumentByType('0109', this.mainUser)//共债人身份证正面
          // this.getDocumentByType('0110', this.mainUser)//共债人身份证反面
          // this.getDocumentByType('0111', this.mainUser)//共债人授权书
          // this.getDocumentByType('0112', this.mainUser)//共债人银行征信授权书
          // this.getDocumentByType('0113', this.spouse)//共债人配偶身份证正面
          // this.getDocumentByType('0114', this.spouse)//共债人配偶身份证反面
          // this.getDocumentByType('0115', this.spouse)//共债人配偶授权书
          // this.getDocumentByType('0116', this.spouse)//共债人配偶银行征信授权书
        } catch (e) {
          console.log(e)
        }
      },
    },
    mounted () {
      this.initImage()
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

        .xh-user-tag {
            background: #FDF1F0;
            border-radius: 4px;
            padding: .2rem;
            color: #C4252A;
        }
    }

</style>
