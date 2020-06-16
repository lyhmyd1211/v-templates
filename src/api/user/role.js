import request from '@/utils/request'
import qs from 'qs'

export function getList(params) {
  return request({
    url: '/vue-admin-template/role/getRolesList',
    method: 'get',
    params: params
  })
}
export function add(params) {
  return request({
    url: '/vue-admin-template/user/addRole',
    method: 'post',
    data: qs.stringify(params)
  })
}
export function edit(params) {
  return request({
    url: '/vue-admin-template/user/editRole',
    method: 'post',
    data: qs.stringify(params)
  })
}
export function bindResource(params) {
  return request({
    url: '/vue-admin-template/user/editResourceRole',
    method: 'post',
    data: qs.stringify(params)
  })
}
export function getResourceTreelist(params) {
  return request({
    url: '/vue-admin-template/role/getResourceTreelist',
    method: 'get',
    params: params
  })
}
export function getResourceByParent(params) {
  return request({
    url: '/vue-admin-template/role/getResourcelist',
    method: 'get',
    params: params
  })
}

export function view(params) {
  return request({
    url: '/vue-admin-template/role/view',
    method: 'get',
    params
  })
}
export function del(params) {
  return request({
    url: '/vue-admin-template/role/roDel',
    method: 'get',
    params
  })
}

