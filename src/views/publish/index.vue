<template>
  <div class="publish-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $route.query.id ? '修改文章' : '发布文章' }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form ref="publish-form" :model="article" :rules="formRules" label-width="60px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <!-- <el-input type="textarea" v-model="article.content"></el-input> -->
          <el-tiptap placeholder="请输入文章内容" height="300px" v-model="article.content" :extensions="extensions"></el-tiptap>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option v-for="(channel, index) in channels" :key="index" :label="channel.name" :value="channel.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">发布</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { getArticleChannels, addArticle, updateArticle, getArticle } from '@/api/article'
import 'element-tiptap/lib/index.css'
import {
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Image,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  HorizontalRule,
  Fullscreen,
  Preview,
  CodeBlock,
  TextColor
} from 'element-tiptap'
import { uploadImage } from '@/api/image'

export default {
  name: 'publishIndex',
  components: {
    'el-tiptap': ElementTiptap
  },
  props: {},
  data () {
    return {
      channels: [], // 文章频道列表
      article: {
        title: '', // 文章标题
        content: '', // 文章内容
        cover: {
          type: 0, // 封面类型
          images: [] // 封面图片的地址
        },
        channel_id: null
      },
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Underline(), // 下划线
        new Italic(), // 斜体
        new Image({
          // 自定义图片上传
          uploadRequest (file) {
            const fd = new FormData()
            fd.append('image', file)
            return uploadImage(fd).then(res => {
              return res.data.data.url
            })
          }
        }),
        new Strike(), // 删除线
        new ListItem(),
        new BulletList(), // 无序列表
        new OrderedList(), // 有序列表
        new TodoItem(),
        new TodoList(),
        new HorizontalRule(),
        new Fullscreen(),
        new Preview(),
        new CodeBlock(),
        new TextColor()
      ],
      formRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blue' },
          { min: 5, max: '30', message: '长度在5到30个字符', trigger: 'blue' }
        ],
        content: [
          // { required: true, message: '请输入文章标题', trigger: 'change' }
          {
            validator (rule, value, callback) {
              if (value === '<p></p>') {
                callback(new Error('请输入文章内容'))
              } else {
                callback()
              }
            }
          },
          { required: true, message: '请输入文章内容', trigger: 'blue' }
        ],
        channel_id: [
          { required: true, message: '请输入文章频道' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadChannels()

    // 由于发布与修改用的同一个组件,所以这里要判断
    // 如果路由路径参数里面有id,则请求展示文章内容
    if (this.$route.query.id) {
      this.loadArticle()
    }
  },
  mounted () {},
  methods: {
    loadChannels () {
      getArticleChannels().then(({ data }) => {
        // console.log(res)
        this.channels = data.data.channels
      })
    },
    onPublish (draft = false) {
      this.$refs['publish-form'].validate(valid => {
        if (!valid) {
          return
        }
        // 找到数据接口
        // 封装请求方法
        // 请求提交表单
        // 如果是编辑文章,则执行修改操作
        const articleId = this.$route.query.id
        if (this.$route.query.id) {
          updateArticle(articleId, this.article, draft).then(res => {
            this.$message({
              message: `${draft ? '存入草稿' : '发布'}成功`,
              type: 'success'
            })
            // 跳转到内容管理页面
            this.$router.push('/article')
          })
        } else {
          addArticle(this.article, draft).then(res => {
            console.log(res)
            this.$message({
              message: `${draft ? '存入草稿' : '发布'}成功`,
              type: 'success'
            })
            // 跳转到内容管理页面
            this.$router.push('/article')
          })
        }
      })
      // 处理响应结果
    },

    // 编辑文章
    loadArticle () {
      console.log('loadArticle')
      // 找到数据接口
      // 封装请求方法
      // 请求获取数据
      getArticle(this.$route.query.id).then(res => {
        // 模块绑定展示
        this.article = res.data.data
      })
    }
  }
}
</script>

<style scoped lang="less">
</style>
