<template>
  <el-container class="layot-container">
    <el-aside class="aside" width="auto"><AppAside class="aside-menu" :is-collapse="isCollapse"/></el-aside>
    <el-container>
      <el-header class="header">
        <div>
          <i :class="{
            'el-icon-s-fold': isCollapse,
            'el-icon-s-unfold': !isCollapse
          }" @click="isCollapse = !isCollapse"></i>
          <span>江苏传智播客科技教育有限公司</span>
        </div>
        <el-dropdown>
          <div class="avatar-wrap">
            <img class="avatar" :src="user.photo" alt="">
            <span>{{ user.name }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <!-- <span>
            下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
          </span> -->
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>设置</el-dropdown-item>
            <!-- 组件默认不识别原生事件的,除非内部做了特殊处理 -->
            <!-- 原生事件修饰符 -->
            <el-dropdown-item @click.native="onLogout">退出</el-dropdown-item>
          </el-dropdown-menu>
      </el-dropdown>
      </el-header>
      <el-main class="main">
          <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from './components/aside'
import { getUserProfile } from '@/api/user'
import globalBus from '@/utils/global-bus'

export default {
  name: 'LayoutIndex',
  components: {
    AppAside
  },
  props: {},
  data () {
    return {
      // 当前用户登录信息
      user: {},
      isCollapse: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUserProfile()
    // 注册自定义事件
    globalBus.$on('update-user', (data) => {
      console.log('update-user', data)
      this.user.name = data.name
      this.user.photo = data.photo
    })
  },
  mounted () {},
  methods: {
    loadUserProfile () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },
    onLogout () {
      this.$confirm('确认退出吗?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 把用户登录状态清除
        window.localStorage.removeItem('user')
        // 跳转到登录页面
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
  .layot-container {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
  }

  .aside {
      .aside-menu {
          height: 100%;
      }
  }

  .header {
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #ccc ;
  }

  .main {
      background-color: #fff;
  }

  .avatar-wrap {
      display: flex;
      align-items: center;
      .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
      }
  }

</style>
