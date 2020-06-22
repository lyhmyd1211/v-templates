
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': { 'token': 'admin-token', 'user': { 'id': 58, 'name': '管理员', 'phone': '13111111111', 'email': '1@qq.com', 'account': 'admin', 'password': '123456', 'agentId': 12, 'createTime': null, 'userType': '02', 'status': '01', 'roleId': 9, 'roleName': '超级管理员', 'agent': { 'id': 12, 'memberId': 58, 'agentName': '测试', 'agentType': 0, 'extentOfJurisdiction': '110000,120000', 'city': null, 'agentPerson': '管理员', 'agentPhone': '13111111111', 'bindAccount': null, 'accountBalances': 0.00, 'balancesLastChange': '2020-05-21扣减2,750.00元', 'status': 0, 'createTime': 1588155993126, 'branchAgentId': null, 'branchAgent': null, 'openBank': '到达地', 'bankAccount': '555555', 'memberAccount': 'chaoguan', 'memberName': '管理员', 'memberPhone': '13111111111', 'accountBalancesList': [], 'user': null, 'branchAgentBean': null, 'count': null }, 'resource': [108], 'resourceRoles': [{ 'roId': 9, 'label': null, 'reId': 108 }] }},
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export default [
  // user login
  {
    url: '/vue-admin-template/user/login',
    type: 'post',
    response: config => {
      const { account } = config.body
      const token = tokens[account]
      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 0,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/vue-admin-template/user/session\.*',
    type: 'get',
    response: config => {
      const token = config.headers['x-token']
      const info = users[token]
      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 0,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/vue-admin-template/user/logout',
    type: 'get',
    response: _ => {
      return {
        code: 0,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-admin-template/user/getList',
    type: 'get',
    response: _ => {
      return {
        code: 0,
        data: { 'total': 1, 'items': [{ 'id': 1, 'name': 'user1', 'phone': '13111111111', 'email': '1@qq.com', 'account': 'user1', 'password': '1223456', 'createTime': null, 'userType': '02', 'status': '01', 'roleId': 1, 'roleName': 'role1', 'agent': null, 'resource': [], 'resourceRoles': null }] }
      }
    }
  }, {
    url: '/vue-admin-template/user/add',
    type: 'post',
    response: _ => {
      return {
        code: 0,
        data: {
          code: 0,
          data: {},
          message: '操作成功'
        }
      }
    }
  },
  {
    url: '/vue-admin-template/user/stop',
    type: 'get',
    response: _ => {
      return {
        code: 0,
        data: {
          code: 0,
          data: {}
        },
        message: '操作成功'
      }
    }
  },
  {
    url: '/vue-admin-template/user/start',
    type: 'get',
    response: _ => {
      return {
        code: 0,
        data: {
          code: 0,
          data: {}
        },
        message: '操作成功'
      }
    }
  },
  {
    url: '/vue-admin-template/user/edit',
    type: 'post',
    response: _ => {
      return {
        code: 0,
        data: {
          code: 0,
          data: {},
          message: '操作成功'
        }
      }
    }
  },
  {
    url: '/vue-admin-template/user/editUserRoles',
    type: 'post',
    response: _ => {
      return {
        code: 0,
        data: {
          code: 0,
          data: {},
          message: '操作成功'
        }
      }
    }
  },
  {
    url: '/vue-admin-template/user/del',
    type: 'get',
    response: _ => {
      return {
        code: 0,
        data: {
          code: 0,
          data: {}
        },
        message: '操作成功'
      }
    }
  },
  {
    url: '/vue-admin-template/user/view',
    type: 'get',
    response: _ => {
      return {
        'code': 0,
        'message': '获取成功!',
        'data': {
          'item': { 'id': 1, 'name': 'user1', 'phone': '13111111111', 'email': '1@qq.com', 'account': 'user1', 'password': '1223456', 'createTime': null, 'userType': '02', 'status': '01', 'roleId': 1, 'roleName': 'role1', 'agent': null, 'resource': [108] }
        }
      }
    }
  },
  {
    url: '/uploadFile',
    type: 'post',
    response: res => {
      return { 'name': 'test1.png', 'url': 'http://test1.png' }
    }
  }

]
