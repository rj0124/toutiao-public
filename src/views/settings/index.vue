<template>
  <div class="settings-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row>
        <el-col :span="15">
          <el-form ref="form" :model="user" label-width="70px">
            <el-form-item label="编号">
              {{user.id}}
            </el-form-item>
            <el-form-item label="手机">
              {{user.name}}
            </el-form-item>
            <el-form-item label="媒体名称">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
             <el-form-item label="媒体介绍">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
              type="primary"
              @click="onUpdateUser"
              :loading="updateUserProfileLoading"
              >保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :offset="2" :span="4">
          <!-- <el-avatar shape="square" :size="150" fit="cover" :src="user.photo"></el-avatar> -->
          <!-- <p @click="$refs.file.click()">点击修改头像</p> -->
          <label for="file">
            <el-avatar shape="square" :size="150" fit="cover" :src="user.photo"></el-avatar>
            <p>点击修改头像</p>
          </label>
          <input type="file" hidden ref="file" id="file" @change="onFileChange">
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
      title="修改头像"
      :visible.sync="dialogVisible"
      append-to-body
      @opened="onDialogOpened"
      @closed="onDialogClosed"
      >
      <div class="preview-image-wrap">
        <img
          class="preview-image"
          :src="previewImage"
          ref="preview-image"
          >
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
        type="primary"
        :loading="updatePhotoLoading"
        @click="onUpdatePhoto">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getUserProfile, updateUserPhoto, updateUserProfile } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import globalBus from '@/utils/global-bus'

export default {
  name: 'SettingsIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        email: '',
        id: null,
        intro: '',
        mobile: '',
        name: '',
        photo: ''
      },
      dialogVisible: false, // 控制上传图片的裁切预览
      previewImage: '', // 预览图片
      cropper: null, // 裁剪器示例
      updatePhotoLoading: false,
      updateUserProfileLoading: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUser()
  },
  mounted () {},
  methods: {
    async onUpdateUser () {
      // 表单验证
      this.updateUserProfileLoading = true
      const { name, intro, email } = this.user
      const res = await updateUserProfile({
        name,
        intro,
        email
      })
      this.$message({
        type: 'success',
        message: '保存成功'
      })
      this.updateUserProfileLoading = false
      // 发布通知
      globalBus.$emit('update-user', this.user)
    },
    loadUser () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },
    onFileChange () {
      // 处理图片预览
      const file = this.$refs.file
      const blobData = window.URL.createObjectURL(file.files[0])
      this.previewImage = blobData
      // 展示弹出层,预览用户选择的图片
      this.dialogVisible = true

      // 解决相同文件不触发 change 事件事件
      this.$refs.file.value = ''
    },
    onDialogOpened () {
      // 获取图片dom节点
      const image = this.$refs['preview-image']

      if (this.cropper) {
        this.cropper.replace(this.previewImage)
        return
      }

      this.cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: 'none',
        cropBoxResizable: false
      })
    },
    onDialogClosed () {
      // 对话框关闭,销毁裁剪器
      // this.cropper.destroy()
    },

    getCroppendCanvas () {
      return new Promise((resolve, reject) => {
        this.cropper.getCroppendCanvas().toBlob(file => {
          resolve(file)
        })
      })
    },

    async onUpdatePhoto () {
      this.updatePhotoLoading = true
      // 获取裁切的图片对象
      const file = await this.getCroppendCanvas()
      const fd = new FormData()
      fd.append('photo', file)
      // 请求更新用户头像
      updateUserPhoto(fd)
      // 关闭对话框
      this.dialogVisible = false
      // 更新视图展示
      // this.user.photo = res.data.data.photo
      this.user.photo = window.URL.createObjectURL(file)
      this.updatePhotoLoading = false
      this.$message({
        type: 'success',
        message: '更新头像成功'
      })
      globalBus.$$emit('update-user', this.user)
    }
  }
}
</script>
<style scoped lang="less">
.preview-image-wrap {
  .preview-image {
    display: block;
    max-width: 100%;
    height: 200px;
  }
}
</style>
