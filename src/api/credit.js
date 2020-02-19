import request from '@/utils/request'

/**
 * 获取银行
 * @param params
 */
export function getBank(params) {
  return request({
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
    url: '/order/creditInfo/cuCreditRegisterFormMob',
    method: 'get',
    params
  })
}

/**
 * 获取征信列表
 * @param params
 */
export function getList(params) {
  return request({
    url: '/order/creditInfo/queryCreaditRegister',
    method: 'get',
    params
  })
}

/**
 * 获取征信按钮列表
 * @param params
 */
export function getButtonList(params) {
  return request({
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
