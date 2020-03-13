//客户建档
import request,{serviceOther} from '@/utils/request'

export function getDic(params) {
    return serviceOther({
        url: '/manage/dict/getDictByTypes',
        method: 'post',
        data: params
    })
}
export function submitCreate(params) {
    return request({
        url: '/customer/cs/cuPersonalInfo/insert',
        method: 'post',
        data: params
    })
}