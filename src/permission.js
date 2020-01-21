import router from './router'
import store from './store'
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

const loginForm = {
  username: "0170",
  password: "lBTqrKS0kZixOFXeZ0HRng=="
}

const whiteList = ['/login','/userAgreement'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  if (whiteList.indexOf(to.path) !== -1) {
    next()
    return;
  }
  if (hasToken) {
    if(!store.state.user.wordbook) {
      try {
        await store.dispatch("user/getWordBook")
        next()
      }catch (e) {
        next()
      }
    }
    next()
  } else {
    /* has no token*/
    await store.dispatch("user/login", loginForm)
    try {
      await store.dispatch("user/getWordBook")
      next()
    } catch (e) {
      next()
    }
    // if (whiteList.indexOf(to.path) !== -1) {
    //   // in the free login whitelist, go directly
    //   next()
    // } else {
    //   // other pages that do not have permission to access are redirected to the login page.
    //   next(`/login?redirect=${to.path}`)
    // }
  }
})
