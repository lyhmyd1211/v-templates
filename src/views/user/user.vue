<template>
  <div class="user-role-main">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
      label-position="left"
      class="role-form"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <div class="set-role">权限设置</div>
      <el-form-item v-loading="loading" prop="reIds" class="no-label-form">
        <el-input v-model="resource" style="display:none" />
        <el-tree
          ref="tree"
          check-strictly
          :data="rolesList"
          :props="defaultProps"
          show-checkbox
          accordion
          node-key="id"
          :default-checked-keys="form.reIds"
          class="role-tree"
          @check-change="handleCheckChange"
        />
      </el-form-item>
    </el-form>
    <div class="btn">
      <el-button @click="closeFn">取消</el-button>
      <el-button :loading="loading" type="primary" @click="submit">确定</el-button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { hasPermission } from '@/utils'
import { getChildren } from '@/utils/tools'
import {
  getResourceTreelist,
  bindResource,
  add,
  view,
  edit
} from '@/api/user/role'
export default {
  props: {
    action: {
      type: Number,
      default() {
        return 0
      }
    },
    id: {
      type: [Number, String],
      default() {
        return null
      }
    },
    closeFn: {
      type: Function,
      default() {
        return function() {}
      }
    }
  },
  data() {
    return {
      form: {},
      reIds: [],
      loading: false,
      hasPermission,
      defaultProps: {
        children: 'child',
        label: 'label'
      },
      orgId: [],
      rolesList: [],
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'change' }
        ],
        reIds: [
          { required: true, message: '请至少选择一个权限', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['systemRoles', 'userinfo']),
    // rolesList() {
    //   if (this.action > -1) {
    //     return deepClone(this.systemRoles)
    //   }
    //   return ['0']
    // },
    resource() {
      return JSON.stringify(this.form.reIds)
    }
  },
  created() {
    this.fetchData()
    if (this.id) {
      this.getEditData()
    }
  },
  mounted() {
    if (this.form.reIds && this.form.reIds[0] === '-1') {
      this.$refs.tree.setCheckedNodes(this.rolesList)
    }
  },
  methods: {
    // loadNode(node, resolve) {
    //      resolve(data)
    // },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    fetchData() {
      this.loading = true
      getResourceTreelist()
        .then(res => {
          if (this.action > -1) {
            this.rolesList = res.data.items
          } else {
            this.rolesList = ['0']
          }
          console.log('rolesList', this.rolesList)
          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
    },
    handleCheckChange(event, checked) {
      if (!checked) {
        // 取消勾选
        let arr = this.$refs.tree.getCheckedKeys()
        const children = getChildren(
          this.rolesList,
          event.id,
          this.defaultProps.children
        )
        children.map(item => {
          arr = arr.filter(v => v !== item.id)
        }) // 根节点取消勾选，则把节点下的子节点都取消勾选
        this.$refs.tree.setCheckedKeys(arr)
        if (event.parentId !== 0) {
          // 如果不是根节点
          const children = getChildren(
            this.rolesList,
            event.parentId,
            this.defaultProps.children
          ) // 获取同级节点
          let parentUnChecked = true // 判断是否是最后一个勾选的子节点
          for (let index = 0; index < children.length; index++) {
            const element = children[index]
            if (this.$refs.tree.getCheckedKeys().includes(element.id)) {
              // 当前层级下存在已勾选的节点则不取消父级的勾选
              parentUnChecked = false
              break
            } else {
              parentUnChecked = true // 如果把最后一个子节点取消后把父级的勾选状态也取消
            }
          }
          if (parentUnChecked) {
            let arr = this.$refs.tree.getCheckedKeys()
            arr = arr.filter(v => v !== event.parentId)
            this.$refs.tree.setCheckedKeys(arr)
          }
        }
      } else {
        // 勾选操作
        if (
          event.parentId !== 0 &&
          !this.$refs.tree.getCheckedKeys().includes(event.parentId)
        ) {
          // 当前节点没有勾选时，勾选当前节点的子节点要把当前节点也勾选上
          this.$refs.tree.setCheckedKeys(
            this.$refs.tree.getCheckedKeys().concat([event.parentId])
          )
        }
        const vm = this
        // eslint-disable-next-line no-inner-declarations
        function checkAllChildren(id) {
          // 勾选当前节点时把所有子节点都勾选上，包括孙子节点
          let childrenCheck = true
          const children = getChildren(
            vm.rolesList,
            id,
            vm.defaultProps.children
          )
          for (let index = 0; index < children.length; index++) {
            const element = children[index]
            if (vm.$refs.tree.getCheckedKeys().includes(element.id)) {
              childrenCheck = false
              break
            } else {
              childrenCheck = true
            }
          }
          if (childrenCheck) {
            const all = [event.id]
            children.map(item => {
              all.push(item.id)
              checkAllChildren(item.id)
            })
            vm.$refs.tree.setCheckedKeys(
              vm.$refs.tree.getCheckedKeys().concat(all)
            )
          }
        }
        checkAllChildren(event.id)
      }
      this.form.reIds = this.$refs.tree.getCheckedKeys()
      this.form = { ...this.form }
    },
    submit() {
      console.log('form', this.form)
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const fn = this.id ? edit : add
          fn(this.form).then(res => {
            bindResource({
              roId: this.id ? this.id : res.data.id,
              reIds: this.resource
            }).then(res => {
              this.$message({
                type: 'success',
                message: res.message
              })
              if (this.userinfo.roleId === this.id) {
                this.$alert('当前账号角色信息已改变，请重新登录', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.logout()
                  }
                })
              } else {
                this.closeFn()
              }
              this.loading = false
            })
          })
        }
      })
    },
    getEditData() {
      view({ id: this.id }).then(res => {
        const { id, name, resources } = res.data.item
        const reIds = resources.map(item => item && item.id)
        this.form = {
          id,
          name,
          reIds
        }
      })
    }
  }
}
</script>
<style lang="scss">
.user-role-main {
  .btn {
    text-align: right;
  }
  .set-role {
    margin: 20px 0;
    font-weight: bold;
    color: #606266;
    &::before {
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
  }
  .role-item {
    display: inline-block;
    margin: 10px;
    width: 90px;
  }
  .role-form {
    .no-label-form {
      .el-form-item__content {
        margin-left: 0px !important;
      }
    }
    .el-checkbox__inner {
      margin-right: 10px;
    }
  }
}
</style>

