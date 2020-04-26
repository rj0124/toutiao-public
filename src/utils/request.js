// 导入axios
import axios from 'axios'
import JSONbig from 'json-bigint'

// 创建axios实例
// 我们通过这个实例去发送请求,把需要的配置配置给这个实例
const request = axios.create({
  // 请求的基本路径
  baseURL: 'http://ttapi.research.itcast.cn',
  // 订制后端返回的原始数据处理
  // 参数data就是后端返回的原始数据,(未经处理的JSON格式)
  transformResponse: [function (data) {
    // console.log(data)
    try {
      // 后端返回的可能不是JSON字符串
      // 如果不是,那么JSON.parse 调用就会出错
      // 所以我们使用, try-catch 来捕获异常,处理异常的发生
      return JSONbig.parse(data)
    } catch (err) {
      return data
    }
  }]
})

// 请求拦截器
// 所有请求都会经过这里
// config是当前请求相关的配置信息对象
request.interceptors.request.use(function (config) {
  const user = JSON.parse(window.localStorage.getItem('user'))
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 导出request模块
export default request

// 谁使用,谁加载
