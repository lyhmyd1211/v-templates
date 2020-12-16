<template>
  <div class="user-account-main">
    <div class="table-tools">
      <div class="tools-line">
        <div class="tools-line">
          <div class="label">角色名称：</div>
          <el-select
            v-model="listQuery.roleName"
            placeholder="请选择角色名称"
            clearable
            @keyup.native.enter="screen"
          >
            <el-option
              v-for="(item, index) in roleList"
              :key="index"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </div>
        <div class="tools-line">
          <div class="label">登录账号：</div>
          <el-input
            v-model="listQuery.account"
            placeholder="请输入账号"
            clearable
            @keyup.native.enter="screen"
          />
        </div>
        <div class="tools-line">
          <div class="label">姓名：</div>
          <el-input
            v-model="listQuery.name"
            placeholder="请输入姓名"
            clearable
            @keyup.native.enter="screen"
          />
        </div>
        <div class="tools-line">
          <div class="label">联系方式：</div>
          <el-input
            v-model="listQuery.phone"
            placeholder="请输入联系方式"
            clearable
            @keyup.native.enter="screen"
          />
        </div>
        <div class="tools-line">
          <el-button type="primary" size="small" plain @click="screen"
            >筛选</el-button
          >
        </div>
      </div>
    </div>
    <div class="table-btns">
      <el-button type="primary" size="small" @click="showDialog(0)"
        >添加</el-button
      >
    </div>
    <el-table
      class="table1"
      key="sdlist"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">{{
          (listQuery.pageNo - 1) * listQuery.pageSize + scope.$index + 1
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="登录账号" prop="account" />
      <el-table-column align="center" label="姓名" prop="name" />
      <el-table-column align="center" label="用户角色" prop="roleId">
        <template slot-scope="scope">
          <span>{{
            scope.row.roleId
              | lookupFormatter(roleList, { key: 'id', label: 'name' })
          }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系方式" prop="phone" />
      <el-table-column align="center" label="账号状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status == '01'" style="color: #42b983"
            >启用</span
          >
          <span v-if="scope.row.status == '02'" style="color: #f56c6c"
            >停用</span
          >
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            v-permission="[108]"
            type="text"
            size="small"
            @click="showDialog(1, scope.row.id)"
            >编辑</el-button
          >
          <el-button
            v-permission="[108]"
            type="text"
            size="small"
            :style="{
              color: scope.row.status === '01' ? '#F56C6C' : '#42b983',
            }"
            @click="changeStatus(scope.row.id, scope.row.status)"
            >{{ scope.row.status === '02' ? '启用' : '停用' }}</el-button
          >
          <el-button
            v-permission="[108]"
            type="text"
            size="small"
            style="color: #f56c6c"
            @click="delUser(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      ref="dialog"
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="530px"
      @closed="closeFn"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
        label-position="left"
        class="app-form"
      >
        <el-form-item label="角色" prop="roleId">
          <el-select
            ref="roles"
            v-model="form.roleId"
            placeholder="请选择角色"
            style="width: 100%"
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入电子邮箱" />
        </el-form-item>
        <el-form-item label="登录账号" prop="account">
          <el-input
            v-model="form.account"
            :disabled="action == 1"
            placeholder="请输入登录账号"
          />
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input
            ref="password"
            v-model="form.password"
            :type="passwordType"
            placeholder="请输入登录密码"
          >
            <span slot="suffix" class="show-pwd" @click="showPwd">
              <svg-icon
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
              />
            </span>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitFn">确 定</el-button>
      </span>
    </el-dialog>
    <el-pagination
      :current-page.sync="listQuery.pageNo"
      :page-size="listQuery.pageSize"
      :total="total"
      background
      layout="total, prev, pager, next, jumper"
      @current-change="changePage"
    />
  </div>
</template>
<script>
import {
  getList,
  viewUser,
  addUser,
  editUser,
  start,
  stop,
  editUserRoles,
  del
} from '@/api/user/user'
import { getList as getRole } from '@/api/user/role'
import { validatePhone, validateEmail } from '@/utils/validate'

export default {
  data() {
    return {
      passwordType: 'password',
      id: '',
      roleList: [],
      form: {},
      action: 0, // 0为导出，1为导入
      dialogVisible: false, // 导出导入数据弹框开关
      listQuery: {
        // 查询条件
        pageNo: 1,
        pageSize: 10
      },
      total: 0,
      list: [],
      listLoading: true,
      rules: {
        account: [
          { required: true, message: '请输入用户名', trigger: 'change' }
        ],
        name: [{ required: true, message: '请输入姓名', trigger: 'change' }],
        roleId: [{ required: true, message: '请选择角色', trigger: 'change' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' }
        ],
        phone: [
          {
            required: true,
            trigger: 'change',
            validator: validatePhone
          }
        ],
        email: [
          {
            required: true,
            trigger: 'change',
            validator: validateEmail
          }
        ]
      },
    }
  },
  computed: {
    dialogTitle() {
      switch (this.action) {
        case 0:
          return '添加用户'
        case 1:
          return '编辑用户'
      }
      return '添加用户'
    }
  },
  created() {
    this.fetchData()
    this.fetchRole()
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    delUser(id) {
      this.$confirm('是否删除当前用户？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del({ id }).then(res => {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.fetchData()
        })
      })
    },
    changeStatus(id, status) {
      this.$confirm(`是否${status === '01' ? '停用' : '启用'}该用户?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const fn = status === '01' ? stop : start
        fn(id).then(res => {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.fetchData()
        })
      })
    },
    submitFn() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const fn = this.id ? editUser : addUser
          this.form.roleName = this.$refs.roles.selectedLabel
          fn(this.form).then(res => {
            this.$message.success(this.id ? '编辑成功' : '新增成功')
            editUserRoles({
              id: this.id || res.data.id,
              roleId: this.form.roleId,
              roleName: this.form.roleName
            }).then(r => {
              this.closeFn()
              this.fetchData()
            })
          })
        }
      })
    },
    closeFn() {
      this.dialogVisible = false
    },
    uploadHandle(res, files) {
      this.form.idCardUrl = res.url
      this.form.idCardName = res.name
    },
    removeHandle(res, files) {
      this.form.idCardUrl = ''
      this.form.idCardName = ''
    },
    beforeUpload(file) {
      if (file.size / 1024 / 1024 > 50) {
        this.$message({
          message: '请上传小于50M的文件！',
          type: 'error'
        })
        return false
      }
    },
    screen() {
      this.listQuery.pageNo = 1
      this.fetchData()
    },
    fetchRole() {
      getRole({ pageNo: 1, pageSize: 100000 }).then(res => {
        this.roleList = res.data.items
      })
    },
    fetchData() {
      this.listLoading = true
      getList(Object.assign({}, this.listQuery, {}))
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
    goFn(url, status, id) {
      this.$router.push({ path: url, query: { status: status, id: id } })
    },
    showDialog(type, id) {
      this.action = type
      this.dialogVisible = true
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
      if (id) {
        viewUser(id).then(res => {
          this.form = res.data.item
        })
      }
      this.id = id
    }
  }
}
</script>
<style lang="scss" scoped>
.user-account-main {
}
</style>
