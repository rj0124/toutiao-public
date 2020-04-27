<template>
 <div class="article-container">
   <el-card class="filter-card">
     <div slot="header" class="clearfix">
       <!-- 面包屑路径导航 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
         <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
         <el-breadcrumb-item>内容管理</el-breadcrumb-item>
       </el-breadcrumb>
     </div>
       <!-- 数据筛选表单 -->
    <el-form ref="form" :model="form" label-width="50px" size="mini">
        <el-form-item label="状态">
        <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
        </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
        <el-select v-model="channelId" placeholder="请选择频道 ">
            <el-option label="全部" :value="null" ></el-option>
            <el-option :label="channel.name" :value="channel.id" v-for="(channel, index) in channels" :key="index"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="日期">
        <el-date-picker
            v-model="rangeDate"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            >
        </el-date-picker>
        </el-form-item>
        <el-form-item>
        <el-button type="primary" :disabled="loading" @click="loadArticles(1)">筛选</el-button>
        </el-form-item>
    </el-form>
   </el-card>

   <el-card class="box-card">
     <div slot="header" class="clearfix">
       根据筛选条件查询到 {{totalCount}} 条结果
     </div>
     <!-- 数据列表 -->
     <!-- Table表格组件
     1 把需要展示的数据列表绑定给 table 组件的data 属性
     2 label 可以设定列的标题
     3 prop 用来设置要渲染的列表项数据字段 -->
    <el-table
      :data="articles"
      stripe
      style="width: 100%"
      class="list-table"
      size='mini'
      v-loading="loading"
      >
      <el-table-column
        prop="date"
        label="封面">
        <template slot-scope="scope">
          <el-image
          style="widtn: 100px; height: 100px"
          :src="scope.row.cover.images[0]"
          fit="cover"
          lazy>
          </el-image>
          <!-- <img v-if="scope.row.cover.images[0]" :src="scope.row.cover.images[0]" alt="" class="article-cover">
          <img v-else src="./no-cover.gif" alt="" class="article-cover"> -->
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题">
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          <el-tag type="articleStatus[scope.row.status].type">{{ articleStatus[scope.row.status].text }}</el-tag>
          <!-- <el-tag v-if="scope.row.status===1">待审核</el-tag>
          <el-tag type="success" v-if="scope.row.status===2">审核通过</el-tag>
          <el-tag type="danger" v-if="scope.row.status===3">审核失败</el-tag>
          <el-tag type="info" v-if="scope.row.status===4">已删除</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column
        prop="pubdate"
        label="发布时间">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            circle
            icon="el-icon-edit"
            type="primary"
            @click="$router.push('/publish?id='+scope.row.id.toString())"
          ></el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            circle
            @click="onDeleteArticle(scope.row.id)"
            ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalCount"
      @current-change="onCurrentChange"
      :page-size="pageSize"
      :disabled="loading"
      :current-page.sync="page"
      >
    </el-pagination>
   </el-card>
 </div>
</template>
<script>
import { getArticles, getArticleChannels, deleteArticle } from '@/api/article'

export default {
  name: 'ArticleIndex',
  components: {},
  props: {},
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      articles: [], // 文章数据列表
      articleStatus: [
        { status: 0, text: '草稿', type: 'info' },
        { status: 1, text: '待审核', type: '' },
        { status: 2, text: '审核通过', type: 'success' },
        { status: 3, text: '审核失败', type: 'warning' },
        { status: 4, text: '已删除', type: 'danger' }
      ],
      totalCount: 0, // 总数据条数
      pageSize: 10, // 每页大小
      status: null, // 查询文章的状态
      channels: [], // 文章频道列表
      channelId: null, // 查询文章的频道
      rangeDate: null, // 筛选的范围日期
      loading: true, // 表格数据加载中
      page: 1
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadChannels()
    this.loadArticles()
  },
  mounted () {},
  methods: {
    loadArticles (page = 1) {
      this.loading = true
      getArticles({
        page: page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null, // 开始日期
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null // 截止日期
      }).then(res => {
        const { results, total_count: totalCount } = res.data.data
        this.articles = results
        this.totalCount = totalCount

        // 关闭加载中loading
        this.loading = false
      })
    },
    onSubmit () {
      console.log('submit!')
    },
    onCurrentChange (page) {
      this.loadArticles(page)
    },
    loadChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    onDeleteArticle (articleId) {
      this.$confirm('确认删除吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArticle(articleId.toString()).then(res => {
          this.loadArticles(this.page)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      // 找到数据接口
      // 封装请求方法
      // 删除请求调用
      // 处理响应结果
    }
  }
}
</script>

<style scoped lang="less">
.filter-card {
    margin-bottom: 30px;
}

.list-table {
    margin-bottom: 20px;
}

.article-cover {
  width: 100px;
  background-size: cover;
}
</style>
