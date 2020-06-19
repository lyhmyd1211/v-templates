<template>
  <div>
    <editor :id="id" v-model="contentData" :init="editorInit" />
    <div id="progress-parent">
      <div v-show="uploading" id="progress" class="upload-progress">
        <div
          class="upload-progress-background"
          :style="{'width':uploadPercent+'%'}"
        >{{ uploadPercent }}%</div>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import axios from 'axios'
import 'tinymce/themes/silver'
import 'tinymce/plugins/image' // 插入上传图片插件
import 'tinymce/plugins/media' // 插入视频插件
import 'tinymce/plugins/table' // 插入表格插件
import 'tinymce/plugins/lists' // 列表插件
import 'tinymce/plugins/wordcount' // 字数统计插件
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/link'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/print'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/code'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/imagetools'
import 'tinymce/plugins/autoresize'

// import 'tinymce/plugins/lineheight'
export default {
  components: {
    Editor
  },
  model: {
    prop: 'message',
    event: 'change'
  },
  props: {
    width: {
      type: [Number, String],
      default: 800
    },
    height: {
      type: [Number, String],
      default: 800
    },
    message: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    uploadUrl: {
      type: String,
      default: process.env.VUE_APP_UPLOAD_URL
    },
    plugins: {
      type: [String, Array],
      default: () => {
        return [
          'advlist autolink lists link image  charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table powerpaste imagetools wordcount lineheight autoresize'
        ]
      }
    },
    toolbar: {
      type: [String, Array],
      default:
        'undo redo | styleselect |lineheight| bold italic strikethrough  | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media link   | removeformat fullscreen'
    },
    id: {
      type: String,
      default: 'tinymce'
    }
  },
  data() {
    return {
      uploading: false,
      uploadPercent: 0,
      contentData: '',
      editorInit: {
        // GLOBAL
        font_formats: `
          宋体=SimSun;
          微软雅黑=Microsoft Yahei;
          新宋体=NSimSun;
          黑体=SimHei;
          楷体=KaiTi;
          仿宋=FangSong;
          微软正黑体=Microsoft JhengHei;
          Courier New=courier new,courier,monospace;
          AkrutiKndPadmini=Akpdmi-n;
          Andale Mono=andale mono,times;
          Arial=arial,helvetica,sans-serif;
          Arial Black=arial black,avant garde;
          Book Antiqua=book antiqua,palatino;
          Comic Sans MS=comic sans ms,sans-serif;
          Courier New=courier new,courier;
          Georgia=georgia,palatino;
          Helvetica=helvetica;
          Impact=impact,chicago;
          Symbol=symbol;
          Tahoma=tahoma,arial,helvetica,sans-serif;
          Terminal=terminal,monaco;
          Times New Roman=times new roman,times;
          Trebuchet MS=trebuchet ms,geneva;
          Verdana=verdana,geneva;
          Webdings=webdings;
          Wingdings=wingdings,zapf dingbats;
         `,
        base_url: `${process.env.BASE_URL}tinymce_tools`,
        // content_css:
        //   '/tinymce_tools/skins/content/default/content.css',
        // skin_url: '/tinymce_tools/skins/ui/oxide',
        skin: 'oxide',
        width: this.width,
        height: this.height,
        // menubar: false,
        language: 'zh_CN',
        // language_url: '/tinymce_tools/langs/zh_CN.js',
        // statusbar: false,
        toolbar: this.toolbar,
        plugins: this.plugins,
        external_plugins: {
          powerpaste:
            `${process.env.BASE_URL}tinymce_tools/plugins/powerpaste/plugin.min.js`,
          lineheight: `${process.env.BASE_URL}tinymce_tools/plugins/lineheight/plugin.min.js`
        },
        min_height: 500,
        imagetools_cors_hosts: ['58.16.65.111'],
        lineheight_val: '1 1.25 1.5 1.75 2 2.5 3 3.5 4 4.5 5',
        // target_list: false,
        file_picker_types: 'media image file',
        // be used to add custom file picker to those dialogs that have it.
        file_picker_callback: (cb, value, meta) => {
          // if (meta.filetype == "media") {
          const input = document.createElement('input')
          input.setAttribute('type', 'file')
          const vm = this
          input.onchange = function () {
            document
              .getElementsByClassName('tox-control-wrap')[0]
              .appendChild(document.getElementById('progress'))
            vm.uploading = true
            const formData = new FormData()
            formData.append('file', this.files[0])
            var pattern = new RegExp('[/\\%&?]')
            if (pattern.test(this.files[0].name)) {
              vm.$message({
                message: '文件名不能包含 /\\%&? 特殊字符',
                type: 'error'
              })
              if (document.getElementById('progress')) {
                document
                  .getElementById('progress-parent')
                  .appendChild(document.getElementById('progress'))
              }
              vm.uploading = false
              vm.uploadPercent = 0
            } else {
              axios(vm.uploadUrl, {
                method: 'post',
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: progressEvent => {
                  if (progressEvent.lengthComputable) {
                    vm.uploadPercent = parseInt(
                      (progressEvent.loaded / progressEvent.total) * 100
                    ).toFixed(1)
                  }
                }
              })
                .then(res => {
                  if (meta.filetype === 'file') {
                    cb(res.data.url, { text: res.data.name })
                  } else {
                    cb(res.data.url)
                  }
                  document
                    .getElementById('progress-parent')
                    .appendChild(document.getElementById('progress'))
                  vm.uploading = false
                  vm.uploadPercent = 0
                })
                .catch(err => {
                  if (err) {
                    if (document.getElementById('progress')) {
                      document
                        .getElementById('progress-parent')
                        .appendChild(document.getElementById('progress'))
                    }
                    vm.uploading = false
                    vm.uploadPercent = 0
                  }
                })
            }
          }
          input.click()
        },
        // CONFIG: ContentStyle 这块很重要， 在最后呈现的页面也要写入这个基本样式保证前后一致，
        content_style: `
            .tab-main {
              zoom: 1;
              position: relative;
              display: flex;
              justify-content: center;
              width: 1200px;
              margin: auto;
            }
            .tab-main::after {
              display: block;
              clear: both;
              content: "";
              visibility: hidden;
              height: 0;
            }

            .tab-main .tab-item {
              list-style: none;
              margin-right: 4px;
            }

            .tab-item .tab-input {
              cursor: pointer;
              position: relative;
              display: inline-block;
              width: 85px;
              height: 27px;
              border: 1px solid transparent;
              line-height: 27px;
              text-align: center;
            }

            .tab-item .tab-box {
              position: absolute;
              left: 0;
              top: 28px;
              width: 1200px;
              height: 400px;
              border-radius: 5px;
              border-top-left-radius: 0px;
              background: #fff;
              border-top: 1px solid #eee;
              z-index: 0;
            }
            .tab-radio {
            }
            .tab-label {
              display: none;
            }

            .tab-radio:checked + .tab-input {
              color: #457cff;
              border-bottom: 1px solid #457cff;
              z-index: 10;
            }
            .tab-radio:checked ~ .tab-box {
              z-index: 5;
            }
            html                      {padding:0 50px}
            .tab-nav-item             {border:1px solid #eee;min-width:100px}
            .tab-nav                  {border-bottom:1px solid #eee}
            *                         { padding:0; margin:0; }
            a                         { color:#0000EE; text-decoration: underline; }
            iframe                    { width: 100%; }
            p                         { line-height:1.5; margin: 0px;}
            div                       { line-height:1.5; margin: 0px;}
            table                     { word-wrap:break-word; word-break:break-all; max-width:100%; border:none; border:#999; }
            .mce-object-iframe        { width:100%; box-sizing:border-box; margin:0; padding:0; }
            ul,ol                     { list-style-position:inside; }
          `,
        // CONFIG: Paste
        powerpaste_word_import: 'propmt', // 参数可以是propmt, merge, clear，效果自行切换对比
        powerpaste_html_import: 'propmt', // propmt, merge, clear
        powerpaste_allow_local_images: true,
        images_upload_handler: (blobInfo, success, failure) => {
          const formData = new FormData()
          formData.append('file', blobInfo.blob(), blobInfo.filename())
          console.log('upload', this.uploadUrl)
          axios(this.uploadUrl, {
            method: 'post',
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
          }).then(res => {
            success(res.data.url)
          })
        },

        init_instance_callback: editor => {
          this.$emit('getInstance', editor)
        },
        paste_data_images: true // 粘贴的同时能把内容里的图片自动上传，非常强力的功能
        // Image
      }
    }
  },
  watch: {
    contentData(val) {
      this.$emit('change', val)
    },
    message(val) {
      if (val !== this.contentData) {
        this.contentData = val
      }
    }
  },
  mounted() {
    this.contentData = this.message
  },
  methods: {
    change(val) { }
  }
}
</script>

<style lang="scss" scoped>
.upload-progress {
  position: absolute;
  width: 100%;
  top: 0px;
  background-color: #ebeef5;
  .upload-progress-background {
    color: #fff;
    padding: 10px 0;
    width: 0%;
    background-color: #409eff;
    text-align: right;
  }
}
</style>
<style lang="scss" >
.tox-statusbar__branding {
  display: none;
}
</style>
