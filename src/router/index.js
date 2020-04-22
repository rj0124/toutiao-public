import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login/'
import Home from '@/views/home/'
import Layout from '@/views/layout/'

Vue.use(VueRouter)

// 路由配置表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    // 可以用路由的名字找到该路由
    // name: 'layout',
    component: Layout,
    children: [
      {
        // path为空,会作为默认子路由渲染
        path: '',
        // 可以用路由的名字找到该路由
        name: 'home',
        component: Home
      }
    ]
  }

]

const router = new VueRouter({
  routes
})

export default router
