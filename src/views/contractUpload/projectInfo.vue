<template>
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

    <Card style="margin-top: 10px;">
      <template v-slot:header> 意见描述 </template>
      <van-field v-model="remark" :border="false" type="textarea" placeholder="输入说明" rows="1" :autosize="autosize" maxlength="200" show-word-limit class="zh-textarea" />
    </Card>

    <!-- 提交按钮 -->
    <div style="margin: 45px 10px 30px 10px; display: flex; flex-direction: row;">
      <van-button size="large" style="background-color: #C4252A; color: white;margin-left: 3px;border-radius: 8px;flex:1;" @click="submitRemark"> 提交 </van-button>
    </div>
  </div>
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
      dataList:[]
    };
  },
  computed: {
    customerId(){
      return this.$route.query.customerId;
    },
    customerNum(){
      return this.$route.query.customerNum;
    },
    wordbook() {
      return this.$store.state.user.wordbook;
    },
    projectId(){
      return this.$route.query.projectId;
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
    this.remark = this.$route.query.remark;
    this.resetUserInfo();
    this.initImage();
    this.getListDetails();
  },
  methods: {
    // 获取 userInfo
    getListDetails(){
      this.showTostLoading();
      api.getListDetails({id:this.$route.query.id}).then(res=>{
        res.code === 200 ? Toast.clear() : ''
        let {customerName, certificateNum, contactPhone, spsNm, spsCrdtNo, spsCtcTel} = {...res.data.projectInfo.customer};

        this.userInfo[0].name = customerName;
        this.userInfo[0].phone = contactPhone;
        this.userInfo[0].idCard = certificateNum;
        this.userInfo[1].name = spsNm;
        this.userInfo[1].phone = spsCtcTel;
        this.userInfo[1].idCard = spsCrdtNo;
      })
    },

    // 图片上传 与 展示
    async getDocumentByType(documentType) {
      this.dataList = [];
      let params = {
        customerNum: this.customerNum,
        documentType: documentType
      };
      let { data } = await getDocumentByType(params);
      let declare = this.documentType[documentType]
        ? this.documentType[documentType].label
        : "图片描述";
      data.forEach(item => {
        item.declare = declare;
      });
      this.dataList.push({
        declare: declare, //图片描述
        isRequire: true, //*是否必须
        deletable: true, //是否可以操作-上传和删除
        documentType: documentType,
        customerNum: this.customerNum,
        customerId: this.customerId,
        kind: "1",
        fileList: data
      });
    },
    initImage() {
      this.getDocumentByType("1801"); //主借人 - 融资租赁合同
      this.getDocumentByType("1806"); //主借人 - 融资租赁业务告知书"
      this.getDocumentByType("1802"); //主借人 - 抵押合同
      this.getDocumentByType("1803"); //主借人 - 车辆验收合格单
      this.getDocumentByType("1804"); //主借人 - 委托扣款授权书
      this.getDocumentByType("1805"); //主借人 - 加融费用收取证明
      this.getDocumentByType("1807"); //主借人 - 收车授权委托书
    },

    // 提交备注
    submitRemark(){
      api.submitRemark({projectId:this.projectId, remark:this.remark}).then(res => {
        if(res.msg === 'OK'){
          Notify({ type: 'success', message: '操作成功' });
        }else{
          Notify({ type: 'danger', message: '操作失败, 请重试!' });
        }
      })
    },

    // 显示 Loading
    showTostLoading(){
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
        loadingType: 'spinner',
        overlay: true
      });
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
