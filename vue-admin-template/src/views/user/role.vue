<template>
  <div class="role-main">
    <div class="table-tools">
      <div class="tools-line">
        <div class="tools-line">
          <div class="label">角色：</div>
          <el-select
            v-model="listQuery.name"
            placeholder="请选择角色名称"
            clearable
            @keyup.native.enter="search"
          >
            <el-option
              v-for="(item, index) in roleList"
              :key="index"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
          <!-- <el-input
            v-model="listQuery.roleName"
            placeholder="请输入角色名称"
            clearable
            @keyup.native.enter="search"
          />-->
        </div>
        <div class="tools-line">
          <div class="label">权限：</div>
          <el-cascader
            v-model="listQuery.resourceName"
            clearable
            :show-all-levels="false"
            :options="rolesTreeList"
            :props="{ expandTrigger: 'hover',checkStrictly: true ,children:'child',emitPath:false,value:'label',}"
            @keyup.native.enter="search"
          />
        </div>
        <div class="tools-line">
          <el-button type="primary" size="small" plain @click="search">筛选</el-button>
        </div>
      </div>
    </div>
    <div v-permission="[108]" class="table-btns">
      <el-button type="primary" size="small" @click="showDialog(0)">添加</el-button>
    </div>
    <el-table
      key="userList"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="95">
        <template
          slot-scope="scope"
        >{{ (listQuery.pageNo - 1) * listQuery.pageSize + scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column align="center" label="角色" prop="name" />
      <el-table-column align="center" label="人数" prop="userCount" />
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            v-permission="[108]"
            type="text"
            size="small"
            @click="showDialog(1, scope.row.id)"
          >编辑</el-button>
          <el-button v-permission="[142]" type="text" size="small" @click="operation(scope.row.id)">
            <span style="color: #F56C6C;">删除</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :current-page.sync="listQuery.pageNo"
      :page-size="listQuery.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="total"
      @current-change="changePage"
    />
    <el-dialog
      v-if="dialogVisible"
      ref="dialog"
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="530px"
      :close-on-click-modal="false"
      @closed="closeFn"
    >
      <User :id="id" :action="action" :close-fn="closeFn" />
    </el-dialog>
  </div>
</template>
<script>
import { getList, edit, add, del, getResourceTreelist } from '@/api/user/role'
import User from './user'

export default {
  components: {
    User
  },
  data() {
    return {
      id: '',
      organType: [],
      defaultForm: {},
      listQuery: {
        // 查询条件
        pageNo: 1,
        pageSize: 10
      },
      total: 0,
      rolesTreeList: [],
      roleList: [],
      list: [],
      listLoading: true,
      dialogVisible: false,
      action: 0, // 0为添加， 1为编辑， 2为查看
      roles: [], // 存储选中roles选中值
      form: {}
    }
  },
  computed: {
    dialogTitle() {
      switch (this.action) {
        case 0:
          return '添加角色'
        case 1:
          return '维护角色'
      }
      return '添加角色'
    }
  },
  created() {
    this.fetchData()
    this.fetchRole()
  },
  methods: {
    search() {
      this.listQuery.pageNo = 1
      this.fetchData()
    },
    fetchRole() {
      getResourceTreelist()
        .then(res => {
          this.rolesTreeList = res.data.items
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
      getList({ pageNo: 1, pageSize: 100000 }).then(res => {
        this.roleList = res.data.items
      })
    },
    fetchData() {
      this.listLoading = true
      getList(this.listQuery)
        .then(res => {
          this.total = res.data.total
          this.list = res.data.items
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    changePage(val) {
      this.fetchData()
    },
    showDialog(action, id) {
      this.action = action
      this.id = id
      this.dialogVisible = true
    },
    setForm(data) {
      this.form = data
      this.dialogVisible = true
    },
    getForm(form) {
      this.childForm = form
    },
    closeFn() {
      this.fetchData()
      this.dialogVisible = false
    },
    operation(id) {
      this.$confirm('是否删除当前角色？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del({ id }).then(res => {
          this.$message({
            message: res.message,
            type: 'success',
            duration: 3 * 1000
          })
          this.fetchData()
        })
      })
    },
    submitFn() {
      if (this.action === 2) return (this.dialogVisible = false)
      const fn = this.action === 0 ? add : edit
      this.childForm.validate(valid => {
        if (valid) {
          if (this.id) {
            this.form.id = this.id
          }
          fn(
            Object.assign({}, this.form, {
              resourceid: JSON.stringify(this.form.resourceid)
            })
          ).then(res => {
            this.$message({
              message: res.message,
              type: 'success',
              duration: 3 * 1000
            })
            this.dialogVisible = false
            this.fetchData()
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
