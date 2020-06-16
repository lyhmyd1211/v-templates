<template>
  <div class="dashboard-container">
    <div class="dashboard-text">组件说明：</div>
    <div class="example">
      <el-card>
        <el-row>comm-upload是对element上传的封装，简化了上传前及上传后的处理</el-row>
        <el-row>
          <comm-upload
            v-bind="uploadPorps"
            @getUpload="getUpload($event,'pic')"
            @getFileList="getFileList($event,'pic')"
          />
          <!-- @setFileList="setFileList($event)" -->
        </el-row>
        <el-row>
          <label>值类型：</label>
          <span>{{ typeof(picData) }}</span>
        </el-row>
        <el-row>
          <label>返回值：</label>
          <el-input :value="picData" readonly />
        </el-row>
      </el-card>
      <el-card>
        <editor
          id="richContent"
          v-model="richData"
          width="100%"
          :height="500"
          @change="getContent"
        />
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CommUpload from '@/components/CommUpload'
import Editor from '@/components/Editor'
export default {
  name: 'Dashboard',
  components: {
    CommUpload,
    Editor
  },
  data() {
    return {
      picData: '',
      picList: '',
      richData: '',
      uploadPorps: {
        action: process.env.VUE_APP_UPLOAD_URL,
        listType: 'picture',
        limit: 1,
        className: 'upload-com',
        fileSize: 1, // 文件大小
        uploadBtn: '选择图片', // 按钮文字
        tip: '尺寸512*512.大小1M以内，图片格式支持png,jpeg,jpg', // 上传提示
        saveType: 'json', // 返回数据的类型 array|json
        limitHideBtn: true, // 达到上传个数阈值时是否隐藏上传按钮
        format: ['png', 'jpeg', 'jpg'] // 限制的文件类型
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    // setFileList(fn, index) {
    //   fn([{ name: '2', url: '3' }])
    // },
    getUpload(val, type) {
      this.picData = val
    },
    getFileList(val, type) {

    },
    getContent(val) {
      this.richData = val
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
<style lang="scss">
.dashboard-container {
  .upload-com {
    // width: 200px;
  }
  .el-card {
    margin: 20px 0;
    width: 1000px;
  }
  .el-row {
    margin: 20px 0;
  }
  label {
    padding: 20px 0;
    width: 100px;
  }
  .el-input {
    width: 800px;
  }
}
</style>
