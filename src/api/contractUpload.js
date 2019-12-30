//合同上传
import request from '@/utils/request'
import Qs from 'qs'

export default {
  // 获取列表
  getList: params => request({url: '/order/project/list', method: 'get', params}),

  // 获取列表详情
  getListDetails: params => request({url: '/order/project/getProjectInfo', method: 'get', params}),

  // 获取图片列表
  getImagesList: params => request({url: '/document/api/list', method: 'get', params}),

  // 提交备注信息
  submitRemark: params => request({url: '/order/project/update/remark', method: 'post', data:params})
}