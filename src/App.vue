<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  import { getToken } from '@/utils/auth'
  export default {
  name: 'App',
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      }
    }
  },
  methods: {
    login () {
      // this.$store.dispatch('user/login', this.loginForm)
      this.$store.dispatch('user/login', this.loginForm).then(res => {
        // this.$router.push({ path: this.redirect || '/' })
        // if(res) {

        // }
        this.$store.dispatch("user/getWordBook");
      })
    }
  },
  mounted () {
    const hasToken = getToken()
    if (!hasToken) {
      this.login()
    } else {
      this.$store.dispatch("user/getWordBook");
    }
  }
}
</script>

<style lang="scss">
    html, body, #app {
        height: 100%
    }
    #app {
        min-width: 100vw;
        overflow: auto;
        color: #323233;
        font-family: 'PingFang SC', Helvetica, 'STHeiti STXihei', 'Microsoft YaHei', Tohoma, Arial, sans-serif;
        line-height: 1;
        background-color: #f7f8fa;
        -webkit-font-smoothing: antialiased;
    }
    *{
        font-size: 1.4rem;
    }
</style>
