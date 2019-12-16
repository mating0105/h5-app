<template>
    <ViewPage>
        <van-tabs v-model="activeName">
            <van-tab title="银行审批信息" name="1" class="tabBox">
                <!-- 客户基本信息 -->
                <red-card label="客户基本信息">
                    <template slot="cardBody">
                        <div>
                            <van-row>
                                <van-col span="12" class="xh-top-10 xh-ellipsis">
                                    客户姓名：袁东
                                </van-col>
                                <van-col span="12" class="xh-top-10 xh-text-right" >
                                    联系电话：13698555588
                                </van-col>
                            </van-row>
                            <van-row>
                                <van-col span="24" class="xh-top-10 xh-ellipsis">
                                    证件号码：360428199412068038 | 身份证
                                </van-col>
                            </van-row>
                        </div>
                    </template>
                </red-card>
                <!-- 审批结论 -->
                <Card style="margin-top:15px;">
                    <template v-slot:header>
                        <div class="notice">
                            <p>审批结论</p>
                            <van-cell v-model="approvalConclusion"  is-link @click="showPopupType('approvalConclusion')"/>
                        </div>
                    </template>
                </Card>
                <!-- 银行放款信息 -->
                <Card style="margin-top:15px;">
                    <template v-slot:header>
                        银行放款信息
                    </template>
                    <div>
                        <van-cell-group>
                            <van-cell title="主借人还款卡号：" required value="612413131321231321313" />
                        </van-cell-group>
                        <van-cell-group>
                            <van-cell title="还款卡银行：" value="中国工商银行" />
                        </van-cell-group>
                        <van-cell-group>
                            <van-cell title="录机时间：" required is-link @click="showPopupType('approvalConclusion')"/>
                        </van-cell-group>
                        <van-cell-group v-if="approvalConclusion=='已放款'">
                            <van-cell title="实际放款金额（元）：" required value="请输入" />
                        </van-cell-group>
                        <van-cell-group v-if="approvalConclusion=='已放款'">
                            <van-cell title="实际放款时间：" value="请选择"/>
                        </van-cell-group>
                    </div>
                </Card>
                <!-- 放款凭证 -->
                <Card style="margin-top: 10px;" v-if="approvalConclusion=='已放款'">
                    <template v-slot:header>
                        放款凭证
                    </template>
                    <div class="zh-form-body" style="display: flex; flex-wrap: wrap; padding:5px 0;">
                    <div class="zh-img zh-relative" v-for="(i,index) in imgWalkList" :key="index">
                      <div class="zh-upload" @click="imagesLook(index)">
                        <div class="zh-upload-button zh-upload-img">
                          <img :src="i.smallUrl" alt="" />
                        </div>
                      </div>
                      <van-icon name="close" @click="closeImg(index,i.documentId)" />
                    </div>
                    <div class="zh-img zh-relative">
                      <div class="zh-upload">
                        <div class="zh-upload-button zh-upload-icon" @click="callUpdateImg">
                          <div class="van-uploader">
                            <i class="icon-add"></i>
                          </div>
                          <p class="text">添加照片</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
                <!-- 意见描述 -->
                <Card style="margin-top:15px;">
                    <template v-slot:header>
                        意见描述
                    </template>
                    <div>
                        <van-cell-group>
                            <van-field v-model="message" rows="2" autosize type="textarea" maxlength="200" placeholder="请输入留言" show-word-limit/>
                        </van-cell-group>
                    </div>
                </Card>
                <!-- 通知业务员 -->
                <Card style="margin-top:15px;" v-if="approvalConclusion=='退回'">
                    <template v-slot:header>
                        <div class="notice">
                            <p>通知业务员</p>
                            <van-cell v-model="approvalConclusion" is-link @click="showPopupType('approvalConclusion')"/>
                        </div>
                    </template>
                </Card>
                <!-- 通知财务 -->
                <Card style="margin-top:15px;" v-if="approvalConclusion=='拒绝放款'">
                    <template v-slot:header>
                        <div class="notice">
                            <p>通知财务</p>
                            <van-cell v-model="approvalConclusion" is-link @click="showPopupType('approvalConclusion')"/>
                        </div>
                    </template>
                </Card>
                <!-- 提交按钮 -->
                <div class="xh-submit" style="padding: 0 10px;">
                    <van-button size="large" class="xh-bg-main" @click="submit" :loading="loading">提 交</van-button>
                </div>
            </van-tab>
            </van-tab>
            <van-tab title="征信信息" name="2"></van-tab>
            <van-tab title="审批记录" name="3"></van-tab>
        </van-tabs>

        <!--  -->
        <van-dialog v-model="showQRCode" :show-confirm-button="false" :show-cancel-button="false" :close-on-popstate="true"
        :close-on-click-overlay="true">
            <img width="100%" height="100%" :src="qrCodeUrl" />
        </van-dialog>

        <!-- piker选择器 -->
        <van-popup position="bottom" :overlay="true" v-model="popupShow">
            <van-picker show-toolbar :title="title1" :columns="columns" :loading="loading" @cancel="onCancel"
            @confirm="onConfirm" />
        </van-popup>
    </ViewPage>
</template>

<script>
  import Vue from 'vue';
  import { mapGetters } from 'vuex'
  import ViewPage from '@/layout/components/ViewPage';
  import Card from '@/components/card/index';
  import redCard from "@/components/redCard/index";
  import imageList from '@/components/imageList'
  import { Dialog, Button, Row, Col, Tab, Tabs, Cell, CellGroup,Picker,Popup,Field } from 'vant';
  
  const Components = [Dialog, Button, Row, Col, Tab, Tabs, Cell, CellGroup,Picker,Popup,Field];
  Components.forEach(item => {
  Vue.use(item);
});

