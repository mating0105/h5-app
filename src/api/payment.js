import request from '@/utils/request'

export function paymentList(params) {
    return request({
        url: '/order/captureExpends/list',
        method: 'get',
        params
    })
}
export function paymentDetail(params) {
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
export function submitPay(params) {
    return request({
        url: '/order/captureExpends/save',
        method: 'post',
        data: params
    })
}
