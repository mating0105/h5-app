import { serviceOther } from '@/utils/request'

// 照片
export const getDocumentByType = params => serviceOther({
  method: 'post',
  url: '/document/getDocumentBytype',
  data: params
})

// 照片
export const uploadsDocument = params => {
  const formData = new FormData()
  for (let key in params) {
    if(params.hasOwnProperty(key)) {
      if(Object.prototype.toString.call(params[key]) === "[object Array]") {
        for (let i = 0;i < params[key].length;i++) {
          formData.append(key, params[key][i])
        }
      } else {
        formData.append(key, params[key])
      }
    }
  }
  return serviceOther({
    method: 'post',
    url: '/document/uploads',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    data: formData
  })
}

// 照片
export const removeDocument = params => serviceOther({
  method: 'post',
  url: '/document/delete',
  data: params
})
