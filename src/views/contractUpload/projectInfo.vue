<template>
  <!-- <ViewPage :loading="loading"> -->
    <div class="projectInfo">
      <Card>
        <template v-slot:header>
          签约人信息
        </template>
        <div class="userInfoBox">
          <div class="userInfo" v-for="(item, index) in userInfo" :key="index">
            <div>
              <img src="../../assets/new_images/user_black.png">
              <span class="userName">{{item.name}}</span>
              <span class="tag">{{item.tag}}</span>
            </div>
            <div>
              <img src="../../assets/new_images/idCar_black.png">
              <span>{{item.idCard}}</span>
            </div>
            <div>
              <img src="../../assets/new_images/phone_black.png">
              <span>{{item.phone}}</span>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <template v-slot:header> 合同照片 </template>
        <div class="xh-image-box master">
          <div class="xh-box-item">
            <svg-icon icon-class="user" />
            <span>{{ userInfo[0].name }}</span>
            <span class="xh-user-tag">主借人</span>
          </div>
        </div>
        <div class="xh-image-box">
          <div class="xh-box-item">
            <svg-icon icon-class="user" />
            <span>{{ userInfo[1].name }}</span>
            <span class="xh-user-tag">主借人配偶</span>
          </div>
        </div>
        <imageList :dataList="dataList"></imageList>
      </Card>

      <Card style="margin-top: 10px;" v-if="!isView">
        <template v-slot:header> 意见描述 </template>
        <van-field v-model="remark" :border="false" type="textarea" :disabled="isView" placeholder="输入说明" rows="1" :autosize="autosize" maxlength="200" show-word-limit class="zh-textarea" />
      </Card>

      <!-- 提交按钮 -->
      <div style="margin: 45px 10px 30px 10px; display: flex; flex-direction: row;" v-if="!isView">
        <van-button size="large" style="background-color: #C4252A; color: white;margin-left: 3px;border-radius: 8px;flex:1;" @click="submitRemark"> 提交 </van-button>
      </div>
    </div>
  <!-- </ViewPage> -->
</template>

<script>
import ViewPage from "@/layout/components/ViewPage";
import Card from "@/components/card";
import imageList from "@/components/imageList";
import { Button, Field, Toast, Notify } from "vant";
import Vue from "vue";
import { getDocumentByType } from "@/api/document";
import api from "@/api/contractUpload";

Vue.use(Button).use(Field).use(Toast).use(Notify);

export default {
  name: "creditNextStep",
  components: {
    ViewPage,
    Card,
    imageList
  },
  data() {
    return {
      loading: false,
      remark:'',
      autosize: {
        maxHeight: 100,
        minHeight: 80
      },
      userInfo: [{
        name: "",
        tag: "主借人",
        phone: "",
        idCard: ""
      },{
        name: "",
        tag: "主借人配偶",
        phone: "",
        idCard: ""
      }],
      dataList:[],
      projectInfo:{},
      isView: false, // 是否查看
    };
  },
  computed: {
    wordbook() {
      return this.$store.state.user.wordbook;
    },
    routeData(){
      return this.$route.query;
    },
    documentType() {
      let obj = {};
      if (this.wordbook.document_type && this.wordbook.document_type.length) {
        this.wordbook.document_type.forEach(item => {
          obj[item.value] = item;
        });
      }
      return obj;
    }
  },
  activated(){
    this.remark = this.$route.query.remark || '';
    console.log(this.$route.query)
    this.resetUserInfo();
    this.getListDetails();
  },

  methods: {

    // 获取 userInfo
    getListDetails(){
      this.loading = true;
      api.getListDetails({id:this.routeData.projectId}).then(res=>{
        res.code === 200 ? this.loading = false : ''
        this.projectInfo = res.data.projectInfo;
        let {customerName, certificateNum, contactPhone, spsNm, spsCrdtNo, spsCtcTel} = {...res.data.projectInfo.customer};

        this.userInfo[0].name = customerName;
        this.userInfo[0].phone = contactPhone;
        this.userInfo[0].idCard = certificateNum;
        this.userInfo[1].name = spsNm;
        this.userInfo[1].phone = spsCtcTel;
        this.userInfo[1].idCard = spsCrdtNo;
        if(this.$route.query.isView){
          this.isView = this.$route.query.isView == 1;
        } else{
          this.isView = this.projectInfo.bankMakeLoan && this.projectInfo.bankMakeLoan.processState == '已放款';
        }
        this.initImage();
      })
    },

    // 图片上传 与 展示
    initImage() {
      this.dataList = [];
      api.getImagesList({kind:'1',customerId:this.routeData.customerId,documentTypeParent:'ht'}).then(res => {
        res.data.forEach(item=>{
          this.dataList.push({
              declare: item.name, //图片描述
              isRequire: true, //*是否必须
              deletable: !this.isView, //是否可以操作-上传和删除
              documentType: item.type,
              customerNum: this.routeData.customerNum,
              customerId: this.routeData.customerId,
              kind: "1",
              fileList: item.documents || []
            });
        })
      })
    },

    // 提交备注
    submitRemark(){
      api.submitRemark({projectId:this.routeData.projectId, remark:this.remark}).then(res => {
        if(res.msg === 'OK'){
          Notify({ type: 'success', message: '操作成功' });
          this.$router.go(-1);
        }else{
          Notify({ type: 'danger', message: '操作失败, 请重试!' });
        }
      })
    },
    // 重置用户信息
    resetUserInfo(){
      for (const itemList of this.userInfo) {
        for (const item in itemList) {
          if(item !== 'tag'){
            itemList[item] = '';
          }
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">

.userInfoBox{
  padding: 10px 10px 0;
  .userInfo{
    border-radius: 4px;
    padding: 8px 10px;
    margin-bottom: 10px;
    background-color: #F2F2F2;
    img{
      width: 20px;
    }
    >div{
      height: 30px;
      display: flex;
      align-items: center;

      span{
        font-size: 14px;
        margin-left: 10px;
      }
      .userName{
        font-size: 1.4rem;
      }
      .tag{
        font-size: 12px;
        color: #fff;
        padding: 4px 6px;
        border-radius: 4px;
        background-color: #999;
      }
    }
  }
}

.master{
  margin-bottom: 10px;
}
.xh-image-box {
  padding: 0 1rem 0 1rem;

  &:first-child {
    padding-top: 1rem;
  }

  .xh-box-item {
    margin-bottom: 0.5rem;

    &:last-child {
      margin-bottom: 0;
    }

    span {
      display: inline-block;
    }

    span:nth-of-type(1) {
      margin: 0 0.5rem;
    }
  }

  .xh-user-tag {
    background: #fdf1f0;
    border-radius: 4px;
    padding: 0.2rem;
    color: #c4252a;
  }
}
</style>
