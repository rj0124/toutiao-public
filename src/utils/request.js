// 导入axios
import axios from 'axios'

// 创建axios实例
// 我们通过这个实例去发送请求,把需要的配置配置给这个实例
const request = axios.create({
  // 请求的基本路径
  baseURL: 'http://ttapi.research.itcast.cn'
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
