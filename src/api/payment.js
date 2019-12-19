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
//提交接口-创建流程
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
        method: 'get',
        data: params
    })
}