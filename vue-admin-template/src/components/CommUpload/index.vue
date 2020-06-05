<template>
  <div class="common-upload">
    <el-upload
      :class="{[className]:true,'_upload-hide-btn':!showBtn}"
      :action="action"
      :headers="headers"
      :multiple="multiple"
      :data="data"
      :name="name"
      :with-credentials="withCredentials"
      :show-file-list="showFileList"
      :drag="drag"
      :list-type="listType"
      :accept="accept"
      :before-upload="beforeUpload||before"
      :on-success="onSuccess||success"
      :on-remove="onRemove||remove"
      :file-list="fileList"
      :limit="limit"
      :limit-hide-btn="limitHideBtn"
    >
      <el-button v-if="uploadBtn&&showBtn" size="small" class="upload-btn">{{ uploadBtn }}</el-button>
      <slot name="upload-btn" />
      <div v-if="tip&&showBtn" slot="tip" class="el-upload__tip tip-common">{{ tip }}</div>
    </el-upload>
    <slot name="upload-tip" />
  </div>
</template>

<script>
export default {
  props: {
    propList: {
      type: Array,
      default() {
        return []
      }
    },
    saveType: {
      type: String,
      default() {
        return 'json'
      }
    },
    fileSize: {
      type: [Number, Boolean],
      default() {
        return 50
      }
    },
    format: {
      type: Array,
      default() {
        return []
      }
    },
    tip: {
      type: String,
      default() {
        return ''
      }
    },
    uploadBtn: {
      type: String,
      default() {
        return ''
      }
    },
    limitHideBtn: {
      type: Boolean
    },
    listType: {
      type: String,
      default() {
        return 'text'
      }
    },
    limit: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default() {
        return false
      }
    },
    className: {
      type: String,
      default() {
        return 'upload-img'
      }
    },
    action: {
      type: String,
      default() {
        return '/'
      }
    },
    // eslint-disable-next-line vue/require-default-prop
    headers: {
      type: Object
    },
    multiple: {
      type: Boolean,
      default() {
        return false
      }
    },
    // eslint-disable-next-line vue/require-default-prop
    data: {
      type: Object
    },
    name: {
      type: String,
      default() {
        return 'file'
      }
    },
    withCredentials: {
      type: Boolean,
      default() {
        return false
      }
    },
    showFileList: {
      type: Boolean,
      default() {
        return true
      }
    },
    drag: {
      type: Boolean,
      default() {
        return false
      }
    },
    // eslint-disable-next-line vue/require-default-prop
    accept: {
      type: String
    },
    // eslint-disable-next-line vue/require-default-prop
    onPreview: {
      type: Function
    },
    // eslint-disable-next-line vue/require-default-prop
    onRemove: {
      type: Function
    },
    // eslint-disable-next-line vue/require-default-prop
    onSuccess: {
      type: Function
    },
    // eslint-disable-next-line vue/require-default-prop
    beforeUpload: {
      type: Function
    }
  },
  data() {
    return {
      file: '',
      fileList: [],
      uploadData: '[]',
      showBtn: true
    }
  },
  watch: {
    propList(val) {
      console.log('qwdqwd', this.propList)
      if (val) {
        this.fileList = [...val]
        this.uploadData = JSON.stringify(val)
      }
    },
    fileList() {
      if (this.limitHideBtn && this.fileList.length >= this.limit) {
        this.showBtn = false
      } else {
        this.showBtn = true
      }
    }
  },
  created() {
    if (this.propList) {
      this.fileList = [...this.propList]
      this.uploadData = JSON.stringify(this.propList)
    }
    this.$emit('setFileList', this.setFileList)
  },
  methods: {
    setFileList(list) {
      this.fileList = [...list]
    },
    before(file) {
      if (this.limit && this.fileList.length === this.limit) {
        this.$message({
          message: `超出文件个数限制，只能上传${this.limit}个文件！`,
          type: 'error'
        })
        return false
      }
      if (this.fileSize && file.size / 1024 / 1024 > this.fileSize) {
        this.$message({
          message: `请上传小于${this.fileSize}M的文件！`,
          type: 'error'
        })
        return false
      }
      var str = file.name.split('.')[file.name.split('.').length - 1]
      const ucaseFormat = [...this.format]
      console.log('object', this)
      this.format.forEach(element => {
        ucaseFormat.push(element.toUpperCase())
      })
      if (this.format.length > 0 && ucaseFormat.indexOf(str) < 0) {
        this.$message({
          message: `请上传${this.format.join(',')}格式的文件！`,
          type: 'error'
        })
        return false
      }
      var pattern = new RegExp('[/\\%&?]')
      if (pattern.test(file.name)) {
        this.$message({
          message: '文件名不能包含 /\\%&? 特殊字符',
          type: 'error'
        })
        return false
      }
    },
    success(res, file, fileList) {
      if (this.saveType === 'json') {
        let arr = []
        if (this.uploadData) {
          arr = JSON.parse(this.uploadData)
        }
        arr.push(res)
        this.uploadData = JSON.stringify(arr)
      } else if (this.saveType === 'array') {
        let arr = []
        if (this.uploadData) {
          arr = JSON.parse(this.uploadData)
        }
        arr.push(res.url)
        this.uploadData = JSON.stringify(arr)
      }
      this.fileList = fileList
      this.$emit('getUpload', this.uploadData)
      this.$emit('getFileList', this.fileList)
    },
    remove(file, fileList) {
      this.fileList = fileList
      if (fileList.length > 0) {
        if (this.saveType === 'json') {
          this.uploadData = JSON.stringify(fileList)
        } else if (this.saveType === 'array') {
          this.uploadData = []
          this.fileList.forEach(element => {
            this.uploadData.push(element.url)
          })
          this.uploadData = JSON.stringify(this.uploadData)
        }
      } else {
        this.uploadData = ''
      }
      this.$emit('getUpload', this.uploadData)
      this.$emit('getFileList', this.fileList)
    }
  }
}
</script>

<style lang="scss" >
.common-upload {
  .el-upload__tip {
    margin-left: 20px;
    margin-top: 0px;
    color: red;
    display: inline-block;
  }
  ._upload-hide-btn {
    line-height: 0;
    .el-upload {
      display: none;
    }
  }
}
</style>
