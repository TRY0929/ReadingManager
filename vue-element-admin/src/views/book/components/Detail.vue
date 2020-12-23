<template>
  <div class="detail">
    <el-form ref="postForm" :model="postForm" class="from-container" :rules="rules">
      <!-- 显示帮助+提交表单按钮开始 -->
      <sticky :class-name="'sub-navbar'">
        <el-button @click="showGuide">显示帮助</el-button>
        <el-button
          v-loading="loading"
          type="success"
          @click="submitForm"
        >{{ isEdit ? '编辑电子书' : '新增电子书' }}</el-button>
      </sticky>
      <!-- 显示帮助+提交表单按钮结束 -->
      <div class="detail-container">
        <el-row>
          <warning />
          <!-- 上传图书区域 -->
          <el-col :span="24">
            <ebook-upload
              :disabled="isEdit"
              :file-list="fileList"
              @onSuccess="onUploadSuccess"
              @onRemove="onUploadRemove"
              @onError="onUploadError"
            />
          </el-col>
          <!-- 编辑图书区域+图书信息 -->
          <el-col :span="24">
            <!-- 书名开始 -->
            <el-form-item prop="title">
              <MDinput
                v-model="postForm.title"
                required
                name="title"
                :maxlength="100"
              >
                书名
              </MDinput>
            </el-form-item>
            <!-- 书名结束 -->
            <!-- 图书信息开始 -->
            <div>
              <!-- 作者+出版社 -->
              <el-row>
                <el-col :span="12">
                  <el-form-item prop="author" label="作者：" :label-width="labelWidth">
                    <el-input
                      v-model="postForm.author"
                      placeholder="作者"
                      style="width: 100%"
                    >作者</el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="publisher" label="出版社：" :label-width="labelWidth">
                    <el-input
                      v-model="postForm.publisher"
                      placeholder="出版社"
                      style="width: 100%"
                    >出版社</el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 语言+根文件 -->
              <el-row>
                <el-col :span="12">
                  <el-form-item prop="language" label="语言：" :label-width="labelWidth">
                    <el-input
                      v-model="postForm.language"
                      :placeholder="'语言'"
                      style="width: 100%"
                    >语言</el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="根文件：" :label-width="labelWidth">
                    <el-input
                      v-model="postForm.rootFile"
                      :placeholder="'根文件'"
                      style="width: 100%"
                      disabled
                    >根文件</el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 文件路径+解压路径 -->
              <el-row>
                <el-col :span="12">
                  <el-form-item label="文件路径：" :label-width="labelWidth">
                    <el-input
                      v-model="postForm.filePath"
                      :placeholder="'文件路径'"
                      style="width: 100%"
                      disabled
                    >文件路径</el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="解压路径：" :label-width="labelWidth">
                    <el-input
                      v-model="postForm.unzipPath"
                      :placeholder="'解压路径'"
                      style="width: 100%"
                      disabled
                    >解压路径</el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 封面路径+文件名称 -->
              <el-row>
                <el-col :span="12">
                  <el-form-item label="封面路径：" :label-width="labelWidth">
                    <el-input
                      v-model="postForm.coverPath"
                      :placeholder="'封面路径'"
                      style="width: 100%"
                      disabled
                    >封面路径</el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="文件名称：" :label-width="labelWidth">
                    <el-input
                      v-model="postForm.originalName"
                      :placeholder="'文件名称'"
                      style="width: 100%"
                      disabled
                    >文件名称</el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 封面 -->
              <el-row>
                <el-col :span="24">
                  <el-form-item label="封面：" :label-width="labelWidth">
                    <a v-if="postForm.cover" :href="postForm.cover" target="_blank">
                      <img :src="postForm.cover" class="preview-img">
                    </a>
                    <span v-else>无</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 目录 -->
              <el-row>
                <el-col>
                  <el-form-item label="目录：" :label-width="labelWidth">
                    <div v-if="chapterTree && chapterTree.length > 0" class="contents-container">
                      <el-tree
                        :data="chapterTree"
                        @node-click="onNodeClick"
                      />
                    </div>
                    <span v-else>无</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <!-- 图书信息结束 -->
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import Warning from './Warning'
import EbookUpload from '@/components/EbookUpload'
import MDinput from '@/components/MDinput'
import { createBook, getBook, updateBook } from '@/api/book'
const fileds = {
  title: '书名',
  author: '作者',
  publisher: '出版社',
  language: '语言'
}
export default {
  name: 'Detail',
  components: {
    Sticky,
    Warning,
    EbookUpload,
    MDinput
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (!value) {
        callback(new Error(fileds[rule.field] + '不能为空'))
      } else {
        callback()
      }
    }
    return {
      postForm: {}, // 表单内容
      loading: false,
      fileList: [],
      labelWidth: '120px',
      rules: {
        title: [{ validator: validateRequire }],
        author: [{ validator: validateRequire }],
        publisher: [{ validator: validateRequire }],
        language: [{ validator: validateRequire }]
      },
      chapterTree: []
    }
  },
  created() {
    if (this.isEdit) {
      const fileName = this.$route.params.fileName
      this.getBookData(fileName)
    }
  },
  methods: {
    // 目录条目点击事件 实现点击跳转到目录的url
    onNodeClick(data) {
      if (data.text) {
        window.open(data.text)
      }
    },
    // 将解析后的电子书数据显示到页面上(postForm)
    setData(data) {
      const {
        title,
        author,
        publisher,
        language,
        rootFile,
        filePath,
        coverPath,
        unzipPath,
        url,
        originalName,
        fileName,
        cover,
        contents,
        chapterTree
      } = data
      this.postForm = {
        ...this.postForm,
        title,
        author,
        publisher,
        language,
        rootFile,
        coverPath,
        filePath,
        unzipPath,
        url,
        originalName,
        cover,
        contents,
        fileName
      }
      this.chapterTree = chapterTree
      this.fileList = [{ name: originalName || fileName, url }]
    },
    // 显示帮助
    showGuide() {
      console.log('show guide...')
    },
    // 提交表单
    submitForm() {
      const toSuccess = (res) => {
        const { msg } = res
        this.$notify({
          title: '操作成功',
          message: msg,
          type: 'success',
          duration: 2000
        })
        this.loading = false
        this.setDefault()
      }
      if (!this.loading) {
        this.loading = true
        this.$refs.postForm.validate((valid, fileds) => {
          if (valid) {
            // 验证通过
            const book = { ...this.postForm }
            delete book.chapterTree
            if (!this.isEdit) {
              createBook(book).then(res => {
                toSuccess(res)
              })
                .catch(err => {
                  this.loading = false
                  console.log('submitForm', err)
                })
            } else {
              updateBook(book).then(res => {
                toSuccess(res)
              })
                .catch(() => {
                  this.loading = false
                })
            }
          } else {
            this.loading = false
            this.$message({
              message: ('请正确核对表单信息'),
              type: 'error'
            })
          }
        })
      }
    },
    // 上传文件成功
    onUploadSuccess(data) {
      console.log('onUploadSuccess', data)
      this.setData(data)
    },
    // 上传文件失败
    onUploadError(file) {
      console.log('onUploadError')
    },
    // 将data的值恢复为默认的
    setDefault() {
      this.postForm = {
        title: '',
        author: '',
        publisher: '',
        language: '',
        rootFile: '',
        filePath: '',
        coverPath: '',
        unzipPath: '',
        url: '',
        originalName: '',
        cover: ''
      }
      this.chapterTree = []
      this.fileList = []
      this.$refs.postForm.resetFields()
    },
    // 删除文件
    onUploadRemove() {
      this.setDefault()
      console.log('onUploadRemove')
    },
    // 编辑图书的时候根据书名拿到数据
    getBookData(fileName) {
      getBook(fileName).then(res => {
        this.setData(res.data)
      })
    }
  }
}
</script>

<style lang="scss" scope>
  @import "~@/styles/mixin.scss";
  .detail {
    position: relative;
    .detail-container {
      padding: 40px 45px 20px 50px;
      .preview-img {
        width: 200px;
        height: 270px;
      }
      .contents-wrapper {
        padding: 5px 0;
      }
    }
  }
</style>
