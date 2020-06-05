import router from './router'
import store from './store'
import { Message, MessageBox } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { getFirstRouterByMap } from '@/utils/tools'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist
const BlackList = ['/page1', '/page2/subPage1', '/page3'] // 黑名单用户不能进入的页面
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)
  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        if (to.path === '/') {
          const accessRoutes = await store.dispatch('permission/generateRoutes', store.getters.roles)
          const path = await getFirstRouterByMap(accessRoutes)
          next(path)
        } else {
          if (BlackList.indexOf(to.path) !== -1) {
            if (!store.getters.roles.includes(-1)) { // blackList powers now is -1
              MessageBox.alert('当前用户没有权限无法进入', '提示', {
                confirmButtonText: '确定',
                type: 'warning',
                callback: action => {
                  NProgress.done()
                }
              })
            } else {
              next()
            }
          } else {
            next()
          }
        }
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          await store.dispatch('user/getInfo')
          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', store.getters.roles)
          // dynamically add accessible routes
          await router.addRoutes(accessRoutes)
          // await store.dispatch('notification/GetNotify', store.getters.userinfo)
          if (from.path === '/login') {
            const path = await getFirstRouterByMap(accessRoutes)
            await next(path)
          } else {
            await next(to.path)
          }
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
        } catch (error) {
          console.log('eeeeeeeeeeeeeeeeeeeee', error)
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
