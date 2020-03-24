import request,{serviceOther} from '@/utils/request'

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
//提交流程
export function submitProcess(params){
    return request({
        url:'/order/bankmakeloan/submit',
        method: 'post',
        data: params
    })
}
// 获取待办已办数据
export function findList(params){
    return request({
        url:'/order/wf/findList',
        method: 'post',
        data: params
    })
}
//获取页面字段规则
export function fieldRules(params){
    return serviceOther({
        url:'/manage/regularConfig/getRegularByServer',
        method: 'get',
        params
    })
}
export function fieldRulesNew(params){
    return request({
        url:params.urls,
        method: 'get',
        params:params.obj
    })
}
//待办--获取征信类型
export function getCreditList(params){
    return serviceOther({
        url:'/manage/buttonConfig/getButtonByServer/v2',
        method: 'get',
        params
    })
}