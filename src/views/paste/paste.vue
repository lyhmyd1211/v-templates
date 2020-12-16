<template>
  <el-row :gutter="10">
    <el-col :span="12">
      <el-card>
        <div class="update-paste-con">
          <paste-editor
            v-model="pasteDataArr"
            @on-success="handleSuccess"
            @on-error="handleError"
          />
        </div>
        <div class="update-paste-btn-con">
          <span class="paste-tip">使用Tab键换列，使用回车键换行</span>
          <el-button type="primary" style="float: right" @click="handleShow"
            >显示表格数据</el-button
          >
        </div>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card>
        <el-table
          :height="400"
          :data="tableData"
          border
          fit
          highlight-current-row
        >
          <el-table-column
            :label="item.title"
            v-for="(item, index) in columns"
            :key="index"
            :prop="item.key"
          ></el-table-column>
        </el-table>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import PasteEditor from '@/components/paste-editor'
import { getTableDataFromArray } from '@/utils/tools'
export default {
  name: 'update_paste_page',
  components: {
    PasteEditor
  },
  data() {
    return {
      pasteDataArr: [],
      columns: [],
      tableData: [],
      validated: true,
      errorIndex: 0
    }
  },
  methods: {
    handleSuccess() {
      this.validated = true
    },
    handleError(index) {
      this.validated = false
      this.errorIndex = index
    },
    handleShow() {
      if (!this.validated) {
        this.$Notice.error({
          title: '您的内容不规范',
          desc: `您的第${this.errorIndex + 1}行数据不规范，请修改`
        })
      } else {
        let { columns, tableData } = getTableDataFromArray(this.pasteDataArr)
        this.columns = columns
        this.tableData = tableData
      }
    }
  }
}
</script>

<style lang="scss">
.update-paste {
  &-con {
    height: 350px;
  }
  &-btn-con {
    box-sizing: content-box;
    height: 30px;
    padding: 15px 0 5px;
  }
}
.paste-tip {
  color: #19be6b;
}
</style>
