// 导入axios
import axios from 'axios'

// 创建axios实例
// 我们通过这个实例去发送请求,把需要的配置配置给这个实例
const request = axios.create({
  // 请求的基本路径
  baseURL: 'http://ttapi.research.itcast.cn'
})

// 导出request模块
export default request

// 谁使用,谁加载
