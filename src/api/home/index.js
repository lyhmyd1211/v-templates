import request from '@/utils/request'
import qs from 'qs'

export function get1(params) {
  return request({
    url: '/vue-admin-template/role/getRolesList',
    method: 'get',
    params: params
  })
}
export function post1(params) {
  return request({
    url: '/vue-admin-template/user/addRole',
    method: 'post',
    data: qs.stringify(params)
  })
}