export default {
  name:'bakLend',
  components: {
    redCard,
    Card,
    ViewPage,
    imageList
  },
  data() {
    return {
      activeName: "1",
      selected: 1,
      columns: [],
      imgWalkList: [],//图片
      popupShow: false,
      title1:'',
      approvalConclusion:'请选择',
      params: {},
      certificateNum: "",
      projProjectInfo: {},
      showQRCode: false,
      qrCodeUrl: "",
      loading: false,
      message:''
    };
  },
  methods: {
    handleClose() {
      this.$toast("关闭!");
    },
    loadData(params) {
      let dataList = {
        projectId: params.projectId
      };
      requestUrl
        .getList("/carloan/projectinfo", dataList)
        .then(res => {
          if (res.data.code == "SYS.200") {
            this.projProjectInfo = res.data.data.projectInfo;
            if (this.projProjectInfo.isChangeProj == "1") {
              this.projProjectInfo.isChangeProj = "1";
              this.certificateNum = this.projProjectInfo.customer.certificateNum;
            } else {
              this.projProjectInfo.isChangeProj = "0";
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //显示选择弹框
    showPopupType(type) {
        this.popupShow = true
        this.popupSign = type
        switch (type) {
        case 'payType':
            this.title1 = '请选择走款模式'
            this.columns = [
            { text: '快垫', key: '1' },
            { text: '传统', key: '2' }
            ]
            break;
        case 'notice':
            this.title1 = '请选择业务员补充资料'
            this.columns = [
            { text: '张三', key: '1' },
            { text: '李四', key: '2' },
            { text: '王五', key: '3' }
            ]
            break;
        case 'approvalConclusion':
            this.title1 = '请选择审批结论'
            this.columns = [
            { text: '通过', key: '1' },
            { text: '退回', key: '2' },
            { text: '拒绝放款', key: '3' },
            { text: '已放款', key: '4' }
            ]
            break;
        case 'payeeFullName':
            this.title1 = '请选择收款人名称'
            this.columns = [];
            if (this.form.cost.payWay == 1) {
            this.payee.forEach(e => {
                this.columns.push({
                text: e.rcvpymtpsNm,
                rcvpymtpsAcc: e.rcvpymtpsAcc,
                rppdbnk: e.rppdbnk
                })
            })
            } else {
            this.payeePublic.forEach(e => {
                this.columns.push({
                text: e.rcvpymtpsNm,
                rcvpymtpsAcc: e.rcvpymtpsAcc,
                rppdbnk: e.rppdbnk
                })
            })
            }
        }
    },
    onConfirm(value) {
        this.popupShow = false
        switch (this.popupSign) {
            case 'payType':
                this.projectForm.payType = value.text;
                break;
            case 'notice':
                this.noticeName = value.text;
                break;
            case 'approvalConclusion':
                this.approvalConclusion=value.text;
                break;
            case 'payeeFullName':
                this.form.cost.payeeFullName = value.text;
                this.form.cost.payeeBank = value.rppdbnk;
                this.form.cost.payeeAccount = value.rcvpymtpsAcc
        }
    },
    onCancel() {
        this.popupShow = false
    },
    submit() {
      bridge.loadurlwithmobile({
        url:
          "zhgjApp/page/projectDeclaration/approvalEnd.html?projectId=" +
          this.params.projectId +
          "&activityId=" +
          this.params.activityId +
          "&taskId=" +
          this.params.taskId +
          "&businessType=" +
          this.params.businesstype
      });
    },
    meunList(row) {
      this.$router.push({ path: row.url, query: this.params });
    },
    getQRCode(custId, projId) {
      requestUrl
        .getList(
          "/order/ws/qrcode",
          {
            customerId: custId,
            projectId: projId
          },
          "soa"
        )
        .then(res => {
          if (res.data.code == 200 && res.data.data.codeImg) {
            this.qrCodeUrl = res.data.data.codeImg;
            // this.qrCodeUrl = "http://192.168.0.81:8080/group2/M00/00/3C/wKgAU11k10uAFTfrAAL1NDR8bIo167.jpg";
          }
        });
    },
    callbackImage(data) {
        data.forEach(e => {
            switch (e.documentType) {
            case '0620':
                this.imgWalkList.push(e)
                break;
            }
        })
    },
    closeImg(index, documentId) {
        requestUrl.getList('/carloan/projProjectInfo/deleteFile', { documentId: documentId }).then((res) => {
          this.imgWalkList.splice(index, 1)
        })
    },
    // 查看图片
    imagesLook(index) {
        var imagelist = [];
        this.imgWalkList.forEach(e => {
            imagelist.push(e.bigUrl)
        })
        bridge.callhandler("PreviewImages", { "imageList": imagelist, "index": index });
    },
    //图片上传
    callUpdateImg() {
        let params = {
            documentType: '0620',
            customerNum: this.form.cost.customerNo,
            customerId: this.form.cost.customerId,
            bizNum: this.projectNo,
            bizId: this.projectId,
            kind: "1"
        }
        bridge.callhandler('newUploadImg', params)
    },
  },
  mounted() {
    this.params = this.$route.query;
  }
};
</script>

<style scoped>
.tabBox{
    padding: 10px 10px;
}
.rowBox{
    margin: 10px 0;
}
.notice{
    display:flex;
    align-items: baseline;
}
.notice>p{
    margin:0;
    width:70%;
}
.notice>.van-cell{
    padding: 0;
}
.van-cell__value--alone{
    text-align: right;
}
</style>
