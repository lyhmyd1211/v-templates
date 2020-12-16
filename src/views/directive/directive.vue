<template>
  <div>
    <el-row>
      <el-col>
        <el-card>
          <el-row>
            <el-col :span="8">
              <el-button type="primary" @click="showModal"
                >显示可拖动弹窗</el-button
              >
              <br />
              <el-button v-draggable="buttonOptions" class="draggable-btn"
                >这个按钮也是可以拖动的</el-button
              >
            </el-col>
            <el-col :span="16">
              <div class="intro-con">
                &lt;Modal v-draggable="options"
                v-model="visible"&gt;标题&lt;/Modal&gt;
                <pre class="code-con">
    options = {
      trigger: '.ivu-modal-body',
      body: '.ivu-modal'
    }
                </pre>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px">
      <el-col>
        <el-card>
          <el-row>
            <el-col :span="8">
              <el-input style="width: 60%" v-model="inputValue">
                <el-button slot="append" v-clipboard="clipOptions"
                  >copy</el-button
                >
              </el-input>
            </el-col>
            <el-col :span="16">
              <div class="intro-con">
                &lt;Input style="width: 60%" v-model="inputValue"&gt;
                <br />
                &nbsp;&nbsp;&nbsp;&lt;Button slot="append"
                v-clipboard="clipOptions"&gt;copy&lt;/Button&gt;
                <br />
                &lt;/Input&gt;
                <pre class="code-con">
    clipOptions: {
      value: this.inputValue,
      success: (e) => {
        this.$Message.success('复制成功')
      },
      error: () => {
        this.$Message.error('复制失败')
      }
    }
                </pre>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      v-draggable="options"
      ref="dialog"
      :visible.sync="modalVisible"
      width="530px"
      :close-on-click-modal="false"
    >
      <span>拖动这里即可拖动整个弹窗</span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'directive_page',
  data() {
    return {
      modalVisible: false,
      options: {
        trigger: '.el-dialog',
        body: '.el-dialog',
        recover: true
      },
      buttonOptions: {
        trigger: '.draggable-btn',
        body: '.draggable-btn'
      },
      statu: 1,
      inputValue: '这是输入的内容'
    }
  },
  computed: {
    clipOptions() {
      return {
        value: this.inputValue,
        success: (e) => {
          this.$message.success('复制成功')
        },
        error: () => {
          this.$message.error('复制失败')
        }
      }
    }
  },
  methods: {
    showModal() {
      this.modalVisible = true
      console.log('a', this.modalVisible);
    }
  }
}
</script>

<style>
.intro-con {
  min-height: 140px;
}
.draggable-btn {
  margin-top: 20px;
}
.code-con {
  width: 400px;
  background: #f9f9f9;
  padding-top: 10px;
}
</style>
