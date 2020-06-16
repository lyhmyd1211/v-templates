import Mock from 'mockjs'
import { deepClone } from '../../src/utils/index.js'
import { asyncRoutes, constantRoutes } from './routes.js'

const routes = deepClone([...constantRoutes, ...asyncRoutes])

const roles = [
  {
    key: 'admin',
    name: 'admin',
    description: 'Super Administrator. Have access to view all pages.',
    routes: routes
  },
  {
    key: 'editor',
    name: 'editor',
    description: 'Normal Editor. Can see all pages except permission page',
    routes: routes.filter(i => i.path !== '/permission')// just a mock
  },
  {
    key: 'visitor',
    name: 'visitor',
    description: 'Just a visitor. Can only see the home page and the document page',
    routes: [{
      path: '',
      redirect: 'dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          meta: { title: 'dashboard', icon: 'dashboard' }
        }
      ]
    }]
  }
]

export default [
  // mock get all routes form server
  {
    url: '/vue-element-admin/routes',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: routes
      }
    }
  },

  // mock get all roles form server
  {
    url: '/vue-element-admin/roles',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: roles
      }
    }
  },

  // add role
  {
    url: '/vue-element-admin/role',
    type: 'post',
    response: {
      code: 20000,
      data: {
        key: Mock.mock('@integer(300, 5000)')
      }
    }
  },

  // update role
  {
    url: '/vue-element-admin/role/[A-Za-z0-9]',
    type: 'put',
    response: {
      code: 20000,
      data: {
        status: 'success'
      }
    }
  },

  // delete role
  {
    url: '/vue-element-admin/role/[A-Za-z0-9]',
    type: 'delete',
    response: {
      code: 20000,
      data: {
        status: 'success'
      }
    }
  },
  {
    url: '/vue-admin-template/role/getRolesList',
    type: 'get',
    response: {
      code: 0,
      data: {
        'total': 1, 'items': [{
          'id': 1,
          'name': 'role1',
          'userCount': 1,
          'resources': 'user1'
        }]
      }
    }
  },
  {
    url: '/vue-admin-template/user/addRole',
    type: 'post',
    response: {
      code: 0,
      data: {},
      message: '添加角色成功'
    }
  },
  {
    url: '/vue-admin-template/user/editRole',
    type: 'post',
    response: {
      code: 0,
      data: {},
      message: '编辑角色成功'
    }
  },
  {
    url: '/vue-admin-template/user/editResourceRole',
    type: 'post',
    response: {
      code: 0,
      data: {},
      message: '操作成功'
    }
  },
  {
    url: '/vue-admin-template/role/getResourcelist',
    type: 'get',
    response: {
      code: 0,
      data: {},
      message: '操作成功'
    }
  },
  {
    url: '/vue-admin-template/role/view',
    type: 'get',
    response: {
      'code': 0,
      'message': '获取成功!',
      'data': {
        'item': {
          'id': 1,
          'name': 'role1',
          'resources': [{
            'id': 108,
            'label': '账号管理',
            'parentId': 0,
            'child': [{
              'id': 109,
              'label': '查看',
              'parentId': 108,
              'child': []
            }, {
              'id': 110,
              'label': '新增',
              'parentId': 108,
              'child': []
            }, {
              'id': 111,
              'label': '修改',
              'parentId': 108,
              'child': []
            }, {
              'id': 112,
              'label': '删除',
              'parentId': 108,
              'child': []
            }]
          }]
        }
      }
    }
  },
  {
    url: '/vue-admin-template/role/roDel',
    type: 'get',
    response: {
      code: 0,
      data: {},
      message: '删除成功'
    }
  },

  {
    url: '/vue-admin-template/role/getResourceTreelist',
    type: 'get',
    response: {
      code: 0,
      data: {
        'items': [{
          'id': 108,
          'label': '账号管理',
          'parentId': 0,
          'child': [{
            'id': 109,
            'label': '查看',
            'parentId': 108,
            'child': []
          }, {
            'id': 110,
            'label': '新增',
            'parentId': 108,
            'child': []
          }, {
            'id': 111,
            'label': '修改',
            'parentId': 108,
            'child': []
          }, {
            'id': 112,
            'label': '删除',
            'parentId': 108,
            'child': []
          }]
        }, {
          'id': 128,
          'label': '角色管理',
          'parentId': 0,
          'child': [{
            'id': 129,
            'label': '查看',
            'parentId': 128,
            'child': []
          }, {
            'id': 130,
            'label': '新增',
            'parentId': 128,
            'child': []
          }, {
            'id': 131,
            'label': '修改',
            'parentId': 128,
            'child': []
          }, {
            'id': 132,
            'label': '删除',
            'parentId': 128,
            'child': []
          }]
        }]
      }
    }
  }

]
