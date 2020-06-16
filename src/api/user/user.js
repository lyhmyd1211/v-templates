import request from '@/utils/request'
import qs from 'qs'
// 登录
export function login(params) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data: qs.stringify(params)
  })
}
// 获取用户信息
export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/session',
    method: 'get'
  })
}
// 退出
export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'get'
  })
}
// 获取用户列表
export function getList(params) {
  return request({
    url: '/vue-admin-template/user/getList',
    method: 'get',
    params: params
  })
}
// 添加用户
export function addUser(params) {
  return request({
    url: '/vue-admin-template/user/add',
    method: 'post',
    data: qs.stringify(params)
  })
}
// 获取单个用户信息
export function viewUser(id) {
  return request({
    url: '/vue-admin-template/user/view',
    method: 'get',
    params: {
      id
    }
  })
}
// 停用当前用户
export function stop(id) {
  return request({
    url: '/vue-admin-template/user/stop',
    method: 'get',
    params: {
      id
    }
  })
}
// 停用启用当前用户
export function start(id) {
  return request({
    url: '/vue-admin-template/user/start',
    method: 'get',
    params: {
      id
    }
  })
}
// 编辑用户
export function editUser(params) {
  return request({
    url: '/vue-admin-template/user/edit',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 编辑用户
export function editUserRoles(params) {
  return request({
    url: '/vue-admin-template/user/editUserRoles',
    method: 'post',
    data: qs.stringify(params)
  })
}

export function del(params) {
  return request({
    url: '/vue-admin-template/user/del',
    method: 'get',
    params
  })
}
