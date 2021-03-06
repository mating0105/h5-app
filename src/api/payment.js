import request from '@/utils/request'

export function paymentList(params) {
    return request({
        url: '/order/captureExpends/list',
        method: 'get',
        params
    })
}
export function getPaymentDetail(params) {
    return request({
        url: '/order/captureExpends',
        method: 'get',
        params
    })
}
export function getDic(params) {
    return request({
        url: '/manage/dict/getDictByTypes',
        method: 'post',
        data: params
    })
}
//保存接口
export function savePay(params) {
    return request({
        url: '/order/captureExpends/save',
        method: 'post',
        data: params
    })
}
//提交接口-业务发起垫款创建流程
export function submitPay(params) {
    return request({
        url: '/order/captureExpends/createProess',
        method: 'post',
        data: params
    })
}
//提交流程
export function submitProcess(params) {
    return request({
        url: '/order/captureExpends/submit',
        method: 'post',
        data: params
    })
}
//加载审批记录
export function approvalRecord(params) {
    return request({
        url: '/order/projProjectWf/getPageCreditList',
        method: 'post',
        data: params
    })
}
//提交接口-财务确认垫款
export function submitGo(params) {
    return request({
        url: '/order/captureExpends/submit',
        method: 'post',
        data: params
    })
}
//终止流程
export function stopTask(params) {
    return request({
        url: '/order/captureExpends/stopTask',
        method: 'post',
        data: params
    })
}
// gps列表
export function gpsList(params) {
    return request({
        url: '/order/gpsInstall/list',
        method: 'post',
        data: params
    })
}
// 审批官垫款审批列表
export function approveList(params) {
    return request({
        url: '/order/captureExpends/risklist',
        method: 'get',
        params
    })
}
// 审批官风控意见提交
export function approveSubmit(params) {
    return request({
        url: '/order/captureExpends/risksave',
        method: 'post',
        data: params
    })
}
// 加载资方
export function managementList(params) {
    return request({
        url: '/cooperation/advancesasset/list',
        method: 'get',
        data: params
    })
}

