<!--
 * @Description: 银行征信回复
 * @Author: mating
 * @Date: 2020-03-17
 -->
<template>
    <ViewPage :loading="loading">
        <template v-slot:head>
            <van-tabs v-model="active">
                <van-tab title="基本信息"></van-tab>
                <van-tab title="征信信息"></van-tab>
                <van-tab title="操作记录"></van-tab>
            </van-tabs>
        </template>
        <template v-if="active === 0">
            <replyInfo></replyInfo>
        </template>
        <template v-else-if="active === 1">
            <div class="tip" style="padding:0 1rem;">
                <van-divider :dashed="true" :style="{ color: 'red', borderColor: 'red' }">以下为历史征信记录</van-divider>
            </div>
            <collapsBox label="银行征信查询信息" :showSign="showSign" :showTime="showTime" :sign='sign' :signColor='signColor' :changeitem='changeitem'>
                <template>内容</template>
            </collapsBox>
        </template>
        <template v-else-if="active === 2">
            <approvalRecord :requestParams="recordParams"></approvalRecord>
        </template>
    </ViewPage>
</template>
<script>
import Vue from 'vue';
import ViewPage from '@/layout/components/ViewPage';
import replyInfo from './replyInfo.vue'
import approvalRecord from "@/views/basicInfo/approvalRecord";
import collapsBox from "@/components/collapseBox/index";

import { Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast, Notify, SwipeCell, Dialog, Tab, Tabs,Collapse, CollapseItem,Divider } from 'vant';
const Components = [Cell, CellGroup, Field, Icon, Button, Picker, Popup, Toast, Notify, SwipeCell, Dialog, Tab, Tabs,Collapse, CollapseItem,Divider ]
Components.forEach(item => {
    Vue.use(item)
})

export default {
    name:'bankCreditReply',
    components: {
      ViewPage,
      replyInfo,
      approvalRecord,
      collapsBox
    },
    data(){
        return {
            active:1,
            loading: false,
            recordParams: {
                businessKey: '', businessType: '07'
            },
            activeName: '1',
            showTime:true,//卡片（显示时间）
            showSign:true,//卡片（显示标签）
            sign:'通过',//标签标记内容  （查询中、被退回）
            signColor:'green',//标签标记颜色
        }
    },
    methods:{
        changeitem(val){
            console.log(val)
        }
    }
}
</script>
<style lang="scss" scoped>

</style>