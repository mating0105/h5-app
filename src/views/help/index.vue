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
        { title: '1、银行征信查询',
          text: '',
          list: [
            { roleName: '客户经理', title: '发起银行征信查询', content: '客户建档后，选择一个被查询的主借人' },
            { roleName: '客户经理', title: '确认征信查询信息', content: '可添加征信查询对象、添加车辆' },
            { roleName: '客户经理', title: '提交至驻行内勤', content: '上传征信查询授权书、银行卡正反面等照片' },
            { roleName: '驻行内勤', title: '查询并回复征信结果', content: '线下查询后录入征信结果，上传征信报告照片' },
            { roleName: '驻行内勤', title: '提交并结束征信查询', content: '提交后，征信查询结果展示给相应人员' }
          ]
        },
        { title: '2、大数据征信查询',
          text: '',
          list: [
            { roleName: '内勤/客户经理', title: '发起大数据查询', content: '银行征信流程发起后，选择一个贷款客户' },
            { roleName: '内勤/客户经理', title: '查询并回复征信结果', content: '线下查询后录入征信结果，上传征信报告照片' }
          ]
        },
        { title: '3、二手车评估',
          text: '',
          list: [
            { roleName: '评估岗/评估公司', title: '进行二手车评估', content: '银行征信流程发起后，选择一个评估任务' },
            { roleName: '评估岗/评估公司', title: '填写评估结果', content: '线下评估后录入车辆评估价，上传评估报告照片' }
          ]
        },
        { title: '4、项目报单流程',
          text: '',
          list: [
            { roleName: '客户经理', title: '发起项目报单', content: '客户建档后即可选择一个贷款客户' },
            { roleName: '客户经理', title: '填写报单信息', content: '填写项目基本信息、调查信息等' },
            { roleName: '客户经理', title: '提交至内勤审核', content: '提交前请确保报单信息的完整性' },
            { roleName: '内勤文员', title: '审核报单信息', content: '审批结论有：退回、通过' },
            { roleName: '内勤文员', title: '提交至风控审批', content: '审核通过的报单信息可提交至风控审批官' },
            { roleName: '风控审批', title: '审核报单信息', content: '审批结论有：退回、拒绝、通过' },
            { roleName: '风控审批', title: '提交并结束项目报单', content: '审核通过的提交后即可开始走款/放款流程；审核拒绝的终止结束，不能走后续流程；' }
          ]
        },
        { title: '5、合同签约上传',
          text: '',
          list: [
            { roleName: '客户经理', title: '线下完成合同签约', content: '完成签约后选择一个评估任务' },
            { roleName: '客户经理', title: '上传合同签约照片', content: '上传各类合同照片至线上系统' }
          ]
        },
        { title: '6、缴费走款流程',
          text: '缴费走款和银行放款流程不分先后，人为自行决定',
          list: [
            { roleName: '客户经理', title: '发起缴费走款', content: '风控审批通过后，选择一个项目订单' },
            { roleName: '客户经理', title: '填写走款信息', content: '填写并确认费用信息、走款信息、凭证等' },
            { roleName: '客户经理', title: '提交至财务审批', content: '提交前请确保走款信息的完整性' },
            { roleName: '财务审批', title: '审核走款信息', content: '审批结论有：退回、拒绝、通过' },
            { roleName: '财务审批', title: '提交并结束缴费走款', content: '审核通过的提交后即可开始银行放款流程；审核拒绝的终止结束，不能走后续流程；' }
          ]
        },
        { title: '7、银行放款流程',
          text: '缴费走款和银行放款流程不分先后，人为自行决定',
          list: [
            { roleName: '做单文员', title: '开始做单', content: '风控审批通过后即给做单文员生成做单待办' },
            { roleName: '做单文员', title: '填写做单信息', content: '检测确认、补充完善银行放款所需各类信息' },
            { roleName: '做单文员', title: '提交至驻行内容', content: '提交前请确保做单信息的完整性' },
            { roleName: '驻行内勤', title: '审核做单信息', content: '审批结论有：退回、拒绝、通过、已放款；审批通过的需驻行内勤线下跟踪银行放款；' },
            { roleName: '驻行内勤', title: '提交并银行放款流程', content: '审核已放款或拒绝放款提交后，车贷流程结束；' }
          ]
        },
        { title: '8、重权补录',
          text: '',
          list: [
            { roleName: '客户经理', title: '线下办理各类事宜', content: '办理完成后选择一个项目订单' },
            { roleName: '客户经理', title: '填写重权补录信息', content: '填写抵押、上户、保险等信息' }
          ]
        }
      ]
    }
  }
};
</script>

<style lang="scss">

</style>
