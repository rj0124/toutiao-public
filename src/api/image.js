import request from '@/utils/request'

export const uploadImage = data => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/user/images',
    // 一般文件上传的接口都要求把请求头中的 Content-Type 设置为 multipart/from-data,但是我们使用axios上传文件的话不需要手动设置,只需要给data一个FormData对象即可
    data
  })
}
