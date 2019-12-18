import request from '@/utils/request'

//获取详情信息
export function loanInfoDetail(params) {
  return request({
    url: '/order/bankmakeloan/'+params.id,
    method: 'get'
  })
}
//获取项目信息
export function getProjectInfo(params) {
    return request({
      url: '/order/project/getProjectInfo',
      method: 'get',
      params
    })
}
//更新放款信息
export function updateLoanInfo(params){
    return request({
        url:'/order/bankmakeloan/update',
        method: 'post',
        data: params
    })

}
//获取流程处理人
export function getPeople(params){
    return request({
        url:'/user/user/process',
        method: 'post',
        data: params
    })
}