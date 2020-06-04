
import Layout from '@/layout'

const userRouter = {
  path: '/user',
  component: Layout,
  redirect: '/user/account',
  name: 'user',
  alwaysShow: true,
  meta: {
    title: '账户权限管理',
    icon: 'power',
    roles: [108]
  },
  children: [
    {
      path: 'account',
      component: () => import('@/views/user/account'), // Parent router-view
      name: 'account',
      meta: { title: '账号管理', roles: [108] }

    },
    {
      path: 'role',
      component: () => import('@/views/user/role'), // Parent router-view
      name: 'role',
      meta: { title: '角色管理', roles: [108] }

    }
  ]
}

export default userRouter
