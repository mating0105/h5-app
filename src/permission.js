import router from './router'
import store from './store'
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

const loginForm = {
  username: "gz0128",
  password: "123"
}


const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if(!store.state.user.wordbook) {
      await store.dispatch("user/getWordBook")
    }
    next()
  } else {
    /* has no token*/
    await store.dispatch("user/login", loginForm)
    await store.dispatch("user/getWordBook")
    next()
    // if (whiteList.indexOf(to.path) !== -1) {
    //   // in the free login whitelist, go directly
    //   next()
    // } else {
    //   // other pages that do not have permission to access are redirected to the login page.
    //   next(`/login?redirect=${to.path}`)
    // }
  }
})
