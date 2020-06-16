<template>
  <div class="navbar" :class="{opened:sidebar.opened}">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-badge v-if="notifyCount" :value="notifyCount" :max="99" class="badge">
        <i class="el-icon-bell" @click="notiClick" />
      </el-badge>
      <span class="user-avatar">{{ name }}</span>
      <span class="user-avatar user-a" @click="edit">修改账号信息</span>
      <span class="user-avatar user-a" @click="logout">退出</span>
    </div>
    <el-dialog
      v-if="visible"
      ref="dialog"
      title="账户信息修改"
      :visible.sync="visible"
      :close-on-click-modal="false"
      width="530px"
      :modal-append-to-body="false"
      @closed="closeFn"
    >
      <el-form
        v-if="visible"
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
        label-position="left"
        class="app-form"
      >
        <el-form-item label="登录账号" prop="account">
          <el-input v-model="form.account" disabled placeholder="请输入登录账号" />
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
        <el-form-item label="原密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入原密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="form.newPassword" type="password" placeholder="请输入新密码，如不需要修改密码不用输入此项" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeFn">取 消</el-button>
        <el-button type="primary" @click="submitFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { validatePhone, validateEmail } from '@/utils/validate'
import { editUser } from '@/api/user/user'
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      notifyCount: 1,
      list: [],
      visible: false,
      form: {},
      rules: {
        account: [
          { required: true, message: '请输入用户名', trigger: 'change' }
        ],
        name: [{ required: true, message: '请输入姓名', trigger: 'change' }],
        password: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (value !== '' && value != null) {
                if (value !== this.userinfo.password) {
                  callback(new Error('原密码输入错误'))
                } else {
                  callback()
                }
              } else {
                callback(new Error('请输入原密码'))
              }
            }
          }
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
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'userinfo'
    ])
  },
  watch: {
  },
  mounted() {
  },
  created() { },
  methods: {
    notiClick() {
      this.notifyCount = 0
    },
    submitFn() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const formData = {
            id: this.form.id,
            name: this.form.name,
            phone: this.form.phone,
            email: this.form.email,
            account: this.form.account,
            password: this.form.password,
            newPassword: this.form.newPassword
          }
          if (formData.newPassword && formData.newPassword !== '') {
            formData.password = formData.newPassword
          }
          editUser(formData).then(res => {
            this.$message.success('账号信息修改成功')
            this.$alert('当前账号信息已改变，请重新登录', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.logout()
              }
            })
          })
        }
      })
    },
    closeFn() {
      this.visible = false
      this.form = {}
    },
    edit() {
      this.visible = true
      this.form = { ...this.userinfo }
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  &.opened {
    width: calc(100vw - 210px);
  }
  .badge {
    height: 20px;
    margin-right: 10px;
    cursor: pointer;
    i {
      vertical-align: top;
    }
    sup {
      pointer-events: none;
    }
  }
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
    .user-a {
      color: #409eff;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
    .user-avatar {
      width: 40px;
      height: 40px;
      // border-radius: 10px;
      padding-right: 10px;
      margin-right: 10px;
      border-right: 1px solid #eee;
      font-size: 14px;
      &:last-child {
        margin-right: 20px;
        border: none;
      }
    }
    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        // .user-avatar {
        //   cursor: pointer;
        //   width: 40px;
        //   height: 40px;
        //   border-radius: 10px;
        //   margin-right: 30px;
        // }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.navbar {
  .badge {
    sup {
      pointer-events: none;
    }
  }
}
</style>
