//客户建档
import request from '@/utils/request'

export function getDic(params) {
    return request({
        url: '/manage/dict/getDictByTypes',
        method: 'post',
        data: params
    })
}