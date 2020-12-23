<template>
  <div class="upload-container">
    <el-upload
      :action="action"
      :headers="headers"
      :multiple="false"
      :limit="1"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :on-error="onError"
      :on-exceed="onExceed"
      :on-remove="onRemove"
      :file-list="fileList"
      :disabled="disabled"
      drag
      show-file-list
      accept="application/epub+zip"
      class="image-uploader"
    >
      <i class="el-icon-upload" />
      <div v-if="fileList.length === 0" class="el-upload__text">
        请将文件拖入或<em>点击上传</em>
      </div>
      <div v-else class="el-upload__text">图书已上传</div>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  name: 'EbookUpload',
  props: {
    fileList: {
      type: Array,
      default() {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      action: `${process.env.VUE_APP_BASE_API}/book/upload`
    }
  },
  computed: {
    // 添加http头 token验证
    headers() {
      return {
        Authorization: `Bearer ${getToken()}`
      }
    }
  },
  methods: {
    // 图书上传前触发的函数
    beforeUpload(file) {
      console.log(file)
      // 触发beforeUpload事件并将文件作为参数传给父组件进行处理
      this.$emit('beforeUpload', file)
    },
    // 图书上传成功后
    onSuccess(res, file) {
      const { code, msg, data } = res
      if (code === 0) {
        this.$message({
          message: msg,
          type: 'success'
        })
        this.$emit('onSuccess', data)
      } else {
        this.$message({
          message: (msg && `上传失败，原因:${msg}`) || '上传失败',
          type: 'error'
        })
        this.$emit('onError', file)
      }
    },
    // 图书上传失败
    onError(err) {
      const errMsg = err.message ? JSON.parse(err.message) : ''
      this.$message({
        message: (errMsg && errMsg.msg) ? `上传失败，原因:${errMsg.msg}` : '上传失败',
        type: 'error'
      })
      this.$emit('uploadError', err)
    },
    // 上传文件超过数量限制
    onExceed() {
      this.$message({
        message: '每次只能上传一本电子书',
        type: 'warning'
      })
    },
    // 点击上传之后的删除按钮
    onRemove() {
      this.$message({
        message: '删除电子书成功',
        type: 'success'
      })
      this.$emit('onRemove')
    }
  }
}
</script>

<style lang="scss" scope>
  .upload-container {
    width: 100%;
    height: 100%;
    position: relative;

    .image-uploader {
      height: 100%;
    }
  }
</style>
