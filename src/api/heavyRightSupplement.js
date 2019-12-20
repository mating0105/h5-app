/*
 * @Description:
 * @Author: shenah
 * @Date: 2019-12-18 14:42:09
 * @LastEditors  : shenah
 * @LastEditTime : 2019-12-20 09:50:30
 */

import request, { serviceOther } from "@/utils/request"; // 报单列表
// 重权补录列表
export function queryRightSuppleList(params) {
  return request({
    url: "/order/projCust/list",
    method: "get",
    params
  });
}
// 单个补录详情
export function queryRightSuppleDetails(params) {
  return request({
    url: "/order/projCust/startProcess",
    method: "get",
    params
  });
}
// 基本信息的保存
export function saveHeavyRightBasic(params) {
  return request({
    url: "/order/projCust/acManagerSave",
    method: "post",
    data:params
  });
}
