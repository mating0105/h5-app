import request,{serviceOther} from '@/utils/request'

/**
 * 获取银行
 * @param params
 */
export function getBank(params) {
  return serviceOther({
    url: '/cooperation/loanPlatform/getLoanPlatformTree',
    method: 'get',
    params
  })
}

/**
 * 获取征信详情
 * @param params
 */
export function getCreditInfo(params) {
  return request({
    url: '/order/standardCreditInfo/cuCreditRegisterFormMob',
    method: 'get',
    params
  })
}
//获取征信详情
export function getCreditDetail(params) {
  return request({
    url: '/order/standardCreditInfo/cuCreditRegisterFormMob',
    method: 'get',
    params
  })
}
//获取历史征信
export function getCreditHistory(params) {
  return request({
    url: '/order/standardCreditInfo/historyList',
    method: 'post',
    data: params
  })
}

/**
 * 获取征信列表
 * @param params
 */
export function getList(params) {
  return request({
    url: '/order/standardCreditInfo/queryCreaditRegister',
    method: 'get',
    params
  })
}

/**
 * 获取征信按钮列表
 * @param params
 */
export function getButtonList(params) {
  return serviceOther({
    url: '/manage/buttonConfig/getButtonByServer?serverName=credit-list',
    method: 'get',
    params
  })
}

/**
 * 保存征信信息
 * @param params
 */
export function saveCreditInfo(params) {
  return request({
    url: '/order/creditInfo/creditRegisterInput',
    method: 'post',
    data: params
  })
}

/**
 * 创建任务
 * @param params
 */
export function createTask(params) {
  return request({
    url: '/order/creditProcess/createTask',
    method: 'post',
    data: params
  })
}

/**
 * 获取用户
 * @param params
 */
export function getUsers(params) {
  return request({
    url: '/order/creditProcess/findCreditChoosePer',
    method: 'post',
    data: params
  })
}

/**
 * 提交征信
 * @param params
 */
export function submitCredit(params) {
  return request({
    url: '/order/creditProcess/submitCredit',
    method: 'post',
    data: params
  })
}

/**
 * 终止征信
 * @param params
 */
export function stopTask(params) {
  return request({
    url: '/order/creditProcess/stopTask',
    method: 'get',
    params
  })
}

/**
 * 重新发起征信检测
 * @param params
 */
export function checkedReregisterMob(params) {
  return request({
    url: '/order/creditInfo/checkedReregisterMob',
    method: 'post',
    data: params
  })
}



/**
 * 百融征信查询
 * @param params
 */
export function creditQueryOf100(params) {
  return request({
    url: '/order/credit100/cuCreditRegisterFormMob',
    method: 'get',
    params
  })
}
/**
 * 百融征信保存
 * @param params
 */
export function creditSaveOf100(params) {
  return request({
    url: '/order/credit100/creditRegisterInput',
    method: 'post',
    data: params
  })
}
// 获取方式
export function getByServer(params) {
  return serviceOther({
    url: '/manage/buttonConfig/getButtonByServer/v2',
    method: 'get',
    params
  })
}
//字典
export function setBookObj(params) {
  return serviceOther({
    url: '/manage/dict/getDictByTypes',
    method: 'post',
    data: params
  })
}

//推送至E分期
export function pushToEfenqi(params) {
  return request({
    url: '/order/eStageCreditInfo/pushEStage',
    method: 'post',
    data: params
  })
}
//E分期-终止查询
export function stopTask_E(params) {
  return request({
    url: '/order/eStageCreditInfo/applyForOrder',
    method: 'get',
    params
  })
}

export function getCreditType(params) {
  return request({
    url: '/manage/buttonConfig/getButtonByServer/v2?serverName=big-data-credit',
    method: 'get',
    params
  })
}
/**
 * 查询角色信息
 * @param params
 */
export function getCompanyName(params) {
  return request({
    url: '/user/getUserInfoByTo',
    method: 'get',
    params
  })
}
//安心签-签合同
export function signContract(params) {
  return request({
    url: '/order/eStageCreditInfo/creditElectronicCreateContract',
    method: 'post',
    data: params
  })
}