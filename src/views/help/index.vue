<template>
  <ViewPage :backFn="closeNativeWebView">
    <div style="padding: 10px;">
      <div v-for="(i,index) in helpList" :key="index">
        <div style="font-size: 20px;padding: 10px 0;">{{ i.title }}</div>
        <div style="color: rgb(150, 151, 153);padding: 0 0 10px 0;" v-if="i.text">{{ i.text }}</div>
        <van-steps direction="vertical" active-color="#969799">
          <van-step v-for="(t,idx) in i.list" :key="idx">
            <h3>{{ t.roleName }} {{ t.title }}</h3>
            <p>{{ t.content }}</p>
          </van-step>
        </van-steps>
      </div>
    </div>
  </ViewPage>
</template>

<script>
import Vue from "vue";
import { Step, Steps } from "vant";
import ViewPage from "@/layout/components/ViewPage";
const Components = [Step, Steps];

Components.forEach(item => {
  Vue.use(item);
});
export default {
  components: {
    ViewPage
  },
  data() {
    return {
      helpList: [
        { title: '1、银行征信查询流程',
          text: '',
          list: [
            { roleName: '', title: '发起银行征信查询', content: '客户建档后，选择一个被查询的客户' },
            { roleName: '', title: '确认征信查询信息', content: '录入征信所需信息，可添加多人同时查询' },
            { roleName: '', title: '提交征信查询', content: '上传征信授权书或进行电子签，提交至银行' },
            { roleName: '', title: '查询并回复征信结果', content: '人工或系统查询后回复征信结果和征信报告' }
          ]
        },
        { title: '2、大数据/人保征信查询功能(非流程)',
          text: '',
          list: [
            { roleName: '', title: '发起大数据/人保征信查询', content: '客户建档后，选择一个被查询的客户' },
            { roleName: '', title: '查询并回复征信结果', content: '查询后回复/获取征信结果和征信报告' }
          ]
        },
        { title: '3、二手车评估功能(非流程)',
          text: '',
          list: [
            { roleName: '', title: '发起二手车评估', content: '创建二手车信息后发起二手车评估' },
            { roleName: '', title: '回复评估结果', content: '人工或系统评估回复评估价和评估报告' }
          ]
        },
        { title: '4、项目报单流程',
          text: '',
          list: [
            { roleName: '', title: '发起项目报单', content: '选择一个贷款客户发起项目报单' },
            { roleName: '', title: '填写报单信息', content: '填写车辆信息、金融产品信息等' },
            { roleName: '', title: '提交至内勤/文员审核', content: '报单信息确认无误后可提交至审核' },
            { roleName: '内勤/文员', title: '审核报单信息', content: '对报单信息和调查资料完整性进行审核' },
            { roleName: '', title: '提交至风控审批', content: '报单和资料审核无误后可提交至审批' },
            { roleName: '风控审批', title: '审核报单信息', content: '对报单信息和调查资料风险性进行审批' },
            { roleName: '', title: '提交并结束项目报单', content: '审核通过的提交后即可开始垫款/放款流程；审核拒绝的终止结束，不能走后续流程；' }
          ]
        },
        { title: '5、完善调查信息功能(非流程)',
          text: '',
          list: [
            { roleName: '', title: '完善调查信息', content: '项目报单发起后，项目报单审批通过可随时完善调查信息' }
          ]
        },
        { title: '6、合同签约上传功能(非流程)',
          text: '',
          list: [
            { roleName: '', title: '上线合同签约照片', content: '线下完成签约后上传合同签约照片' }
          ]
        },
        { title: '7、缴费垫款流程',
          text: '缴费垫款和银行放款流程不分先后，人为自行决定',
          list: [
            { roleName: '', title: '发起缴费垫款', content: '项目报单审批通过后，即可发起' },
            { roleName: '', title: '填写垫款信息', content: '填写并确认费用信息、垫款信息、凭证等' },
            { roleName: '', title: '提交至财务审批', content: '提交审批时可选择是否先进行风控审批' },
            { roleName: '', title: '审核垫款信息', content: '填写垫款金额、上传垫款凭证等信息' },
            { roleName: '', title: '提交并完成缴费垫款', content: '审核通过的提交后即可开始银行放款流程；审核拒绝的终止结束，不能走后续流程；' }
          ]
        },
        { title: '8、垫款审批功能(非流程)',
          text: '',
          list: [
            { roleName: '', title: '风控审批垫款信息', content: '若发起缴费垫款时选择通知风控进行审批，则需风控审批垫款信息，给出风控意见' }
          ]
        },
        { title: '9、银行放款流程',
          text: '缴费垫款和银行放款流程不分先后，人为自行决定',
          list: [
            { roleName: '', title: '开始做单', content: '风控审批通过后即给做单文员生成做单待办' },
            { roleName: '', title: '填写做单信息', content: '检查确认、补充完善银行放款所需各类信息' },
            { roleName: '', title: '提交请款申请', content: '提交前请确保做单信息的完整性' },
            { roleName: '', title: '审核做单信息', content: '跟踪银行放款，填写放款金额、上传放款凭证等信息' },
            { roleName: '', title: '提交并完成银行放款', content: '审核已放款或拒绝放款提交后，车贷流程结束；' }
          ]
        },
        { title: '10、重权补录功能(非流程)',
          text: '',
          list: [
            { roleName: '', title: '补录重权信息', content: '将线下办理的重权信息补录至系统，可多次补录' }
          ]
        }
      ]
    }
  }
};
</script>

<style lang="scss">

</style>
