import request from '@/utils/request'

export function surveyList(params) {
    return request({
        url: '/order/project/investigationlist',
        method: 'post',
        params
    })
}